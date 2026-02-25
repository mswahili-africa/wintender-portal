import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useErrorHandler from "./useErrorHandler";
import { getStatistics } from "@/services/dashboard";

export default function useStatistics() {
    const { handleError } = useErrorHandler();

    const query = useQuery({
        queryKey: ["statistics"],

        queryFn: getStatistics,

        // Prevent unnecessary refetches
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,

        // Cache & freshness strategy
        staleTime: 10 * 60 * 1000, // 10 minutes (data considered fresh)
        cacheTime: 30 * 60 * 1000, // 30 minutes (keep in memory)

        // Background refresh ONLY when app is active
        refetchInterval: 5 * 60 * 1000,
        refetchIntervalInBackground: false,

        retry: 1, 

        onError: (error: AxiosError) => handleError(error),
    });

    return {
        ...query,
        stats: query.data,
    };
}