import { TOKEN_KEY } from "@/http/constants";
import http from "../http";
import { ILoginResponse, ICountry, IRole, IlistResponse, IToken } from "@/types";
import { IBidderRegisterForm, IConfirmPasswordResetForm, IRegisterForm } from "@/types/forms";


export async function getRoles(params: {}) {
    const response = await http.get<IlistResponse<IRole>>("/users/auth/roles", {
        params: params
    })

    return response.data
}

export async function getCountries(params: {}) {
    const response = await http.get<ICountry[]>("/countries/country/list", {
        params: params
    })

    return response.data
}

export async function login(payload: {username: string, password: string}) {
    const response = await http.post<ILoginResponse>("/users/auth/login", payload)

    return response.data
}

export async function logout(payload: {username: string, accessToken: string}) {
    const response = await http.post<any>("/users/auth/signout", payload)

    return response.data
}

export async function tokenInfo() {
    const response = await http.get<any>("/users/auth/token-info")

    return response.data
}

// pass email for such user
export async function forgotPassword(payload: {username: string}) {
    const response = await http.post<any>("/users/auth/reset-password", payload)

    return response.data
}

export async function confirmResetPassword(payload: IConfirmPasswordResetForm) {
    const response = await http.post<any>("/users/auth/confirm-reset", payload)

    return response.data
}

export async function confirmUser(userId:string) {
    const response = await http.post<any>(`/users/user/confirm/${userId}`, {})

    return response.data
}

export async function resetUser(id: string) {
    const response = await http.put<any>(`/users/auth/reset-user/${id}`)

    return response.data
}

export async function updateUser(payload: IRegisterForm, userId: string) {
    const response = await http.put<any>(`/users/user/update/${userId}`, payload)

    return response.data
}

// pass username for such user
// export async function deleteUser(payload: {username: string}) {
//     const response = await http.post<any>("/authentication/deleteuser", payload)

//     return response.data
// }

export async function signup(payload: IRegisterForm) {
    const response = await http.post<any>("/users/user/create", payload)
}

export async function bidderRegister(payload: IBidderRegisterForm) {
    const response = await http.post<any>("/users/bidder/register", payload)
}

export function isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY); // Retrieve the token from localStorage
    return !!token; // Return true if a token exists, false otherwise
}
