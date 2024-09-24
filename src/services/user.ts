import http from "@/http";
import { IQueryParams, IUser, IlistResponse} from "@/types";


export async function getUsers(params: IQueryParams) {
    const response = await http.get<IlistResponse<IUser>>("/users/user/list", {
        params: params
    })

    return response.data
}

export async function getBidders(params: IQueryParams) {
    const response = await http.get<IlistResponse<IUser>>("/users/user/list-bidders", {
        params: params
    })

    return response.data
}

export async function getUserById(id: string) {
    const response = await http.get<any>(`/users/user/view/${id}`)

    return response.data
}

export async function changeUserStatus(id: string) {
    const response = await http.put<any>(`/users/user/status/${id}`)

    return response.data
}