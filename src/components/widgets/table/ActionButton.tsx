import { IconLoader } from "@tabler/icons-react"
import { twMerge } from "tailwind-merge"

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    loading?: boolean
    tooltip?: string
}

export default function({...props}: IProps) {

    return (
        <button
            type="button"
            className={twMerge(
                "relative flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600 focus:outline-none cursor-pointer",
                "p-1 border border-slate-200 hover:border-green-600 rounded-md",
                props.className
            )}
            onClick={props.onClick}>
            {
                props.loading ?
                <IconLoader size={20} className="animate-spin mx-auto" /> :

                props.children
            }
            {
                props.tooltip &&
                <div className="absolute text-[10px]">
                    {props.tooltip}
                </div>
            }
        </button>
    )
}