import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import Tabs from "@/components/widgets/Tabs";
import { authStore } from "@/store/auth";
import ChangePasswordForm from "./fragments/change-password-form";
import PasswordResetRequest from "./fragments/password-reset-request";


export default function() {
    const { username } = useParams();
    const auth = useSnapshot(authStore);

    const accountOwner = (): boolean => {
        const user = auth.user;

        if(user) {
            return user?.displayName.replace(".", "") === username
        }
        return false
    }

    return (
        <div>
            <Tabs panels={["Password"]}>
                {   
                    accountOwner() ?

                    <div className="space-y-12 divide-y divide-slate-200">
                        <PasswordResetRequest email={auth.user?.email ?? ""} />

                        <div className="w-full md:w-3/4 xl:w-1/3 py-12">
                            <ChangePasswordForm email={auth.user?.email ?? ""} />
                        </div>
                    </div>:

                    <div className="text-xs">
                        Password change for another user account not applicable
                    </div>
                }
            </Tabs>
            
        </div>
    )
}