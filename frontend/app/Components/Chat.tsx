"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoSend } from "react-icons/io5";
import { useUser } from "../(dashboard)/context";
import { FaX } from "react-icons/fa6";

export default function Chat() {
  const { id } = useParams();
  const { user, contacts, darkMode } = useUser();
  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const router=useRouter();


  const [messages, setMessages] = useState<
    { sender: "me" | "other"; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  const currentChat = contacts.find((c) => c.id === id);

  useEffect(() => {
    if (!id || !user?.id) return;

    const allMessages = [...user.sentMessages, ...user.receivedMessages];

    const chatMessages: { sender: "me" | "other"; text: string }[] = allMessages
  .filter(
    (msg) =>
      (msg.senderId === user.id && msg.receiverId === id) ||
      (msg.senderId === id && msg.receiverId === user.id)
  )
  .sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  .map((msg) => ({
    sender: msg.senderId === user.id ? "me" : "other",
    text: msg.message,
  }));

  setMessages(chatMessages);

  }, [id, user]);

  useEffect(() => {
    if (!id || !user?.id) return;

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_Ws}`);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "online", userId: user.id }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (
        (data.senderId === id && data.receiverId === user.id) ||
        (data.senderId === user.id && data.receiverId === id)
      ) {
       const newMsg: { sender: "me" | "other"; text: string } = {
        sender: data.senderId === user.id ? "me" : "other",
        text: data.message,
        };
        setMessages((prev) => [...prev, newMsg]);
      }
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
  }, [id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !input.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN ||
      !user?.id ||
      !id
    )
      return;

    const messageObj = {
      type: "message",
      senderId: user.id,
      receiverId: id,
      message: input,
    };

    socketRef.current.send(JSON.stringify(messageObj));
    setMessages((prev) => [...prev, { sender: "me", text: input }]);
    setInput("");
  };

  const bgMain = darkMode ? "bg-gray-800" : "bg-white";
  const textMain = darkMode ? "text-white" : "text-gray-900";
  const borderMain = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-800";
  const msgOther = darkMode
    ? "bg-gray-700 text-white"
    : "bg-gray-200 text-gray-800";

  return (
    <main
      className={`flex flex-col h-full w-full lg:w-3/4 ${bgMain} ${
        darkMode
          ? "border-gray-900 border-l-1"
          : "border-l-1 border-[#64646480]"
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${borderMain} flex items-center gap-4 relative`}>
        <h1 className="w-12 h-12 rounded-full flex justify-center items-center bg-blue-600 text-white">
          {currentChat?.name?.charAt(0)}
        </h1>
        <div>
          <h2 className={`text-lg font-semibold ${textMain}`}>
            {currentChat?.name}
          </h2>
          <p className="text-sm text-green-500">
            {currentChat?.online ? "online" : "offline"}
          </p>
        </div>
        <div className="flex md:hidden absolute right-5 top-5 w-fit" onClick={()=>{
          router.push('/dashboard')
        }}>
          <FaX className={`${textMain}`}/>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                msg.sender === "me"
                  ? "bg-blue-500 text-white"
                  : `${msgOther}`
              } p-3 rounded-lg max-w-sm`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className={`p-4 border-t ${borderMain} flex items-center gap-2`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 p-2 rounded-lg border border-gray-300 ${inputBg}`}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
        >
          <IoSend size={20} />
        </button>
      </form>
    </main>
  );
}
