
import { IconEye } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/widgets/table/Pagination";
import { SortDirection, Table } from "../../components/widgets/table/Table";
import useProducts from "../../hooks/useTenders";
import { IProduct } from "../../types";
import columns from "./fragments/tenderColumns";

export default function() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();
    const { products, isLoading } = useProducts({
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
            <h2 className="text-lg font-bold mb-10">Tenders</h2>
            
            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <input 
                        type="text" 
                        placeholder="Search by serial"
                        className="input-normal py-2 w-1/2 lg:w-1/4"
                        onChange={(e) => setSearch(e.target.value)} />
                </div>
                
                <Table 
                    columns={columns}
                    data={products ? products.content : []}
                    isLoading={isLoading}
                    hasSelection={true}
                    hasActions={false}
                    onSorting={handleSorting}
                    actionSlot={(content: IProduct) => {
                    return (
                        <div className="flex justify-center space-x-3">
                            <Link to={`/products/${content.serial}`} className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600">
                                <IconEye size={20} />
                            </Link>
                        </div>
                    )
                }} />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>

                    {
                        products?.pageable &&
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={products.totalPages}
                            />
                    }
                </div>
            </div>
        </div>
    )
}