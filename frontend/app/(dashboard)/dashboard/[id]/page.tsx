"use client"
import { IoSend } from "react-icons/io5";

export default function Page({ params }: { params: { id: unknown } }) {
  const { id } = params;
  return (
    <main className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-4">
      <img
        src="https://via.placeholder.com/40"
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h2 className="text-lg font-semibold text-gray-900">John Doe</h2> {/* Replace with actual name */}
        <p className="text-sm text-green-500">Online</p> {/* Replace with dynamic status */}
      </div>
    </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Example Messages */}
        <div className="flex justify-start">
          <div className="bg-gray-200 p-3 rounded-lg max-w-sm">
            <p className="text-sm text-gray-800">Hello! This is a message from the other user.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-blue-500 text-white p-3 rounded-lg max-w-sm">
            <p className="text-sm">Hi! This is your reply.</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <form className="p-4 border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg border border-gray-300 text-gray-800"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
        >
          <IoSend size={20} />
        </button>
      </form>
    </main>
  );
}
