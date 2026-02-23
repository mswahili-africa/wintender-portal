import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getTendersGovernment } from "@/services/tenders";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
    eligibility?:boolean
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersGovernment", props.page, props.sort, props?.search, props?.filter,props?.eligibility],
        queryFn: () => getTendersGovernment({page: props.page, size: 30, sort: props.sort, search: props.search,eligibility:props.eligibility}),
        onError: (error: AxiosError) => handleError(error),
        refetchOnWindowFocus: false,
        staleTime: 1 * 60 * 1000
    });

    return {
        isLoading,
        isError,
        getTenders: data,
        error,
        refetch
    }
}