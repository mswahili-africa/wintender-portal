import { useState, useEffect } from "react";
import { isAuthenticated, tokenInfo } from "@/services/auth";
import { IUserData } from "@/types/forms";
import { authStore } from "@/store/auth";
import toast from "react-hot-toast";

const userDataCache: { data: IUserData | null; fetched: boolean } = {
    data: null,
    fetched: false,
};

// Hook to fetch user data
export function useUserData() {
    const [userData, setUserData] = useState<IUserData | null>(userDataCache.data);
    const [loading, setLoading] = useState<boolean>(!userDataCache.fetched);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            setUserData(null);
            setLoading(false);
            setError("User is not logged in");
            return;
        }

        if (userDataCache.fetched) {
            setUserData(userDataCache.data);
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {

            try {

                setLoading(true);
                const data = await tokenInfo(); // Fetch data from API
                userDataCache.data = data;
                userDataCache.fetched = true;
                setUserData(data);
            } catch (err) {

                toast.error("Unauthorized. Please log in.");

                authStore.logout();

            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, loading, error };
}

// Function to clear user data on logout
export function clearUserData() {
    userDataCache.data = null;
    userDataCache.fetched = false;
}
