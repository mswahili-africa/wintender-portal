import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getClarifications } from "@/services/clarifications";

interface IProps {
    id: string
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getClarifications",props.id],
        queryFn: () => getClarifications(props.id), 
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 1500000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 1,
        cacheTime: 30 * 60 * 1000,
        staleTime: 5 * 60 * 1000
    });

    return {
        isLoading,
        isError,
        clarifications: data,
        error,
        refetch
    }
}