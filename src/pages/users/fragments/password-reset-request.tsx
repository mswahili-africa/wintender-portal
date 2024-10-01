import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Button from "@/components/button/Button";
import usePopup from "@/hooks/usePopup";
import { forgotPassword } from "@/services/auth";


interface IProps {
    email: string
}

export default function({...props}: IProps) {
    const { showConfirmation } = usePopup();

    const forgotPasswordMutation = useMutation({
        mutationFn: (email: string) => forgotPassword({"username": email}),
        onSuccess: (res) => {
            toast.success("Reset request sent successful");
        },
        onError: (error: any) => {
            toast.error("Failed to send reset request");
        }
    });

    const submitReset = () => {
        showConfirmation({ 
            theme: "danger",
            title: "Reset Password",
            message: "Password reset confirmation code will be sent to your account for password change. Agree to initiate this process.",
            onConfirm: () => forgotPasswordMutation.mutate(props.email),
            onCancel: () => {}
        })
    }

    return (
        <div className="space-y-12 divide-y divide-slate-200">
            <section>
                <h4 className="text-sm uppercase font-medium mb-8 max-w-max">
                    Request password reset
                </h4>

                <Button 
                    type="button" 
                    label="Reset Password" 
                    theme="primary"
                    size="md"
                    loading={forgotPasswordMutation.isLoading}
                    onClick={submitReset} />
            </section>
        </div>
    )
}