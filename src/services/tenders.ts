import http from "@/http";
import { IQueryParams, ITenderCategory, IlistResponse } from "@/types";
import { IAssignBidder, IConsultation, IConsultationApplication } from "@/types/forms";


// JCM TENDER
export async function downloadTenderDocument(id: string) {
    const response = await http.get<any>(`/tenders/tender/download/${id}`, {
        headers: {
            responseType: "blob",
        }
    })

    return response.data
}

export async function getTendersPrivate(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/tender/list?tenderGroup=PUBLIC&region=PRIVATE", {
        params: params
    })

    return response.data
}

export async function getTendersGovernment(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/tender/list?tenderGroup=PUBLIC&region=GOVERNMENT", {
        params: params
    })

    return response.data
}

export async function getTendersInternational(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/tenders/tender/list?tenderGroup=PUBLIC&region=INTERNATIONAL", {
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

export async function updateTender(id: string, payload: FormData) {
    const response = await http.post<any>(`/tenders/tender/update/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data
}

export async function deleteTenders(id: string) {
    const response = await http.delete<any>(`/tenders/tender/delete/${id}`);

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
// JCM TENDER

export async function assignBidder(payload: IAssignBidder) {
    const response = await http.post<any>(`/applications/do-for-me/assign-bidder`, payload)

    return response.data;
}

export async function updatePrincipleAmount(id: string, amount: number) {
    const response = await http.put<any>(`/applications/do-for-me/change-fee/${id}`, { principleAmount: amount });

    return response.data;
}

export async function updateStatus(id: string, comment: string, status: string) {
    const response = await http.put<any>(`/applications/do-for-me/update/${id}`, { status: status, comments: comment });

    return response.data;
}


// JCM DO FOR ME
export async function requestDoForMe(id: string) {
    const response = await http.post<any>(`/applications/do-for-me/request/${id}`);

    return response.data
}

export async function getDoForMeGroup(params: {}) {
    const response = await http.get<IlistResponse<any>>("/applications/do-for-me/list/group", {
        params: params
    })

    return response.data
}

export async function getDoForMeApplication(groupId: string, params: {}) {
    const response = await http.get<IlistResponse<any>>(`/applications/do-for-me/list/application/${groupId}`, {
        params: params
    })

    return response.data
}

export async function deleteDoForMe(id: string) {
    const response = await http.delete<any>(`/applications/do-for-me/delete/${id}`);

    return response.data
}
// JCM DO FOR ME

// JCM BILLBOARD
export async function createBillboard(payload: IConsultation) {
    const response = await http.post<any>("/applications/consultation/billboard/create", payload)
    return response.data
}

export async function deleteBillboard(id: string) {
    const response = await http.delete<any>(`/applications/consultation/billboard/delete/${id}`);

    return response.data
}

export async function getBillboards() {
    const response = await http.get<IConsultation[]>("/applications/consultation/billboard/list")

    return response.data
}
// JCM BILLBOARD

// JCM CONSULT ME
export async function createConsultMe(id: string) {
    const response = await http.post<any>(`/applications/consultation/application/create/${id}`)

    return response.data
}


export async function deleteConsultMe(id: string) {
    const response = await http.delete<any>(`/applications/consultation/application/delete/${id}`);

    return response.data
}

export async function getConsultMe(params: IQueryParams) {
    const response = await http.get<IlistResponse<any>>("/applications/consultation/application/list", {
        params: params
    })
    return response.data
}

export async function updateConsultMe(id: string, comment: string, status: string) {
    const response = await http.put<any>(`/applications/consultation/application/update/${id}`, { status: status, comment: comment });

    return response.data;
}

// JCM CONSULT ME


export async function getTenderDetails(id: string) {
    const response = await http.get<any>(`/tenders/tender/view/${id}`);

    return response.data
}

export async function uploadApplicationDocument(formData: FormData) {
    const response = await http.post("/applications/application/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function viewApplication(id: string) {
    const response = await http.get<any>(`/applications/application/${id}/view`);

    return response.data
}

export async function listApplication(tenderId: string, params: {}) {
    const response = await http.get<IlistResponse<any>>(`/applications/application/list?tenderId=${tenderId}`, {
        params: params
    })

    return response.data
}

export async function listAllSubmittedApplication(params: {}) {
    const response = await http.get<IlistResponse<any>>(`/applications/application/list`, {
        params: params
    })

    return response.data
}

export async function reviewApplication(id: string, status: string) {
    const response = await http.put<any>(`/applications/application/${id}/review`, { status: status});

    return response.data;
}

export async function deleteApplication(id: string) {
    const response = await http.delete<any>(`/applications/application/${id}/delete`);

    return response.data
}