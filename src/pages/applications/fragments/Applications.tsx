import { IconCheckbox, IconEdit, IconEye, IconSquareRoundedMinus } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./applicationListColumns";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { getUserRole } from "@/utils";
import { IApplicationGroup, IApplications, ITenders } from "@/types";
import { deleteDoForMe, updatePrincipleAmount, updateStatus } from "@/services/tenders";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/button/Button";
import TenderViewModelDoItForMe from "./tenderViewModelDoItForMe";
import Chip from "@/components/chip/Chip";

interface ApplicationsListProps {
    applicationGroup: IApplicationGroup;
    applicationList: IApplications[];
    onClose: () => void; // Function to close the modal
    onRefetch: () => void; // Function to refetch data if needed
}

export default function ApplicationsList({ applicationGroup, applicationList, onClose }: ApplicationsListProps) {
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("createdAt,desc"); const [filter] = useState<any>();
    const [selectedGroup, setSelectedGroup] = useState<IApplicationGroup | null>(null);
    const [selectedTender, setSelectedTender] = useState<ITenders | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<IApplications | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
    const [editAmount, setEditAmount] = useState<number | null>(null);
    const { showConfirmation } = usePopup();

    const schema = object().shape({
        status: string().required("Status is required"),
        comments: string().required("Comment is required"),
    });

    const { register, formState: { errors }, getValues, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: "", comments: "" },
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    const deteleMutation = useMutation({
        mutationFn: (doItForMeId: string) => deleteDoForMe(doItForMeId),
        onSuccess: (res) => {
            toast.success("Request deleted successful");
        },
        onError: (error: any) => {
            toast.error("Delete failed");
        },
    });

    const updateAmountMutation = useMutation({
        mutationFn: ({ id, amount }: { id: string, amount: number }) => updatePrincipleAmount(id, amount),
        onSuccess: () => {
            toast.success("Consultation fee updated");
            setIsEditModalOpen(false);
        },
        onError: () => {
            toast.error("Update failed");
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, comments, status }: { id: string, comments: string, status: string }) => updateStatus(id, comments, status),
        onSuccess: () => {
            toast.success("Status changed");
            setIsStatusModalOpen(false);
        },
        onError: () => {
            toast.error("Update failed");
        },
    });

    const reject = (payload: IApplications) => {
        showConfirmation({
            theme: "danger",
            title: "Delete this request?",
            message:
                "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => {
                deteleMutation.mutate(payload.id);
            },
            onCancel: () => { },
        });
    };

    // Edit Principal Amount Handler
    const handleEdit = (content: IApplications) => {
        setIsTenderModalOpen(false);
        setEditAmount(content.controlNumber.principleAmount);
        setSelectedTender(content.tender);
        setIsEditModalOpen(true);
    };

    // Edit Status Handler
    const handleStatusChange = (content: IApplications) => {
        setIsTenderModalOpen(false);
        setIsTenderModalOpen(false);
        setSelectedTender(content.tender);
        setIsStatusModalOpen(true);
    };

    const handlStatusUpdate = () => {
        const { status, comments } = getValues(); // Extract status and comments from the form

        if (selectedTender && status && comments) {
            setIsStatusModalOpen(false);
            showConfirmation({
                theme: "warning", // Adjust the theme to fit status updates
                title: "Change Status",
                message: "Are you sure you want to change the status and add a comments?",
                onConfirm: () => {
                    updateStatusMutation.mutate({
                        id: selectedTender.id,
                        comments: comments,
                        status: status
                    });
                },
                onCancel: () => { },
            });
        } else {
            toast.error("Please fill in both status and comments.");
        }
    };


    // View Tender Details
    const handleView = (group: IApplicationGroup, application: IApplications, tender: ITenders) => {
        setIsEditModalOpen(false);
        setSelectedGroup(group);
        setSelectedTender(tender);
        setSelectedApplication(application);
        setIsTenderModalOpen(true);  // Open tender view modal
    };

    const handleUpdate = () => {
        if (selectedTender && editAmount !== null) {

            setIsEditModalOpen(false);
            showConfirmation({
                theme: "danger",
                title: "Change",
                message:
                    "Are you sure you want to change amount?",
                onConfirm: () => {
                    updateAmountMutation.mutate({ id: selectedTender.id, amount: editAmount });
                },
                onCancel: () => { },
            });

        }
    };

    const userRole = getUserRole();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-1 bg-black bg-opacity-50">
            <div className="modal-content bg-white rounded-lg shadow-lg w-[90%] p-4 z-10"> {/* Added z-60 */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Requests</h3>
                    <button onClick={onClose} className="text-red-500">Close</button>
                </div>


                <Table
                    columns={columns}
                    data={applicationList}
                    isLoading={false} // Change this if you have loading state
                    hasSelection={false}
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(content: IApplications) => {
                        return (
                            <div className="flex justify-center items-center space-x-3">
                                <button
                                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                    onClick={() => handleView(applicationGroup, content, content.tender)}
                                >
                                    <IconEye size={20} />
                                </button>
                                {userRole === "BIDDER" &&
                                    content.status == "REQUESTED" && (
                                        <Fragment>
                                            <button className="text-red-600 hover:text-red-700" onClick={() => reject(content)}>
                                                <IconSquareRoundedMinus size={20} />
                                            </button>
                                        </Fragment>
                                    )}
                                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") &&
                                    content.status == "REQUESTED" && (
                                        <Fragment>
                                            <button className="hover:text-green-700" onClick={() => handleEdit(content)}>
                                                <IconEdit size={20} />
                                            </button>
                                        </Fragment>
                                    )}
                                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") &&
                                    (content.status == "REQUESTED" || content.status == "ON_PROGRESS") && (
                                        <Fragment>
                                            <button
                                                className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                                onClick={() => handleStatusChange(content)}
                                            >
                                                <IconCheckbox size={20} />
                                            </button>
                                        </Fragment>
                                    )}
                            </div>
                        );
                    }}
                />

                {/* Staus Modal */}
                {isStatusModalOpen && selectedTender && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="modal-content bg-green-100 rounded-lg shadow-lg w-[400px] p-4">
                            <h3 className="font-bold text-lg mb-4">Manager Request</h3>
                            <div className="mb-2">
                                <label htmlFor="status" className="block mb-2">
                                    Status
                                </label>

                                <select
                                    className={`${errors.status?.type === "required"
                                        ? "input-error"
                                        : "input-normal"
                                        }`}
                                    {...register("status", { required: true })}
                                >
                                    <option value="ON_PROGRESS">ON PROGRESS</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="RETURNED">RETURNED</option>
                                    <option value="CANCELED">CANCELED</option>
                                </select>
                                <p className="text-xs text-red-500 mt-1 mx-0.5">
                                    {errors.status?.message?.toString()}
                                </p>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="comments" className="block mb-2">
                                    Comments
                                </label>

                                <textarea
                                    rows={3}
                                    className={`${errors.comments?.type === "required"
                                        ? "input-error"
                                        : "input-normal"
                                        }`}
                                    {...register("comments", { required: true })}
                                ></textarea>
                                <p className="text-xs text-red-500 mt-1 mx-0.5">
                                    {errors.comments?.message?.toString()}
                                </p>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button label="Cancel" theme="danger" onClick={() => setIsStatusModalOpen(false)} />
                                <Button label="Save" theme="primary" onClick={handlStatusUpdate} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && selectedTender && (
                    <div className="fixed inset-0 flex items-center justify-center z-70">  {/* Add overlay for better visibility */}
                        <div className="modal-content bg-green-100 rounded-lg shadow-lg w-[400px] p-4">
                            <h3 className="font-bold text-lg mb-4">Edit Consultation Fee</h3>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm text-gray-600">Principal Amount</label>
                                <input
                                    type="number"
                                    value={editAmount ?? ""}
                                    onChange={(e) => setEditAmount(Number(e.target.value))}
                                    className="input-normal w-full"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button label="Cancel" theme="danger" onClick={() => setIsEditModalOpen(false)} />
                                <Button label="Save" theme="primary" onClick={handleUpdate} />
                            </div>
                        </div>
                    </div>
                )}

                {isTenderModalOpen && selectedGroup && selectedTender && selectedApplication && (
                    <TenderViewModelDoItForMe
                        tenderGroup={selectedTender.tenderGroup}
                        onClose={() => setSelectedTender(null)}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <strong className="w-32 text-gray-600">Bidder:</strong>
                                <h3 className="text-l font-semi-bold text-gray-800"><strong className="w-32 text-gray-600">{selectedGroup.user.account}</strong> : {selectedGroup.user.company.name}</h3>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <strong className="w-32 text-gray-600">Phone:</strong>
                                <a href={`tel:${selectedGroup.user.company.primaryNumber}`} className="text-l font-semi-bold text-gray-800">
                                    {selectedGroup.user.company.primaryNumber}
                                </a>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <strong className="w-32 text-gray-600">Email:</strong>
                                <a href={`mailto:${selectedGroup.user.company.email}`} className="text-l font-semi-bold text-gray-800">
                                    {selectedGroup.user.company.email}
                                </a>
                            </div>

                        </div>

                        <hr></hr>
                        <br></br>

                        <div className="space-y-4">
                            {/* Tender Header */}
                            <div className="flex items-center justify-between mb-4">
                                <strong className="w-32 text-gray-600">Title:</strong>
                                <h3 className="flex-1 font-bold text-gray-800">{selectedTender.tenderNumber} : {selectedTender.title}</h3>
                            </div>

                            {/* Tender Details */}
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">PE:</strong>
                                    <p className="flex-1 font-bold text-gray-800">{selectedTender.entity.name.toUpperCase()}</p>
                                </div>
                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Category:</strong>
                                    <p className="flex-1">{selectedTender.category.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Summary:</strong>
                                    <p className="flex-1">{selectedTender.summary}</p>
                                </div>

                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Status:</strong>
                                    <Chip
                                        label={(() => {
                                            const currentDate = new Date().getTime();
                                            const closeDate = selectedTender.closeDate;
                                            const remainingTime = closeDate - currentDate;
                                            const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

                                            // Determine the label based on the remaining days
                                            if (remainingDays < 0) {
                                                return 'CLOSED';
                                            } else if (remainingDays <= 2) {
                                                return 'CLOSING';
                                            } else {
                                                return selectedTender.status;
                                            }
                                        })()}
                                        size="sm"
                                        theme="success"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Close Date:</strong>
                                    <p className="flex-1">{new Date(selectedTender.closeDate).toLocaleString()}</p>
                                </div>

                                <br></br>
                                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") && (
                                    <><hr></hr><div className="flex items-center">
                                        <strong className="w-50 text-gray-600">Consultation Fee:</strong>
                                        <p className="flex-1">
                                            <strong className="w-40 text-gray-600">
                                                TZS {new Intl.NumberFormat().format(selectedApplication.controlNumber.principleAmount)}
                                            </strong>
                                        </p>
                                    </div></>

                                )}
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
                    </TenderViewModelDoItForMe>
                )}
            </div>
        </div>
    );
}