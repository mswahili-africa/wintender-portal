import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { getBillboards } from "@/services/tenders";

interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export const useBillboards = ({...props}: IProps) =>{
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getBillboards",props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getBillboards(),
        onError: (error: AxiosError) => handleError(error),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1,
        staleTime: 6 * 60 * 1000,

    }); 

    return {
        isLoading,
        isError,
        consultationServices: data,
        error,
        refetch
    }
} 