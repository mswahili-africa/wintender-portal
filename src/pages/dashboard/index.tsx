import {
    IconUsersGroup,
    IconGitPullRequest,
    IconFileText,
    IconReportMoney,
    IconPigMoney,
    IconUser
} from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUserDataContext } from "@/providers/userDataProvider";
import { getSummaryReport } from "@/services/reports";
import { ISummaryReport } from "@/types";
import WelcomeBanner from "./fragments/Welcomebanner";

type DashboardStats = ISummaryReport;

export default function Dashboard() {

    const { userData } = useUserDataContext();  // Use the hook to get user data
    const userRole = userData?.role || "BIDDER"; // Extract role from userData, defaulting to "BIDDER" if not found
    const userId = userData?.userId || "";
    const account = userData?.account || "00000000";

    const [stats, setStats] = useState<DashboardStats | null>(null);
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

        if (userId !== "") {
            fetchStats();
        }
    }, [userId]);

    const SkeletonLoader = () => (
        <div className="grid grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white shadow-md p-6 rounded-lg">
                    <Skeleton width={32} height={32} circle />
                    <h3 className="text-l font-bold mt-4"><Skeleton width={150} /></h3>
                    <p className="text-gray-600"><Skeleton width={100} /></p>
                </div>
            ))}
        </div>
    );

    const AdminStats = () => (
        <div className="grid grid-cols-4 gap-4">
            <Link to="/tenders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconFileText className="text-green-600 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Tenders</h3>
                    <p className="text-gray-600">Open: {stats?.statistics.tenders}</p>
                </div>
            </Link>
            <Link to="/bidders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconUsersGroup className="text-green-600 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Bidders</h3>
                    <p className="text-gray-600">Active: {stats?.statistics.bidders}</p>
                </div>
            </Link>
            <Link to="/do-it-for-me">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconGitPullRequest className="text-yellow-500 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Do it for me</h3>
                    <p className="text-gray-600">Requests: {stats?.statistics.requests}</p>
                </div>
            </Link>
            <Link to="/payments">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconReportMoney className="text-purple-500 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Payment</h3>
                    <p className="text-gray-600">Total: {new Intl.NumberFormat('en-TZ', {
                        style: 'decimal',
                        currency: 'TZS',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(stats?.statistics.payments ?? 0)}</p>
                </div>
            </Link>
        </div>
    );

    const PublisherStats = () => (
        <div className="grid grid-cols-2 gap-4">
            <Link to="/tenders">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconFileText className="text-green-600 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Tenders</h3>
                    <p className="text-gray-600">Open: {stats?.statistics.tenders}</p>
                </div>
            </Link>
            <Link to="/publisher-reports">
                <div className="bg-white shadow-md p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconPigMoney className="text-purple-500 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Commission</h3>
                    <p className="text-gray-600">
                        Total Earned: TZS {new Intl.NumberFormat('en-TZ', {
                            style: 'decimal',
                            currency: 'TZS',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(stats?.statistics.payments ?? 0)}
                    </p>
                </div>
            </Link>
        </div>
    );

    const BidderStats = () => (
        <div className="grid grid-cols-3 gap-4">
            <Link to={`/users/${userId}`}>
                <div className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconUser className="text-yellow-500 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">{account}</h3>
                    <p className="text-gray-600">Account</p>
                </div>
            </Link>
            <Link to="/tenders">
                <div className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconFileText className="text-green-600 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Tenders</h3>
                    <p className="text-gray-600">Open: {stats?.statistics.tenders}</p>
                </div>
            </Link>

            <Link to="/do-it-for-me">
                <div className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                    <IconGitPullRequest className="text-yellow-500 w-6 h-6 mb-4" />
                    <h3 className="text-l font-bold">Requests</h3>
                    <p className="text-gray-600">Requested: {stats?.statistics.requests}</p>
                </div>
            </Link>
        </div>
    );

    return (
        <div className="p-1 min-h-screen">
            <WelcomeBanner /> {/* Include the WelcomeBanner component */}

            {(userRole.includes("MANAGER") || userRole.includes("BIDDER") || userRole.includes("ACCOUNTANT")) && (
                <div>
                    <br></br>
                    {loading ? <SkeletonLoader /> : <BidderStats />}
                </div>
            )}

            {
                userRole.includes("PUBLISHER") && (
                    <div>
                        <br></br>
                        {loading ? <SkeletonLoader /> : <PublisherStats />}
                    </div>
                )}

            {
                userRole.includes("ADMINISTRATOR") && (
                    <div>
                        <br></br>
                        {loading ? <SkeletonLoader /> : <AdminStats />}
                    </div>
                )}

            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
}
