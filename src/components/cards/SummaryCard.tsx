export interface ISummaryCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    borderColor?: string;
    iconBgColor?: string;
    iconTextColor?: string;
}

export default function SummaryCard({
    label,
    value,
    icon,
    borderColor = "border-gray-100",
    iconBgColor = "bg-gray-100",
    iconTextColor = "text-gray-600",
}: ISummaryCardProps) {
    return (
        <div className={`bg-white border ${borderColor} rounded-xl p-1.5 shadow-sm hover:shadow-md transition duration-200`}>
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${iconBgColor} ${iconTextColor} flex items-center justify-center shrink-0`}>
                    {icon}
                </div>
                <div className="min-w-0 truncate">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide truncate">
                        {label}
                    </p>
                    <p className="text-md font-bold text-gray-800 leading-tight">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}