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
