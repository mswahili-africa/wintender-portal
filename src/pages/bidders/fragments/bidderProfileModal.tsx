import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "react-medium-image-zoom/dist/styles.css";
import { ICategory, ICompany, IContacts, ITenders } from "@/types";
import { IMessage } from "@/types/forms";
import { sendMessageSingle } from "@/services/commons";
import { IconAward, IconBrandWhatsapp, IconEye, IconFileText, IconListNumbers, IconLoader, IconMessage, IconSend } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import Modal from "@/components/Modal";
import { Table } from "@/components/widgets/table/Table";
import Pagination from "@/components/widgets/table/Pagination";
import paymentsColumns from "./paymentsColumns"
import dummyLogo from "@/assets/images/bidder-dummy-logo.png"
import { getUserPayments } from "@/hooks/usePayments";
import applicationColumns from "./applicationListColumns";
import useApplicationsList from "@/hooks/useApplicationsList";
import Chip from "@/components/chip/Chip";
import Button from "@/components/button/Button";
import { IconX } from "@tabler/icons-react";
import { useUserData } from "@/hooks/useUserData";
import { IconEdit } from "@tabler/icons-react";
import UserProfile from "@/pages/users/_username";
import { WalletButton } from "@/components/button/WalletButton";
import columns from "@/pages/tenders/fragments/tenderColumns";
import useTenders from "@/hooks/useTenders";
import TenderViewModal from "@/pages/tenders/fragments/tenderViewModelNew";
import useCategories from "@/hooks/useCategories";
import Loader from "@/components/spinners/Loader";
import GeneralSMSModal from "@/pages/messages/fragments/GeneralSmsModal";
import { ConversationModal } from "@/pages/messages/fragments/ConversationModal";

interface IProps {
    children?: React.ReactNode;
    user: ICompany;
    loading: boolean;
    zIndex?: number;
    onClose: () => void; // Add this to handle closing the modal from parent
}

