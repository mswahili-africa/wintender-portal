import http from "@/http";
import { IDash } from "@/types";


export async function getStatistics() {
    const response = await http.get<IDash>("/reports/statistics/summary")

    return response.data
}