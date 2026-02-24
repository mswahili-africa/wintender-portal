import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getEntities } from "@/services/entities";
import useErrorHandler from "./useErrorHandler";
import { getPEUsers } from "@/services/user";

interface IProps {
    page: number
    size?: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export function useEntities(props: IProps) {
    const { handleError } = useErrorHandler();

    const query = useQuery({
        queryKey: [
            "getVendors",
            props.page,
            props.size,
            props.sort,
            props.search,
            props.filter
        ],
        queryFn: () =>
            getEntities({
                page: props.page,
                size: props.size!,
                sort: props.sort,
                search: props.search,
            }),
        enabled: typeof props.search === "string" ? props.search.length >= 3 : true,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 300000,
        refetchOnWindowFocus: false,
        onError: (error: AxiosError) => handleError(error),
    });

    return {
        ...query,
        entities: query.data,
    };
}

export function useSearchEntities(props: IProps) {
    const { handleError } = useErrorHandler();

    const query = useQuery({
        queryKey: [
            "getSearchEntities",
            props.page,
            props.size,
            props.sort,
            props.search,
            props.filter
        ],
        queryFn: () =>
            getEntities({
                page: props.page,
                size: props.size!,
                sort: props.sort,
                search: props.search,
            }),
        enabled: typeof props.search === "string" && props.search.length >= 3,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 300000,
        refetchOnWindowFocus: false,
        onError: (error: AxiosError) => handleError(error),
    });

    return {
        ...query,
        entities: query.data,
    };
}
export function usePEUsers({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["usePEUsers", props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getPEUsers({page: props.page, size: 10, sort: props.sort, search: props.search}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 300000,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        isLoading,
        isError,
        pes: data,
        error,
        refetch
    }
}