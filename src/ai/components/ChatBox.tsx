// components/ChatBox.tsx
import { useEffect, useRef } from "react";

interface Message {
    role: "USER" | "ASSISTANT";
    content: string;
    timestamp: number;
}

interface ChatBoxProps {
    messages: Message[];
    isLoading?: boolean;
}

export default function ChatBox({ messages, isLoading }: ChatBoxProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    function formatMessage(text: string) {
        let t = text;

        // Bold: *text*
        t = t.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

        // Italic: _text_
        t = t.replace(/_(.*?)_/g, "<em>$1</em>");

        // Bullets: lines starting with "* "
        t = t.replace(/^\* (.*)$/gm, "<li>$1</li>");
        if (t.includes("<li>")) {
            t = `<ul>${t}</ul>`;
        }

        return t;
    }

    return (
        <div
            ref={scrollRef}
            style={{
                padding: "12px",
                overflowY: "auto",
                flex: 1,
            }}
        >
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    style={{
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: msg.role === "USER" ? "flex-end" : "flex-start",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "75%", // wider bubble
                            padding: "10px 14px",
                            borderRadius: "20px",
                            backgroundColor: msg.role === "USER" ? "#2fb10b" : "#eee",
                            color: msg.role === "USER" ? "#fff" : "#000",
                            fontSize: "0.9rem", // smaller font
                            whiteSpace: "pre-wrap",
                        }}
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                </div>
            ))}

            {isLoading && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 8,
                    }}
                >
                    <div
                        style={{
                            border: "3px solid #f3f3f3",
                            borderTop: "3px solid #2fb10b",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            animation: "spin 1s linear infinite",
                        }}
                    />
                    <span>Thinking...</span>
                    <style>
                        {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
                    </style>
                </div>
            )}
        </div>
    );
}
