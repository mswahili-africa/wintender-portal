import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { getBidders } from "@/services/user";
import useErrorHandler from "./useErrorHandler";
import { getCompanyPlans } from "@/services/entities";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getCompanyPlans", props.page, props.sort, props?.search, props?.filter],
        queryFn: () => getCompanyPlans({page: props.page, size: 10, sort: props.sort, search: props.search}),
        onError: (error: AxiosError) => handleError(error),
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort])

    return {
        isLoading,
        isError,
        companyPlans: data,
        error,
        refetch
    }
}