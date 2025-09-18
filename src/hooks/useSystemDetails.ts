import { getSummaryReport } from "@/services/reports";
import {  getSystemHealthDetails, getSystemLogs } from "@/services/systemService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
    logType?: string
}

// JCM system logs hook
export function useSystemLogs({ ...props }: IProps) {
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getPeformance", props.page, props.sort, props?.search, props?.filter, props?.logType],
        queryFn: () => getSystemLogs({
            page: props.page,
            size: 10,
            sort: props.sort,
            search: props.search,
            logType: props.logType
        }),

    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort]);

    return {
        isLoading,
        isError,
        logs: data,
        error,
        refetch
    };
}
export function useSystemHealth() {
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getSystemHealth"],
        queryFn: () => getSystemHealthDetails(),

        refetchInterval: 3000000, 
    });

    return {
        isLoading,
        isError,
        healthData: data,
        error,
        refetch
    };
}

export function useSummary() {
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getSystemHealth"],
        queryFn: () => getSummaryReport(),

        refetchInterval: 3000000, 
    });

    return {
        isLoading,
        isError,
        summary: data,
        error,
        refetch
    };
}
