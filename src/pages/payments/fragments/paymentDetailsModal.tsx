import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "react-medium-image-zoom/dist/styles.css";
import { ICategory, ICompany, IPayment } from "@/types";
import { IMessage } from "@/types/forms";
import { sendMessageSingle } from "@/services/commons";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import Modal from "@/components/Modal";
import { Table } from "@/components/widgets/table/Table";
import Pagination from "@/components/widgets/table/Pagination";
import paymentsColumns from "./paymentsColumns"
import dummyLogo from "@/assets/images/bidder-dummy-logo.png"
import { getUserPayments } from "@/hooks/usePayments";
import useApplicationsList from "@/hooks/useApplicationsList";
import Chip from "@/components/chip/Chip";
import paymentListColumns from "./paymentListColumns";
import SMSModal from "@/pages/bidders/fragments/sms-model";

interface IProps {
    children?: React.ReactNode;
    payment: IPayment;
    loading: boolean;
    onClose: () => void; // Add this to handle closing the modal from parent
}


const PaymentDetailsModal: React.FC<IProps> = ({ payment, onClose }) => {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ICompany | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false); // Loading state
    const [message, setMessage] = useState<string>("");
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isPaymentsView, setIsPaymentsView] = useState(true);

    const [searchParams, _] = useSearchParams();

    // Get the userId from the user object passed in props
    const { payments } = getUserPayments({
        userId: payment.createdBy, // Pass the userId from the user object
        page: page,
        filter: { ...Object.fromEntries(searchParams) }, // Pass filter here
    });

    const { applicationList } = useApplicationsList({
        applicationGroup: "user-" + payment.createdBy,
        groupId: "user-" + payment.createdBy,
        page,
        search,
        sort,
        filter: undefined,
    });


    const handleSendSMS = () => {
        const phoneNumber = selectedUser?.phoneNumber || "0100000000"; // Default number for bulk
        if (!phoneNumber) return;
        setIsSending(true); // Start loading state
        sendSMS.mutate({ phoneNumber, message });
    };

    const sendSMS = useMutation({
        mutationFn: (data: IMessage) => sendMessageSingle(data),
        onSuccess: () => {
            toast.success("Sent successfully");
            setIsModalOpen(false); // Close modal on success
            setIsSending(false);
        },
        onError: () => {
            toast.error("Send failed");
            setIsSending(false); // Reset loading state on error
        },
    });



    return (
        <>
            <Modal
                closeIcon={true}
                isOpen={isOpen}
                size={"xl"}
                onClose={() => {
                    setIsOpen(false);
                    onClose();
                }}
            >

                <div className="w-full grid grid-cols-1 gap-10 py-6 px-4 md:px-8">
                    <section className="w-full space-y-6">


                        <div className="border-b border-zinc-200 pb-4">
                            <div className="my-2 flex gap-4 justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="overflow-hidden p-0.5">
                                        <img
                                            src={dummyLogo}
                                            alt={payment?.company}
                                            className="w-16 h-16 object-cover rounded-full border border-gray-300"
                                        />
                                    </div>
                                    <span>
                                        <h4 className="lg:text-lg font-medium">{payment?.company?.toUpperCase()}</h4>
                                    </span>
                                    <Chip
                                        label={payment?.status}
                                        size="sm"
                                        theme={payment?.status === "SUCCESSFUL" || payment?.status === "APPROVED" ? "success" : "danger"}
                                        variant="outline"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="border-b border-zinc-200 text-sm text-black-400 pb-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Left Column - User, Shop, and Status Info */}
                                <div className="space-y-4">
                                    <strong>Transaction Details</strong>
                                    <p><strong>Reference no:</strong> {payment?.transactionReference}</p>
                                    <p><strong>Amount:</strong> {payment?.amount}</p>
                                    <p className="flex flex-row me-4 gap-x-2"><strong>Status:</strong>
                                        <Chip
                                            label={payment?.status}
                                            size="sm"
                                            theme={payment?.status === "SUCCESSFUL" || payment?.status === "APPROVED" ? "success" : "danger"}
                                            variant="outline"
                                        />
                                    </p>
                                    <p><strong>Date:</strong> {payment?.createdAt}</p>
                                    <p><strong>Reason:</strong> {payment?.paymentReason}</p>
                                    <p><strong>Payer:</strong> {payment?.userName}</p>
                                    <p><strong>Phone:</strong> {payment.phoneNumber}</p>
                                </div>

                                {/* Right Column - Location Info */}
                                <div className="space-y-4">
                                    <strong>Company</strong>
                                    {payment?.company && <p><strong>Name:</strong> {payment?.company}</p>}
                                </div>

                            </div>
                        </div>


                    </section>
                </div >


                {/* Toggle Button */}
                < div className="flex flex-col items-center justify-center overflow-hidden" >
                    <label className="flex items-center cursor-pointer">
                        <span className="mr-2">Requests</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isPaymentsView}
                                onChange={() => setIsPaymentsView(!isPaymentsView)}
                            />
                            <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
                            <div
                                className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transition-transform transform ${isPaymentsView ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            ></div>
                        </div>

                        <span className="ml-2">Payments</span>
                    </label>

                    {/* Tab Content */}
                    < div className="tab-content mt-4" >
                        {
                            isPaymentsView ? (
                                <div className="container overflow-hidden" >
                                    <div className="border border-slate-200 bg-white px-32 rounded-md overflow-x-auto">
                                        <Table
                                            columns={paymentsColumns}
                                            data={payments?.content ?? []}
                                            hasSelection={false}
                                            hasActions={false}
                                        />
                                    </div>
                                    {payments?.pageable && (
                                        <div className="flex justify-center p-4">
                                            <Pagination
                                                currentPage={page}
                                                setCurrentPage={setPage}
                                                pageCount={payments?.totalPages!}
                                            />
                                        </div>
                                    )}
                                </div >
                            ) : (
                                <div className="container">
                                    <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                                        <Table
                                            columns={paymentListColumns}
                                            data={applicationList?.content ?? []}
                                            hasSelection={false}
                                            hasActions={false}
                                        />
                                    </div>
                                    {applicationList?.pageable && (
                                        <div className="flex justify-center p-4">
                                            <Pagination
                                                currentPage={page}
                                                setCurrentPage={setPage}
                                                pageCount={applicationList?.totalPages!}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                    </div>
                </div >
                {isModalOpen && (
                    <SMSModal
                        isOpen={isModalOpen}
                        onClose={() => !isSending && setIsModalOpen(false)}
                        title={selectedUser ? `Send SMS to ${selectedUser.name}` : "Send Bulk SMS"}
                    >
                        {!selectedUser && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    className="input-normal w-full mb-4"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here"
                                    maxLength={160} // Limit to 160 characters
                                />
                                <p className="text-sm text-gray-500">
                                    {message.length}/160 characters
                                </p>
                            </div>
                        )}
                        {selectedUser && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                    <input
                                        type="text"
                                        className="input-normal w-full mb-4"
                                        value={selectedUser.name + ' - ' + selectedUser.phoneNumber}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        id="message"
                                        className="input-normal w-full mb-4"
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message here"
                                        maxLength={160} // Limit to 160 characters
                                    />
                                    <p className="text-sm text-gray-500">
                                        {message.length}/160 characters
                                    </p>
                                </div>
                            </>
                        )}
                        <button
                            className={`bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500 w-full ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleSendSMS}
                            disabled={isSending}
                        >
                            {isSending ? "Sending..." : "Send"}
                        </button>
                    </SMSModal>
                )}
            </Modal >
        </>
    );
};

export default PaymentDetailsModal;
