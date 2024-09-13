import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { TOKEN_KEY } from "./constants";
import toast from "react-hot-toast";


const createAxiosInstance = (config: AxiosRequestConfig = {}): AxiosInstance => {

    const defaultConfig: Record<string, any> = {
        ...config,
        "headers": {
            "Accept": "application/json",
        },
    }

    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        ...defaultConfig,
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(TOKEN_KEY);
            console.log("token",token);
            if(token !== null) {
                config.headers["Authorization"] = `Bearer ${token}`
            }
            
          return config;
        },
        (error) => {
          // Handle request error
          return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (config) => {
            const token = localStorage.getItem(TOKEN_KEY);
            console.log("token",token);
            if(token !== null) {
                config.headers["Authorization"] = `Bearer ${token}`
            }
            
          return config;
        },
        (error) => {
          // Handle request error
          // Check if the error is an object with a response
          if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.message || error.response.data?.error ;
        
            // Handle different HTTP status codes
            if (status === 401 || status === 403) {
              toast.error(errorMessage)
            //   SignOut();
              return;
            }
            if (status === 404 || status === 400) {
                toast.error(errorMessage)
 
            } else {
                toast.error(errorMessage)
          }
        
          return Promise.reject(error);
        }
        }
    );

    return instance;
};

const http = createAxiosInstance();

export default http;