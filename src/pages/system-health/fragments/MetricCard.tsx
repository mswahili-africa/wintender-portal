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
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-100">{icon}</div>
            <div>
                <small className="text-xs text-gray-500">{label}</small>
                <p className="text-md font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
}