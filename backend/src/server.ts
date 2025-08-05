import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors"
import userRoutes from "./routes/userRoutes"
import cookieparser from "cookie-parser"
import { prisma } from "./db/db";
import messageRoutes from "./routes/messageRoutes"
import { sendMessage } from "./controller/messageController";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin:'*',
 credentials:true, 
}))

app.use(cookieparser());

app.use("/api/user",userRoutes);
app.use('/api/message',messageRoutes)

app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});



const server = app.listen(8080, () => {
  console.log("HTTP + WS server running on http://localhost:8080");
});

interface Client extends WebSocket {
  roomId?: string;
  username?: string;
}

const wss = new WebSocketServer({ server });
const userSocketMap = new Map<string, WebSocket>(); 
const rooms: Map<string, Set<Client>> = new Map();

wss.on("connection", (ws: WebSocket) => {
  let userId: string = "";

  ws.on("message", async (data) => {
    try {
      const parsed = JSON.parse(data.toString());

      // User comes online
      if (parsed.type === "online") {
        userId = parsed.userId;
        userSocketMap.set(userId, ws);

        await prisma.user.update({
          where: { id: userId },
          data: { isOnline: true },
        });

        console.log(`✅ User ${userId} is now online`);
      }

      if (parsed.type === "join-room") {
        const { roomId, username } = parsed;
        (ws as Client).roomId = roomId;
        (ws as Client).username = username;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        rooms.get(roomId)!.add(ws as Client);

        console.log(`📌 ${username} joined room ${roomId}`);
      }

      if (parsed.type === "message") {
        const { senderId, receiverId, message } = parsed;

        const saved = await sendMessage({ senderId, receiverId, message });

        if (saved.success) {
          const messageData = saved.data;
          const receiverSocket = userSocketMap.get(receiverId);

          if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
            receiverSocket.send(JSON.stringify(messageData));
          }
        } else {
          console.error(saved.error);
        }
      }

      // Send message to room
      if (parsed.type === "room-message") {
        const { roomId, sender, message } = parsed;
        const roomClients = rooms.get(roomId);

        if (roomClients) {
          for (const client of roomClients) {
            if (client.readyState === WebSocket.OPEN && client.username!=sender) {
              client.send(JSON.stringify({
                type: "room-message",
                sender,
                message,
                roomId
              }));
            }
          }
        }
      }

      if(parsed.type==="leave-room"){
        const {roomId,username}=parsed
        const roomClients = rooms.get(roomId);
        roomClients?.delete(username)
      }

    } catch (err) {
      console.error("❌ Failed to handle WebSocket message:", err);
    }
  });

  ws.on("close", async () => {
    if (userId) {
      userSocketMap.delete(userId);

      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false },
      });

      console.log(`⚠️ User ${userId} went offline`);
    }

    for (const [roomId, clients] of rooms.entries()) {
      if (clients.delete(ws as Client) && clients.size === 0) {
        rooms.delete(roomId);
      }
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});
