import { IQueryParams } from "@/types";
import http from "@/http";

export async function getSystemLogs(params: IQueryParams) {
    const response = await http.get<any>(`/commons/errors`, {
        params: {
            ...params
        }
    })
    return response.data
}

export async function getSystemHealthDetails() {
    const response = await http.get<any>(`/reports/server/actuator`)
    return response.data
}

