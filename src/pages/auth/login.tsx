import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import Logo from "@/assets/images/logo.png";
import Button from "@/components/button/Button";
import { login } from "@/services/auth";
import { authStore } from "@/store/auth";
import { ILoginForm } from "@/types/forms";


export default function() {
    const navigate = useNavigate();
    const store = useSnapshot(authStore);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ILoginForm>({
        defaultValues: {
            username: "",
            password: "",
        }
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: (data: {username: string, password: string}) => login(data),
        onSuccess: (data, variables, context) => {
            store.setCredentials(data);
            reset();
            navigate("/");
            window.location.reload()
        },
    });
    
    const signIn = async(input: {username: string, password: string})  => {
        mutate(input);
    }

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
                        <label htmlFor="username" className="block mb-2">
                            Username
                        </label>
                        <input 
                            type="text" 
                            className={`${errors.username?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('username', { required: true } )} />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            className={`${errors.password?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('password', { required: true } )} />
                    </div>
                    
                    <Button
                        type="submit"
                        label="Login"
                        theme="primary"
                        size="md"
                        loading={isLoading}
                    />

                    <Link to="/forgot" className="text-sm">
                        <span className="text-green-600 text-xs md:text-sm">
                            Forgot password
                        </span>
                    </Link>
                </form>
            </div>
    
        </div>
    </div>
    );
}
