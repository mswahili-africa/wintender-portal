import { ReactNode } from "react"


interface IProps {
    label: string
    value: string | number
    icon: ReactNode
}

export default function({...props}: IProps) {

    return (
        <section className="flex space-x-3 p-2 bg-white border border-slate-200 rounded-md shadow-sm">
            <div className="flex flex-col justify-center items-center w-1/3 md:w-1/4 xl:w-1/5 bg-green-600 text-white rounded-md">
                {props.icon}
            </div>

            <div className="shrink text-xs md:text-sm">
                <p className="text-base xl:text-lg font-medium mb-2">{props.value}</p>
                <p className="text-slate-500">{props.label}</p>
            </div>
        </section>
    )
}