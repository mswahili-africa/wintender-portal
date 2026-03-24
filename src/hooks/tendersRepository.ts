import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useErrorHandler from "./useErrorHandler";
import { getTenders, getTendersGovernment, getTendersInternational, getTendersPrivate } from "@/services/tenders";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
    eligibility?:boolean
    categories?: string[]
    bidderId?: string
}


export const useTenders =({...props}: IProps) => {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersGovernment", props.page, props.sort, props?.search, props?.filter,props?.eligibility,props?.categories,props?.bidderId],
        queryFn: () => getTenders({page: props.page, size: 10, sort: props.sort, search: props.search,eligibility:props.eligibility,categories:props.categories,bidderId:props.bidderId}),
        onError: (error: AxiosError) => handleError(error),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
    });

    return {
        isLoading,
        isError,
        getTenders: data,
        error,
        refetch
    }
}

export function useTendersPrivate({...props}: IProps) {
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

export function useTendersInternational({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersInternational", props.page, props.sort, props?.search, props?.filter,props?.eligibility],
        queryFn: () => getTendersInternational({page: props.page, size: 30, sort: props.sort, search: props.search,eligibility:props.eligibility}),
        onError: (error: AxiosError) => handleError(error),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5*60 * 1000,
    });

    return {
        isLoading,
        isError,
        getTenders: data,
        error,
        refetch
    }
}

export function useTendersGovernment({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersGovernment", props.page, props.sort, props?.search, props?.filter,props?.eligibility],
        queryFn: () => getTendersGovernment({page: props.page, size: 30, sort: props.sort, search: props.search,eligibility:props.eligibility}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 600000, 
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 10 * 60 * 1000,
        staleTime: 5 * 60 * 1000
    });

    return {
        isLoading,
        isError,
        getTenders: data,
        error,
        refetch
    }
}