import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { getDoForMeGroup } from "@/services/tenders";

interface IProps {
    userId: string
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export function getAllApplicationsGroup({
    page,
    search,
    sort,
    filter,
}: {
    page: number;
    search: string;
    sort: string;
    filter?: any; // Define this type based on your requirements
}) {
    const { handleError } = useErrorHandler();

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: [
            "getAllApplicationsGroup", page,sort,search,filter ?? "all", // If filter is undefined, set it as 'all'
        ],
        queryFn: () =>
            getDoForMeGroup({
                page,
                size: 10, // Set the size per your requirement
                sort,
                search,
                filter, // Pass the filter
            }),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 300000, // Adjust this interval as needed
    });

    useEffect(() => {
        refetch(); // Refetch when filter, page, search, or sort change
    }, [filter, page, search, sort, refetch]);

    return {
        isLoading,
        isError,
        applicationGroupList: data,
        error,
        refetch,
    };
}

export function getUserApplicationsGroup({ userId, ...props }: IProps) { // Accept userId as a prop
    const { handleError } = useErrorHandler();

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getUserApplicationsGroup", props.page, props.sort, props?.search, props?.filter, userId], // Include userId in queryKey
        queryFn: () =>
            getDoForMeGroup({
                page: props.page,
                size: 10,
                sort: props.sort,
                search: props.search,
                userId,
                filter: props.filter,
            }),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 300000,
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort, userId]); // Include userId as a dependency

    return {
        isLoading,
        isError,
        applicationGroupList: data,
        error,
        refetch,
    };
}