import {  IPaymentForm } from "@/types/forms";
import http from "../http";
import { IQueryParams, IlistResponse } from "@/types";


export async function getPayments(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/finance/payment/transaction/list", {
        params: params
    })

    return response.data
}

export async function createPayment(payload: IPaymentForm) {
    const response = await http.post<any>("/finance/payment/pos/request", payload)

    return response.data
}


export async function approvePayment(paymentId: string) {
    const response = await http.put<any>(`/finance/payment/pos/review/${paymentId}`,{
       
        "status": "APPROVED",
    })

    return response.data
}

export async function rejectPayment(paymentId: string) {
    const response = await http.put<any>(`/finance/payment/pos/review/${paymentId}`,{
        "status": "REJECTED"
    })

    return response.data
}




