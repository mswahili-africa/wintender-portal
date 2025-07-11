import { IconEye } from "@tabler/icons-react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";


interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    hasError?: boolean
    error?: string,
    register: UseFormRegisterReturn;
    prefix?: string
    min?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function ({ ...props }: IProps) {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className={props.className}>
            {
                props.label &&

                <label
                    htmlFor={props.name}
                    className="block mb-2">
                    {props.label}
                </label>
            }

            <div className="relative">
                <input
                    type={props.type}
                    className={twMerge(
                        `${props.hasError ? 'input-error' : 'input-normal'}`,
                        props.prefix ? 'pl-12' : ''
                    )}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                    {...props.register}
                    min={props.min}
                    onChange={props.onChange}
                />

                {
                    props.prefix &&
                    <div className="absolute inset-y-0 left-0 px-3 flex justify-center items-center cursor-pointer">
                        <div className="text-sm text-slate-400 font-light uppercase">
                            {props.prefix}
                        </div>
                    </div>
                }

                {
                    props.type == "password" &&
                    <IconEye
                        className="absolute top-3 right-3 z-10 h-5 w-5 text-slate-400 cursor-pointer"
                        onClick={() => setShow(!show)} />
                }

                {
                    props.hasError &&
                    <div className="text-xs text-red-800 font-medium px-1 pt-1">
                        {
                            props.error ?
                                props.error :
                                "field is required"
                        }
                    </div>
                }
            </div>

        </div>
    )
}