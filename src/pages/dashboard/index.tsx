import {
    IconUsers,
    IconPackage,
    IconShoppingBag,
    IconCreditCard,
    IconBuildingWarehouse,
} from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton'; // Importing Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Skeleton styles
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";
import { getSummaryReport } from "@/services/reports";
import { ISummaryReport } from "@/types";

// Define a type for the stats state
type DashboardStats = ISummaryReport;

export default function Dashboard() {
    const auth = useSnapshot(authStore);
    const [stats, setStats] = useState<DashboardStats | null>(null); // State to store API data
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getSummaryReport();
                setStats(response);
            } catch (err) {
                setError('Failed to load summary report. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <div className="grid grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white shadow-md p-6 rounded-lg">
                    <Skeleton width={32} height={32} circle />
                    <h3 className="text-xl font-bold mt-4"><Skeleton width={150} /></h3>
                    <p className="text-gray-600"><Skeleton width={100} /></p>
                </div>
            ))}
        </div>
    );

    // Admin Stats Component
    const AdminStats = () => (
        <div className="grid grid-cols-2 gap-4">
            <Link to="/customers">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconUsers className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Customers</h3>
                    <p className="text-gray-600">Total Users: {stats?.statistics.customers}</p>
                </div>
            </Link>
            <Link to="/orders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconPackage className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Orders</h3>
                    <p className="text-gray-600">Pending Orders: {stats?.statistics.orders}</p>
                </div>
            </Link>
            <Link to="/products">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconBuildingWarehouse className="text-yellow-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Products</h3>
                    <p className="text-gray-600">Registered: {stats?.statistics.products}</p>
                </div>
            </Link>
            <Link to="/payments">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconCreditCard className="text-purple-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Payment</h3>
                    <p className="text-gray-600">Total Collection: TZS{stats?.statistics.payments}</p>
                </div>
            </Link>
        </div>
    );

     // Vendor Stats Component
     const VendorStats = () => (
        <div className="grid grid-cols-2 gap-4">
            <Link to="/customers">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconUsers className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Customers</h3>
                    <p className="text-gray-600">Total Users: {stats?.statistics.customers}</p>
                </div>
            </Link>
            <Link to="/payments">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconCreditCard className="text-purple-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Payment</h3>
                    <p className="text-gray-600">Total Collection: TZS{stats?.statistics.payments}</p>
                </div>
            </Link>
        </div>
    );

      // Vendor Stats Component
      const FactoryStats = () => (
        <div className="grid grid-cols-2 gap-4">
            <Link to="/devices">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconBuildingWarehouse className="text-yellow-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Devices</h3>
                    <p className="text-gray-600">Registered: {stats?.statistics.products}</p>
                </div>
            </Link>
        </div>
    );

    return (
        <div className="p-3 bg-gray-50 min-h-screen">
            {auth.user && (auth.user.role.role.includes("VENDOR_ADMIN") || auth.user.role.role.includes("COUNTRY_ADMIN") || auth.user.role.role.includes("FULL_ADMIN") || auth.user.role.role.includes("ACCOUNTANT") || auth.user.role.role.includes("MANAGER")) && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Manager</h2>
                    {loading ? <SkeletonLoader /> : <AdminStats />}
                </div>
            )}

            {auth.user &&
                auth.user.role.role.includes("CUSTOMER_SUPPORT") && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6"> Support</h2>
                        {loading ? <SkeletonLoader /> : <VendorStats />}
                    </div>
                )}

            {auth.user &&
                auth.user.role.role.includes("FACTORY_ADMIN") && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6"> Factory</h2>
                        {loading ? <SkeletonLoader /> : <FactoryStats />}
                    </div>
                )}

            {error && <div className="text-red-500 mt-4">{error}</div>} {/* Display error message */}
        </div>
    );
}
