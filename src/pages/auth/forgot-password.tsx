import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/assets/images/logo.png";
import Button from "@/components/button/Button";
import { forgotPassword } from "@/services/auth";
import { IconPhoneCall, IconBrandWhatsapp, IconMail } from "@tabler/icons-react";



export default function () {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ username: string }>({
        defaultValues: {
            username: "",
        }
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: (data: { username: string }) => forgotPassword(data),
        onSuccess: () => {
            toast.success("Reset instruction has been sent to your email");
            navigate("/reset-password", { replace: false });
        },
        onError: (error: any) => { }
    });

    const submit = async (input: { username: string }) => {
        mutate(input);
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
                                {...register('username', { required: true })} />
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
                <div className="flex justify-between mt-4">
                    <Link to="/login" className="text-sm">
                        <span className="text-green-600 text-xs md:text-sm">Login</span>
                    </Link>
                </div>

            </div>
        </div>
    )
}