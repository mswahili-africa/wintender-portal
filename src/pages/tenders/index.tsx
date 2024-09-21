import { IconTrash, IconEye, IconDownload } from "@tabler/icons-react"; // Import the view icon
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useTenders from "@/hooks/useTenders";
import usePopup from "@/hooks/usePopup";
import { downloadTenderDocument, deleteTenders } from "@/services/tenders";
import { ITenders } from "@/types";
import columns from "./fragments/tenderColumns";
import TenderCreateForm from "./fragments/tenderCreateForm";
import Button from "@/components/button/Button";
import TenderViewModal from "./fragments/tenderViewModel"; // Assuming you have a modal component
import Chip from "@/components/chip/Chip";

export default function TendersTable() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>();
    const [activeDownload, setActiveDownload] = useState<string>("");
    const [selectedTender, setSelectedTender] = useState<ITenders | null>(null); // State to manage selected tender for viewing
    const { showConfirmation } = usePopup();
    const { getTenders, isLoading, refetch } = useTenders({
        page: page,
        search: search,
        sort: sort,
        filter: filter
    });

    const viewReceipt = async (
        payload: ITenders
      ) => {
        const url = `${payload.id}`;
        window.open(url, "_blank");
      };

    const downloadMutation = useMutation({
        mutationFn: (data: ITenders) => downloadTenderDocument(data.id),
        onSuccess: (data, variable, context) => {
            const url = URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${activeDownload}.pdf`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.errors ?? "");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (data: ITenders) => deleteTenders(data.id, data.status, true),
        onSuccess: (res) => {
            refetch();
            toast.success("Tender deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.errors ?? "");
        }
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    }

    const handleDelete = (content: ITenders) => {
        showConfirmation({
            theme: "danger",
            title: "Delete Tender",
            message: "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => deleteMutation.mutate(content),
            onCancel: () => { }
        })
    }

    const handleView = (content: ITenders) => {
        setSelectedTender(content); // Set the selected tender to display in the modal
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Tender</h2>

                <TenderCreateForm onSuccess={() => refetch()} />
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input-normal py-2 w-1/2 lg:w-1/4"
                        onChange={(e) => setSearch(e.target.value)} />
                </div>

                <Table
                    columns={columns}
                    data={getTenders ? getTenders.content : []}
                    isLoading={isLoading}
                    hasSelection={true}
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(content: ITenders) => {
                        return (
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                    onClick={() => { setActiveDownload(content.referenceNumber); downloadMutation.mutate(content) }}
                                >
                                    {downloadMutation.isLoading && content.referenceNumber == activeDownload
                                        ? <span className="loader" /> // Show a loader if download is in progress
                                        : <IconDownload size={20} />
                                    }
                                </button>
                                <button
                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                    onClick={() => handleView(content)}
                                >
                                    <IconEye size={20} />
                                </button>
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

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>

                    {
                        getTenders?.pageable &&
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={getTenders.totalPages}
                        />
                    }
                </div>
            </div>

            {selectedTender && (
                <TenderViewModal title={selectedTender.tenderNumber} onClose={() => setSelectedTender(null)}>
                    <div className="space-y-4">
                        {/* Tender Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{selectedTender.title}</h3>
                        </div>

                        {/* Tender Details */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <p className="flex-1">{selectedTender.entity.name}</p>
                            </div>
                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Type:</strong>
                                <p className="flex-1">{selectedTender.tenderType}</p>
                            </div>
                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Category:</strong>
                                <p className="flex-1">{selectedTender.category.name}</p>
                            </div>

                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Close Date:</strong>
                                <p className="flex-1">{new Date(selectedTender.closeDate).toLocaleString()}</p>
                            </div>

                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Status:</strong>
                                <Chip
                                    label={(() => {
                                        const currentDate = new Date().getTime();
                                        const closeDate = selectedTender.closeDate;
                                        const remainingTime = closeDate - currentDate;
                                        const remainingDays = remainingTime / (1000 * 60 * 60 * 24); // Convert ms to days

                                        return remainingDays <= 7 ? 'CLOSING' : selectedTender.status;
                                    })()}
                                    size="sm"
                                    theme={(() => {
                                        const currentDate = new Date().getTime();
                                        const closeDate = selectedTender.closeDate;
                                        const remainingTime = closeDate - currentDate;
                                        const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

                                        return remainingDays <= 7 ? 'warning' : 'success';
                                    })()}
                                />
                            </div>
                            <br></br>
                            <hr></hr>

                            <div className="flex items-center">
                                <p className="flex-1">{selectedTender.summary}</p>
                            </div>
                        </div>

                        <hr></hr>

                        {/* Modal Footer with Actions */}
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                onClick={() => downloadTenderDocument(selectedTender.filePath)}
                            >
                                <IconDownload size={35} />
                            </button>
                        </div>
                    </div>
                </TenderViewModal>
            )}


        </div>
    )
}
