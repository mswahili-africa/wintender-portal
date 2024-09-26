import { useState } from "react";
import { debounce } from "lodash"; // Debouncing to reduce search input triggers
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useCategories from "@/hooks/useCategories";
import usePopup from "@/hooks/usePopup";
import columns from "./fragments/categoryColumns";
import CategoryCreate from "./fragments/categoryCreateForm";

export default function CategoryList() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<Record<string, any> | undefined>(undefined); // Set a specific type if possible
    const { showConfirmation } = usePopup();

    const { categories, isLoading, refetch } = useCategories({
        page,
        search,
        sort,
        filter
    });

    const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, 300);

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Categories</h2>
                <CategoryCreate onSuccess={() => refetch()} />
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input-normal py-2 w-1/2 lg:w-1/4"
                        onChange={handleSearchChange}
                    />
                </div>

                <Table
                    columns={columns}
                    data={categories?.content || []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={false}
                    onSorting={handleSorting}
                />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>

                    {categories?.pageable && (
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={categories.totalPages}
                        />
                    )}
                </div>
            </div>

            {/* Handle empty state */}
            {categories?.content?.length === 0 && !isLoading && (
                <div className="text-center p-4">
                    <p>No categories found.</p>
                </div>
            )}
        </div>
    );
}
