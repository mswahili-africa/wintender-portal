export const MetricCard = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => {
    return (
        <div className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row items-center gap-x-4 gap-y-2">
            <div className="p-3 rounded-lg bg-gray-100">{icon}</div>
            <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
}