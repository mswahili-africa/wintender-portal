import http from "@/http";
import { IQueryParams, ITenderCategory, IlistResponse } from "@/types";


export async function downloadTenderDocument(id: string) {
    const response = await http.get<any>(`/tenders/tender/download/${id}`, {
        headers: {
            responseType: "blob",
        }
    })

    return response.data
}

export async function getTendersPrivate(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/tender/list-private", {
        params: params
    })

    return response.data
}

export async function getTendersGovernment(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/tender/list-government", {
        params: params
    })

    return response.data
}

export async function getTendersInternational(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/tender/list-international", {
        params: params
    })

    return response.data
}

export async function createTender(payload: FormData) {
    const response = await http.post<any>("/tenders/tender/create", payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data
}

export async function deleteTenders(id: string) {
    const response = await http.delete<any>(`/tenders/tender/delete/${id}`);

    return response.data
}

export async function createCategory(payload: ITenderCategory) {
    const response = await http.post<any>("/tenders/category/register", payload)

    return response.data
}

export async function getCategories(params: {}) {
    const response = await http.get<IlistResponse<any>>("/tenders/category/list", {
        params: params
    })

    return response.data
}

export async function requestDoForMe(id: string) {
    const response = await http.post<any>(`/applications/do-for-me/request/${id}`);

    return response.data
}

export async function updatePrincipleAmount(id: string, amount: number) {
    const response = await http.put<any>(`/applications/do-for-me/change-fee/${id}`, { principleAmount: amount });

    return response.data;
}

export async function updateStatus(id: string, comment: string, status: string) {
    const response = await http.put<any>(`/applications/do-for-me/update/${id}`, { status: status, comments: comment });

    return response.data;
}


export async function getDoForMe(params: {}) {
    const response = await http.get<IlistResponse<any>>("/applications/do-for-me/list", {
        params: params
    })

    return response.data
}

export async function deleteDoForMe(id: string) {
    const response = await http.delete<any>(`/applications/do-for-me/delete/${id}`);

    return response.data
}
