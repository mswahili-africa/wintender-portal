import http from "@/http";
import { IQueryParams, IEntity,IlistResponse } from "@/types";


export async function getEntities(params: IQueryParams) {
    const response = await http.get<IlistResponse<IEntity>>("/entities/list", {
        params: params
    })

    return response.data
}

export async function createEntity(payload: IEntity) {
    const response = await http.post<IEntity>("/entities/create", payload)

    return response.data
}

export async function updateEntity(id: string, payload: IEntity) {
    const response = await http.put<IEntity>(`/entities/update/${id}`, payload)

    return response.data;
}