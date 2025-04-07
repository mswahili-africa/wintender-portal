import { IBillboard, IMessage, IPublisherReport } from "@/types/forms";
import http from "../http";
import { IEntity, IlistResponse, IQueryParams } from "@/types";

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

export async function createBillboard(payload: IBillboard) {
    const response = await http.post<any>("/commons/billboard/create", payload)
    return response.data
}

export async function deleteBillboard(id: string) {
    const response = await http.delete<any>(`/commons/billboard/delete/${id}`);

    return response.data
}

export async function getBillboards(params: {}) {
    const response = await http.get<IlistResponse<any>>("/commons/billboard/list", {
        params: params
    })

    return response.data
}