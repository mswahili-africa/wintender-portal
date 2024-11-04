import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getTendersPrivate } from "@/services/tenders";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersPrivate", props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getTendersPrivate({page: props.page, size: 30, sort: props.sort, search: props.search}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 100000
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