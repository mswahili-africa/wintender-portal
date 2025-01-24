import { IconMessage, IconSearch } from "@tabler/icons-react";
import {  useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useBidders from "@/hooks/useBidders";
import columns from "./fragments/bidder-columns";
import { IUser } from "@/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changeUserStatus } from "@/services/user";
import { IMessage } from "@/types/forms";
import SMSModal from "./fragments/sms-model";
import { sendMessageSingle } from "@/services/commons";
import { resetUser } from "@/services/auth";
import BidderProfileModal from "./fragments/bidderProfileModal";

export default function Bidders() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [userInfo, setUserInfo] = useState<IUser | any>();
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false); // Loading state

    const { bidders, isLoading, refetch } = useBidders({
        page: page,
        search: search,
        sort: sort,
        filter: filter,
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    const changeMutation = useMutation({
        mutationFn: (userId: string) => changeUserStatus(userId),
        onSuccess: () => {
            toast.success("Changed successfully");
            refetch();
        },
        onError: () => {
            toast.error("Change failed");
        },
    });

    const resetMutation = useMutation({
        mutationFn: (userId: string) => resetUser(userId),
        onSuccess: () => {
            toast.success("Resetted successfully");
            refetch();
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
            setIsSending(false); // Reset loading state
            refetch();
        },
        onError: () => {
            toast.error("Send failed");
            setIsSending(false); // Reset loading state on error
        },
    });

    const openBulkSendModal = () => {
        setSelectedUser(null); // Clear selected user
        setMessage(""); // Clear message
        setIsModalOpen(true); // Open the modal
    };

    const handleSendSMS = () => {
        const phoneNumber = selectedUser?.phoneNumber || "0100000000"; // Default number for bulk
        if (!phoneNumber) return;
        setIsSending(true); // Start loading state
        sendSMS.mutate({ phoneNumber, message });
    };

    const handleModalClose = () => {
        setUserInfo(undefined);
    };

    return (
        <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <input
                    type="text"
                    placeholder="Search"
                    className="input-normal py-2 w-1/2 lg:w-1/4"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-green-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-500 flex items-center"
                    onClick={openBulkSendModal}
                >
                    <IconMessage size={20} className="mr-2" /> {/* Adjust the size as needed */}
                    Send Bulk
                </button>

            </div>

            {userInfo && (
                <BidderProfileModal
                    user={userInfo}
                    loading={isLoading}
                    onClose={handleModalClose} // Pass the close handler
                />
            )}

            <Table
                columns={columns}
                data={bidders ? bidders.content : []}
                isLoading={isLoading}
                hasSelection={false}
                hasActions={true}
                onSorting={handleSorting}
                actionSlot={(content: any) => {
                    return (
                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={() => setUserInfo(content)}
                            >
                                <IconSearch
                                    className="h-5 w-5 text-green-500"
                                />
                            </button>

                        </div>
                    );
                }}
            />

            <div className="flex justify-between items-center p-4 lg:px-8">
                <div></div>
                {bidders?.pageable && (
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        pageCount={bidders.totalPages}
                    />
                )}
            </div>

            {isModalOpen && (
                <SMSModal
                    isOpen={isModalOpen}
                    onClose={() => !isSending && setIsModalOpen(false)} // Only close when not sending
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
                                    value={selectedUser.company.name + ' - ' + selectedUser.phoneNumber}
                                    readOnly
                                />
                            </div>
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
        </div>
    );
}
