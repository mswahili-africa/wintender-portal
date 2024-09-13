import http from "@/http";
import { ISummaryReport, } from "@/types";


export async function getSummaryReport() {
    const response = await http.get<ISummaryReport>(`/reports/statistics/summary`)

    return response.data
}