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
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getBidders", props.page, props.sort, props.search,props.address, props.categories?.join(","), props.filter],
        queryFn: () => getBidders({page: props.page, size: 10, sort: props.sort, search: props.search, address: props.address, categories: props.categories}),
        onError: (error: AxiosError) => handleError(error),
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search,props.address, props.categories, props.sort])

    return {
        isLoading,
        isError,
        bidders: data,
        error,
        refetch
    }
}