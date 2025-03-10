import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "react-medium-image-zoom/dist/styles.css";
import { ICategory, ICompany, IUser } from "@/types";
import { IMessage } from "@/types/forms";
import { sendMessageSingle } from "@/services/commons";
import { IconMessage } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import Modal from "@/components/Modal";
import { Table } from "@/components/widgets/table/Table";
import Pagination from "@/components/widgets/table/Pagination";
import SMSModal from "./sms-model";
import paymentsColumns from "./paymentsColumns"
import dummyLogo from "@/assets/images/bidder-dummy-logo.png"
import { getCategories } from "@/services/tenders";
import { getUserPayments } from "@/hooks/usePayments";
import applicationColumns from "./applicationListColumns";
import Loader from "@/components/spinners/Loader";
import useApplicationsList from "@/hooks/useApplicationsList";
import usePopup from "@/hooks/usePopup";
import { resetUser } from "@/services/auth";
import { changeUserStatus } from "@/services/user";
import Chip from "@/components/chip/Chip";

interface IProps {
    children?: React.ReactNode;
    user: ICompany;
    loading: boolean;
    onClose: () => void; // Add this to handle closing the modal from parent
}

const BidderProfileModal: React.FC<IProps> = ({ user, onClose }) => {
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
    const { showConfirmation } = usePopup();

    const [searchParams, _] = useSearchParams();

    // Get the userId from the user object passed in props
    const { payments } = getUserPayments({
        userId: user.id, // Pass the userId from the user object
        page: page,
        filter: { ...Object.fromEntries(searchParams) }, // Pass filter here
    });

    const { applicationList } = useApplicationsList({
        applicationGroup: "user-" + user.id,
        groupId: "user-" + user.id,
        page,
        search,
        sort,
        filter: undefined,
    });

    const SendSingleSMS = (user: ICompany) => {
        setSelectedUser(user); // Set the selected user for the modal
        setIsModalOpen(true); // Open the modal
    };

    const handleSendSMS = () => {
        const phoneNumber = selectedUser?.phoneNumber || "0100000000"; // Default number for bulk
        if (!phoneNumber) return;
        setIsSending(true); // Start loading state
        sendSMS.mutate({ phoneNumber, message });
    };

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories({
                    page: 0,
                    size: 300,
                    search: "",
                    filter: {},
                });
                setCategories(data.content);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        }

        fetchCategories();
    }, []);

    const changeMutation = useMutation({
        mutationFn: (userId: string) => changeUserStatus(userId),
        onSuccess: () => {
            toast.success("Changed successfully");
        },
        onError: () => {
            toast.error("Change failed");
        },
    });

    const resetMutation = useMutation({
        mutationFn: (userId: string) => resetUser(userId),
        onSuccess: () => {
            toast.success("Resetted successfully");
        },
        onError: () => {
            toast.error("Change failed");
        },
    });

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

    const changeStatus = (payload: IUser) => {
        showConfirmation({
            theme: "danger",
            title: "Change bidder status?",
            message: "Please verify that you want to change bidder status.",
            onConfirm: () => {
                changeMutation.mutate(payload.id);
            },
            onCancel: () => { },
        });
    };

    const handleResetUser = (payload: IUser) => {
        showConfirmation({
            theme: "danger",
            title: "Reset user?",
            message: "Please verify that you want to reset user account.",
            onConfirm: () => {
                resetMutation.mutate(payload.id);
            },
            onCancel: () => { },
        });
    };

    return (
        <>
            <Modal
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
                                            src={user.companyLogoFilePath ? user.companyLogoFilePath : dummyLogo}
                                            alt={user.companyName}
                                            className="w-16 h-16 object-cover rounded-full border border-gray-300"
                                        />
                                    </div>
                                    <span>
                                        <h4 className="lg:text-lg font-medium">{user?.companyName.toUpperCase()}</h4>
                                    </span>
                                    <Chip
                                        label={user.planExpiryDate && user.planExpiryDate > Date.now() ? "PLAN ACTIVE" : "PLAN EXPIRED"}
                                        size="sm"
                                        theme={user.planExpiryDate && user.planExpiryDate > Date.now() ? "success" : "danger"}
                                        variant="outline"
                                    />
                                </div>
                                <p className="flex items-center space-x-3">
                                    <button onClick={() => SendSingleSMS(user)}>
                                        <IconMessage size={24} className="text-green-500" />
                                    </button>
                                    {/* <button className="text-green-500" onClick={() => handleResetUser(user)}
                                    >
                                        <IconUserOff size={20} />
                                    </button>
                                    <button
                                        className="text-green-500"
                                        onClick={() => changeStatus(user)}
                                    >
                                        <IconStatusChange size={20} />
                                    </button> */}
                                </p>
                            </div>
                        </div>

                        <div className="border-b border-zinc-200 text-sm text-black-400 pb-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Left Column - User, Shop, and Status Info */}
                                <div className="space-y-4">
                                    <strong>Contact Person</strong>
                                    <p><strong>Person:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.companyEmail}</p>
                                    <p><strong>Phone:</strong> {user.companyPrimaryNumber}</p>
                                </div>

                                {/* Right Column - Location Info */}
                                <div className="space-y-4">
                                    <strong>Company</strong>
                                    {user.companyTin && <p><strong>TIN:</strong> {user.companyTin}</p>}
                                    {user.companyAddress && <p><strong>Address:</strong> {user.companyAddress}</p>}
                                    {user.companyPrimaryNumber && <p><strong>Phone:</strong> {user.companyPrimaryNumber}</p>}
                                    {user.companyEmail && <p><strong>Email:</strong> {user.companyEmail}</p>}
                                    {user.companyWebsite && <p><strong>Website:</strong> {user.companyWebsite}</p>}
                                </div>

                            </div>
                        </div>

                        <div className="border-b border-zinc-200 text-sm text-zinc-400 pb-4">
                            <div className="space-y-4">
                                <strong>Categories</strong>
                                {/* Show loader while categories are loading */}
                                {categories.length === 0 ? (
                                    <Loader />
                                ) : (
                                    <ul>
                                        {(Array.isArray(user.companyCategories) ? user.companyCategories : [])
                                            .filter(categoryId => categoryId) // Ensure no null/undefined values
                                            .map((categoryId) => {
                                                const category = categories.find((c) => c.id === categoryId);
                                                return (
                                                    <li key={categoryId || `unknown-${Math.random()}`} className="flex items-center gap-2">
                                                        <input type="checkbox" checked={true} readOnly className="h-4 w-4 text-green-500" />
                                                        <span>{category ? category.name : "Unknown Category"}</span>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                )}
                            </div>
                        </div>

                    </section>
                </div>


                {/* Toggle Button */}
                <div className="flex items-center justify-center">
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
                </div>

                {/* Tab Content */}
                <div className="tab-content mt-4">
                    {isPaymentsView ? (
                        <div className="container">
                            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
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
                        </div>
                    ) : (
                        <div className="container">
                            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                                <Table
                                    columns={applicationColumns}
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
            </Modal>


        </>
    );
};



export default BidderProfileModal;
