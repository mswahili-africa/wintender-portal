import {
    IconUsersGroup,
    IconGitPullRequest,
    IconFileText,
    IconReportMoney,
    IconPigMoney,
    IconUser,
    IconMessage,
    IconBrandWhatsapp,
    IconMail
} from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUserDataContext } from "@/providers/userDataProvider";
import { motion } from "framer-motion";
import bgImage from "@/assets/images/img-dropbox-bg.svg";
import { IConsultation } from "@/types/forms";
import Spinner from "@/components/spinners/Spinner";
import Button from "@/components/button/Button";
import { createConsultMe } from "@/services/tenders";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { useMutation } from "@tanstack/react-query";
import { useBillboards } from "@/hooks/useBillboards";
import { useSummary } from "@/hooks/useSystemDetails";

export default function Dashboard() {
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const userId = userData?.userId || "";
    const account = userData?.account || "00000000";

    const { showConfirmation } = usePopup();
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedBillboard, setSelectedBillboard] = useState<IConsultation | null>(null);
    const closeModal = () => setShowModal(false);
    
    const {consultationServices} = useBillboards({page:1});
    const {summary,isLoading} = useSummary();
    console.log(summary);

    const handleConsultMeClick = () => {
        if (selectedBillboard)
            showConfirmation({
                theme: "success",
                title: "Request Consultation",
                message: "Request will be send to our team for processing",
                onConfirm: () => requestMutation.mutate(selectedBillboard.id),
                onCancel: () => { }
            })
    }

    const requestMutation = useMutation({
        mutationFn: (id: string) => createConsultMe(id),
        onSuccess: () => {
            toast.success("Request send successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "");
        }
    });

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
            <StatCard icon={IconFileText} title="Tenders" description={`Open: ${summary?.statistics.tenders}`} to="/tenders" />
            <StatCard icon={IconUsersGroup} title="Bidders" description={`Active: ${summary?.statistics.bidders}`} to="/bidders" />
            <StatCard icon={IconGitPullRequest} title="Do it for me" description={`Requests: ${summary?.statistics.requests}`} to="/do-it-for-me" />
            <StatCard
                icon={IconReportMoney}
                title="Payment"
                description={`Total: ${new Intl.NumberFormat('en-TZ', {
                    style: 'decimal',
                    currency: 'TZS',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(summary?.statistics.payments ?? 0)}`}
                to="/payments"
            />
        </div>
    );

    const PublisherStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={IconFileText} title="Tenders" description={`Open: ${summary?.statistics.tenders}`} to="/tenders" />
            <StatCard
                icon={IconPigMoney}
                title="Commission"
                description={`Total Earned: TZS ${new Intl.NumberFormat('en-TZ', {
                    style: 'decimal',
                    currency: 'TZS',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(summary?.statistics.payments ?? 0)}`}
                to="/publisher-reports"
            />
        </div>
    );

    const PEStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={IconUser} title={account} description="Account" to={`/users/${userId}`} />
            <StatCard icon={IconFileText} title="My Tenders" description={`Open: ${summary?.statistics.tenders}`} to="/tenders" />
            <StatCard icon={IconGitPullRequest} title="Tender Box" description={`Applications: ${summary?.statistics.applications}`} to="/tender-box" />
        </div>
    );

    const BidderStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={IconUser} title={account} description="Account" to={`/users/${userId}`} />
            <StatCard icon={IconFileText} title="Tenders" description={`Open: ${summary?.statistics.tenders}`} to="/tenders" />
            <StatCard icon={IconGitPullRequest} title="Requests" description={`Requested: ${summary?.statistics.requests}`} to="/do-it-for-me" />
            <StatCard icon={IconGitPullRequest} title="Submissions" description={`Applications: ${summary?.statistics.applications}`} to="/do-it-for-me" />
        </div>
    );

    const Billboards = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {consultationServices?.map((board) => (
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
                            {requestMutation.isPending ? (
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
        <div className="p-2 min-h-screen relative">
            {
                userRole !== "PROCUREMENT_ENTITY" ? <>
                    {
                        userRole.includes("BIDDER") && (<>
                            <div className="text-3xl font-[200]">Hello, {userData?.name}</div>
                            <div className="text-gray-800 mb-6 w-fit">Welcome to your dashboard </div>
                        </>
                        )
                    }
                    <h2 className="text-xl font-bold mb-4">Billboards</h2>
                    <Billboards />
                </> : <>
                    {/* <h2 className="text-xl font-bold mb-4">Dashboard</h2> */}
                    <div className="text-3xl font-[200]">Hello, {userData?.name}</div>
                    <div className="text-gray-600">Welcome to your dashboard</div>
                </>
            }
            <Modal isOpen={showModal} closeModal={closeModal} />

            {(userRole.includes("MANAGER") || userRole.includes("BIDDER") || userRole.includes("ACCOUNTANT")) && (
                <div className="mt-6">
                    {isLoading ? <SkeletonLoader /> : <BidderStats />}
                </div>
            )}

            {(userRole.includes("PUBLISHER") || userRole.includes("SUPERVISOR")) && (
                <div className="mt-6">
                    {isLoading ? <SkeletonLoader /> : <PublisherStats />}
                </div>
            )}

            {/* JCM pe stats*/}
            {userRole.includes("PROCUREMENT_ENTITY") && (
                <div className="mt-6">
                    {isLoading ? <SkeletonLoader /> : <PEStats />}
                </div>
            )}

            {userRole.includes("ADMINISTRATOR") && (
                <div className="mt-6">
                    {isLoading ? <SkeletonLoader /> : <AdminStats />}
                </div>
            )}

            {
                !["BIDDER", "PROCUREMENT_ENTITY"].includes(userRole) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-5">
                        <div className="bg-white shadow-lg p-6 rounded-xl transition hover:shadow-xl hover:bg-green-50 border border-gray-100 w-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <IconMessage className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800">SMS Balance Report</h2>
                            </div>

                            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                                <div className="flex justify-between">
                                    <span className="font-medium">NextSMS:</span>
                                    <span className="font-semibold">{isLoading ? <Spinner size="sm" /> : summary?.statistics?.messageBalance?.nextSMS ?? "0"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Onfon Media:</span>
                                    <span className="font-semibold">{isLoading ? <Spinner size="sm" /> : summary?.statistics?.messageBalance?.onfonMedia ?? "0"}</span>
                                </div>
                            </div>
                        </div>


                        {/* JCM CONTACTS  */}
                        {
                            ["BIDDER", "PROCUREMENT_ENTITY"].includes(userRole) && (
                                <div className="fixed bottom-6 right-4 z-50 flex flex-col space-y-3">
                                    {/* WhatsApp */}
                                    <a
                                        href="https://wa.me/+255766028558"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex group bg-green-200 hover:bg-green-400 text-green-800 p-2 rounded-full shadow-md transition-all duration-200"
                                    >
                                        <IconBrandWhatsapp size={20} />
                                        {/* <span className="text-sm group-hover:block hidden font-medium">WhatsApp</span> */}
                                    </a>

                                    {/* Email */}
                                    <a
                                        href="mailto:info@wintender.co.tz"
                                        className="flex items-center bg-blue-200 hover:bg-blue-400 text-blue-800 p-2 rounded-full shadow-md transition-all duration-200"
                                    >
                                        <IconMail size={20} />
                                        {/* <span className="text-sm font-medium">Email</span> */}
                                    </a>
                                </div>
                            )}
                    </div>

                )
            }


            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
}
