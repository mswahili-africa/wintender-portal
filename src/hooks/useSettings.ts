import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useErrorHandler from "./useErrorHandler";
import { getSettings } from "@/services/settings";


export default function() {
    const { handleError } = useErrorHandler();
    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey: ["getSettings"],
        queryFn: () => getSettings(),
        onError: (error: AxiosError) => handleError(error)
    });
 
    return {
        isLoading,
        isError,
        settings: data,
        error,
        refetch
    }
}