import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useEntity from "@/hooks/useEntities";
import { IEntity } from "@/types";
import { IconBallpen } from "@tabler/icons-react";
import { useState } from "react";
import columns from "./fragments/entityColumns";
import VendorForm from "./fragments/entityForm";

export default function () {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();
    const [update, setUpdate] = useState<IEntity>();
    const { entities, isLoading, refetch } = useEntity({
        page: page,
        search: search,
        sort: sort,
        filter: filter
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    }

    return (
        
        <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <input
                    type="text"
                    placeholder="Search"
                    className="input-normal py-2 w-1/2 lg:w-1/4"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <VendorForm
                    initials={update}
                    onSuccess={() => {
                        setUpdate(undefined);
                        refetch();
                    }}
                />
            </div>

            <Table
                columns={columns}
                data={entities ? entities.content : []}
                isLoading={isLoading}
                hasSelection={true}
                hasActions={false}
                onSorting={handleSorting}
                actionSlot={(content: IEntity) => {
                    return (
                        <div className="flex justify-center space-x-3">

                            <button
                                className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                onClick={() => setUpdate(content)}>
                                <IconBallpen size={20} />
                            </button>
                        </div>
                    )
                }} />

            <div className="flex justify-between items-center p-4 lg:px-8">
                <div></div>

                {
                    entities?.pageable &&
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        pageCount={entities.totalPages}
                    />
                }
            </div>
        </div>
    )

}