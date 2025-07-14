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
      // if (error.response) {
      //   const status = error.response.request.status;
      //   const errorMessage = error.response.data?.message || error.response.data?.error;

      //     // Handle different HTTP status codes
      //   if ([401].includes(status)) {
      //     toast.error("Unauthorized. You are not authorized, Please login again");

      //     // Delay the logout action
      //     setTimeout(() => {
      //       // Clear user session and redirect after a delay
      //       authStore.logout(); // Assuming authStore has a logout method
      //     }, 5000); 

      //     return;

      //   } else if ([403].includes(status)) {
      //     toast.error("Forbidden. Access has been denied");
      //   } else {
      //     toast.error("An unexpected error occurred.");
      //   }

      // }



      // JCM Error handling
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error;

        // Handling different specific status codes
        if (status === 401) {
          toast.error("Unauthorized. Please login again.");

          setTimeout(() => {
            authStore.logout(); // Assuming authStore has a logout method
          }, 5000);

        } else if (status === 403) {
          toast.error("Forbidden. Access has been denied.");
        } else if (status === 404) {
          toast.error("Resource not found.");
        } else if (status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(errorMessage || "Something went wrong.");
        }
      } else if (error.request) {
        toast.error("No response from the source. Check your network.");
      } else {
        toast.error("An unexpected error occurred.");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const http = createAxiosInstance();

export default http;
