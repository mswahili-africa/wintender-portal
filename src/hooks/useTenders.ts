import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getTenders } from "@/services/tenders";


interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
    eligibility?:boolean
    categories?: string[]
    bidderId?: string
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTendersGovernment", props.page, props.sort, props?.search, props?.filter,props?.eligibility,props?.categories,props?.bidderId],
        queryFn: () => getTenders({page: props.page, size: 30, sort: props.sort, search: props.search,eligibility:props.eligibility,categories:props.categories,bidderId:props.bidderId}),
        onError: (error: AxiosError) => handleError(error),
    });

    useEffect(() => {
        refetch();
    }, [props.filter, props.page, props.search, props.sort, props.eligibility, props.categories, props.bidderId]);

    return {
        isLoading,
        isError,
        getTenders: data,
        error,
        refetch
    }
}