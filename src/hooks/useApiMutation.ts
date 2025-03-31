import { authStore } from "@/store/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useApiMutation = <T, V>(mutationFn: (variables: V) => Promise<T>) => {
    return useMutation<T, any, V>({
        mutationFn,
        onSuccess: (response: any) => {
            const apiMessage = response?.data?.message;
            toast.success(apiMessage || "Request processed successfully!");
        },
        onError: (error: any) => {
            if (!error || !error.response) {
                toast.error("Unknown error occurred.");
                return;
            }

            const { status, data } = error.response;
            const apiMessage = data?.message; // API-provided message

            switch (status) {
                case 400:
                    toast.error(apiMessage || "Bad Request. Please check your input.");
                    break;
                case 401:
                    toast.error(apiMessage || "Unauthorized. Please log in.");
                    authStore.logout();
                    break;
                case 403:
                    toast.error(apiMessage || "Forbidden. You don't have permission for this action.");
                    break;
                case 404:
                    toast.error(apiMessage || "Resource not found.");
                    break;
                case 500:
                    toast.error(apiMessage || "Server error. Please try again later.");
                    break;
                default:
                    toast.error(apiMessage || "An unexpected error occurred.");
            }
        }
    });
};

export default useApiMutation;
