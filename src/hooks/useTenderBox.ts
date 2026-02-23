import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getTenderBox } from "@/services/tenders";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function ({ ...props }: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTenderBox", props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getTenderBox({ page: props.page, size: 30, sort: props.sort, search: props.search }),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 600000, // 10 minutes

        refetchOnWindowFocus: false,
        staleTime: 5*60*1000,
    });

    return {
        isLoading,
        isError,
        getTenderBox: data,
        error,
        refetch
    }
}