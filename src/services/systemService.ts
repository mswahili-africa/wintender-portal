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


export async function createBackup() {
    const response = await http.post<any>(`/commons/backup`)
    return response.data
}

export async function sendRatraReport() {
    const response = await http.post<any>(`/commons/latra-report`)
    return response.data
}

export async function deleteLogs() {
    const response = await http.post<any>(`/commons/logs-deletion`)
    return response.data
}