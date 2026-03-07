import { IconLoader } from "@tabler/icons-react";
import { Fragment } from "react";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    loading?: boolean;
    icon?: React.ReactElement;
    size?: "sm" | "md" | "lg";
    theme?: "primary" | "secondary" | "info" | "success" | "danger" | "warning" | "default";
    variant?: "filled" | "outline" | "pastel";
    iconPosition?: "left" | "right";
}

export default function Button({
    type = "button",
    disabled = false,
    ...props
}: IButtonProps) {
    const themes = {
        primary: {
            filled: "bg-green-600 text-white border border-green-600 hover:bg-green-700",
            outline: "text-green-600 border border-green-600 hover:bg-green-600 hover:text-white",
            pastel: "text-green-700 bg-green-100 hover:bg-green-200"
        },

        secondary: {
            filled: "bg-zinc-800 text-white border border-zinc-800 hover:bg-zinc-900",
            outline: "text-zinc-800 border border-zinc-800 hover:bg-zinc-800 hover:text-white",
            pastel: "text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
        },

        info: {
            filled: "bg-cyan-600 text-white border border-cyan-600 hover:bg-cyan-700",
            outline: "text-cyan-600 border border-cyan-600 hover:bg-cyan-600 hover:text-white",
            pastel: "text-blue-700 bg-blue-100 hover:bg-blue-200 font-bold"
        },

        success: {
            filled: "bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700",
            outline: "text-emerald-600 border border-emerald-600 hover:bg-emerald-600 hover:text-white",
            pastel: "text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
        },

        warning: {
            filled: "bg-amber-600 text-white border border-amber-600 hover:bg-amber-700",
            outline: "text-amber-600 border border-amber-600 hover:bg-amber-600 hover:text-white",
            pastel: "text-amber-700 bg-amber-100 hover:bg-amber-200"
        },

        danger: {
            filled: "bg-red-600 text-white border border-red-600 hover:bg-red-700",
            outline: "text-red-600 border border-red-600 hover:bg-red-600 hover:text-white",
            pastel: "text-red-700 bg-red-100 hover:bg-red-200"
        },

        default: {
            filled: "bg-gray-800 text-white border border-gray-800 hover:bg-gray-900",
            outline: "text-gray-800 border border-gray-800 hover:bg-gray-800 hover:text-white",
            pastel: "text-gray-700 bg-gray-100 hover:bg-gray-200"
        }
    };

    const variant = props.variant ?? "filled";
    const theme = props.theme ?? "default";
    const position = props.iconPosition ?? "left";

    
    const style = themes[theme][variant];

    const computeSize = () => {
        switch (props.size) {
            case "sm":
                return "text-xs py-1.5 px-4";
            case "md":
                return "text-sm py-2.5 px-6";
            case "lg":
                return "text-sm py-3.5 px-6";
            default:
                return "text-xs py-2 px-4";
        }
    };

    return (
        <button
            type={type}
            className={`
        ${computeSize()}
        ${style}
        ${props.icon && "flex items-center justify-center"}
        font-medium
        rounded-md
        transition-colors
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
            onClick={props.onClick}
            disabled={disabled || props.loading}
        >
            {props.loading ? (
                <IconLoader size={20} className="animate-spin mx-auto" />
            ) : (
                <Fragment>
                    {position === "left" && props.icon}
                    <span className={`${props.icon && "ml-2"}`}>{props.label}</span>
                    {position === "right" && props.icon}
                </Fragment>
            )}
        </button>
    );
}