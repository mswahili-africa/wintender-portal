import { IconTrash, IconEye, IconEdit, IconClockPlus, IconFilter, IconRefresh, IconSquareCheck, IconSquare } from "@tabler/icons-react";
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
import Button from "@/components/button/Button";
import TenderViewModal from "./fragments/tenderViewModelNew";
import { useUserDataContext } from "@/providers/userDataProvider";
import TenderEdit from "./fragments/tenderEditForm";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../payments/fragments/PaymentModel";
import { debounce } from "lodash";
import { getEntities } from "@/services/entities";
import Select from "react-select";
import useApiMutation from "@/hooks/useApiMutation";
import PETenderCreateForm from "./fragments/PETenderCreateForm";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";

export default function InternationalTenders() {
    const [page, setPage] = useState<number>(0);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>({});
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
    const [openModal, setOpenModal] = useState<{ type: "create" | "update" | "delete" | "view" | null, tender: ITenders | null }>({ type: null, tender: null });
    const { t } = useTranslation();



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
        if (openModal.tender) {
            setIsDoItForMeLoading(true);
            doItForMeMutation.mutate(openModal.tender.id, {
                onSettled: () => {
                    setIsDoItForMeLoading(false);
                },
            });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">{t("tender-international-header")}</h2>
                {(userRole === "PUBLISHER" || userRole === "ADMINISTRATOR") && (
                    <PETenderCreateForm
                        onSuccess={() => {
                            refetch();
                        }}
                    />
                )}
                {(userRole === "BIDDER") && (
                    <Tooltip
                        content={t("tender-subscription-top-up-tooltip")}
                    >
                        <button onClick={() => topUpSubscription()}>
                            <IconClockPlus size={30} className="text-green-600" />
                        </button>
                    </Tooltip>
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
                    <Tooltip content={t("tender-filter-button-tooltip")}>
                        <Button
                            type="button"
                            label={t("tender-filter-button")}
                            icon={<IconFilter size={18} />}
                            theme="info"
                            size="sm"
                            onClick={handleSearch} // Triggers search
                        />
                    </Tooltip>
                    <Tooltip content={t("tender-search-reset-button-tooltip")}>
                        <Button
                            type="button"
                            label={t("tender-search-reset-button")}
                            icon={<IconRefresh size={18} />}
                            theme="warning"
                            size="sm"
                            onClick={handleReset} // Resets filters
                        />
                    </Tooltip>
                    {(userRole === "BIDDER") && (
                        <Tooltip content={t("tender-eligible-button-tooltip")}>
                            <Button
                                type="button"
                                label={t("tender-eligible-button")}
                                icon={isEligible ? <IconSquareCheck size={18} /> : <IconSquare size={18} />}
                                theme={isEligible ? "secondary" : "info"}
                                size="sm"
                                onClick={() => setIsEligible(!isEligible)} // Resets filters
                            />
                        </Tooltip>
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
                                <Tooltip content={t("tender-view-button-tooltip")}>
                                    <button
                                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                        onClick={() => setOpenModal({ type: "view", tender: content })}
                                    >
                                        <IconEye size={20} />
                                    </button>
                                </Tooltip>
                                {(userRole === "ADMINISTRATOR" || userRole === "PUBLISHER") && (
                                    <>
                                        <Fragment>
                                            <Tooltip content={t("tender-update-button-tooltip")}>
                                                <button
                                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-yellow-600"
                                                    onClick={() => setOpenModal({ type: "update", tender: content })}
                                                >
                                                    <IconEdit size={20} />
                                                </button>
                                            </Tooltip>
                                        </Fragment>
                                        <Fragment>
                                            <Tooltip content={t("tender-delete-button-tooltip")}>
                                                <button
                                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                                    onClick={() => handleDelete(content)}
                                                >
                                                    <IconTrash size={20} />
                                                </button>
                                            </Tooltip>
                                        </Fragment>
                                    </>
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

            <TenderViewModal
                isOpen={openModal.type === "view"}
                tender={openModal.tender ?? null}
                onClose={handleCloseModal}
                isLoading={isDoItForMeLoading}
                onDoItForMeClick={handleDoItForMeClick}
            />

        </div>
    )
}
