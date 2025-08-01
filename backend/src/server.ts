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

const wss = new WebSocketServer({ server });
const userSocketMap = new Map<string, WebSocket>(); 

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

      if (parsed.type === "message") {
        const { senderId, receiverId, message } = parsed;

        const saved = await sendMessage({ senderId, receiverId, message });

        if (saved.success) {
          const messageData = saved.data;

          const receiverSocket = userSocketMap.get(receiverId);
          // const senderSocket = userSocketMap.get(senderId);

          if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
            receiverSocket.send(JSON.stringify(messageData));
          }
        } else {
          console.error(saved.error);
        }
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
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});
