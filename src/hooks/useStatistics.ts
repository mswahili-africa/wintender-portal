import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useErrorHandler from "./useErrorHandler";
import { getStatistics } from "@/services/dashboard";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function() {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getStatistics"],
        queryFn: () => getStatistics(),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 20000
    });

    return {
        isLoading,
        isError,
        stats: data,
        error,
        refetch
    }
}