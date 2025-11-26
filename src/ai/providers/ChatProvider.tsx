// providers/chatProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
    isChatOpen: boolean;
    setChatOpen: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({
    isChatOpen: false,
    setChatOpen: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [isChatOpen, setChatOpen] = useState(false);

    return (
        <ChatContext.Provider value={{ isChatOpen, setChatOpen }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
