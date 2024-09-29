import { useState, useEffect } from "react";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import usePublisherPerfomance from "@/hooks/usePublisherPerfomance";
import Pagination from "@/components/widgets/table/Pagination";
import columns from "./fragments/perfomanceColumns";

// Define months for the dropdown (now as numbers)
const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
];

// Helper function to get the current month as a number (1-12)
const getCurrentMonth = () => {
    const now = new Date();
    return now.getMonth() + 1; // Return the month as a number (1-12)
};

export default function PublisherPerformance() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();
    const [selectedMonth, setSelectedMonth] = useState<number>(getCurrentMonth); // Default to current month as a number

    const { performance, isLoading, refetch } = usePublisherPerfomance({
        page: page,
        search: search,
        sort: sort,
        filter: filter,
        month: selectedMonth // Pass selected month as a number
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = Number(e.target.value); // Convert selected value to a number
        setSelectedMonth(newMonth);
    };

    // Refetch data whenever selectedMonth changes
    useEffect(() => {
        refetch();
    }, [selectedMonth, refetch]);

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Publisher Performance</h2>
                {/* Month Dropdown */}
                <select 
                    value={selectedMonth} 
                    onChange={handleMonthChange}
                    className="border border-gray-300 rounded-md p-2">
                    <option value="">Select Month</option>
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <Table 
                    columns={columns}
                    data={performance ? performance.content : []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={false}
                    onSorting={handleSorting}
                    actionSlot={(content: any) => (
                        <div className="flex justify-center space-x-3">
                            {/* Action slots */}
                        </div>
                    )}
                />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>
                    {
                        performance?.pageable &&
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={performance.totalPages}
                        />
                    }
                </div>
            </div>
        </div>
    );
}
