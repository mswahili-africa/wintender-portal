import { IconMessage, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useBidders from "@/hooks/useBidders";
import columns from "./fragments/bidder-columns";
import { ICompany } from "@/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changeUserStatus } from "@/services/user";
import { IMessage } from "@/types/forms";
import SMSModal from "./fragments/sms-model";
import { sendMessageSingle } from "@/services/commons";
import { resetUser } from "@/services/auth";
import BidderProfileModal from "./fragments/bidderProfileModal";
import useCategories from "@/hooks/useCategories";
import React from "react";

export default function Bidders() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ICompany | null>(null);
    const [userInfo, setUserInfo] = useState<ICompany | any>();
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false); // Loading state

    // JCM categories
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [bidderCategories, setBidderCategories] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const checkboxRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (checkboxRef.current && !checkboxRef.current.contains(event.target)) {
                setShowCheckboxes(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const { bidders, isLoading, refetch } = useBidders({
        page: page,
        search: search,
        categories: bidderCategories,
        sort: sort,
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
        const phoneNumber = selectedUser?.companyPrimaryNumber || "0100000000"; // Default number for bulk
        if (!phoneNumber) return;
        setIsSending(true); // Start loading state
        sendSMS.mutate({ phoneNumber, message });
    };

    const handleModalClose = () => {
        setUserInfo(undefined);
    };

    // JCM category filter
    const { categories: allCategories } = useCategories({
        page: page,
        search: search,
        categories: selectedCategories,
        sort: sort,
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        if (checked) {
            setSelectedCategories(prev => [...prev, value]);
        } else {
            setSelectedCategories(prev => prev.filter(item => item !== value));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Bidders</h2>

                <button
                    className="bg-green-600 text-white py-2 px-3 rounded hover:bg-blue-500 flex items-center"
                    onClick={openBulkSendModal}
                >
                    <IconMessage size={20} className="mr-2" /> {/* Adjust the size as needed */}
                    Send Bulk
                </button>
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-start items-center p-4 border-b gap-x-3 border-slate-200">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input-normal py-2 w-1/2 lg:w-1/4"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* JCM category filter */}
                    <div className="relative">
                        {/* trigger */}
                        <button
                            onClick={() => setShowCheckboxes(!showCheckboxes)}
                            className="px-3 py-2 ms-auto text-sm bg-gray-100 hover:bg-green-200 rounded shadow border border-green-300"
                        >
                            Select Categories
                        </button>

                        {/* floating panel */}
                        {showCheckboxes && (
                            <div
                                ref={checkboxRef}
                                className="absolute z-20 mt-2 p-4 bg-white rounded-md shadow-lg border border-gray-200 w-80 max-h-64 overflow-y-auto"
                            >
                                <p className="text-sm font-medium text-gray-600 mb-2">Filter by Category</p>
                                {allCategories?.content?.map((category: any) => (
                                    <label key={category.id} className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="checkbox"
                                            value={category.name}
                                            checked={selectedCategories.includes(category.name)}
                                            onChange={handleCategoryChange}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

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
                        title={selectedUser ? `Send SMS to ${selectedUser.companyName}` : "Send Bulk SMS"}
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
                                        value={selectedUser.companyName + ' - ' + selectedUser.companyPrimaryNumber}
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
        </div >
    );
}
