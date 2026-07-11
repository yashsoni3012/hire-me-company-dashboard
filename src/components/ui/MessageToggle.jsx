import { useState, useEffect } from "react";
import { TbMessage, TbX, TbSend, TbMinimize, TbMaximize } from "react-icons/tb";
import Avatar from "./Avatar";

export default function MessageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Arjun Mehta",
      text: "Hi, I'd like to apply for the React Developer role.",
      time: "10:24 AM",
      unread: true,
    },
    {
      id: 2,
      sender: "Priya Shah",
      text: "Can you share more details about the salary structure?",
      time: "9:10 AM",
      unread: true,
    },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "You",
          text: message,
          time: "Just now",
          unread: false,
        },
      ]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600 transition-all hover:scale-105 flex items-center justify-center"
      >
        <TbMessage size={24} />
        {messages.some((m) => m.unread) && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {messages.filter((m) => m.unread).length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isMinimized ? "w-72" : "w-96"}`}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-brand-500 text-white">
          <div className="flex items-center gap-2">
            <TbMessage size={18} />
            <span className="font-semibold text-sm">Messages</span>
            {messages.some((m) => m.unread) && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {messages.filter((m) => m.unread).length} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMinimized ? (
                <TbMaximize size={16} />
              ) : (
                <TbMinimize size={16} />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <TbX size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === "You" ? "flex-row-reverse" : ""}`}
                >
                  {msg.sender !== "You" && (
                    <Avatar
                      initials={msg.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      size="sm"
                    />
                  )}
                  <div
                    className={`max-w-[80%] ${
                      msg.sender === "You"
                        ? "bg-brand-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-tl-xl rounded-tr-xl rounded-br-xl"
                    } px-3 py-2 text-sm`}
                  >
                    {msg.sender !== "You" && (
                      <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-0.5">
                        {msg.sender}
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1 ${msg.sender === "You" ? "text-white/70" : "text-gray-400"}`}
                    >
                      {msg.time}
                    </div>
                  </div>
                  {msg.unread && msg.sender !== "You" && (
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-brand-400"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  message.trim()
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <TbSend size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
