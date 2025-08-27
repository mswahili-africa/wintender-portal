import { IconAlertTriangle, IconChevronDown, IconFilePlus, IconFilter, IconMessage, IconRefresh, IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { Table } from "@/components/widgets/table/Table";
import useBidders from "@/hooks/useBidders";
import columns from "./fragments/bidder-columns";
import { ICompany } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changeUserStatus, deleteBidder } from "@/services/user";
import { IMessage } from "@/types/forms";
import SMSModal from "./fragments/sms-model";
import { sendMessageSingle } from "@/services/commons";
import { resetUser } from "@/services/auth";
import BidderProfileModal from "./fragments/bidderProfileModal";
import useCategories from "@/hooks/useCategories";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import Button from "@/components/button/Button";
import { useUserData } from "@/hooks/useUserData";
import Modal from "@/components/Modal";
import PrivateTenderRequest from "../applications/fragments/privateRequestForm";
import { ExportXLSX } from "@/components/widgets/Excel";
import bidderExcelColumns from "./fragments/bidderExcelColumns";

const tanzaniaRegions = [
    "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma",
    "Kilimanjaro", "Lindi", "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza",
    "Njombe", "Pemba North", "Pemba South", "Pwani", "Rukwa", "Ruvuma", "Shinyanga",
    "Simiyu", "Singida", "Tabora", "Tanga", "Zanzibar North", "Zanzibar South and Central", "Zanzibar Urban West"
];
const regionOptions = tanzaniaRegions.map(r => ({ label: r, value: r }));

