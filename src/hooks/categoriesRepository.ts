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

export function useCategories(props: IProps) {
    const { handleError } = useErrorHandler();

    const query = useQuery({
        queryKey: [
            "getCategories",
            props.page,
            props.size,
            props.sort,
            props.search,
            props.categories,
            props.filter
        ],
        queryFn: () =>
            getCategories({
                page: props.page,
                size: props.size,
                sort: props.sort,
                search: props.search,
                categories: props.categories,
                filter: props.filter
            }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        onError: (error: AxiosError) => handleError(error),
    });

    return {
        ...query,
        categories: query.data,
    };
}

export function useSearchCategories(props: IProps) {
    const { handleError } = useErrorHandler();

    const query = useQuery({
        queryKey: [
            "getSearchCategories",
            props.page,
            props.size,
            props.sort,
            props.search,
            props.categories,
            props.filter
        ],
        queryFn: () =>
            getCategories({
                page: props.page,
                size: props.size,
                sort: props.sort,
                search: props.search,
                categories: props.categories,
                filter: props.filter
            }),
        enabled: typeof props.search === "string" && props.search.length >= 3,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        onError: (error: AxiosError) => handleError(error),
    });

    return {
        ...query,
        categories: query.data,
    };
}