import http from "@/http";
import { IStatisticsResponse } from "@/types";


export async function getSummaryReport() {
    const response = await http.get<IStatisticsResponse>(`/reports/statistics/summary`)

    return response.data.statistics
}