import { useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { useUserDataContext } from "@/providers/userDataProvider";
import useCompanyPlans from "@/hooks/useCompanyPlans";
import { IconPlus } from "@tabler/icons-react";
import Button from "@/components/button/Button";
import SubscriptionPlanFormModal from "./fragments/SubscriptionPlanFormModal";

export default function SubscriptionPlans() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();
    const [showModal, setShowModal] = useState<{ open: "subscriptionForm"|null; object: any }>({ open: null, object: null });

    const handleModalClose = () => setShowModal({ open: null, object: null });

    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";

    const { companyPlans, isLoading, refetch } = useCompanyPlans({
        page: page,
        search: search,
        sort: sort,
        filter: filter,
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };


    return (

        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-semibold">Subscription Plans</h2>
                {["ADMINISTRATOR", "SUPERVISOR", "CUSTOMER_RELATIONSHIP_MANAGER", "PUBLISHER"].includes(userRole) && (
                    <Button
                        type="button"
                        label="Subscription Plan"
                        icon={<IconPlus size={18} />}
                        theme="primary"
                        size="md"
                        onClick={() => {
                            setShowModal({ open: "subscriptionForm", object: null });
                        }}
                    />
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
                {/* <Table
                    columns={null}
                    data={companyPlans ? companyPlans.content : []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={false}
                    onSorting={handleSorting}
                    actionSlot={(content: any) => { }}
                /> */}

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>
                    {companyPlans?.pageable && (
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={companyPlans.totalPages}
                        />
                    )}
                </div>

                <SubscriptionPlanFormModal open={showModal.open === "subscriptionForm"} onClose={handleModalClose} onSuccess={() => refetch()} />
            </div>
        </div>
    );
}
