import { useState } from "react";
import ChatModal from "./ChatModal";
import { useChat } from "../providers/ChatProvider";
import { useUserDataContext } from "@/providers/userDataProvider";

export default function FloatingChatButton() {

    const { userData } = useUserDataContext();
    const [open, setOpen] = useState(false);
    const { isChatOpen } = useChat();

    if (!userData?.account || isChatOpen) return null;

    return (
        <>
            {open && <ChatModal onClose={() => setOpen(false)} />}
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "#2fb10b",
                    color: "#fff",
                    fontSize: 28,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                }}
            >
                💬
            </button>
        </>
    );
}
