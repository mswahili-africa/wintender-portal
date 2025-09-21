import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getPublisherPerfomance } from "@/services/commons";

interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
    month: number
}

export default function usePublisherPerformance({ month, ...props }: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getPeformance", props.page, props.sort, props?.search, props?.filter, month], // Make sure month is passed as a string
        queryFn: () => getPublisherPerfomance(month, {
            page: props.page,
            size: 10,
            sort: props.sort,
            search: props.search
        }),
        onError: (error: AxiosError) => handleError(error),
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort, month]); // Add month to refetch

    return {
        isLoading,
        isError,
        performance: data,
        error,
        refetch
    };
}
