import { Fragment, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { useUserDataContext } from "@/providers/userDataProvider";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import Button from "@/components/button/Button";
import SubscriptionPlanFormModal from "./fragments/SubscriptionPlanFormModal";
import { useSubscriptionPlans } from "@/hooks/usePayments";
import subscriptionColumns from "./fragments/subscription-columns";
import SubscriptionBenefitFormModal from "./fragments/SubscriptionBenefitFormModal";
import { t } from "i18next";
import Tooltip from "@/components/tooltip/Tooltip";
import { set } from "lodash";
import usePopup from "@/hooks/usePopup";
import { useMutation } from "@tanstack/react-query";
import { deleteSubscriptionPlan } from "@/services/payments";
import toast from "react-hot-toast";
import { ISubscriptionPlan } from "@/types";

export default function SubscriptionPlans() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>();
    const { showConfirmation } = usePopup();
    const [showModal, setShowModal] = useState<{ open: "subscriptionForm" | "subscriptionBenefitForm" | "deletePlan" | null; object: any }>({ open: null, object: null });

    const handleModalClose = () => setShowModal({ open: null, object: null });

    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";

    const { subscriptionPlans, isLoading, refetch } = useSubscriptionPlans({});

    const deletePlanMutation = useMutation({
        mutationFn: (data: string) => deleteSubscriptionPlan(data),
        onSuccess: () => {
            toast.success("Delete successfully");
            handleModalClose() // Close modal on success
            refetch();
        },
        onError: () => {
            toast.error("Failed to delete");
        },
    });

    const handleDeletePlan = (plan: ISubscriptionPlan) => {
        showConfirmation({
            theme: "danger",
            title: "Delete this subscription plan?",
            message:
                "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => {
                deletePlanMutation.mutate(plan.id!);
            },
            onCancel: () => {
                handleModalClose();
            },
        });
    };

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    return (

        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-semibold">Subscription Plans</h2>
                {["ADMINISTRATOR", "SUPERVISOR", "MANAGER", "CUSTOMER_RELATIONSHIP_MANAGER", "PUBLISHER"].includes(userRole) && (
                    <div className="flex space-x-4">
                        <Button
                            type="button"
                            label="Subscription Benefit"
                            icon={<IconPlus size={18} />}
                            theme="primary"
                            size="sm"
                            onClick={() => {
                                setShowModal({ open: "subscriptionBenefitForm", object: null });
                            }}
                        />
                        <Button
                            type="button"
                            label="Subscription Plan"
                            icon={<IconPlus size={18} />}
                            theme="primary"
                            size="sm"
                            onClick={() => {
                                setShowModal({ open: "subscriptionForm", object: null });
                            }}
                        />

                    </div>
                )}
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input-normal py-2 w-1/2 lg:w-1/4"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Table
                    columns={subscriptionColumns}
                    data={subscriptionPlans ? subscriptionPlans : []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(content: any) => {
                        return (
                            <>
                                <Fragment>
                                    <Tooltip content={'Edit this plan'}>
                                        <button
                                            className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                            onClick={() => setShowModal({ open: "subscriptionForm", object: content })}
                                        >
                                            <IconEdit size={20} />
                                        </button>
                                    </Tooltip>
                                </Fragment>
                                <Fragment>
                                    <Tooltip content={'Delete this plan'}>
                                        <button
                                            className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                            onClick={() => handleDeletePlan(content)}
                                        >
                                            <IconTrash size={20} />
                                        </button>
                                    </Tooltip>
                                </Fragment>
                            </>
                        )
                    }}
                />

                {/* <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>
                    {subscriptionPlans?.pageable && (
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={subscriptionPlans.totalPages}
                        />
                    )}
                </div> */}

                <SubscriptionPlanFormModal open={showModal.open === "subscriptionForm"} onClose={handleModalClose} initials={showModal.object} refresh={() => refetch()} />
                <SubscriptionBenefitFormModal open={showModal.open === "subscriptionBenefitForm"} onClose={handleModalClose} />
            </div>
        </div>
    );
}
