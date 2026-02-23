import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getLoginAttempts } from "@/services/auth";

interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getLoginAttempts", props.page, props.sort, props?.search, , props?.filter],
        queryFn: () => getLoginAttempts({page: props.page, size: 10, sort: props.sort, search: props.search}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 300000, 
        refetchOnWindowFocus: false,
        staleTime: 1 * 60 * 1000
    });

    return {
        isLoading,
        isError,
        attempts: data,
        error,
        refetch
    }
}