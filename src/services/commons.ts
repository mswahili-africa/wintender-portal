import { IPackagesForm } from "@/types/forms";
import http from "../http";

export async function sendMessage(payload: IPackagesForm) {
    const response = await http.post<any>("/commoms/message/send", payload)
    return response.data
}


export async function sendOtp(payload: IPackagesForm) {
    const response = await http.post<any>("/commoms/otp/send", payload)
    return response.data
}

export async function sendVerify(payload: IPackagesForm) {
    const response = await http.post<any>("/commoms/otp/verify", payload)
    return response.data
}





