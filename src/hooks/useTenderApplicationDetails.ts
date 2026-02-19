import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import useErrorHandler from "./useErrorHandler";
import { getTenderApplicationDetails, getTendersGovernment } from "@/services/tenders";


interface IProps {
    id:string
}

export default function({...props}: IProps) {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getTenderApplicationDetails", props.id],
        queryFn: () => getTenderApplicationDetails(props.id),
        enabled: !!props.id,
        onError: (error: AxiosError) => handleError(error),
    });

    useEffect(() => {
        refetch();
    }, [props.id]);

    return {
        isLoading,
        isError,
        applicationDetails: data,
        error,
        refetch
    }
}