import { useQuery } from "@tanstack/react-query";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { getDoForMeApplication } from "@/services/tenders";

interface IProps {
    applicationGroup: any
    groupId: string
    page: number
    size?: number
    search?: string
    searchColumn?: string
    paymentReason?: string
    sort?: string
    filter?: Record<string, any>
    visibility?: string
    status?: string
}

export default function({groupId,...props}: IProps,options?: { enabled?: boolean }) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getDIFMApplications",props.applicationGroup?.id, props.page,props.status, props.sort, props?.search, props?.filter,props?.visibility,props?.paymentReason, props?.searchColumn],
        queryFn: () => getDoForMeApplication(groupId ,{page: props.page, size: 10, sort: props.sort,visibility:props.visibility, search: props.search, status: props.status, paymentReason: props.paymentReason, searchColumn: props.searchColumn, ...props.filter}),
        onError: (error: AxiosError) => handleError(error),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: options && options?.enabled ? true : props.search !== undefined  ? props.search.length >= 3 : true
    });

    return {
        isLoading,
        isError,
        applicationList: data,
        error,
        refetch
    }
} 