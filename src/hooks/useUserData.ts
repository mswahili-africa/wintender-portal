import { useState, useEffect } from "react";
import { isAuthenticated, tokenInfo } from "@/services/auth";
import { IUserData } from "@/types/forms";
import { useQuery } from "@tanstack/react-query";

const userDataCache: { data: IUserData | null; fetched: boolean } = {
    data: null,
    fetched: false,
};

// Hook to fetch user data
export function useUserData() {
    const [userData, setUserData] = useState<IUserData | null>(userDataCache.data);
    const [loading, setLoading] = useState<boolean>(!userDataCache.fetched);
    const [error, setError] = useState<string | null>(null);

    const {data} = useQuery({
        queryKey: ["userData"],
        queryFn: () => tokenInfo(),

        
    });
     useEffect(() => {
        if(data){
            userDataCache.data = data;
            userDataCache.fetched = true;
            setUserData(data);
            setLoading(false);
        }
    }, [data]);

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

        
    }, []);

    return { userData, loading, error };
}

// Function to clear user data on logout
export function clearUserData() {
    userDataCache.data = null;
    userDataCache.fetched = false;
}
