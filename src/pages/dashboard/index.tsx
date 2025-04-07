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
import { motion } from "framer-motion";
import { IBillboard } from "@/types/forms";
import { getBillboards } from "@/services/commons";
import bgImage from "@/assets/images/img-dropbox-bg.svg";
import welcomeImage from "@/assets/images/welcome-banner.png";

type DashboardStats = ISummaryReport;

export default function Dashboard() {

    const { userData } = useUserDataContext();  // Use the hook to get user data
    const userRole = userData?.role || "BIDDER"; // Extract role from userData, defaulting to "BIDDER" if not found
    const userId = userData?.userId || "";
    const account = userData?.account || "00000000";

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [billboards, setBillboards] = useState<IBillboard[]>([]);
    const [billboardLoading, setBillboardLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedBillboard, setSelectedBillboard] = useState<IBillboard | null>(null);
    const closeModal = () => setShowModal(false);

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

        const fetchBillboards = async () => {
            try {
                const data = await getBillboards();
                setBillboards(data); // ✅ only set the array part
            } catch (err) {
                console.error("Failed to fetch billboards", err);
            } finally {
                setBillboardLoading(false);
            }
        };

        if (userId !== "") {
            fetchStats();
            fetchBillboards();
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

    const Billboards = () => (
        <div className="grid grid-cols-4 gap-4">
            {billboards.map((board) => (
                <div
                    key={board.id}
                    className="bg-green-600 lg:w-full bg-gradient-to-r from-indigo-500 rounded-xl text-white bg-cover cursor-pointer"
                    style={{
                        backgroundImage: `url(${bgImage})`, // Use dynamic background image if available
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100%"
                    }}
                    onClick={() => {
                        setSelectedBillboard(board); // Set selected billboard in state
                        setShowModal(true);           // Open modal
                    }}
                >
                    <div className="flex justify-between">
                        <div className="flex flex-col p-5 lg:gap-1">
                            <div>
                                <p className="font-light text-sm lg:max-w-[900px] lg:pt-4">
                                    <strong>{board.title}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="lg:block hidden">
                            <img src={welcomeImage} alt="Welcome" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
    const Modal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void }) => {
        const formatMessage = (message: string) => {
            return message.split("\n").map((line, index) => (
                <span key={index}>
                    {line}
                    <br />
                </span>
            ));
        };
    
        return (
            <motion.div
                className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"> {/* Increased width to max-w-2xl */}
                    <h2 className="text-2xl font-bold mb-4">{selectedBillboard?.title}</h2>
                    <div className="text-gray-600 mb-4 overflow-y-auto max-h-96"> {/* Added scrollable functionality */}
                        {selectedBillboard ? formatMessage(selectedBillboard.message) : null}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={closeModal}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };    
    

    return (
        <div className="p-1 min-h-screen">
            <div>
                <h2 className="text-xl font-bold mb-4">Billboards</h2>
                <Billboards />
                <Modal isOpen={showModal} closeModal={closeModal} />
            </div>

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
