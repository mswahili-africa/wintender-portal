import { IconTrash, IconEye, IconEdit } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useTenders from "@/hooks/useTendersGovernment";
import usePopup from "@/hooks/usePopup";
import { deleteTenders, requestDoForMe } from "@/services/tenders";
import { ITenders } from "@/types";
import columns from "./fragments/tenderColumns";
import TenderCreateForm from "./fragments/tenderCreateForm";
import Button from "@/components/button/Button";
import TenderViewModal from "./fragments/tenderViewModel";
import Chip from "@/components/chip/Chip";
import { getUserRole } from "@/utils";
import TenderEdit from "./fragments/tenderEditForm";

export default function GovernmentTenders() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>({});
    const [selectedTender, setSelectedTender] = useState<ITenders | null>(null);
    const [editTender, setEditTender] = useState<ITenders | any>();
    const { showConfirmation } = usePopup();
    const { getTenders, isLoading, refetch } = useTenders({
        page: page,
        search: search,
        sort: sort,
        filter: filter
    });


    const doItForMeMutation = useMutation({
        mutationFn: async (tenderId: string) => requestDoForMe(tenderId),
        onSuccess: () => {
            toast.success("Request processed successfully!");
        },
        onError: (error: any) => {
            toast.error(error.message ?? "Failed to process request");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (data: ITenders) => deleteTenders(data.id),
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
        setSelectedTender(content);
    }

    const handleEdit = (content: ITenders) => {
        setEditTender(content);
    }

    const handleEditModalClose = () => {
        setEditTender(undefined);
    };

    const userRole = getUserRole();

    const handleDoItForMeClick = () => {
        if (selectedTender) {
            doItForMeMutation.mutate(selectedTender.id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Tender</h2>
                {(userRole === "PUBLISHER" || userRole === "ADMINISTRATOR") && (
                    <TenderCreateForm
                        onSuccess={() => {
                            refetch();
                        }}
                    />
                )}
            </div>

            {editTender ? (
                <TenderEdit
                    initials={editTender}
                    onSuccess={() => {
                        setEditTender(null);
                        refetch();
                    }}
                    onClose={handleEditModalClose}
                />
            ) : null}

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
                    hasSelection={false}
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(content: ITenders) => {
                        return (
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                    onClick={() => handleView(content)}
                                >
                                    <IconEye size={20} />
                                </button>
                                {(userRole === "ADMINISTRATOR" || userRole === "PUBLISHER") && (
                                    <><Fragment>

                                        <button
                                            className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                            onClick={() => handleEdit(content)}
                                        >
                                            <IconEdit size={20} />
                                        </button>
                                    </Fragment>
                                        <Fragment>

                                            <button
                                                className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                                onClick={() => handleDelete(content)}
                                            >
                                                <IconTrash size={20} />
                                            </button>
                                        </Fragment></>
                                )}
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
                <TenderViewModal
                    title={selectedTender.tenderNumber}
                    onClose={() => setSelectedTender(null)}
                    isLoading={doItForMeMutation.isLoading}
                    onDoItForMeClick={handleDoItForMeClick}
                >
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
                                <strong className="w-32 text-gray-600">Category:</strong>
                                <p className="flex-1">{selectedTender.category.name}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="flex-1">{selectedTender.summary}</p>
                            </div>

                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Status:</strong>
                                <Chip label={(() => {
                                    const currentDate = new Date().getTime();
                                    const closeDate = selectedTender.closeDate;
                                    const remainingTime = closeDate - currentDate;
                                    const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

                                    if (remainingDays < 0) {
                                        return 'CLOSED';
                                    } else if (remainingDays <= 2) {
                                        return 'CLOSING';
                                    } else {
                                        return selectedTender.status;
                                    }
                                })()} size="sm" theme="success" />
                            </div>
                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Close Date:</strong>
                                <p className="flex-1">{new Date(selectedTender.closeDate).toLocaleString()}</p>
                            </div>

                            <br></br>
                        </div>

                        <hr></hr>

                        {/* PDF Viewer */}
                        <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <iframe
                                src={selectedTender.filePath}
                                width="100%"
                                height="500px"
                                frameBorder="0"
                                title="Tender Document"
                            ></iframe>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button label="Close" size="sm" theme="danger" onClick={() => setSelectedTender(null)} />
                        </div>
                    </div>
                </TenderViewModal>
            )}

        </div>
    )
}
