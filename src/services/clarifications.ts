import http from "@/http"


export async function addClarification(id:string,data:any) {
    const response = await http.post<any>(`/tenders/clarification/${id}`,data)

    return response.data
}

export async function getClarifications(id:string) {
    const response = await http.get<any>(`/tenders/clarification/${id}`)

    return response.data
}

export async function replyClarification(id:string,data:any) {
    const response = await http.put<any>(`/tenders/clarification/${id}`, data)

    return response.data
}
