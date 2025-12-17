import { useState, useEffect } from "react";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import Pagination from "@/components/widgets/table/Pagination";
import columns from "./fragments/ErrorColumns";
import { useSystemLogs } from "@/hooks/useSystemDetails";
import Select from "react-select";

const options: any[] = [
    { value: "LOG", label: "Logs" },
    { value: "NOTIFICATION", label: "Notifications" },
    { value: "RATE_LIMIT", label: "Requests limit" },
    { value: "ERROR", label: "Errors" },
];


export default function SystemLogs() {
    const [page, setPage] = useState<number>(0);
    const [search] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>();
    const [tempSearchType, setTempSearchType] = useState<string>("ERROR");

    const { logs, isLoading, refetch } = useSystemLogs({
        page: page,
        search: search,
        sort: sort,
        filter: filter,
        logType: tempSearchType
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    // Refetch data whenever selectedMonth changes
    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold">System Logs</h3>

                <Select
                    className="w-1/3" 
                    options={options}
                    onChange={(selectedOption : any) => {
                        setTempSearchType(selectedOption?.value);
                    }}
                    value={tempSearchType}
                />
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <Table
                    columns={columns}
                    data={logs ? logs.content : []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={false}
                    onSorting={handleSorting}

                />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>
                    {
                        logs?.pageable &&
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={logs.totalPages}
                        />
                    }
                </div>
            </div>
        </div>
    );
}
