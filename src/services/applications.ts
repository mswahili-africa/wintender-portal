import {  IPaymentForm } from "@/types/forms";
import http from "../http";
import { IQueryParams, IlistResponse } from "@/types";


export async function getApplications(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/applications/list", {
        params: params
    })

    return response.data
}

export async function createApplication(payload: IPaymentForm) {
    const response = await http.post<any>("/applications/create", payload)

    return response.data
}


export async function approvePayment(paymentId: string) {
    const response = await http.put<any>(`/applications/review/${paymentId}`,{
       
        "status": "APPROVED",
    })

    return response.data
}

export async function rejectPayment(paymentId: string) {
    const response = await http.put<any>(`/applications/review/${paymentId}`,{
        "status": "REJECTED"
    })

    return response.data
}




