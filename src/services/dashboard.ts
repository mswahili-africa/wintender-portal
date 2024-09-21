import http from "@/http";

export async function getStatistics() {
    const response = await http.get<any>("/reports/statistics/summary")

    return response.data
}