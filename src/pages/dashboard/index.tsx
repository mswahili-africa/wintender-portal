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
import bgImage from "@/assets/images/img-dropbox-bg.svg";
import { getBillboards } from "@/services/tenders";
import { IConsultation } from "@/types/forms";
import Spinner from "@/components/spinners/Spinner";
import Button from "@/components/button/Button";
import { createConsultMe } from "@/services/tenders";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { useMutation } from "@tanstack/react-query";

type DashboardStats = ISummaryReport;

export default function Dashboard() {
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const userId = userData?.userId || "";
    const account = userData?.account || "00000000";

    const { showConfirmation } = usePopup();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [billboards, setBillboards] = useState<IConsultation[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBillboard, setSelectedBillboard] = useState<IConsultation | null>(null);
    const [isConsultMeLoading, setIsConsultMeLoading] = useState(false);
    const closeModal = () => setShowModal(false);

     const handleConsultMeClick = () => {
        if(selectedBillboard)
            showConfirmation({
                theme: "success",
                title: "Request Consultation",
                message: "Request will be send to our team for processing",
                onConfirm: () => requestMutation.mutate(selectedBillboard.id),
                onCancel: () => { }
            })
        }

    const requestMutation = useMutation({
            mutationFn: (id:string) => createConsultMe(id),
            onSuccess: () => {
                toast.success("Request send successfully");
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message ?? "");
            }
        });

        

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
                setBillboards(data);
            } catch (err) {
                console.error("Failed to fetch billboards", err);
            } 
        };

        if (userId !== "") {
            fetchStats();
            fetchBillboards();
        }
    }, [userId]);

    const SkeletonLoader = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
                    <Skeleton width={32} height={32} circle />
                    <h3 className="text-base font-bold mt-4"><Skeleton width={150} /></h3>
                    <p className="text-gray-600 text-sm"><Skeleton width={100} /></p>
                </div>
            ))}
        </div>
    );

    const StatCard = ({ icon: Icon, title, description, to }: any) => (
        <Link to={to}>
            <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg cursor-pointer hover:bg-gray-50">
                <Icon className="w-6 h-6 mb-4 text-green-600" />
                <h3 className="text-base font-bold">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </Link>
    );

    const AdminStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={IconFileText} title="Tenders" description={`Open: ${stats?.statistics.tenders}`} to="/tenders" />
            <StatCard icon={IconUsersGroup} title="Bidders" description={`Active: ${stats?.statistics.bidders}`} to="/bidders" />
            <StatCard icon={IconGitPullRequest} title="Do it for me" description={`Requests: ${stats?.statistics.requests}`} to="/do-it-for-me" />
            <StatCard
                icon={IconReportMoney}
                title="Payment"
                description={`Total: ${new Intl.NumberFormat('en-TZ', {
                    style: 'decimal',
                    currency: 'TZS',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(stats?.statistics.payments ?? 0)}`}
                to="/payments"
            />
        </div>
    );

    const PublisherStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={IconFileText} title="Tenders" description={`Open: ${stats?.statistics.tenders}`} to="/tenders" />
            <StatCard
                icon={IconPigMoney}
                title="Commission"
                description={`Total Earned: TZS ${new Intl.NumberFormat('en-TZ', {
                    style: 'decimal',
                    currency: 'TZS',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(stats?.statistics.payments ?? 0)}`}
                to="/publisher-reports"
            />
        </div>
    );

    const BidderStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={IconUser} title={account} description="Account" to={`/users/${userId}`} />
            <StatCard icon={IconFileText} title="Tenders" description={`Open: ${stats?.statistics.tenders}`} to="/tenders" />
            <StatCard icon={IconGitPullRequest} title="Requests" description={`Requested: ${stats?.statistics.requests}`} to="/do-it-for-me" />
        </div>
    );

    const Billboards = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {billboards.map((board) => (
                <div
                    key={board.id}
                    className="bg-green-600 w-full bg-gradient-to-r from-indigo-500 rounded-xl text-white bg-cover cursor-pointer"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100%"
                    }}
                    onClick={() => {
                        setSelectedBillboard(board);
                        setShowModal(true);
                    }}
                >
                    <div className="flex justify-between">
                        <div className="flex flex-col p-4 sm:p-5 gap-1">
                            <p className="font-light text-sm sm:text-base">
                                <strong>{board.title}</strong>
                            </p>
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
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90%] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold">{selectedBillboard?.title}</h2>

                        <Button
                            size="sm"
                            label="Request 'Consultation'"
                            theme="primary"
                            onClick={handleConsultMeClick}
                        >
                            {isConsultMeLoading ? (
                                <div className="flex items-center gap-2">
                                    <Spinner size="sm" />
                                    Requesting...
                                </div>
                            ) : (
                                "Request Consultation"
                            )}
                        </Button>
                    </div>


                    <div className="text-gray-600 mb-4">
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
        <div className="p-2 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Billboards</h2>
            <Billboards />
            <Modal isOpen={showModal} closeModal={closeModal} />

            {(userRole.includes("MANAGER") || userRole.includes("BIDDER") || userRole.includes("ACCOUNTANT")) && (
                <div className="mt-6">
                    {loading ? <SkeletonLoader /> : <BidderStats />}
                </div>
            )}

            {userRole.includes("PUBLISHER") && (
                <div className="mt-6">
                    {loading ? <SkeletonLoader /> : <PublisherStats />}
                </div>
            )}

            {userRole.includes("ADMINISTRATOR") && (
                <div className="mt-6">
                    {loading ? <SkeletonLoader /> : <AdminStats />}
                </div>
            )}

            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
}
