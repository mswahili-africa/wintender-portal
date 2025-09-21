import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getEntities } from "@/services/entities";
import useErrorHandler from "./useErrorHandler";
import { getPEUsers } from "@/services/user";

interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export function useEntities({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getVendors", props.page, props.sort, props?.search, , props?.filter],
        queryFn: () => getEntities({page: props.page, size: 10, sort: props.sort, search: props.search}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 300000
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        entities: data,
        error,
        refetch
    }
}

export function usePEUsers({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["usePEUsers", props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getPEUsers({page: props.page, size: 10, sort: props.sort, search: props.search}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 300000
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        pes: data,
        error,
        refetch
    }
}