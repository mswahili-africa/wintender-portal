import React, { useState, useEffect, Fragment } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "react-medium-image-zoom/dist/styles.css";
import { ICategory, ICompany, ITenders } from "@/types";
import { IMessage } from "@/types/forms";
import { sendMessageSingle } from "@/services/commons";
import { IconEye, IconMessage, IconTrash } from "@tabler/icons-react";
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
import useApplicationsList from "@/hooks/useApplicationsList";
import Chip from "@/components/chip/Chip";
import Button from "@/components/button/Button";
import { updateBidderCategories } from "@/services/user";
import { IconX } from "@tabler/icons-react";
import { useUserData } from "@/hooks/useUserData";
import { IconEdit } from "@tabler/icons-react";
import UserProfile from "@/pages/users/_username";
import { WalletButton } from "@/components/button/WalletButton";
import columns from "@/pages/tenders/fragments/tenderColumns";
import useTenders from "@/hooks/useTenders";

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

    const [activeTab, setActiveTab] = useState<"requests" | "payments" | "eligible">("requests");

    const tabs = [
        { name: "Requests", value: "requests" },
        { name: "Payments", value: "payments" },
        { name: "Eligible Tenders", value: "eligible" },
    ];

    // const { userData } = useUserDataContext();  // Use the hook to get user data
    // const userRole = userData?.role || "BIDDER";

    // JCM  edit details
    const { userData } = useUserData();
    const [editDetails, setEditDetails] = useState<boolean>(false);

    // JCM category
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
    const [isChanged, setIsChanged] = useState(false);

    const addCategory = (category: ICategory) => {
        if (!selectedCategories.find((c) => c.id === category.id)) {
            setSelectedCategories([...selectedCategories, category]);
            setIsChanged(true); // ← Mark as changed
        }
    };

    const removeCategory = (category: ICategory) => {
        setSelectedCategories(prev =>
            prev.filter((c) => c.id !== category.id)
        );
        setIsChanged(true);
    };

    const availableOptions = categories
        .filter((cat) => !selectedCategories.find((sc) => sc.id === cat.id))
        .map((cat) => ({ value: cat.id, label: cat.name }));


    useEffect(() => {
        if (user?.companyCategories && categories.length > 0 && isOpen) {
            const initialSelected = categories.filter((cat) =>
                user.companyCategories.includes(cat.id)
            );
            setSelectedCategories(initialSelected);
            setIsChanged(false);
        }
    }, [user, categories, isOpen]);


    // JCM input style
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: state.isFocused ? 'green' : 'green',
            boxShadow: state.isFocused ? '0 0 0 1px green' : 'none',
            '&:hover': {
                borderColor: 'green',
            },
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#d1fae5'
                : state.isFocused
                    ? '#f0fdf4'
                    : 'white',
            color: 'black',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'black',
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 9999,
        }),
    };

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
                    size: 1000,
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

    const sendSMS = useMutation({
        mutationFn: (data: IMessage) => sendMessageSingle(data),
        /*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Callback function to be called when the mutation is successful
         * Will close the modal, reset the loading state and show a success toast
         */
        /*******  50bed3d9-7e01-41f7-a08c-df2ec70bb39e  *******/
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

    const updateCategoriesMutation = useMutation({
        mutationFn: (data: { id: string; categoryIds: string[] }) =>
            updateBidderCategories({ categoryIds: data.categoryIds }, data.id),
        onSuccess: () => {
            toast.success("Categories updated successfully");
            setIsChanged(false);
        },
        onError: () => {
            toast.error("Failed to update categories");
        },
    });

    // days left before expiration
    let daysLeft = Math.ceil((user.planExpiryDate - new Date().getTime()) / (1000 * 60 * 60 * 24));
    daysLeft = daysLeft < 0 ? 0 : daysLeft;


    // ELLIGIBLE TENDERS LOGIC
    const { getTenders, isLoading, refetch } = useTenders({
        page: page,
        sort: sort,
        categories: user.companyCategories,

    });

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
                                    <div className="flex flex-col">
                                        <div className="flex flex-col md:flex-row items-center gap-x-2">
                                            <span>
                                                <h4 className="lg:text-lg font-medium me-2">{user?.companyName?.toUpperCase()}</h4>
                                            </span> |
                                            <Chip
                                                label={`${daysLeft} days left`}
                                                size="sm"
                                                theme={daysLeft >= 2 ? "success" : "danger"}
                                                variant="outline"
                                            />
                                        </div>
                                        <h5 className="text-sm font-bold">{user?.account}</h5>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <WalletButton amount={user.walletAmount} />

                                    <button onClick={() => SendSingleSMS(user)}>
                                        <IconMessage size={24} className="text-green-500" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* JCM edit button */}
                        <div className="flex justify-end w-full">
                            {
                                userData?.role === "SUPERVISOR" && // Show edit button only for supervisors
                                <Button
                                    label={editDetails ? "Cancel Edit" : "Edit Details"}
                                    size="sm"
                                    icon={editDetails ? <IconX size={16} /> : <IconEdit size={16} />}
                                    theme="primary"
                                    onClick={() => setEditDetails(!editDetails)}
                                />
                            }
                        </div>

                    </section>
                </div>

                {
                    // JCM Show user details only if not SUPERVISOR
                    !editDetails &&
                    <>
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
                                    {/* {user.companyCategories && user.companyCategories.length > 0 && <p><strong>Categories:</strong> {selectedCategories.map((c) => c.name).join(", ")}</p>} */}
                                </div>

                            </div>
                        </div>



                        <div className="border-b border-zinc-200 text-sm text-zinc-400 pb-4">

                            <div className="space-y-4">
                                {/* JCM Edit categories only for supervisors */}
                                <div className="flex flex-row items-center justify-between">
                                    <strong className="uppercase w-1/2">Categories</strong>

                                </div>

                                <div>
                                    {/*JCM Selected Categories */}
                                    <div className="flex flex-col gap-2 mb-4">
                                        {selectedCategories.length === 0 ? (
                                            <span className="text-sm text-gray-400 my-10 w-full text-center">
                                                No categories
                                            </span>
                                        ) : (
                                            selectedCategories.map((category) => (
                                                <span
                                                    key={category.id}
                                                    className="flex items-center w-fit gap-1 px-3 py-1 text-black rounded-full text-sm"
                                                >
                                                    {category.name}
                                                    {/* <button
                                                            type="button"
                                                            onClick={() => removeCategory(category)}
                                                            className="text-red-500 hover:text-red-700 ml-2 text-xs"
                                                        >
                                                            <IconX size={16} />
                                                        </button> */}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {
                                    // JCM save button
                                    // isChanged && selectedCategories.length > 0 &&
                                    // <div className="w-full flex justify-center">
                                    //     <Button
                                    //         type="button"
                                    //         label={updateCategoriesMutation.isLoading ? "Updating..." : "Save"}
                                    //         size="md"
                                    //         theme="primary"
                                    //         loading={updateCategoriesMutation.isLoading}
                                    //         disabled={updateCategoriesMutation.isLoading}
                                    //         onClick={() => {
                                    //             const categoryIds = selectedCategories.map((cat) => cat.id);
                                    //             if (categoryIds.length > 0) {
                                    //                 updateCategoriesMutation.mutate({
                                    //                     id: user.id,
                                    //                     categoryIds,
                                    //                 });
                                    //             }
                                    //         }}
                                    //     />
                                    // </div>
                                }



                            </div>
                        </div>

                    </>
                }
                {/* JCM edit BIDDER profile*/}
                <div className="w-full">
                    {
                        editDetails && <UserProfile selectedUser={user} selectedLoading={false} />
                    }
                </div>



                <div className="w-full flex justify-center mt-8">
                    <div className="bg-gray-100 rounded-full p-1 flex shadow-md">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value as typeof activeTab)}
                                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300
              ${activeTab === tab.value
                                        ? "bg-green-600 text-white shadow"
                                        : "text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Tab Content */}
                <div className="tab-content mt-4">
                    {activeTab === "requests" &&
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
                    }


                    {activeTab === "payments" &&
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
                    }


                    {/* ELLIGIBLE TENDERS */}
                    {activeTab === "eligible" &&
                        <div className="container">
                            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                                <Table
                                    columns={columns}
                                    data={getTenders ? getTenders.content : []}
                                    isLoading={isLoading}
                                    hasSelection={false}
                                    hasActions={true}
                                    actionSlot={(content: ITenders) => {
                                        return (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                                // onClick={() => handleView(content)}
                                                >
                                                    <IconEye size={20} />
                                                </button>
                                                {
                                                    ["ADMINISTRATOR", "PUBLISHER", "PROCUREMENT_ENTITY"].includes(userData?.role!) && (
                                                        <><Fragment>

                                                            <button
                                                                className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                                            // onClick={() => handleEdit(content)}
                                                            >
                                                                <IconEdit size={20} />
                                                            </button>
                                                        </Fragment>
                                                            <Fragment>

                                                                <button
                                                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                                                // onClick={() => handleDelete(content)}
                                                                >
                                                                    <IconTrash size={20} />
                                                                </button>
                                                            </Fragment>

                                                        </>

                                                    )
                                                }
                                            </div>
                                        );
                                    }}
                                />

                                <div className="flex justify-between items-center p-4 lg:px-8">
                                    <div></div>

                                    {
                                        getTenders?.pageable &&
                                        <Pagination
                                            currentPage={page}
                                            setCurrentPage={setPage}
                                            pageCount={getTenders.totalPages}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    }

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
            </Modal >
        </>
    );
};

export default BidderProfileModal;
