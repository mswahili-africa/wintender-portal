import { useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/plan-columns";
import { getUserRole } from "@/utils";
import useCompanyPlans from "@/hooks/useCompanyPlans";
import ContractModal from "./fragments/contract-model";

export default function CompanyPlans() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();

    const userRole = getUserRole();

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
        <h2 className="text-lg font-semibold">Plans</h2>
        {(userRole === "PUBLISHER" || userRole === "ADMINISTRATOR") && (
                    <ContractModal
                        onSuccess={() => {
                            refetch();
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
            <Table
                columns={columns}
                data={companyPlans ? companyPlans.content : []}
                isLoading={isLoading}
                hasSelection={false}
                hasActions={false}
                onSorting={handleSorting}
                actionSlot={(content: any) => { }}
            />

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
        </div>
        </div>
    );
}
