import { useEffect, useState, useMemo } from "react";
import { ICompany, ITenders } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useBidders from "@/hooks/useBidders";
import Pagination from "@/components/widgets/table/Pagination";
import BidderProfileModal from "@/pages/bidders/fragments/bidderProfileModal";
import SMSModal from "@/pages/bidders/fragments/sms-model";
import { sendMessageSingle } from "@/services/commons";
import { IMessage } from "@/types/forms";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import useApplicationsList from "@/hooks/useApplicationsList";
import Spinner from "@/components/spinners/Spinner";

type EligibleBiddersProps = {
    tender: ITenders;
};

export const EligibleBidders = ({ tender }: EligibleBiddersProps) => {
    const [page, setPage] = useState<number>(0);
    const [sort] = useState<string>("createdAt,desc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ICompany | null>(null);
    const [userInfo, setUserInfo] = useState<ICompany | any>();
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Auto-apply tender.categoryId
    useEffect(() => {
        if (tender?.categoryId) {
            const currentCategory = searchParams.get("category");
            if (!currentCategory || currentCategory !== tender.categoryId.toString()) {
                const params = new URLSearchParams(searchParams);
                params.set("category", tender.categoryId.toString());
                navigate(`?${params.toString()}`, { replace: true });
            }
        }
    }, [tender?.categoryId]);

    const appliedFilters = useMemo(() => {
        const filter: { [key: string]: any } = {};
        const categoriesParam = searchParams.get("category");
        const parsedCategories = categoriesParam
            ? categoriesParam.split(",").filter((id) => id)
            : [];
        if (parsedCategories.length > 0) {
            filter["categories"] = parsedCategories;
        }
        return filter;
    }, [searchParams]);

    const { bidders, isLoading, refetch } = useBidders({
        page,
        sort,
        ...appliedFilters,
    });

    const { applicationList } = useApplicationsList({
        groupId: tender.id,
        applicationGroup: {},
        page: 0,
        size: 1000, 
        sort: "createdAt,desc",
        filter: { tenderId: tender.id }
    });

    const biddersWithApplications = useMemo(() => {
        if (!bidders?.content || !applicationList?.content) return [];

        return bidders.content.map((bidder: any) => {
            // Filter all applications made by this bidder
            const bidderApps = applicationList.content.filter(
                (app: any) => app.bidderAccount === bidder.account 
            );

            return {
                ...bidder,
                hasApplied: bidderApps.length > 0,
                applicationStatus: bidderApps.length > 0 ? bidderApps[0].status : "Not Applied",
            };
        });
    }, [bidders?.content, applicationList?.content]);

    const sendSMS = useMutation({
        mutationFn: (data: IMessage) => sendMessageSingle(data),
        onSuccess: () => {
            toast.success("Sent successfully");
            setIsModalOpen(false);
            setIsSending(false);
            refetch();
        },
        onError: () => {
            toast.error("Send failed");
            setIsSending(false);
        },
    });

    const handleSendSMS = () => {
        const phoneNumber = selectedUser?.companyPrimaryNumber || "0100000000";
        if (!phoneNumber) return;
        setIsSending(true);
        sendSMS.mutate({ phoneNumber, message });
    };

    const handleModalClose = () => {
        setUserInfo(undefined);
    };

    const renderSubscription = (value: number) => {
        const now = Date.now();
        const diff = value - now;
        const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (daysLeft <= 0) {
            return (
                <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                    Expired
                </span>
            );
        }

        return (
            <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                {daysLeft} day{daysLeft > 1 ? "s" : ""} left
            </span>
        );
    };

    return (
        <div
            className="rounded-md border border-slate-300 backdrop-blur-sm bg-transparent p-4"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
            {userInfo && (
                <BidderProfileModal
                    user={userInfo}
                    loading={isLoading}
                    onClose={handleModalClose}
                />
            )}

            {/* Custom Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-gray-500">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Company</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Subscription</th>
                            <th className="p-3">Do it for Me</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isLoading ?
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-400 italic">
                                        <Spinner />
                                    </td>
                                </tr>
                                :
                                biddersWithApplications.length ? (
                                    biddersWithApplications.map((bidder: any, index: number) => (
                                        <tr
                                            key={bidder.id}
                                            onClick={() => setUserInfo(bidder)}
                                            className="border-b border-gray-700 hover:bg-gray-800/20 transition cursor-pointer"
                                        >
                                            <td className="p-1">{index + 1 + page * (bidders?.size ?? 0)}</td>
                                            <td className="p-3">{bidder.companyName.toUpperCase()}</td>
                                            <td className="p-3">{bidder.companyPrimaryNumber || "-"}</td>
                                            <td className="p-3">
                                                {bidder.planExpiryDate
                                                    ? renderSubscription(bidder.planExpiryDate)
                                                    : "-"}
                                            </td>
                                            <td className="p-3">
                                                {bidder.hasApplied ? (
                                                    <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                                                        {bidder.applicationStatus}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                                                        Not Applied
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-400 italic">
                                            No eligible bidders found.
                                        </td>
                                    </tr>
                                )}
                    </tbody>

                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
                {/* <div /> */}
                {bidders?.pageable && (
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        pageCount={bidders.totalPages}
                    />
                )}
            </div>

            {/* SMS Modal */}
            {isModalOpen && (
                <SMSModal
                    isOpen={isModalOpen}
                    onClose={() => !isSending && setIsModalOpen(false)}
                    title={
                        selectedUser
                            ? `Send SMS to ${selectedUser.companyName}`
                            : "Send Bulk SMS"
                    }
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">
                            Message
                        </label>
                        <textarea
                            className="w-full bg-transparent border border-gray-400 rounded p-2 text-gray-100 mb-3"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here"
                            maxLength={160}
                        />
                        <p className="text-xs text-gray-400">{message.length}/160</p>
                    </div>

                    <button
                        className={`bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500 w-full ${isSending ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={handleSendSMS}
                        disabled={isSending}
                    >
                        {isSending ? "Sending..." : "Send"}
                    </button>
                </SMSModal>
            )}
        </div>
    );
};
