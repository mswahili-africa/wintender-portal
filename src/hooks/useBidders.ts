import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getBidders } from "@/services/user";
import useErrorHandler from "./useErrorHandler";


interface IProps {
    page: number
    categories?: string[]
    address?: string;
    search?: string
    sort?: string
    filter?: Record<string, any>
    subscriptionDate?: string
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getBidders", props.page, props.sort, props.search,props.address, props.categories?.join(","), props.filter, props.subscriptionDate],
        queryFn: () => getBidders({page: props.page, size: 10, sort: props.sort, search: props.search, address: props.address, categories: props.categories, subscriptionDate: props.subscriptionDate}),
        onError: (error: AxiosError) => handleError(error),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 2 * 60 * 1000,
        enabled: props.search !== undefined  ? props.search.length >= 3 : true
    });

    return {
        isLoading,
        isError,
        bidders: data,
        error,
        refetch
    }
}