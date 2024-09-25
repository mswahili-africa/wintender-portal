import http from "@/http";
import { IQueryParams, IEntity, IlistResponse, ICompanyDocuments } from "@/types";


export async function getEntities(params: IQueryParams) {
    const response = await http.get<IlistResponse<IEntity>>("/entities/list", {
        params: params
    })

    return response.data
}

export async function createEntity(payload: FormData) {
    const response = await http.post<any>("/entities/create", payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data
}

export async function updateEntity(id: string, payload: IEntity) {
    const response = await http.put<IEntity>(`/entities/update/${id}`, payload)

    return response.data;
}

export async function uploadDocument(payload: FormData) {
    const response = await http.post<any>("/entities/company/document/upload", payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data
}

export async function getDocuments(account: string, params: IQueryParams) {
    const response = await http.get<IlistResponse<ICompanyDocuments>>(`/entities/company/document/list/${account}`, {
        params: params
    })

    return response.data
}

export async function deleteDocument(id: string) {
    const response = await http.delete<any>(`/entities/company/document/delete/${id}`);

    return response.data
}