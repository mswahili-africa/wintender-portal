import {
    IconUsersGroup,
    IconGitPullRequest,
    IconFileText,
    IconReportMoney,
    IconPigMoney
} from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";
import { getSummaryReport } from "@/services/reports";
import { ISummaryReport } from "@/types";

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
            <Link to="/tenders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconFileText className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Tenders</h3>
                    <p className="text-gray-600">Open: {stats?.statistics.tenders}</p>
                </div>
            </Link>
            <Link to="/bidders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconUsersGroup className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Bidders</h3>
                    <p className="text-gray-600">Active: {stats?.statistics.bidders}</p>
                </div>
            </Link>
            <Link to="/do-it-for-me">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconGitPullRequest className="text-yellow-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Requests</h3>
                    <p className="text-gray-600">Do it for me: {stats?.statistics.requests}</p>
                </div>
            </Link>
            <Link to="/payments">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconReportMoney className="text-purple-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Payment</h3>
                    <p className="text-gray-600">Total Collection: TZS{stats?.statistics.payments}</p>
                </div>
            </Link>
        </div>
    );

    
     const PublisherStats = () => (
        <div className="grid grid-cols-2 gap-4">
            <Link to="/tenders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconFileText className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Tenders</h3>
                    <p className="text-gray-600">Open: {stats?.statistics.tenders}</p>
                </div>
            </Link>
            <Link to="/publisher-reports">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconPigMoney className="text-purple-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Commission</h3>
                    <p className="text-gray-600">Total Earned: TZS{stats?.statistics.payments}</p>
                </div>
            </Link>
        </div>
    );

      const BidderStats = () => (
        <div className="grid grid-cols-2 gap-4">
            <Link to="/tenders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconFileText className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Tenders</h3>
                    <p className="text-gray-600">Open: {stats?.statistics.tenders}</p>
                </div>
            </Link>

            <Link to="/do-it-for-me">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconGitPullRequest className="text-yellow-500 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold">Requests</h3>
                    <p className="text-gray-600">My Requests: {stats?.statistics.requests}</p>
                </div>
            </Link>
        </div>
    );

    return (
        <div className="p-3 bg-gray-50 min-h-screen">
            {auth.user && (auth.user.role.role.includes("MANAGER") || auth.user.role.role.includes("ADMINISTRATOR") || auth.user.role.role.includes("ACCOUNTANT")) && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Manager</h2>
                    {loading ? <SkeletonLoader /> : <AdminStats />}
                </div>
            )}

            {auth.user &&
                auth.user.role.role.includes("PUBLISHER") && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6"> Publisher</h2>
                        {loading ? <SkeletonLoader /> : <PublisherStats />}
                    </div>
                )}

            {auth.user &&
                auth.user.role.role.includes("BIDDER") && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6"> Tenders</h2>
                        {loading ? <SkeletonLoader /> : <BidderStats />}
                    </div>
                )}

            {error && <div className="text-red-500 mt-4">{error}</div>} {/* Display error message */}
        </div>
    );
}
