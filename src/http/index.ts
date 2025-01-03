import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { TOKEN_KEY } from "./constants";
import toast from "react-hot-toast";
import { authStore } from "../store/auth";

const createAxiosInstance = (config: AxiosRequestConfig = {}): AxiosInstance => {
  const defaultConfig: Record<string, any> = {
    ...config,
    headers: {
      Accept: "application/json",
    },
  };

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    ...defaultConfig,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token !== null) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const status = error.response.request.status;
        const errorMessage = error.response.data?.message || error.response.data?.error;

        // Handle different HTTP status codes
        if ([401].includes(status)) {
          toast.error("Your session has expired. Please log in again.!");
          
          // Clear user session and redirect
          authStore.logout(); // Assuming authStore has a logout method
          return;
        } else if ([400, 404].includes(status)) {
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occurred.");
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const http = createAxiosInstance();

export default http;
