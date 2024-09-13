import { useState } from "react";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/role-columns";
import userRoles from "@/hooks/useRoles";


export default function() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();

    const { roles, isLoading } = userRoles({
        page: page,
        search: search,
        sort: sort,
        filter: filter
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Roles</h2>
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

                <Table 
                    columns={columns}
                    data={roles? roles.content : []}
                    isLoading={isLoading}
                    hasSelection={true}
                    hasActions={false}
                    onSorting={handleSorting}
                    actionSlot={(content: any) => {
                    return (
                        <div className="flex justify-center space-x-3">
                           
                        </div>
                    )
                }} />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>

                    {/* {
                        roles?.pageable &&
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={users.totalPages}
                            />
                    } */}
                </div>
            </div>
        </div>
    )
}