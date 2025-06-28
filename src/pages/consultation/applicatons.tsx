
import { useState } from "react";
import { useUserDataContext } from "@/providers/userDataProvider";
import toast from "react-hot-toast";
import { Table } from "@/components/widgets/table/Table";
import columns from "./fragments/applicationColumns";
import { IConsultationApplication } from "@/types/forms";
import { IconCheckbox, IconTrash, IconCloudDollar  } from "@tabler/icons-react";
import usePopup from "@/hooks/usePopup";
import { useMutation } from "@tanstack/react-query";
import { deleteConsultMe, updateConsultMe, updatePrincipleAmount, updateStatus } from "@/services/tenders";
import useConsultMeApplication from "@/hooks/useConsultMeApplication";
import Pagination from "@/components/widgets/table/Pagination";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import Button from "@/components/button/Button";
import WalletPaymentModal from "../tenders/fragments/WalletPaymentModel";
import { USSDPushWalletRequest } from "@/services/payments";

export default function ConsultationApplication() {
    const [selectedApplication, setSelectedApplication] = useState<IConsultationApplication | null>(null);
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>();
    const { showConfirmation } = usePopup();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAmount, setEditAmount] = useState<number | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    // JCM wallet payment
    const [paymentDetails, setPaymentDetails] = useState({
        amount: 0,
        phoneNumber: "",
        paymentReason: "WALLET_IN"
    });
    const [open, setOpen] = useState(false);
    const [isWalletLoading, setIsWalletLoading] = useState(false);

    // JCM handle payment submission
    const paymentMutation = useMutation({
        mutationFn: (paymentData: { amount: number, phoneNumber: string, paymentReason: string }) => (
            setIsWalletLoading(true),
            USSDPushWalletRequest(paymentData)
        ),
        onSuccess: (data) => {
            toast.success(data.message);
            setIsWalletLoading(false);
        },
        onError: (error) => {
            toast.error("Payment failed: " + error);
            throw error;
        }
    });
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();

    const { application, isLoading, refetch } = useConsultMeApplication({
        page: page,
        search: search,
        sort: sort,
        filter: filter, // Pass the appropriate filter value
    });

    const schema = object().shape({
        status: string().required("Status is required"),
        comment: string().required("Comment is required"),
    });

    const { register, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: "", comment: "" },
    });

    const handleDelete = (content: IConsultationApplication) => {
        showConfirmation({
            theme: "danger",
            title: "Delete Aplication",
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

    const updateAmountMutation = useMutation({
        mutationFn: ({ id, amount }: { id: string, amount: number }) => updatePrincipleAmount(id, amount),
        onSuccess: () => {
            toast.success("Consultation fee updated");
            refetch();
            setIsEditModalOpen(false);
        },
        onError: () => {
            toast.error("Update failed");
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, comment, status }: { id: string, comment: string, status: string }) => updateConsultMe(id, comment, status),
        onSuccess: () => {
            toast.success("Status changed");
            refetch();
            setIsStatusModalOpen(false);
        },
        onError: () => {
            toast.error("Update failed");
        },
    });


    // Edit Principal Amount Handler
    const handleEdit = (content: IConsultationApplication) => {
        setEditAmount(content.principleAmount);
        setSelectedApplication(content);
        setIsEditModalOpen(true);
    };

    // Edit Status Handler
    const handleStatusChange = (content: IConsultationApplication) => {
        setSelectedApplication(content);
        setIsStatusModalOpen(true);
    };


    const handleUpdate = () => {
        if (selectedApplication && editAmount !== null) {
            setIsEditModalOpen(false);
            showConfirmation({
                theme: "danger",
                title: "Change Amount",
                message: "Are you sure you want to change the amount?",
                onConfirm: () => {
                    updateAmountMutation.mutate(
                        { id: selectedApplication.id, amount: editAmount },
                        {
                            onSuccess: () => {
                                refetch();
                            }
                        }
                    );
                },
                onCancel: () => { },
            });
        }
    };


    const handlStatusUpdate = () => {
        const { status, comment } = getValues(); // Extract status and comments from the form

        if (selectedApplication && status && comment) {
            setIsStatusModalOpen(false);
            showConfirmation({
                theme: "warning", // Adjust the theme to fit status updates
                title: "Change Status",
                message: "Are you sure you want to change the status and add comments?",
                onConfirm: () => {
                    updateStatusMutation.mutate(
                        {
                            id: selectedApplication.id,
                            comment: comment,
                            status: status
                        },
                        {
                            onSuccess: () => {
                                refetch();
                            }
                        }
                    );
                },
                onCancel: () => { },
            });
        } else {
            toast.error("Please fill in both status and comments.");
        }
    };


    const viewProfomaInvoice = (applicationGroup: IConsultationApplication) => {
        navigate(`/application-profoma-invoice`, {
            state: { applicationGroupData: applicationGroup, applicationData: application }
        });
    };

    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Consultation Application</h2>
                <Button
                    type="button"
                    label="Top Up"
                    icon={<IconCloudDollar  size={18} />}
                    theme="primary"
                    size="md"
                    onClick={() => setOpen(true)}
                />
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

                                {userRole === "BIDDER" && (
                                    <button
                                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                                        onClick={() => handleDelete(content)}
                                    >
                                        <IconTrash size={20} />
                                    </button>
                                )}
                                {/* {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") && content.status === "REQUESTED" && (
                                    <button className="hover:text-green-700" onClick={() => handleEdit(content)}>
                                        <IconEdit size={20} />
                                    </button>
                                )} */}
                                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") && (content.status === "REQUESTED" || content.status === "ON_PROGRESS") && (
                                    <button className="text-xs xl:text-sm text-slate-600 hover:text-green-600" onClick={() => handleStatusChange(content)}>
                                        <IconCheckbox size={20} />
                                    </button>
                                )}

                                {/* {(content.status === "COMPLETED" || content.status === "ON_PROGRESS") && (
                                    <button
                                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                        onClick={() => viewProfomaInvoice(content)}
                                    >
                                        <IconFile size={20} />
                                    </button>
                                )} */}
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

            {/* Staus Modal */}
            {isStatusModalOpen && selectedApplication && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-content bg-green-100 rounded-lg shadow-lg w-[400px] p-4">
                        <h3 className="font-bold text-lg mb-4">Changa Status</h3>
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
                                className={`${errors.comment?.type === "required"
                                    ? "input-error"
                                    : "input-normal"
                                    }`}
                                {...register("comment", { required: true })}
                            ></textarea>
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.comment?.message?.toString()}
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
            {isEditModalOpen && selectedApplication && (
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


            {/* JCM wallet top up modal */}
            <WalletPaymentModal isLoading={isWalletLoading}  setIsLoading={setIsWalletLoading} isOpen={open} paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} onClose={handleClose} onSubmit={() => paymentMutation.mutate(paymentDetails)} children={undefined} />
        </div>
    );
}
