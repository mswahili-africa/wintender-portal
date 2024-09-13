import {  IPaymentForm } from "@/types/forms";
import http from "../http";
import { IQueryParams, IlistResponse } from "@/types";


export async function getPayments(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/payments/list", {
        params: params
    })

    return response.data
}

export async function createPayment(payload: IPaymentForm) {
    const response = await http.post<any>("/payments/create", payload)

    return response.data
}


export async function approvePayment(paymentId: string) {
    const response = await http.put<any>(`/payments/review/${paymentId}`,{
       
        "status": "APPROVED",
    })

    return response.data
}

export async function rejectPayment(paymentId: string) {
    const response = await http.put<any>(`/payments/review/${paymentId}`,{
        "status": "REJECTED"
    })

    return response.data
}




