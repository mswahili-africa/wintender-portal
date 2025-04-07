
import { Fragment, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Pagination from "@/components/widgets/table/Pagination";
import { Table } from "@/components/widgets/table/Table";
import columns from "./fragments/columns";
import CategoryCreate from "./fragments/createForm";
import useBillboards from "@/hooks/useBillboards";
import { IBillboard } from "@/types/forms";
import { IconTrash } from "@tabler/icons-react";
import usePopup from "@/hooks/usePopup";
import { useMutation } from "@tanstack/react-query";
import { deleteBillboard } from "@/services/commons";

export default function Billboards() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<Record<string, any> | undefined>(undefined);
    const { showConfirmation } = usePopup();

    const { billboards, isLoading, refetch } = useBillboards({
        page,
        search,
        sort,
        filter
    });

    const handleDelete = (content: IBillboard) => {
        showConfirmation({
            theme: "danger",
            title: "Delete Billboard",
            message: "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => deleteMutation.mutate(content),
            onCancel: () => { }
        })
    }

    const deleteMutation = useMutation({
        mutationFn: (data: IBillboard) => deleteBillboard(data.id),
        onSuccess: () => {
            refetch();
            toast.success("Billboard deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.errors ?? "");
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Billboards</h2>
                <CategoryCreate onSuccess={() => refetch()} />
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

                <Table
                    columns={columns}
                    data={billboards || []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={true}
                    actionSlot={(content: IBillboard) => {
                        return (
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                    onClick={() => handleDelete(content)}
                                >
                                    <IconTrash size={20} />
                                </button>
                            </div>
                        );
                    }}
                />

            </div>

            {/* Handle empty state */}
            {billboards?.content?.length === 0 && !isLoading && (
                <div className="text-center p-4">
                    <p>No Billboards found.</p>
                </div>
            )}
        </div>
    );
}
