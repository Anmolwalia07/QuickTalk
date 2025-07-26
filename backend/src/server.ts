import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors"
import userRoutes from "./routes/userRoutes"


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())


app.use("/api/user",userRoutes)

app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
});



const server = app.listen(8080, () => {
  console.log("HTTP + WS server running on http://localhost:8080");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");
  ws.on("error", console.error);
  ws.on("message", (data, isBinary) => {
    console.log("Received:", data.toString());
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.send("Hello! Message From Server!!");
});
