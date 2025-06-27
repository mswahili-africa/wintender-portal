import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IConfirmPasswordResetForm } from "@/types/forms";
import { object, ref, string } from "yup";
import Button from "@/components/button/Button";
import { confirmResetPassword, confirmUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";
import { useState } from "react";
import { IconEye, IconEyeX } from "@tabler/icons-react";

interface IProps {
    email: string,
    title?: string
}

const schema = object().shape({
    confirmationCode: string().required("Confirmation code is required"),
    password: string().min(6).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/, "Please follow password creation guidelines").required("Password is required"),
    passwordConfirmation: string().required("Please repeat your password")
    .oneOf([ref("password")], "Passwords must match"),
});

interface TextInputProps {
    type: string;
    label: string;
    hasError: boolean;
    error?: string;
    register: any;
}

function TextInput({ type, label, hasError, error, register }: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    className={`border ${hasError ? "border-red-500" : "border-gray-300"} rounded-md w-full p-2 pr-10`} // Adjusted padding for icon
                    {...register}
                />
                {type === "password" && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? (
                            <IconEyeX className="h-5 w-5 text-gray-500" />
                        ) : (
                            <IconEye className="h-5 w-5 text-gray-500" />
                        )}
                    </button>
                )}
            </div>
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
}

export default function ConfirmPasswordResetForm({ email, title }: IProps) { 
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
            "email": email,
            "password" : data.password,
            "confirmPassword": data.passwordConfirmation,
            "confirmationCode" : data.confirmationCode
        }
        confirmResetMutation.mutate(_data);
    }

    return (
        <section>
            <h4 className="text-sm uppercase font-medium mb-8 max-w-max">
                { title ? title : "Confirm Password Reset" }
            </h4>

            <form className="space-y-4" onSubmit={handleSubmit(submitCode)}>
                <p className="py-3 px-4 border-l-2 border-slate-200 bg-slate-100 text-sm rounded-md">
                    Password should be at least 6 characters long and should include uppercase, lowercase letters, numbers, and at least one special character.
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
                    loading={confirmResetMutation.isLoading} 
                />
            </form>
        </section>
    )
}
