import { proxy } from "valtio"
import { IAuthUser, ILoginResponse } from "@/types/index"
import { TOKEN_KEY, USER_KEY } from "@/http/constants"
import { useEffect, useState } from "react"
import http from "@/http"
import { clearUserData } from "@/hooks/useUserData";

export interface AuthStore {
    accessToken: string | null
    sessionToken: string | null
    user: IAuthUser | null
    getToken: () => string | null
    getSession: () => string | null
    getUser: () => IAuthUser | null
    setCredentials: (payload: ILoginResponse) => void
    logout: () => void
}

export const authStore = proxy<AuthStore>({
    user: null,
    accessToken: null,
    sessionToken: null,

    getToken(): string | null {
        if (authStore.accessToken) {
            return authStore.accessToken
        }

        authStore.accessToken = localStorage.getItem(TOKEN_KEY);
        return authStore.accessToken
    },

    getSession(): string | null {
        if (authStore.sessionToken) {
            return authStore.sessionToken
        }
        authStore.sessionToken = localStorage.getItem(TOKEN_KEY);
        return authStore.sessionToken
    },

    getUser(): IAuthUser | null {
        const user = localStorage.getItem(USER_KEY);

        if (user !== null) {
            authStore.user = JSON.parse(user);
            return authStore.user
        }
        return null
    },

    setCredentials(payload: ILoginResponse) {
        authStore.accessToken = payload.AccessToken;
        authStore.user = payload.userInfo;
        localStorage.setItem(TOKEN_KEY, authStore.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authStore.user));
    },

    logout() {
        authStore.accessToken = null;

        localStorage.removeItem(TOKEN_KEY);
        clearUserData();

        authStore.user = null;
        localStorage.removeItem(USER_KEY);

        window.location.replace("/login");
    },

});


export function useSession() {
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const responseInterceptor = http.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    setShowModal(true);
                    setTimeout(() => {
                        authStore.logout()
                        setShowModal(false);
                    }, 3000)
                }
                return Promise.reject(error);
            }
        );
        return () => {
            http.interceptors.response.eject(responseInterceptor);
        };
    }, []);
    return {
        showModal
    }
}