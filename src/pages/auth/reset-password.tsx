import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { IConfirmPasswordResetForm } from "@/types/forms";
import { object, ref, string } from "yup";
import { useState } from "react";
import { IconBrandWhatsapp, IconEye, IconEyeOff, IconMail, IconPhoneCall } from "@tabler/icons-react"; // Import Tabler Icons
import Logo from "@/assets/images/logo.png";
import Button from "@/components/button/Button";
import { confirmResetPassword } from "@/services/auth";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";

interface IResetPassword {
    email: string
    confirmationCode: string
    password: string
    passwordConfirmation: string
}

const schema = object().shape({
    email: string().email().required(),
    confirmationCode: string().required("Confirmation code is required"),
    password: string().min(6).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/, "Please follow password creation guidelines").required("Password is required"),
    passwordConfirmation: string().required("Please repeat your password")
        .oneOf([ref("password")], "Passwords must match"),
})


export default function () {
    const store = useSnapshot(authStore);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For repeat password

    const { register, handleSubmit, formState: { errors } } = useForm<IResetPassword>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
            confirmationCode: ""
        }
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: (data: IConfirmPasswordResetForm) => confirmResetPassword(data),
        onSuccess: (res) => {
            toast.success("Password reset successful");
            store.logout();
            navigate("/login");
        },
        onError: (error: any) => {
            toast.error("Failed to send reset request");
        }
    });

    const submit = async (input: IResetPassword) => {
        mutate({
            "email": input.email,
            "password": input.password,
            "confirmPassword": input.passwordConfirmation,
            "confirmationCode": input.confirmationCode
        });
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 relative">
            <div className="text-xs h-fit absolute bottom-2  sm:top-2 flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row justify-end w-full mb-2">
                <a href="tel:0747098558" target="_blank">
                    <div className={`flex items-center px-4 flex-row rounded-md hover:bg-slate-100`}>
                        <div className="pr-3"><IconPhoneCall size={22} className="text-green-600" stroke={2} /></div>
                        <span>+255 747 098 558</span>
                    </div>
                </a>
                <a href="https://wa.me/+255766028558" target="_blank">
                    <div className={`flex items-center px-4 flex-row rounded-md hover:bg-slate-100`}>
                        <div className="pr-3"><IconBrandWhatsapp size={22} className="text-green-600" stroke={2} /></div>
                        <span>WhatsApp</span>
                    </div>
                </a>
                <a target="_blank"
                    href="mailto:info@wintender.co.tz"
                    className="flex items-center px-4 flex-row rounded-md hover:bg-slate-100"
                >
                    <IconMail size={22} className="text-green-600 mr-3" stroke={2} />
                    <span>info@wintender.co.tz</span>
                </a>
            </div>
            <div className="w-1/2 lg:w-1/3 2xl:w-1/4 p-10 bg-white h-auto rounded-md shadow-sm">

                <div className="flex flex-col justify-between items-center mb-8">
                    <Link to="/">
                        <img src={Logo} className="w-20 mb-4 hover:cursor-pointer" alt="Logo" />
                    </Link>

                    <h2 className="text-base md:text-xl xl:text-2xl text-slate-700 font-semibold">
                        Reset Password
                    </h2>
                </div>

                <div>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                        <p className="py-3 px-4 border-l-2 border-slate-200 bg-slate-100 text-xs rounded-md">
                            Password should be at least 6 characters long and should include uppercase,
                            lowercase letters, numbers, and at least one special character.
                        </p>

                        <div>
                            <label htmlFor="email" className="block mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete="off"
                                className={`${errors.email?.message ? 'input-error' : 'input-normal'}`}
                                {...register("email")} />

                            <p className="text-xs text-red-600">{errors.email?.message}</p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    autoComplete="off"
                                    type={showPassword ? "text" : "password"} // Toggle between text and password
                                    className={`${errors.password?.message ? 'input-error' : 'input-normal'}`}
                                    {...register("password")} />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                >
                                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />} {/* Tabler Icons */}
                                </span>
                            </div>
                            <p className="text-xs text-red-600">{errors.password?.message}</p>
                        </div>

                        <div>
                            <label htmlFor="passwordConfirmation" className="block mb-2">
                                Repeat Password
                            </label>
                            <div className="relative">
                                <input
                                    autoComplete="off"
                                    type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                                    className={`${errors.passwordConfirmation?.message ? 'input-error' : 'input-normal'}`}
                                    {...register("passwordConfirmation")} />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle password visibility
                                >
                                    {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />} {/* Tabler Icons */}
                                </span>
                            </div>
                            <p className="text-xs text-red-600">{errors.passwordConfirmation?.message}</p>
                        </div>

                        <div>
                            <label htmlFor="confirmationCode" className="block mb-2">
                                Confirmation Code
                            </label>
                            <input
                                autoComplete="off"
                                type="text"
                                className={`${errors.confirmationCode?.message ? 'input-error' : 'input-normal'}`}
                                {...register("confirmationCode")} />
                        </div>

                        <Button
                            type="submit"
                            label="Submit"
                            theme="primary"
                            size="md"
                            loading={isLoading}
                        />

                    </form>
                </div>

            </div>
        </div>
    )
}
