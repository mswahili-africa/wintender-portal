import http from "../http";
import { ILoginResponse, ICountry, IRole, IlistResponse } from "@/types";
import { IConfirmPasswordResetForm, IRegisterForm } from "@/types/forms";


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
    const response = await http.post<any>("/authentication/signout", payload)

    return response.data
}

// pass email for such user
export async function forgotPassword(payload: {username: string}) {
    const response = await http.post<any>("/users/auth/resetPassword", payload)

    return response.data
}

export async function confirmResetPassword(payload: IConfirmPasswordResetForm) {
    const response = await http.post<any>("/users/auth/confirmReset", payload)

    return response.data
}

export async function confirmUser(userId:string) {
    const response = await http.post<any>(`/users/user/confirm/${userId}`, {})

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

