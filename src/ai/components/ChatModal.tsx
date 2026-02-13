import { useEffect, useState } from "react";
import { IconX, IconArrowUp } from "@tabler/icons-react";
import ChatBox from "./ChatBox";
import { getUserChats, sendChatMessage } from "@/ai/services/apis";
import { useChat } from "../providers/ChatProvider";

interface ChatModalProps {
  onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { setChatOpen } = useChat();

  useEffect(() => {
    setChatOpen(true);
    // return () => setChatOpen(false);
  }, []);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      try {
        const res = await getUserChats();
        setMessages(res?.[0]?.messages || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      role: "USER",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // show thinking loader
    setLoading(true);

    try {
      const res = await sendChatMessage({ content: newMessage.content });
      if (res?.messages) setMessages(res.messages);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ASSISTANT", content: "Failed to get response", timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        right: 24,
        height: "70vh",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
      className="w-[90%] sm:w-[600px]"
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>WintenderAI</h3>
        <button onClick={onClose}>
          <IconX />
        </button>
      </div>

      {/* Chat messages */}
      <ChatBox messages={messages} isLoading={loading} />

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #eee",
          gap: 8,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
          }
          placeholder="Type a message..."
          style={{
            flex: 1,
            borderRadius: 20,
            border: "1px solid #ccc",
            padding: "10px 14px",
            resize: "none",
            height: 40,
            fontSize: 14,
          }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: "#2fb10b",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            border: "none",
          }}
        >
          <IconArrowUp size={20} />
        </button>
      </div>

      <span className="block text-center text-gray-500 text-xs mt-2">
        TenderAI can make mistakes. Check important info.
      </span>


    </div>
  );
}
