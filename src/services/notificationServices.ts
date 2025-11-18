import http from "@/http";
import { IQueryParams, IContacts, IMessages, IlistResponse } from "@/types";
import { IMessage } from "@/types/forms";

export async function getContacts(params: IQueryParams) {
  const response = await http.get<IlistResponse<IContacts>>(`notification/messaging/whatsapp/contacts`, {
    params: {
      ...params,
    },
  });
  return response.data;
}

export async function getMessages(params: IQueryParams) {
  const response = await http.get<IlistResponse<IMessages>>(`notification/messaging/whatsapp/messages`, {
    params: {
      ...params,
    },
  });
  return response.data;
}

// send message
export async function sendTexts(data: IMessage, group: string) {
  const response = await http.post<any>(`notification/messaging/sms?group=${group}`, data)
  return response.data
}
