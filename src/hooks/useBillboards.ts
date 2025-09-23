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
    }); 

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        consultationServices: data,
        error,
        refetch
    }
} 