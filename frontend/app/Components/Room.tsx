"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../(dashboard)/context";

export default function Room({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState([
    { sender: "", text: "Welcome To QuickTalk Room..." },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const { darkMode, user } = useUser();
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const bgMain = darkMode ? "bg-gray-800" : "bg-white";
  const borderMain = darkMode ? "border-gray-700" : "border-gray-200";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user?.id) return;
    const socket = new WebSocket(process.env.NEXT_PUBLIC_Ws!);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join-room",
          username: user.name,
          roomId,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newMsg = {
        sender: data.sender === user.name ? "me" : data.sender,
        text: data.message,
      };
      setMessages((prev) => [...prev, newMsg]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [user?.id, roomId]);

  const sendMessage = () => {
    if (
      !newMessage.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN ||
      !user?.id
    )
      return;

    const messageObj = {
      type: "room-message",
      roomId,
      sender: user.name,
      message: newMessage,
    };

    socketRef.current.send(JSON.stringify(messageObj));
    setMessages((prev) => [...prev, { sender: "me", text: newMessage }]);
    setNewMessage("");
  };

  const handleExit = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "leave-room", roomId, username: user?.name })
      );
    }
    router.push("/dashboard"); 
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
      {/* Top Bar with Exit */}
      <div
        className={`flex items-center justify-between p-3 border-b ${borderMain} ${bgMain}`}
      >
        <h2 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Room: {roomId}
        </h2>
        <button
          onClick={handleExit}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
        >
          Exit Room
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
          >
            <span className={`text-xs  ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
              {msg.sender === "me" ? "You" : msg.sender}
            </span>

            {msg.text && (
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] break-words ${
                  msg.sender === "me"
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>


      {/* Input Bar */}
      <div
        className={`p-3 flex items-center gap-2 border-t ${borderMain} ${bgMain}`}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={`flex-1 px-4 py-2 rounded-full border ${borderMain} focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
          }`}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
