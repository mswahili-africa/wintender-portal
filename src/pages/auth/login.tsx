import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { useState } from "react";
import { IconBrandWhatsapp, IconEye, IconEyeOff, IconMail, IconPhoneCall } from "@tabler/icons-react";
import Logo from "@/assets/images/logo.png";
import Button from "@/components/button/Button";
import RegistrationModel from "./registrationModel";
import { login } from "@/services/auth";
import { authStore } from "@/store/auth";
import { ILoginForm } from "@/types/forms";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const store = useSnapshot(authStore);
    const [create, setCreate] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ILoginForm>({
        defaultValues: {
            username: "",
            password: "",
        }
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: (data: { username: string, password: string }) => login(data),
        onSuccess: (data) => {
            store.setCredentials(data);
            reset();
            navigate("/");
            window.location.reload();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "");
        }
    });

    const signIn = async (input: { username: string, password: string }) => {
        mutate(input);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 relative">
            <div className="text-xs h-fit absolute bottom-2  sm:top-2 flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row justify-end w-full mb-2">
                <a href="tel:0747098558" target="_blank">
                    <div className={`flex items-center px-4 flex-row rounded-md hover:bg-slate-100`}>
                        <div className="pr-3"><IconPhoneCall size={22} className="text-green-600" stroke={2} /></div>
                        <span>+255 747 098 558</span>
                    </div>
                </a>
                <a href="https://wa.me/+255736228228" target="_blank">
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
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-md shadow-sm">
                <div className="flex flex-col items-center mb-6">
                    <Link to="/">
                        <img src={Logo} className="w-16 sm:w-20 mb-4 hover:cursor-pointer" alt="Logo" />
                    </Link>
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-700">Login</h2>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit(signIn)}>
                    <div>
                        <label htmlFor="username" className="block mb-1 text-sm text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-300'
                                }`}
                            {...register('username', { required: true })}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-300'
                                    }`}
                                {...register('password', { required: true })}
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        label="Login"
                        theme="primary"
                        size="md"
                        loading={isLoading}
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs sm:text-sm">
                        <Link to="/forgot" className="text-green-600 mb-2 sm:mb-0">Forgot password?</Link>
                        <span
                            className="text-blue-600 cursor-pointer"
                            onClick={() => setCreate(true)}
                        >
                            Register
                        </span>
                    </div>
                </form>
            </div>

            {/* Registration Modal */}
            <RegistrationModel
                onSuccess={() => setCreate(false)}
                initials={null}
                isOpen={create}
                onClose={() => setCreate(false)}
            />
        </div>
    );
}
