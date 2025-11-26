// components/ChatBubble.tsx
interface ChatBubbleProps {
    role: "USER" | "ASSISTANT";
    content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
    const isUser = role === "USER";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                marginBottom: 12,
                position: "relative"
            }}
        >
            <div style={{ position: "relative", maxWidth: "85%" }}>
                {/* Bubble */}
                <div
                    style={{
                        padding: "10px 16px",
                        borderRadius: 20,
                        backgroundColor: isUser ? "#2fb10b" : "#f1f1f1",
                        color: isUser ? "#fff" : "#000",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontSize: "14px",
                    }}
                >
                    {content}
                </div>

                {/* Arrow/Tail */}
                {isUser ? (
                    <div
                        style={{
                            position: "absolute",
                            right: "-6px",
                            top: "12px",
                            width: 0,
                            height: 0,
                            borderTop: "6px solid transparent",
                            borderBottom: "6px solid transparent",
                            borderLeft: "6px solid #2fb10b"
                        }}
                    />
                ) : (
                    <div
                        style={{
                            position: "absolute",
                            left: "-6px",
                            top: "12px",
                            width: 0,
                            height: 0,
                            borderTop: "6px solid transparent",
                            borderBottom: "6px solid transparent",
                            borderRight: "6px solid #f1f1f1"
                        }}
                    />
                )}
            </div>
        </div>
    );
}
