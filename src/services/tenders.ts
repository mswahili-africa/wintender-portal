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

export async function getTenders(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/tender/list", {
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

export async function deleteTenders(id: string, status: string, archive: boolean) {
    const response = await http.put<any>(`/tenders/tender/delete/${id}`);

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
