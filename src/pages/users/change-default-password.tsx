import { authStore } from "@/store/auth";
import { useSnapshot } from "valtio";
import ChangePasswordForm from "./fragments/changePasswordForm";
import AuthLayout from "@/layouts/auth_layout";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { forgotPassword } from "@/services/auth";


export default function() {
    const [hasCode, setHasCode] = useState<boolean>(false);
    const auth = useSnapshot(authStore);

    const { mutate } = useMutation({
        mutationFn: (email: string) => forgotPassword({"username": email}),
        onSuccess: (res) => {
            toast.success("Reset token has been sent");
            setHasCode(true);
        }
    });

    useEffect(() => {
        if(!hasCode) mutate(auth.getUser()?.email ?? "");
    }, [])

    return (
        <AuthLayout>
            <div className="min-h-screen w-screen flex flex-col justify-center items-center">
                <div className="w-full md:w-3/4 xl:w-1/3 py-12 px-10 border border-slate-200 rounded-md">
                    {
                        auth.user &&
                        <ChangePasswordForm 
                            title="Change default password" 
                            email={auth.user.email}
                        />
                    }
                </div>
            </div>
        </AuthLayout>
    )
}