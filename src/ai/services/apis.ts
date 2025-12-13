// services/chat.ts
import http from "@/http";

// Payload interface
export interface ISendMessagePayload {
    chatId?: string; 
    role?: "USER" | "ASSISTANT";
    content: string;
}

// Fetch chat history for a user
export async function getUserChats() {
    const response = await http.get(`/ai/chat`);
    return response.data;
}

// Send message to AI
export async function sendChatMessage(payload: ISendMessagePayload) {
    const response = await http.post("/ai/chat", payload);
    return response.data;
}

// Delete chat
export async function deleteChat(chatId: string, userId: string) {
    const response = await http.delete(`/ai/chat/${chatId}`);
    return response.data;
}
