import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react"; // Importing Tabler Icons
import Logo from "@/assets/images/logo.png";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import RegistrationModel from "./registrationModel";
import { login } from "@/services/auth";
import { authStore } from "@/store/auth";
import { ILoginForm } from "@/types/forms";

export default function Login() {
    const navigate = useNavigate();
    const store = useSnapshot(authStore);
    const [create, setCreate] = useState(false); // State to control modal visibility
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ILoginForm>({
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
    });

    const signIn = async (input: { username: string, password: string }) => {
        mutate(input);
    };

    return ( 
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="w-1/2 lg:w-1/3 2xl:w-1/4 p-10 bg-white h-auto rounded-md shadow-sm">
                <div className="flex flex-col justify-between items-center mb-8">
                    <Link to="/">
                        <img src={Logo} className="w-20 mb-4 hover:cursor-pointer" alt="Logo" />
                    </Link>
                    <h2 className="text-base md:text-xl xl:text-2xl text-slate-700 font-semibold">Login</h2>
                </div>
                <div>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(signIn)}>
                        <div>
                            <label htmlFor="username" className="block mb-2">Username</label>
                            <input
                                type="text"
                                className={`${errors.username ? 'input-error' : 'input-normal'}`}
                                {...register('username', { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}  // Toggle between text and password
                                    className={`${errors.password ? 'input-error' : 'input-normal'}`}
                                    {...register('password', { required: true })} />
                                <span 
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                >
                                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />} {/* Tabler Icons */}
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
                        <div className="flex justify-between mt-4">
                            <Link to="/forgot" className="text-sm">
                                <span className="text-green-600 text-xs md:text-sm">Forgot password?</span>
                            </Link>
                            <span
                                className="text-blue-600 text-xs md:text-sm cursor-pointer"
                                onClick={() => setCreate(true)}
                            >
                                Register
                            </span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Registration Modal */}
                <RegistrationModel 
                    onSuccess={() => {
                    setCreate(false);
                    // Optionally handle success, e.g., redirect or show a message
                    }} 
                    initials={null} // or pass any necessary initial values
                    isOpen={create}
                    onClose={() => setCreate(false)} // Pass the function to close the modal
                />

        </div>
    );
}
