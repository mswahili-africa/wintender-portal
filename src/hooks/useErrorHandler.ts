import { AxiosError } from "axios";
import { useSnapshot } from "valtio";
import { authStore } from "../store/auth";
import usePopup from "./usePopup";


export default function () {
    const store = useSnapshot(authStore);
    const { showMessage, closePopup } = usePopup();

    const handleError = (error: AxiosError) => {

        const status = error.response?.status;
        switch (status) {
            case 401:
                showMessage({
                    title: "Unauthorized",
                    message: "You are not authorized.",
                    theme: "warning",
                });
                setTimeout(() => { closePopup(); store.logout() }, 10000)
                break;
            case 402:
            case 404:
            case 500:
                showMessage({
                    title: "Technical Issue",
                    message: "Oops! Something went wrong on our end. Please try again later.",
                    theme: "warning",
                });
                setTimeout(() => { closePopup(); }, 10000)
                break;
            case 403:
                showMessage({
                    title: "Forbidden",
                    message: "Access has been denied",
                    theme: "warning",
                });
                setTimeout(() => { closePopup(); store.logout() }, 10000)
                break;
            case 502:
            case 504:
                showMessage({
                    title: "Technical Malfunction",
                    message: "We're experiencing some technical difficulties. Please try again later.",
                    theme: "warning",
                });
                setTimeout(() => { closePopup(); }, 10000)
                break;
            case 503:
                showMessage({
                    title: "Service Unavailable",
                    message: "We're sorry, but the service is currently unavailable. Please try again later.",
                    theme: "warning",
                });
                setTimeout(() => { closePopup(); }, 10000)
                break;
            default:
                showMessage({
                    title: "Technical Malfunction",
                    message: "We're experiencing some technical difficulties. Please try again later.",
                    theme: "warning",
                });
                setTimeout(() => { closePopup(); }, 10000)
                break;
        }
    }

    return {
        handleError
    }
}