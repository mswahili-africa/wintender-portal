import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCategories } from "@/services/tenders";
import useErrorHandler from "./useErrorHandler";

interface IProps {
    page: number
    size: number
    search?: string
    categories?: string[]
    sort?: string
    filter?: Record<string, any>
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getCategories", props.page, props.sort, props?.search ,props?.categories, props?.filter],
        queryFn: () => getCategories({page: props.page, size: props.size, sort: props.sort, search: props.search, categories: props.categories, filter: props.filter}), // Added categories as an array
        onError: (error: AxiosError) => handleError(error),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    return {
        isLoading,
        isError,
        categories: data,
        error,
        refetch
    }
}