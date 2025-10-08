import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { getDoForMeApplication } from "@/services/tenders";

interface IProps {
    applicationGroup: any
    groupId: string
    page: number
    size?: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function({groupId,...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: [props.applicationGroup.id, props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getDoForMeApplication(groupId,{page: props.page, size: 10, sort: props.sort, search: props.search, ...props.filter}),
        onError: (error: AxiosError) => handleError(error),
        refetchInterval: 300000,
    }); 

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        applicationList: data,
        error,
        refetch
    }
} 