import { ReactNode } from "react"

interface IProps {
    icon: ReactNode
    label: string
    value: ReactNode
}

export default function({...props}: IProps) {

    return (
        <div className="flex items-start">
            <div className="mim-w-max mr-3 bg-green-100 text-green-600 p-2 rounded-lg">
                {props.icon}
            </div>

            <div className="grow">
                <h4 className="text-xs md:text-sm text-slate-400 mb-0.5">{props.label}</h4>
                <h2 className="text-sm font-medium">{props.value}</h2>
            </div>
        </div>
    )
}