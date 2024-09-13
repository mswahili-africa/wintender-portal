import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/images/logo.png";
import Button from "@/components/button/Button";
import { forgotPassword } from "@/services/auth";



export default function() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{username: string}>({
        defaultValues: {
            username: "",
        }
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: (data: {username: string}) => forgotPassword(data),
        onSuccess: () => {
            toast.success("Reset instruction has been sent to your email");
            reset();
        },
        onError: (error: any) => {}
    });
    
    const submit = async(input: {username: string}) => {
        mutate(input);
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="w-1/2 lg:w-1/3 2xl:w-1/4 p-10 bg-white h-auto rounded-md shadow-sm">
            
                <div className="flex flex-col justify-between items-center mb-8">
                    <Link to="/">
                        <img src={Logo} className="w-20 mb-4 hover:cursor-pointer" alt="Logo" />
                    </Link>
                    
                    <h2 className="text-base md:text-xl xl:text-2xl text-slate-700 font-semibold">
                        Forgot Password
                    </h2>
                </div>

                <div>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
                        <div>
                            <label htmlFor="username" className="block mb-2">
                                Email
                            </label>
                            <input 
                                type="text" 
                                className={`${errors.username?.type === 'required' ? 'input-error' : 'input-normal'}`}
                                {...register('username', { required: true } )} />
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