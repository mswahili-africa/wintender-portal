import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getCategories } from "@/services/tenders";
import useErrorHandler from "./useErrorHandler";

interface IProps {
    page: number
    search?: string
    categories?: string[]
    sort?: string
    filter?: Record<string, any>
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getCategories", props.page, props.sort, props?.search ,props?.categories, props?.filter],
        queryFn: () => getCategories({page: props.page, size: 10, sort: props.sort, search: props.search, categories: props.categories, filter: props.filter}), // Added categories as an array
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 20000
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        categories: data,
        error,
        refetch
    }
}