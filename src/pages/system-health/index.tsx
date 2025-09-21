import {
    IconCpu,
    IconDatabase,
    IconCloud,
    IconRefresh,
    IconDeviceFloppy,
    IconDeviceSdCard,
} from "@tabler/icons-react";
import { MetricCard } from "./fragments/MetricCard";
import { StatusIconFlag } from "./fragments/StatusIconFlag";
import { useSystemHealth } from "@/hooks/useSystemDetails";
import Button from "@/components/button/Button";

export default function SystemHealth() {
    const { healthData, isLoading, refetch } = useSystemHealth();

    const mongo = healthData?.health?.components?.mongo?.status;
    const memory = healthData?.memory?.measurements[0]?.value || 0;
    const server = healthData?.health?.status;
    const diskStorage = healthData?.health?.components?.diskSpace;
    const cpu = healthData?.cpu?.measurements[0]?.value || 0;
    const uptime = healthData?.uptime?.measurements[0]?.value || 0;
    const isServerUp = server === "UP";


    return (
        <div className="container py-10 space-y-10">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">System Health</h3>

                <Button
                    type="button"
                    label="Refresh"
                    size="md"
                    theme="primary"
                    loading={isLoading}
                    onClick={() => refetch()}
                    icon={<IconRefresh size={18} />}
                />
            </div>

            {
                isLoading &&
                <>
                    {/* 🔄 Server Status Loading */}
                    <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div>
                            <div className="h-5 bg-gray-200 rounded w-40 mb-2" />
                            <div className="h-4 bg-gray-100 rounded w-60" />
                        </div>
                    </div>

                    {/* 🔄 Key Metrics Loading */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white shadow rounded-xl p-4 animate-pulse">
                                <div className="w-8 h-8 bg-gray-200 rounded mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                                <div className="h-5 bg-gray-100 rounded w-24" />
                            </div>
                        ))}
                    </div>

                    {/* 🔄 Recent Checks Loading */}
                    <div className="mt-8">
                        <h4 className="text-lg font-semibold mb-4">Recent Checks</h4>
                        <ul className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <li key={i} className="flex items-center justify-between bg-white shadow p-3 rounded-lg animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                    <div className="h-6 bg-gray-100 rounded w-16" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </>

            }

            {   !isLoading &&
                <>
                    {/* Server status Card */}
                    <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
                        <StatusIconFlag status={isServerUp ? "up" : "down"} />
                        <div>
                            <h4 className="text-lg font-semibold">
                                {isServerUp ? "Server is Running" : "Server is Down"}
                            </h4>
                            <p className="text-gray-500 text-sm">
                                Last checked just now. Click refresh to update.
                            </p>
                        </div>
                    </div>

                    {/* 🔹 Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            icon={<IconCpu className={`${cpu > 80 ? 'text-red-600' : 'text-blue-600'}`} size={28} />}
                            label="CPU Usage"
                            value={cpu.toFixed(3) + " %"}
                        />
                        <MetricCard
                            icon={<IconDeviceSdCard className="text-orange-400" size={28} />}
                            label="Memory Usage"
                            value={(memory / 1024 ** 2).toFixed(2) + " MB"}
                        />
                        <MetricCard
                            icon={<IconDatabase className={`${mongo === 'UP' ? 'text-green-600' : 'text-red-600'}`} size={28} />}
                            label="Database"
                            value={mongo === 'UP' ? 'Connected' : 'Disconnected'}
                        />
                        <MetricCard
                            icon={<IconCloud className="text-purple-600" size={28} />}
                            // label="API Latency"
                            label="Uptime"
                            value={(
                                Math.floor(uptime / 60 ** 2) + "h " +
                                Math.floor(uptime % 60) + "m " +
                                Math.floor(uptime % 1 * 60) + "s"
                            )}
                        />
                        {/* <MetricCard
                    icon={<IconActivity className="text-red-600" size={28} />}
                    label="Error Rate"
                    value="0.3%"
                /> */}
                        <MetricCard
                            icon={<IconDeviceFloppy className={`${((diskStorage?.details?.total - diskStorage?.details?.free) / diskStorage?.details?.total * 100) > 80 ? 'text-red-600' : 'text-cyan-400'}`} size={28} />}
                            label="Disk Space Used"
                            value={diskStorage ? `${((diskStorage?.details?.total - diskStorage?.details?.free) / diskStorage?.details?.total * 100).toFixed(2)} %` : 'N/A'}
                        />
                    </div>

                    {/* CPU chart */}
                    {/* <div className="w-full font-bold text-sm">CPU</div>
            <LineChart
                offline={analytics?.userStatistics?.drivers.offline ?? 0}
            /> */}

                    {/* 🔹 Timeline / History */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Recent Checks</h4>
                        <ul className="space-y-3">
                            {/* {[
                        { time: "12:20 PM", status: "UP" },
                        { time: "12:00 PM", status: "DOWN" },
                    ].map((log, i) => ( */}
                            <li
                                // key={i}
                                className="flex items-center justify-between bg-white shadow p-3 rounded-lg"
                            >
                                <span className="text-gray-600">{new Date().toLocaleTimeString()}</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isServerUp
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {isServerUp ? "UP" : "DOWN"}
                                </span>
                            </li>
                            {/* // ))} */}
                        </ul>
                    </div>
                </>
            }
        </div>
    );
}

