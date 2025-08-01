import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { getPayments } from "../services/payments";

interface IProps {
    userId: string
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export function getAllPayments({
    page,
    search, // Provide default empty string for search
    sort,
    filter,
  }: {
    page: number;
    search?: string; // Allow search to be undefined
    sort: string;
    filter?: any;
  }) {
    const { handleError } = useErrorHandler();

    const { isLoading, isError, data, error, refetch } = useQuery({
      queryKey: [
        "getAllPayments",
        page,
        sort,
        search ?? "", // If search is undefined, fallback to empty string
        filter ?? "all", // If filter is undefined, set to 'all'
      ],
      queryFn: () =>
        getPayments({
          page,
          size: 10, // Set the size per your requirement
          sort,
          search, // Pass the search
          filter, // Pass the filter
        }),
      onError: (error: AxiosError) => handleError(error),
      refetchInterval: 20000, // Adjust this interval as needed
    });
  
    useEffect(() => {
      refetch(); // Refetch when filter, page, search, or sort change
    }, [filter, page, search, sort, refetch]);
  
    return {
      isLoading,
      isError,
      payments: data,
      error,
      refetch,
    };
  }

export function getUserPayments({ userId, ...props }: IProps) { // userId is destructured here
    const { handleError } = useErrorHandler();

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getUserPayments", props.page, props.sort, props?.search, props?.filter, userId], // Include userId in queryKey
        queryFn: () =>
            getPayments({
                page: props.page,
                size: 10,
                sort: props.sort,
                search: props.search,
                userId,
                filter: props.filter,
            }),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 20000,
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort, userId]); // Include userId as a dependency

    return {
        isLoading,
        isError,
        payments: data,
        error,
        refetch,
    };
}
