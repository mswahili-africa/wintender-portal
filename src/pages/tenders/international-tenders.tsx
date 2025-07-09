import { IconTrash, IconEye, IconEdit, IconCalendarPlus, IconFilter, IconRefresh } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useTenders from "@/hooks/useTendersInternational";
import usePopup from "@/hooks/usePopup";
import { deleteTenders, getCategories, requestDoForMe } from "@/services/tenders";
import { ITenders } from "@/types";
import columns from "./fragments/tenderColumns";
import TenderCreateForm from "./fragments/tenderCreateForm";
import Button from "@/components/button/Button";
import TenderViewModal from "./fragments/tenderViewModel";
import Chip from "@/components/chip/Chip";
import { useUserDataContext } from "@/providers/userDataProvider";
import TenderEdit from "./fragments/tenderEditForm";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./fragments/PaymentModel";
import { USSDPushEnquiry, USSDPushRequest } from "@/services/payments";
import { Puff } from "react-loader-spinner";
import { debounce } from "lodash";
import { getEntities } from "@/services/entities";
import Select from "react-select";
import useApiMutation from "@/hooks/useApiMutation";

export default function InternationalTenders() {
    const [page, setPage] = useState<number>(0);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>({});
    const [selectedTender, setSelectedTender] = useState<ITenders | null>(null);
    const [editTender, setEditTender] = useState<ITenders | any>();
    const { showConfirmation } = usePopup();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [isLoadingEnquiry, setIsLoadingEnquiry] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [tempKeyword, setTempKeyword] = useState("");
    const [tempSearchType, setTempSearchType] = useState("title");
    const [tempSelectedEntity, setTempSelectedEntity] = useState(null);
    const [tempSelectedCategory, setTempSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDoItForMeLoading, setIsDoItForMeLoading] = useState(false);

    const [paymentDetails, setPaymentDetails] = useState({
        planId: "66698e3f39cbe2504dd54c57",
        period: 1,
        phoneNumber: "",
        paymentReason: "SUBSCRIPTION"
    });

    const handleSearch = () => {
        setSearchQuery(generateSearchQuery());
    };

    const generateSearchQuery = () => {
        if (tempSearchType === "title") return `title-${tempKeyword}`;
        if (tempSearchType === "entity") return `entity-${tempSelectedEntity}`;
        if (tempSearchType === "category") return `category-${tempSelectedCategory}`;
        return "";
    };

    const handleReset = () => {
        setTempSearchType("title");
        setTempKeyword("");
        setTempSelectedEntity(null);
        setTempSelectedCategory(null);
        setSearchQuery("");
    };

    const { getTenders, isLoading, refetch } = useTenders({
        page: page,
        search: searchQuery,
        sort: sort,
        filter: filter
    });

    const { userData } = useUserDataContext();  // Use the hook to get user data
    const userRole = userData?.role || "BIDDER"; // Extract role from userData, defaulting to "BIDDER" if not found
    const subscriptionDays = userData?.subscription;

    const navigate = useNavigate();

    useEffect(() => {
        if (subscriptionDays !== undefined && subscriptionDays < 1) {
            showConfirmation({
                theme: "danger",
                title: "Your subscription has expired",
                message: "Hello, Your Monthly Subscription has EXPIRED. Make PAYMENT NOW to Catch Up with more Opportunities. For Assistance Contact us 0736 228228",
                onConfirm: () => {
                    // Open payment modal when confirm is clicked
                    setIsPaymentModalOpen(true);
                },
                onCancel: () => {
                    // Redirect to home page when cancelled
                    navigate("/");  // Redirect to home page
                }
            });
        }
    }, [subscriptionDays, navigate]);

    const paymentMutation = useMutation({
        mutationFn: (paymentData: { planId: string, period: number, phoneNumber: string, paymentReason: string }) => USSDPushRequest(paymentData),
        onSuccess: (data) => {
            setPaymentId(data.id);  // Store the payment ID from the response
            setIsLoadingEnquiry(true); // Start loading while enquiry is in progress
            startEnquiry(data.id);  // Start the enquiry API calls
        },
        onError: (error) => {
            toast.error("Payment failed: " + error);
        }
    });

    const startEnquiry = (id: string) => {
        let attemptCount = 0;
        const intervalId = setInterval(async () => {
            try {
                const response = await USSDPushEnquiry(id);
                // Check if response is successful
                if (response.code === "SUCCESS") {
                    toast.success("Payment confirmed.");
                    setIsLoadingEnquiry(false);  // Stop loader if payment is confirmed
                    clearInterval(intervalId);
                    navigate("/");
                }
            } catch (error) {
                toast.error("Error checking payment status.");
            }

            attemptCount += 1;
            if (attemptCount >= 5) {
                setIsLoadingEnquiry(false);  // Stop loader after 5 attempts
                clearInterval(intervalId);  // Stop after 5 attempts
                window.location.reload();
            }
        }, 5000);  // 5-second interval
    };

    const doItForMeMutation = useApiMutation(async (tenderId: string) => requestDoForMe(tenderId));

    const deleteMutation = useMutation({
        mutationFn: (data: ITenders) => deleteTenders(data.id),
        onSuccess: () => {
            refetch();
            toast.success("Tender deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "");
        }
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    }

    const handleDelete = (content: ITenders) => {
        showConfirmation({
            theme: "danger",
            title: "Delete Tender",
            message: "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => deleteMutation.mutate(content),
            onCancel: () => { }
        })
    }

    const fetchCategories = useCallback(async (search = "") => {
        if (!search) {
            setCategories([]);
            return;
        }

        setLoading(true);
        try {
            const allEntities = await getCategories({ page: 0, size: 5, search });
            setCategories(allEntities.content.map(e => ({ value: e.id, label: e.name.toUpperCase() })));
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetchCategory = useCallback(
        debounce((inputValue) => {
            if (inputValue.length >= 3) { // Only fetch if 5 or more characters
                fetchCategories(inputValue);
            } else {
                setCategories([]); // Clear entities if less than 5 characters
            }
        }, 5),
        [fetchCategories]
    );

    const fetchEntities = useCallback(async (search = "") => {
        if (!search) {
            setEntities([]);
            return;
        }

        setLoading(true);
        try {
            const allEntities = await getEntities({ page: 0, size: 5, search });
            setEntities(allEntities.content.map(e => ({ value: e.id, label: e.name.toUpperCase() })));
        } catch (error) {
            console.error("Failed to fetch entities", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetchEntities = useCallback(
        debounce((inputValue) => {
            if (inputValue.length >= 3) { // Only fetch if 5 or more characters
                fetchEntities(inputValue);
            } else {
                setEntities([]); // Clear entities if less than 5 characters
            }
        }, 5),
        [fetchEntities]
    );

    const handleView = (content: ITenders) => {
        setSelectedTender(content);
    }

    const handleEdit = (content: ITenders) => {
        setEditTender(content);
    }

    const handleEditModalClose = () => {
        setEditTender(undefined);
    };

    const topUpSubscription = () => {
        setIsPaymentModalOpen(true);
    };

    const handleDoItForMeClick = () => {
        if (selectedTender) {
            setIsDoItForMeLoading(true);
            doItForMeMutation.mutate(selectedTender.id, {
                onSettled: () => {
                    setIsDoItForMeLoading(false);
                },
            });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">International Tenders</h2>
                {(userRole === "PUBLISHER" || userRole === "ADMINISTRATOR") && (
                    <TenderCreateForm
                        onSuccess={() => {
                            refetch();
                        }}
                    />
                )}
                {(userRole === "BIDDER") && (
                    <button onClick={() => topUpSubscription()}>
                        <IconCalendarPlus size={30} className="text-green-600 blink-shadow" />
                    </button>
                )}
            </div>

            {isPaymentModalOpen && (
                <PaymentModal
                    paymentDetails={paymentDetails}
                    setPaymentDetails={setPaymentDetails}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSubmit={() => paymentMutation.mutate(paymentDetails)}
                >
                    {/* Show loader and message when enquiry is in progress */}
                    {isLoadingEnquiry && (
                        <div className="flex justify-center items-center mt-4">
                            <Puff
                                height="60"
                                width="60"
                                radius="1"
                                color="green"
                                ariaLabel="loading"
                                visible={isLoadingEnquiry}
                            />
                            <p className="mt-4">Please check your phone and accept payment by entering your password.</p>
                        </div>
                    )}
                </PaymentModal>
            )}

            {editTender ? (
                <TenderEdit
                    initials={editTender}
                    onSuccess={() => {
                        setEditTender(null);
                        refetch();
                    }}
                    onClose={handleEditModalClose}
                />
            ) : null}

            <div className="flex justify-between items-center border-b border-slate-200">
                <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
                    {/* Search Type Dropdown */}
                    <div className="mb-2">
                        <Select
                            options={[
                                { value: "title", label: "Title" },
                                { value: "entity", label: "Entity" },
                                { value: "category", label: "Category" },
                            ]}
                            onChange={(selectedOption) => setTempSearchType(selectedOption?.value || "title")}
                            placeholder="Filter by"
                        />
                    </div>

                    {/* Conditional Inputs */}
                    {tempSearchType === "entity" && (
                        <div className="mb-2">
                            <Select
                                options={entities}
                                onInputChange={(inputValue) => debouncedFetchEntities(inputValue)}
                                onChange={(selectedOption) => setTempSelectedEntity(selectedOption?.value)}
                                isLoading={loading}
                                placeholder="Type..."
                            />
                        </div>
                    )}

                    {tempSearchType === "category" && (
                        <div className="mb-2">
                            <Select
                                options={categories}
                                onInputChange={(inputValue) => debouncedFetchCategory(inputValue)}
                                onChange={(selectedOption) => setTempSelectedCategory(selectedOption?.value)}
                                isLoading={loading}
                                placeholder="Type..."
                            />
                        </div>
                    )}

                    {tempSearchType === "title" && (
                        <div className="mb-2">
                            <input
                                type="text"
                                onChange={(e) => setTempKeyword(e.target.value)}
                                className="input-normal w-full px-3 border rounded-md"
                                placeholder="Type..."
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <Button
                        type="button"
                        label="Filter"
                        icon={<IconFilter size={18} />}
                        theme="info"
                        size="sm"
                        onClick={handleSearch} // Triggers search
                    />
                    <Button
                        type="button"
                        label="Reset"
                        icon={<IconRefresh size={18} />}
                        theme="warning"
                        size="sm"
                        onClick={handleReset} // Resets filters
                    />
                </div>

            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

                <Table
                    columns={columns}
                    data={getTenders ? getTenders.content : []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(content: ITenders) => {
                        return (
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                    onClick={() => handleView(content)}
                                >
                                    <IconEye size={20} />
                                </button>
                                {(userRole === "ADMINISTRATOR" || userRole === "PUBLISHER") && (
                                    <><Fragment>

                                        <button
                                            className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                            onClick={() => handleEdit(content)}
                                        >
                                            <IconEdit size={20} />
                                        </button>
                                    </Fragment>
                                        <Fragment>

                                            <button
                                                className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                                onClick={() => handleDelete(content)}
                                            >
                                                <IconTrash size={20} />
                                            </button>
                                        </Fragment></>
                                )}
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

            {selectedTender && (
                <TenderViewModal
                    selfApply={selectedTender.selfApply}
                    title={selectedTender.tenderNumber}
                    tenderId={selectedTender.id}
                    onClose={() => setSelectedTender(null)}
                    isLoading={isDoItForMeLoading}
                    onDoItForMeClick={handleDoItForMeClick}
                >
                    <div className="space-y-4">
                        {/* Tender Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{selectedTender.title}</h3>
                        </div>

                        {/* Tender Details */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <p className="flex-1">{selectedTender.entityName}</p>
                            </div>
                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Category:</strong>
                                <p className="flex-1">{selectedTender.categoryName}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="flex-1">{selectedTender.summary}</p>
                            </div>

                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Status:</strong>
                                <Chip label={(() => {
                                    const currentDate = new Date().getTime();
                                    const closeDate = selectedTender.closeDate;
                                    const remainingTime = closeDate - currentDate;
                                    const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

                                    if (remainingDays < 0) {
                                        return 'CLOSED';
                                    } else if (remainingDays <= 2) {
                                        return 'CLOSING';
                                    } else {
                                        return selectedTender.status;
                                    }
                                })()} size="sm" theme="success" />
                            </div>
                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Close Date:</strong>
                                <p className="flex-1">{new Date(selectedTender.closeDate).toLocaleString()}</p>
                            </div>
                            {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") && (
                                <><div className="flex items-center">
                                    <strong className="w-50 text-gray-600">Consultation Fee:</strong>
                                    <p className="flex-1">
                                        TZS {new Intl.NumberFormat().format(selectedTender.consultationFee)}
                                    </p>
                                </div></>

                            )}
                        </div>

                        <hr></hr>

                        {/* PDF Viewer */}
                        <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <iframe
                                src={selectedTender.filePath}
                                width="100%"
                                height="500px"
                                frameBorder="0"
                                title="Tender Document"
                            ></iframe>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button label="Close" size="sm" theme="danger" onClick={() => setSelectedTender(null)} />
                        </div>
                    </div>
                </TenderViewModal>
            )}

        </div>
    )
}
