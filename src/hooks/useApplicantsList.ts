import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { listApplication } from "@/services/tenders";

interface IProps {
    tenderId: string
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function getApplications({tenderId,...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getApplications", props.page, props.sort, props?.search, props?.filter],
        queryFn: () => listApplication(tenderId,{
            page: props.page,
            size: 10,
            sort: props.sort,
            search: props.search
        }),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 100000
    }); 

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        applicantList: data,
        error,
        refetch
    }
} 