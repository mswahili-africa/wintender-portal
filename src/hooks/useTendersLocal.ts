import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getTendersLocal } from "../services/tenders";
import useErrorHandler from "./useErrorHandler";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersLocal", props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getTendersLocal({page: props.page, size: 10, sort: props.sort, search: props.search}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 20000
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        getTenders: data,
        error,
        refetch
    }
}