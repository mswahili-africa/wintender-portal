import http from "@/http";
import { IQueryParams, IlistResponse } from "@/types";


export async function downloadTenderDocument(id: string) {
    const response = await http.get<any>(`/tenders/download/${id}`, {
        headers: {
            responseType: "blob",
        }
    })

    return response.data
}

export async function getTenders(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/list", {
        params: params
    })

    return response.data
}

export async function createTender(payload: FormData) {
    const response = await http.post<any>("/tenders//create", payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data
}

export async function deleteTenders(id: string, status: string, archive: boolean) {
    const response = await http.put<any>(`/tenders/delete/${id}`);

    return response.data
}