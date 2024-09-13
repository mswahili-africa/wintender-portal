import { IconLoader } from "@tabler/icons-react";
import { Fragment } from "react";


export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string
    loading?: boolean
    icon?: React.ReactElement
    size?: "sm" | "md" | "lg"
    theme?: "primary" | "secondary" | "info" | "success" | "danger" | "warning" | "error" | undefined
    variant?: "outline" | undefined
};


export default function({...props}: IButtonProps) {
    const computeSize = () => {
        switch(props.size) {
            case "sm":
                return "text-xs py-1.5 px-4"
            case "md":
                return "text-sm py-2.5 px-6"
            case "lg":
                return "text-sm py-3.5 px-6"
            default:
                return "text-xs py-1 px-2"
        }
    }

    const computeTheme = () => {
        switch(props.theme) {
            case "primary":
                return `border border-green-600 ${props.variant ? 'text-green-600 bg-white' : 'text-white bg-green-600'}`
            case "secondary":
                return `bg-green-600 border border-green-600 ${props.variant ? 'text-green-600 bg-white' : 'text-white bg-green-600'}`
            case "success":
                return `text-white bg-emerald-600 border border-emerald-600 ${props.variant ? 'text-emerald-600 bg-white' : 'text-white bg-emerald-600'}`
            case "warning":
                return `text-white bg-amber-600 border border-amber-600 ${props.variant ? 'text-amber-600 bg-white' : 'text-white bg-amber-600'}`
            case "danger":
                return `border border-red-600 ${props.variant ? 'text-red-600 bg-red-100' : 'text-white bg-red-600'}`
            default:
                return "text-slate-600 bg-slate-100 border border-slate-200 p-1.5"
        }
    }
    

    return (
        <button 
            className={`${computeTheme()} ${computeSize()} ${props.icon && 'flex justify-center items-center'} font-medium rounded-md`}
            onClick={props.onClick} 
            disabled={props.loading}>
            {
                props.loading ?
                <IconLoader size={20} className="animate-spin mx-auto" /> :
                <Fragment>
                    {props.icon}
                    <span className={`${props.icon && 'ml-3'}`}>{props.label}</span>
                </Fragment>
            }
        </button>
    )
};