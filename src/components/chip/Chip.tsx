import { IconX } from "@tabler/icons-react";
import React, { Fragment } from "react";

type ChipProps = {
    theme?: "primary" | "secondary" | "success" | "warning" | "danger" | "pending" | "approved";
    variant?: "outline" | "lighter"
    size?: string;
    label: string;
    avatar?: string | JSX.Element;
    isDeletable?: boolean
    onClick?: () => void;
    onDelete?: () => void;
};

const Chip: React.FC<ChipProps> = ({
    theme,
    variant,
    size,
    label,
    avatar,
    isDeletable,
    onClick,
    onDelete,
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
    };

    const renderAvatar = () => {
        if (avatar && typeof avatar === "string") {
            return <img src={avatar} alt="Avatar" className="w-6 h-6 rounded-full" />;
        }

        return avatar;
    };

    const computeTheme = () => {
        switch (theme) {
            case "primary":
                return "green-600";
            case "secondary":
                return "slate-600";
            case "success":
                return "green-600";
            case "warning":
                return "amber-600";
            case "danger":
                return "red-600";
            case "approved":
                    return "blue-600";
            default:
                return "slate-200";
        }
    }

    const computeVariant = () => {
        let _theme = computeTheme();
        
        if(_theme) {
            switch (variant) {
                case "outline":
                    return `text-${_theme} border border-${_theme} bg-white`
                case "lighter":
                    return `text-${_theme} border border-${_theme} bg-${_theme} bg-opacity-10`
                default:
                    return `text-white border border-${_theme} bg-${_theme}`
            }
        }
        return null
    };

    const computeSize = () => {
        switch (size) {
            case "sm":
                return "text-xs";
            case "lg":
                return "text-base";
            default:
                return "text-xs";
        }
    };

    return (
        <Fragment>
            { 
                computeVariant() &&
                <div
                    className={`max-w-max flex justify-center items-center px-3 py-1 rounded-lg font-medium uppercase ${computeVariant()} ${computeSize()}`}
                    onClick={handleClick}
                >
                    {avatar && <div className="mr-2">{renderAvatar()}</div>}
                    <span>{label}</span>
                    {
                        isDeletable &&
                        <button onClick={handleDelete} className="ml-2 p-px rounded-full focus:outline-none">
                            <IconX className="h-3 w-3"/>
                        </button>
                    }
                </div>
            }
        </Fragment>
    );
};

export default Chip;
