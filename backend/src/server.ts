import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = app.listen(8080, () => {
  console.log("HTTP + WS server running on http://localhost:8080");
});

app.get("/", (req, res) => {
  res.send("WebSocket server is running.");
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
