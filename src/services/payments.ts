import {  IPaymentForm, ISubscriptionPlanForm, IUSSDPushRequest, IUSSDPushWalletRequest } from "@/types/forms";
import http from "../http";
import { IPayment, IQueryParams, ISubscriptionBenefit, ISubscriptionPlan, IlistResponse } from "@/types";


export async function getControlNumber(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/finance/payment/bill/list", {
        params: params
    })

    return response.data
}
export async function getPayments(params: IQueryParams) {
    const response = await http.get<IlistResponse<IPayment>>("/finance/payment/transaction/list", {
        params: params
    })

    return response.data
}

export async function createPayment(payload: IPaymentForm) {
    const response = await http.post<any>("/finance/payment/pos/request", payload)

    return response.data
}

export async function USSDPushRequest(payload: IUSSDPushRequest) {
    const response = await http.post<any>("/finance/payment/ussd/request", payload)

    return response.data
}

// JCM wallet top up request
export async function USSDPushWalletRequest(payload: IUSSDPushWalletRequest) {
    const response = await http.post<any>("/finance/payment/ussd/request", payload)

    return response.data
}

export async function USSDPushEnquiry(id: string) {
    const response = await http.post<any>(`/finance/payment/ussd/enquiry/${id}`)

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

// SUBSCRIPTIONS benefits
export async function getSubscriptionBenefits(params: any) {
    const response = await http.get<ISubscriptionBenefit[]>("/finance/payment/plan/benefit", {
        params: params
    })

    return response.data
}

export async function createSubscriptionBenefit(payload: any) {
    const response = await http.post<any>(`/finance/payment/plan/benefit`,payload)

    return response.data
}

// SUBSCRIPTIONS plans
export async function getSubscriptionPlans(params: IQueryParams) {
    const response = await http.get<ISubscriptionPlan[]>("/finance/payment/plan", {
        params: params
    })

    return response.data
}

export async function createSubscriptionPlan(payload: ISubscriptionPlanForm) {
    const response = await http.post<any>(`/finance/payment/plan`,payload)

    return response.data
}

export async function updateSubscriptionPlan(payload: ISubscriptionPlanForm,id:string) {
    const response = await http.put<any>(`/finance/payment/plan/${id}`,payload)

    return response.data
}
export async function deleteSubscriptionPlan(id:string) {
    const response = await http.delete<any>(`/finance/payment/plan/${id}`)

    return response.data
}

