import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { listAllSubmittedApplication } from "@/services/tenders";

interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export function useSubmittedApplication({...props}: IProps) {
    const { handleError } = useErrorHandler();
      const { isLoading, isError, data, error, refetch } = useQuery({
          queryKey: ["getVendors", props.page, props.sort, props?.search, , props?.filter],
          queryFn: () => listAllSubmittedApplication({page: props.page, size: 10, sort: props.sort, search: props.search}),
          onError: (error: AxiosError) => handleError(error),
          refetchInterval: 20000
      });
  
      useEffect(() => {
          refetch();
      }, [props.filter, props.page, props.search, props.sort])
  
      return {
          isLoading,
          isError,
          applications: data,
          error,
          refetch
      }
  }