
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Table } from "@/components/widgets/table/Table";
import columns from "./fragments/columns";
import CategoryCreate from "./fragments/createForm";
import { IConsultation } from "@/types/forms";
import { IconTrash } from "@tabler/icons-react";
import usePopup from "@/hooks/usePopup";
import { useMutation } from "@tanstack/react-query";
import { deleteBillboard, getBillboards } from "@/services/tenders";

export default function Consultation() {
    const { showConfirmation } = usePopup();
    const [billboards, setBillboards] = useState<IConsultation[]>([]);
    const [billboardLoading, setBillboardLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchBillboards();
    }, []);

    const fetchBillboards = async () => {
        try {
            const data = await getBillboards();
            setBillboards(data); // ✅ only set the array part
        } catch (err) {
            console.error("Failed to fetch billboards", err);
        } finally {
            setBillboardLoading(false);
        }
    };

    const handleDelete = (content: IConsultation) => {
        showConfirmation({
            theme: "danger",
            title: "Delete Billboard",
            message: "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => deleteMutation.mutate(content),
            onCancel: () => { }
        })
    }

    const deleteMutation = useMutation({
        mutationFn: (data: IConsultation) => deleteBillboard(data.id),
        onSuccess: () => {
            fetchBillboards();
            toast.success("Billboard deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "");
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Consultation Billboards</h2>
                <CategoryCreate onSuccess={() => fetchBillboards()} />
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

                <Table
                    columns={columns}
                    data={billboards || []}
                    isLoading={billboardLoading}
                    hasSelection={false}
                    hasActions={true}
                    actionSlot={(content: IConsultation) => {
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
            {billboards?.length === 0 && !billboardLoading && (
                <div className="text-center p-4">
                    <p>No Billboards found.</p>
                </div>
            )}
        </div>
    );
}
