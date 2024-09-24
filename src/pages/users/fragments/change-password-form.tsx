import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IConfirmPasswordResetForm } from "@/types/forms";
import { number, object, ref, string } from "yup";
import Button from "@/components/button/Button";
import {confirmResetPassword, confirmUser } from "@/services/auth";
import TextInput from "@/components/widgets/forms/TextInput";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";

interface IProps {
    email: string,
    title?: string
}


const schema = object().shape({
    confirmationCode: string().required("Confirmation code is required"),
    password: string().min(6).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/, "please follow password creation guidelines").required("password is required"),
    passwordConfirmation: string().required("Please repeat your password")
    .oneOf([ref("password")], "Passwords must match"),
})

export default function({...props}: IProps) {
    const store = useSnapshot(authStore);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<{
        confirmationCode: string, password: string, passwordConfirmation: string
    }>({
        resolver: yupResolver(schema),
    });

    const confirmResetMutation = useMutation({
        mutationFn: (data: IConfirmPasswordResetForm) => confirmResetPassword(data),
        onSuccess: async (res) => {
            try {
                await confirmUserMutation.mutateAsync(store.user?.id ?? '');
                toast.success("Password reset successful");
                store.logout();
                navigate("/login");
            } catch (error) {
                toast.error("Failed to confirm user");
            }
        },
        onError: (error: any) => {
            toast.error("Failed to send reset request");
        }
    });
    
    const confirmUserMutation = useMutation({
        mutationFn: (userId: string) => confirmUser(userId),
        onError: (error: any) => {
            toast.error("Failed to confirm user");
        }
    });

    const submitCode = (data: any) => {
        let _data = {
            "email": props.email,
            "password" : data.password,
            "confirmPassword": data.password,
            "confirmationCode" : data.confirmationCode
        }


        confirmResetMutation.mutate(_data);
    }

    return (
        <section>
            <h4 className="text-sm uppercase font-medium mb-8 max-w-max">
                { props.title ? props.title : "Confirm Password Reset" }
            </h4>

            <form className="space-y-4" onSubmit={handleSubmit(submitCode)}>
                <p className="py-3 px-4 border-l-2 border-slate-200 bg-slate-100 text-sm rounded-md">
                    Password should be atleast 6 characters long and should include uppercase, lowercase letters, numbers and atleast one special character
                </p>

                <TextInput 
                    type="password" 
                    label="New Password"
                    hasError={errors.password?.type !== undefined}
                    error={errors.password?.message}
                    register={register("password", {required: true})}
                />

                <TextInput 
                    type="password" 
                    label="Repeat Password"
                    hasError={errors.passwordConfirmation?.type !== undefined}
                    error={errors.passwordConfirmation?.message}
                    register={register("passwordConfirmation", {required: true})}
                />
                
                <TextInput 
                    type="text" 
                    label="Confirmation Code"
                    hasError={errors.confirmationCode?.type !== undefined}
                    error={errors.confirmationCode?.message}
                    register={register("confirmationCode", {required: true})}
                />

                <Button 
                    type="submit"
                    label="Submit Code" 
                    theme="primary"
                    size="md" 
                    loading={confirmResetMutation.isLoading} />
            </form>
        </section>
    )
}