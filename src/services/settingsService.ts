import http from "@/http"
import { ISettings } from "@/types"


export async function getSettings() {
    const response = await http.get<ISettings>("/commons/setting")

    return response.data
}

export async function updateSettings(data:ISettings) {
    const response = await http.put<ISettings>("/commons/setting", data)

    return response.data
}

export async function createBackup() {
    const response = await http.post<any>(`commons/setting/backup`)
    return response.data
}

export async function sendRatraReport() {
    const response = await http.post<any>(`commons/setting/latra-report`)
    return response.data
}

export async function deleteLogs() {
    const response = await http.post<any>(`commons/setting/logs-deletion`)
    return response.data
}