import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const schema = object().shape({
    username: string().required("Username is required"),
    password: string().required("Password is required")
});
const tenderApplicationCreationForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "",
            password: ""
        }
    });
    const onSubmit = (data: any) => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("password", data.password);

        // tenderApplicationCreationFormMutation.mutate(formData);
    }

    // const tenderApplicationCreationFormMutation = useMutation({
    //     mutationFn: (data: FormData) => createTenderApplicationForm(data)
    // });

    return (
        <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input {...register("username", { required: true, pattern: /^[A-Za-z]+$/ })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                    {errors.username && <p className="text-red-500 text-xs italic">{errors?.username?.message?.toString()}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input {...register("password", { required: true, pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ })} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors?.password?.message?.toString()}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Sign In
                    </button>
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                    </a>
                </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
                &copy;2020 Acme Corp. All rights reserved.
            </p>
        </div>
    )
}


export default tenderApplicationCreationForm
