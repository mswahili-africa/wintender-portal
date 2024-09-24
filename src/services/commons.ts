import { IMessage, IPackagesForm } from "@/types/forms";
import http from "../http";

export async function sendMessageSingle(payload: IMessage) {
    const response = await http.post<any>("/commons/message/send-sms", payload)
    return response.data
}





