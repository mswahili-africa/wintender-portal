import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { isAuthenticated, tokenInfo } from "@/services/auth";
import { IUserData } from "@/types/forms";
import { authStore } from "@/store/auth";
import toast from "react-hot-toast";

interface UserDataContextType {
    userData: IUserData | null;
    loading: boolean;
    error: string | null;
}

// Define the UserDataProvider props to accept 'children' of type React.ReactNode
interface UserDataProviderProps {
    children: React.ReactNode;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
    const [userData, setUserData] = useState<IUserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Using useRef to store cache so that it doesn't trigger re-renders directly
    const userDataCache = useRef<{ data: IUserData | null; fetched: boolean }>({
        data: null,
        fetched: false,
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            setUserData(null);
            setLoading(false);
            setError("User is not logged in");
            return;
        }

        // If data is already fetched from cache, update state without making an API call
        if (userDataCache.current.fetched) {
            setUserData(userDataCache.current.data);
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const data = await tokenInfo(); // Fetch data from API

                userDataCache.current.data = data; // Store in cache
                userDataCache.current.fetched = true;
                setUserData(data); // Update state with the fetched data
            } catch (err) {

                toast.error("Unauthorized. Please log in.");

                authStore.logout();

            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, loading, error }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserDataContext = (): UserDataContextType => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserDataContext must be used within a UserDataProvider");
    }
    return context;
};
