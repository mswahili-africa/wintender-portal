import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { AxiosError } from "axios";
import { getDocuments } from "@/services/entities";

interface IProps {
    page: number
    search?: string
    sort?: string
    filter?: Record<string, any>
    account: string
}

export default function({ account, ...props }: IProps) {
    const { handleError } = useErrorHandler();

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getCompanyDocument", props.page, props.sort, props?.search, props?.filter, account],
        queryFn: () => getDocuments(account,{ page: props.page, size: 10, sort: props.sort, search: props.search }),
        onError: (error: AxiosError) => handleError(error),
        enabled: !!account, 
        refetchInterval: 20000,
    });

    useEffect(() => {
        if (account) {
            refetch();
        }
    }, [account, props.filter, props.page, props.search, props.sort]);

    return {
        isLoading,
        isError,
        documents: data,
        error,
        refetch,
    };
}