const BidderProfileModal: React.FC<IProps> = ({ user, onClose, zIndex = 10 }) => {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ICompany | null>(null);
    // const [isSending, setIsSending] = useState<boolean>(false); // Loading state
    const [message, _] = useState<string>("");
    const [openModal, setOpenModal] = useState<{ type: "view" | "whatsapp" | null, tender: ITenders | null }>({ type: null, tender: null });

    const [activeTab, setActiveTab] = useState<"requests" | "payments" | "eligible">("requests");

    const tabs = [
        { name: "Do it for me", value: "requests" },
        { name: "Payments", value: "payments" },
        { name: "Eligible Tenders", value: "eligible" },
    ];


    const { categories, isLoading: categoryLoading } = useCategories({
        page: 0,
        size: 1000,
        search: "",
        filter: {},
    });

    // JCM  edit details
    const { userData } = useUserData();
    const [editDetails, setEditDetails] = useState<boolean>(false);

    // JCM category
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
    const contact: IContacts = {
        name: user?.companyName || "",
        phoneNumber: user?.companyPrimaryNumber || "",
        status: "",
        updatedAt: user?.updatedAt || 0,
    }

    if (!contact) return null;

    useEffect(() => {
        if (user?.companyCategories && categories?.content.length! > 0 && isOpen) {
            const initialSelected = categories?.content.filter((cat) =>
                user.companyCategories.includes(cat.id)
            );
            setSelectedCategories(initialSelected!);
        }
    }, [user, categories, isOpen]);

    const [searchParams, setSearchParams] = useSearchParams();

    // Get the userId from the user object passed in props
    const { payments, isLoading: paymentLoading } = getUserPayments({
        userId: user.id, // Pass the userId from the user object
        page: page,
        filter: { ...Object.fromEntries(searchParams) }, // Pass filter here
    });

    const { applicationList, isLoading: requestLoading } = useApplicationsList({
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
        sendSMS.mutate({ phoneNumber, message });
    };

    const sendSMS = useMutation({
        mutationFn: (data: IMessage) => sendMessageSingle(data),
        onSuccess: () => {
            toast.success("Sent successfully");
            setIsModalOpen(false); // Close modal on success
        },
        onError: () => {
            toast.error("Send failed");
        },
    });

    // days left before expiration
    let daysLeft = Math.ceil((user.planExpiryDate - new Date().getTime()) / (1000 * 60 * 60 * 24));
    daysLeft = daysLeft < 0 ? 0 : daysLeft;


    // ELLIGIBLE TENDERS LOGIC
    const { getTenders, isLoading } = useTenders({
        page: page,
        sort: sort,
        eligibility: true,
        bidderId: user.id,

    });

    return (
        <>
            <Modal
                isOpen={isOpen}
                size={"xl"}
                zIndex={zIndex}
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

                                    <button onClick={() => setOpenModal({ type: "whatsapp", tender: null })}>
                                        <IconBrandWhatsapp size={24} className="text-green-500" />
                                    </button>
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
                                    <p><strong>Phone:</strong> {user.companyPrimaryNumber}</p>
                                    <p><strong>Email:</strong> {user.companyEmail}</p>
                                    <p><strong>Plan:</strong> {user.currentPlanId}</p>
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
                        <div className="border-b border-zinc-200 text-sm  pb-5">

                            <div className="space-y-4">
                                {/* JCM Edit categories only for supervisors */}
                                <div className="flex flex-row items-center justify-between">
                                    <strong className="uppercase text-zinc-400 w-1/2">Do it for me</strong>

                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">

                                    {/* Total */}
                                    <div className="bg-white border border-gray-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                                                <IconListNumbers size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                    Total
                                                </p>
                                                <p className="text-md font-bold text-gray-800">
                                                    {applicationList?.summary?.total ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Requests */}
                                    <div className="bg-white border border-blue-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                                <IconFileText size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                    Requests
                                                </p>
                                                <p className="text-md font-bold text-gray-800">
                                                    {applicationList?.summary?.request ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* on progress */}
                                    <div className="bg-white border border-green-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                <IconLoader size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                    On progress
                                                </p>
                                                <p className="text-md font-bold text-gray-800">
                                                    {applicationList?.summary?.open ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submitted */}
                                    <div className="bg-white border border-green-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-green-100 text-green-600">
                                                <IconSend size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                    Submitted
                                                </p>
                                                <p className="text-md font-bold text-gray-800">
                                                    {applicationList?.summary?.submitted ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Awarded */}
                                    <div className="bg-white border border-emerald-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                                                <IconAward size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                    Awarded
                                                </p>
                                                <p className="text-md font-bold text-gray-800">
                                                    {applicationList?.summary?.awarded ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cancelled */}
                                    <div className="bg-white border border-red-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-red-100 text-red-600">
                                                <IconX size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                                    Cancelled
                                                </p>
                                                <p className="text-md font-bold text-gray-800">
                                                    {applicationList?.summary?.canceled ?? 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                                        {
                                            categoryLoading ? (
                                                <Loader />
                                            ) : selectedCategories.length === 0 ? (
                                                <span className="text-sm text-gray-400 my-10 w-full text-center">
                                                    No categories
                                                </span>
                                            ) : (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {selectedCategories.map((category, index) => {
                                                        const formattedName = category.name
                                                            .toLowerCase()
                                                            .replace(/\b\w/g, (char) => char.toUpperCase());

                                                        return (
                                                            <React.Fragment key={category.id}>
                                                                <span className="flex items-center w-fit gap-1 px-3 py-1 text-black bg-green-100 border-green-500 border-2 rounded-full text-sm">
                                                                    {formattedName}
                                                                </span>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                            )
                                        }

                                    </div>
                                </div>



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
                    {activeTab === "payments" &&
                        <div className="container">
                            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                                <Table
                                    columns={paymentsColumns}
                                    loading={paymentLoading}
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

                    {/* REQUESTS */}
                    {activeTab === "requests" &&
                        <div className="container">
                            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                                <Table
                                    columns={applicationColumns}
                                    loading={requestLoading}
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
                                    hasActions={!["BIDDER", "PROCUREMENT_ENTITY"].includes(userData?.role!)}
                                    actionSlot={(content: ITenders) => {
                                        return (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                                    onClick={() => setOpenModal({ type: "view", tender: content })}
                                                >
                                                    <IconEye size={20} />
                                                </button>
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


                <GeneralSMSModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    title={"Send message"}
                />


                {
                    openModal.tender && (
                        <TenderViewModal
                            isOpen={openModal.type === "view"}
                            tender={openModal.tender}
                            onClose={() => setOpenModal({ tender: null, type: null })}
                            isLoading={false}
                            onDoItForMeClick={function (): void {
                                throw new Error("Function not implemented.");
                            }}
                        />
                    )
                }

                {/* Whatsapp conversation */}
                <ConversationModal
                    open={openModal.type === "whatsapp"}
                    onClose={() => setOpenModal({ tender: null, type: null })}
                    contact={contact}
                />

            </Modal >
        </>
    );
};

export default BidderProfileModal;
