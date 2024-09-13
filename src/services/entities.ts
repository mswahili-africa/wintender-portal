import http from "@/http";
import { IQueryParams, IVendor,IlistResponse } from "@/types";


export async function getEntities(params: IQueryParams) {
    const response = await http.get<IlistResponse<IVendor>>("/entities/list", {
        params: params
    })

    return response.data
}

export async function createEntity(payload: FormData) {
    const response = await http.post<IVendor>("/entities/register", payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data
}

export async function updateEntity(id: string, payload: FormData) {
    const response = await http.put<IVendor>(`/entities/update/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data;
}