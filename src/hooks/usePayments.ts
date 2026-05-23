import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { getPayments, getSubscriptionBenefits, getSubscriptionPlans } from "../services/payments";

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
      refetchInterval: 120000,// 2 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 1 * 60 * 1000
    });
  
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
        staleTime: 5 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

    return {
        isLoading,
        isError,
        payments: data,
        error,
        refetch,
    };
}


// BENEFITS
export function useSubscriptionBenefits({page,sort,search,filter,size }: {page?:number,sort?:string,search?:string,filter?:Record<string,any>,size?:number}) { // userId is destructured here
    const { handleError } = useErrorHandler();

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getSubscriptionBenefits", page, sort, search], // Include userId in queryKey
        queryFn: () =>
            getSubscriptionBenefits({
                page: page ?? 0,
                size: size ?? 50,
                sort: sort,
                search: search,
                filter: filter,
            }),
        onError: (error: AxiosError) => handleError(error),
        cacheTime:60 * 60 * 1000,
        staleTime:  60 * 60 * 1000, 
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });

    return {
        isLoading,
        isError,
        subscriptionPlanBenefits: data,
        error,
        refetch,
    };
}

// SUBSCRIPTIONS
export function useSubscriptionPlans({page,sort,search,filter,size }: {page?:number,sort?:string,search?:string,filter?:Record<string,any>,size?:number}) { // userId is destructured here
    const { handleError } = useErrorHandler();

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["geTSubscriptionPlans", page, sort, search], // Include userId in queryKey
        queryFn: () =>
            getSubscriptionPlans({
                page: page ?? 0,
                size: size ?? 4,
                sort: sort,
                search: search,
                filter: filter,
            }),
        onError: (error: AxiosError) => handleError(error),
        cacheTime:60 * 60 * 1000,
        staleTime: 120 * 60 * 1000, // 2 hour
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

    return {
        isLoading,
        isError,
        subscriptionPlans: data,
        error,
        refetch,
    };
}
