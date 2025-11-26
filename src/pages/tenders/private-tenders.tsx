import { IconTrash, IconEye, IconEdit, IconFilter, IconRefresh, IconClockPlus, IconSquareCheck, IconSquare } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useTenders from "@/hooks/useTendersPrivate";
import usePopup from "@/hooks/usePopup";
import { deleteTenders, getCategories, requestDoForMe } from "@/services/tenders";
import { ITenders } from "@/types";
import columns from "./fragments/tenderColumns";
import PETenderCreateForm from "./fragments/PETenderCreateForm";
import Button from "@/components/button/Button";
import TenderViewModal from "./fragments/tenderViewModelNew";
import Chip from "@/components/chip/Chip";
import { useUserDataContext } from "@/providers/userDataProvider";
import TenderEdit from "./fragments/tenderEditForm";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./fragments/PaymentModel";
import { debounce, set } from "lodash";
import { getEntities } from "@/services/entities";
import Select from "react-select";
import useApiMutation from "@/hooks/useApiMutation";
import { Countdown } from "@/components/countdown/Countdown";
import { Clarifications } from "./fragments/Clarifications";

export default function PrivateTenders() {
    const [page, setPage] = useState<number>(0);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>({});
    const [selectedTender, setSelectedTender] = useState<ITenders | null>(null);
    const [editTender, setEditTender] = useState<ITenders | any>();
    const { showConfirmation } = usePopup();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEligible, setIsEligible] = useState(false);
    const [tempKeyword, setTempKeyword] = useState("");
    const [tempSearchType, setTempSearchType] = useState("title");
    const [tempSelectedEntity, setTempSelectedEntity] = useState(null);
    const [tempSelectedCategory, setTempSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDoItForMeLoading, setIsDoItForMeLoading] = useState(false);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<{ type: "create" | "update" | "delete" | "view" | null, tender: ITenders | null }>({ type: null, tender: null });


    const [isDetails, setIsDetails] = useState(true);
    const [isClarification, setIsClarification] = useState(false);
    const handleTabChange = (tab: string) => {
        if (tab === "DETAILS") {
            setIsDetails(true);
            setIsClarification(false);
        } else if (tab === "CLARIFICATION") {
            setIsDetails(false);
            setIsClarification(true);
        }
    }

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
        filter: filter,
        eligibility: isEligible
    });

    const { userData } = useUserDataContext();  // Use the hook to get user data
    const userRole = userData?.role || "BIDDER"; // Extract role from userData, defaulting to "BIDDER" if not found
    const subscriptionDays = userData?.subscription;

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

    const handleCloseModal = () => {
        setOpenModal({ type: null, tender: null });
    }

    // JCM Applicants List
    const openApplicantList = (content: ITenders) => {
        navigate(`/tenders/${content.id}/applicants`, { state: { tender: content } });
    }

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
                <h2 className="text-lg font-bold">Private Tenders</h2>
                {(userRole === "PUBLISHER" || userRole === "ADMINISTRATOR" || userRole === "PROCUREMENT_ENTITY") && (
                    <PETenderCreateForm
                        onSuccess={() => {
                            refetch();
                        }}
                    />
                )}
                {(userRole === "BIDDER") && (
                    <button onClick={() => topUpSubscription()}>
                        <IconClockPlus size={30} className="text-green-600" />
                    </button>
                )}
            </div>

            {isPaymentModalOpen && (
                <PaymentModal
                    onClose={() => setIsPaymentModalOpen(false)}
                />

            )}

            <TenderEdit
                open={openModal.type === "update"}
                initials={openModal.tender!}
                onSuccess={() => {
                    handleCloseModal();
                    refetch();
                }}
                onClose={handleCloseModal}
            />

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
                                className="w-full sm:w-[300px]"
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
                                className="w-full sm:w-[300px]"
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
                    {(userRole === "BIDDER") && (
                        <Button
                            type="button"
                            label="Elligible Tenders"
                            icon={isEligible ? <IconSquareCheck size={18} /> : <IconSquare size={18} />}
                            theme={isEligible ? "secondary" : "info"}
                            size="sm"
                            onClick={() => setIsEligible(!isEligible)} // Resets filters
                        />
                    )}
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
                                    onClick={() => setOpenModal({ type: "view", tender: content })}
                                >
                                    <IconEye size={20} />
                                </button>
                                {
                                    ["ADMINISTRATOR", "PUBLISHER", "PROCUREMENT_ENTITY"].includes(userRole) && (
                                        <>
                                        {
                                            new Date(content?.closeDate) < new Date() && userRole === "PROCUREMENT_ENTITY" ?
                                            "" :
                                            <Fragment>
                                                <button
                                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                                    onClick={() => setOpenModal({ type: "update", tender: content })}
                                                >
                                                    <IconEdit size={20} />
                                                </button>
                                            </Fragment>
                                        }
                                            <Fragment>

                                                <button
                                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                                    onClick={() => handleDelete(content)}
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

            <TenderViewModal
                isOpen={openModal.type === "view"}
                tender={openModal.tender ?? null}
                onClose={handleCloseModal}
                isLoading={isDoItForMeLoading}
                onDoItForMeClick={handleDoItForMeClick}
            />

        </div >
    )
}
