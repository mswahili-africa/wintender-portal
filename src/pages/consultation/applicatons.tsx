
import { useState } from "react";
import toast from "react-hot-toast";
import { Table } from "@/components/widgets/table/Table";
import columns from "./fragments/applicationColumns";
import { IConsultationApplication } from "@/types/forms";
import { IconTrash } from "@tabler/icons-react";
import usePopup from "@/hooks/usePopup";
import { useMutation } from "@tanstack/react-query";
import { deleteConsultMe } from "@/services/tenders";
import useConsultMeApplication from "@/hooks/useConsultMeApplication";
import Pagination from "@/components/widgets/table/Pagination";

export default function ConsultationApplication() {

    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>();
    const { showConfirmation } = usePopup();

    const { application, isLoading, refetch } = useConsultMeApplication({
        page: page,
        search: search,
        sort: sort,
        filter: filter, // Pass the appropriate filter value
    });


    const handleDelete = (content: IConsultationApplication) => {
        showConfirmation({
            theme: "danger",
            title: "Applicato Billboard",
            message: "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => deleteMutation.mutate(content),
            onCancel: () => { }
        })
    }

    const deleteMutation = useMutation({
        mutationFn: (data: IConsultationApplication) => deleteConsultMe(data.id),
        onSuccess: () => {
            toast.success("Application deleted successfully");
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "");
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Consultation Application</h2>
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

                <Table
                    columns={columns}
                    data={application?.content || []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={true}
                    actionSlot={(content: IConsultationApplication) => {
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
            {application?.pageable && (
                <Pagination
                    currentPage={page}
                    setCurrentPage={setPage}
                    pageCount={application.totalPages}
                />
            )}
        </div>
    );
}
