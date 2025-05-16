import { IMessage, IPublisherReport } from "@/types/forms";
import http from "../http";
import { IlistResponse, IQueryParams } from "@/types";

export async function sendMessageSingle(payload: IMessage) {
    const response = await http.post<any>("/commons/message/send-sms", payload)
    return response.data
}


export async function getPublisherPerfomance(month: number, params: IQueryParams) {
    const response = await http.get<IlistResponse<IPublisherReport>>(`/reports/publisher/performance/${month}`, {
        params: params
    })

    return response.data
}