export default function Bidders() {
    const [page, setPage] = useState<number>(0);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ICompany | null>(null);
    const [userInfo, setUserInfo] = useState<ICompany | any>();
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const checkboxRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [tempSearch, setTempSearch] = useState<string>("");
    const [tempSelectedRegion, setTempSelectedRegion] = useState<{ label: string, value: string } | null>(null);
    const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState("");

    // JCM DELETE MODAL
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { userData } = useUserData();

    const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);

    const handleDeleteModalClose = () => {
        setIsDeleting(false);
    };

    const handleDeleteBidder = () => {
        setDeleting(true);
        deleteBidderMutation.mutate();
    };

    const deleteBidderMutation = useMutation({
        mutationKey: ["deleteBidder", selectedUser?.id],
        mutationFn: () => deleteBidder(selectedUser?.id || ""),
        onSuccess: (data) => {
            toast.success(data.message || "Bidder deleted successfully");
            console.log(data);
            setDeleting(false);
            setIsDeleting(false);
            refetch();
        },
        onError: (error: any) => {
            setDeleting(false);
            toast.error(`Failed to delete bidder: ${error.message}`);
        }
    })
    const { } = deleteBidderMutation;
    // JCM DELETE END



    useEffect(() => {
        const addressParam = searchParams.get("address");
        const categoriesParam = searchParams.get("category");
        const searchParam = searchParams.get("search");

        const categoryIds = categoriesParam
            ? categoriesParam.replace(/^\[|\]$/g, "").split(",").filter(id => id)
            : [];

        if (addressParam) {
            setTempSelectedRegion({ label: addressParam, value: addressParam });
        }
        setTempSelectedCategories(categoryIds);
        setTempSearch(searchParam || "");

    }, [searchParams.toString()]);

    // Derived state for API call based on URL params
    const appliedFilters = React.useMemo(() => {
        const filter: { [key: string]: any } = {};

        const categoriesParam = searchParams.get("category");
        const addressParam = searchParams.get("address");
        const searchParam = searchParams.get("search");

        const parsedCategories = categoriesParam
            ? categoriesParam.replace(/^\[|\]$/g, "").split(",").filter(id => id)
            : [];

        if (parsedCategories.length > 0) {
            filter['categories'] = parsedCategories;
        }

        if (addressParam) {
            filter['address'] = addressParam;
        }

        if (searchParam) {
            filter['search'] = searchParam;
        }

        return filter;
    }, [searchParams]);


    const { bidders, isLoading, refetch } = useBidders({
        page,
        sort,
        ...appliedFilters
    });

    const { categories: allCategories } = useCategories({
        page: 0,
        size: 1000,
        sort: "name,asc",
    });

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setTempSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const handleApplyFilters = () => {
        console.log("Filter button clicked");
        const params = new URLSearchParams();

        if (tempSelectedCategories.length > 0) {
            params.set("category", tempSelectedCategories.join(","));
        }
        if (tempSelectedRegion?.value) {
            params.set("address", tempSelectedRegion.value);
        }
        if (tempSearch) {
            params.set("search", tempSearch);
        }

        navigate(`?${params.toString()}`);
        setShowCheckboxes(false);
        setPage(0);
    };

    const handleResetFilters = () => {
        setTempSelectedCategories([]);
        setTempSelectedRegion(null);
        setTempSearch("");
        navigate("");
        setPage(0);
    };


    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (checkboxRef.current && !checkboxRef.current.contains(event.target)) {
                setShowCheckboxes(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


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

    const openBulkSendModal = () => {
        setSelectedUser(null);
        setMessage("");
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setUserInfo(undefined);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Bidders</h2>

                <div className="flex gap-x-2">
                    <ExportXLSX name="Bidders" data={bidders?.content || []} columns={bidderExcelColumns} />
                    <button
                        className="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-800 flex items-center"
                        onClick={openBulkSendModal}
                    >
                        <IconMessage size={20} className="mr-2" />
                        Send Bulk
                    </button>
                </div>
            </div>
            <div className="flex flex-col border-b py-3 gap-y-1 mb-1 border-slate-200">
                <div className="flex justify-between items-center flex-col md:flex-row">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3" >
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Search by Name"
                                className="input-normal py-2 w-60"
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                            />
                        </div>
                        <div className="mb-2">
                            <Select
                                options={regionOptions}
                                value={tempSelectedRegion}
                                onChange={setTempSelectedRegion}
                                placeholder="Select Region"
                                className="w-60"
                                isClearable
                            />
                        </div>
                        <div className="mb-2 relative">
                            <div
                                onClick={() => setShowCheckboxes(!showCheckboxes)}
                                className="px-3 py-2 text-sm  hover:bg-green-200 rounded shadow border border-green-300 justify-between flex flex-row items-center cursor-pointer"
                            >
                                <div>Select Categories</div>
                                <div className="border-l border-gray-300">
                                    <IconChevronDown size={18} className="inline ml-2 text-slate-400" />
                                </div>
                            </div>
                            {showCheckboxes && (
                                <div
                                    ref={checkboxRef}
                                    className="absolute z-20 mt-2 p-4 bg-white rounded-md shadow-lg border border-gray-200 w-80 max-h-80 overflow-y-auto"
                                >
                                    <p className="text-sm font-medium text-gray-600 mb-2">Filter by Category</p>

                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        className="input-normal mb-3 w-full px-2 py-1 border border-gray-300 rounded"
                                        value={categorySearchTerm}
                                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                                    />

                                    {allCategories?.content
                                        ?.filter((cat: any) =>
                                            cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
                                        )
                                        .map((category: any) => (
                                            <label key={category.id} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="checkbox"
                                                    value={category.id}
                                                    checked={tempSelectedCategories.includes(category.id)}
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

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <Button
                            type="button"
                            label="Filter"
                            icon={<IconFilter size={18} />}
                            theme="info"
                            size="sm"
                            onClick={handleApplyFilters}
                        />
                        <Button
                            type="button"
                            label="Reset"
                            icon={<IconRefresh size={18} />}
                            theme="warning"
                            size="sm"
                            onClick={handleResetFilters}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto w-full flex flex-row">
                    {
                        tempSelectedCategories.length > 0 && (
                            <div className="flex flex-nowrap gap-2">
                                {tempSelectedCategories.map((categoryId) => {
                                    const category = allCategories?.content?.find((cat: any) => cat.id === categoryId);
                                    return (
                                        <div
                                            key={categoryId}
                                            className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-2"
                                        >
                                            {category ? category.name : "Unknown Category"}
                                            <button
                                                className="text-red-500 hover:text-red-700 text-xs"
                                                onClick={() => {
                                                    setTempSelectedCategories(prev => prev.filter(id => id !== categoryId))
                                                    setTimeout(() => { }, 300); // Delay to ensure state update before re-render
                                                    handleApplyFilters();
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

                {userInfo && (
                    <BidderProfileModal
                        user={userInfo}
                        loading={isLoading}
                        onClose={handleModalClose}
                    />
                )}


                {/* JCM BIDDER DELETE MODAL */}
                {
                    isDeleting &&
                    <Modal isOpen={isDeleting} onClose={handleDeleteModalClose} size={"md"} >
                        <h1 className="text-lg font-bold"><strong>Delete Bidder?</strong></h1>
                        <div className="flex items-center justify-center mb-4">
                            <IconAlertTriangle size={80} className=" text-red-500 mr-2" />
                        </div>
                        <p className="text-sm px-5 text-gray-700">
                            <span className="text-sm">Are you sure you want to delete bidder with the following details, this action cannot be undone</span> <br /><br />
                            Company name: <span className="font-bold text-gray-900">{selectedUser?.companyName || "N/A"}</span> <br />
                            Company email: <span className="font-bold text-gray-900">{selectedUser?.companyEmail || "N/A"}</span> <br />
                            Company phone: <span className="font-bold text-gray-900">{selectedUser?.companyPrimaryNumber || "N/A"}</span> <br />
                            Admin name: <span className="font-bold text-gray-900">{selectedUser?.name || "N/A"}</span> <br />
                            Admin email: <span className="font-bold text-gray-900">{selectedUser?.email || "N/A"}</span> <br />
                            phone number: <span className="font-bold text-gray-900">{selectedUser?.phoneNumber || "N/A"}</span>
                        </p>
                        <div className="mt-4 flex justify-end space-x-2">
                            {!deleting &&
                                <Button
                                    label="Cancel"
                                    icon={<IconX size={18} />}
                                    onClick={handleDeleteModalClose}
                                    theme="secondary"
                                    size="sm"
                                />
                            }
                            <Button
                                label="DELETE BIDDER"
                                icon={<IconTrash size={18} />}
                                loading={deleting}
                                onClick={handleDeleteBidder}
                                theme="danger"
                                size="sm"
                            />
                        </div>
                    </Modal>

                }

                <Table
                    columns={columns}
                    data={bidders ? bidders.content : []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={true}
                    actionSlot={(content: any) => (
                        <div className="flex justify-center space-x-3">
                            <button onClick={() => setUserInfo(content)}>
                                <IconSearch className="h-5 w-5 text-green-500" />
                            </button>
                            {
                                ["SUPERVISOR", "PUBLISHER", "ADMINISTRATOR"].includes(userData?.role as string) &&
                                <button onClick={() => { setSelectedUser(content) }}>
                                    <IconFilePlus className="h-5 w-5 text-green-500" />
                                </button>
                            }
                            {
                                ["SUPERVISOR",].includes(userData?.role as string) &&
                                <button onClick={() => { setIsDeleting(true); setSelectedUser(content); }}>
                                    <IconTrash className="h-5 w-5 text-red-500" />
                                </button>
                            }
                        </div>
                    )}
                />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div />
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
                        onClose={() => !isSending && setIsModalOpen(false)}
                        title={selectedUser ? `Send SMS to ${selectedUser.companyName}` : "Send Bulk SMS"}
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                className="input-normal w-full mb-4"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here"
                                maxLength={160}
                            />
                            <p className="text-sm text-gray-500">{message.length}/160 characters</p>
                        </div>

                        <button
                            className={`bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500 w-full ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleSendSMS}
                            disabled={isSending}
                        >
                            {isSending ? "Sending..." : "Send"}
                        </button>
                    </SMSModal>
                )}

                {
                    selectedUser && isDeleting === false &&
                    <PrivateTenderRequest onSuccess={refetch} bidder={selectedUser} />

                }
            </div>
        </div>
    );
}