import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useErrorHandler from "./useErrorHandler";
import { getTendersPrivate } from "@/services/tenders";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
    categories?: string[]
    eligibility?:boolean
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersPrivate", props.page, props.sort, props?.search, props?.filter,props?.eligibility],
        queryFn: () => getTendersPrivate({page: props.page, size: 30, sort: props.sort, search: props.search,categories:props.categories,eligibility:props.eligibility}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 600000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry:1,
        cacheTime: 10 * 60 * 1000,
        staleTime: 10 * 60 * 1000,
    });

    return {
        isLoading,
        isError,
        getTenders: data,
        error,
        refetch
    }
}