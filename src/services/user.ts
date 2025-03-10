import http from "@/http";
import { ICompany, IQueryParams, IUser, IlistResponse} from "@/types";


export async function getUsers(params: IQueryParams) {
    const response = await http.get<IlistResponse<IUser>>("/users/user/list", {
        params: params
    })

    return response.data
}

export async function getBidders(params: IQueryParams) {
    const response = await http.get<IlistResponse<ICompany>>("/users/user/list-bidders", {
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

export async function updateBidder(payload: IUser, userId: string) {
    const response = await http.post<any>(`/users/bidder/update/${userId}`, payload)

    return response.data
}

export async function updateBidderCompany(payload: ICompany, userId: string) {
    const response = await http.post<any>(`/users/bidder/update-company/${userId}`, payload)

    return response.data
}