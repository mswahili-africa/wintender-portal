import { IconAward, IconCheckbox, IconEdit, IconEye, IconFile, IconFileText, IconListNumbers, IconLoader, IconSend, IconSquareRoundedMinus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Table } from "@/components/widgets/table/Table";
import applicationListColumns from "./applicationListColumns";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { useUserDataContext } from "@/providers/userDataProvider";
import { IApplicationGroup, IApplications } from "@/types";
import { deleteDoForMe, requestApplicationPDFReport, updatePrincipleAmount, updateStatus } from "@/services/tenders";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { number, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/button/Button";
import TenderViewModelDoItForMe from "./tenderViewModelDoItForMe";
import Chip from "@/components/chip/Chip";
import useApplicationsList from "@/hooks/useApplicationsList";
import Pagination from "@/components/widgets/table/Pagination";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/spinners/Loader";
import { IApplicationPDFReport } from "@/types/forms";
import { DIFMStatusOptions } from "@/types/statuses";
import TextInput from "@/components/widgets/forms/TextInput";
import { filter } from "lodash";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";


interface ApplicationsListProps {
    applicationGroup: IApplicationGroup;
    groupId: string;
    onClose: () => void; // Function to close the modal
    onRefetch: () => void; // Function to refetch data if needed
}

export default function ApplicationsList({ applicationGroup, groupId, onClose, onRefetch }: ApplicationsListProps) {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [selectedApplication, setSelectedApplication] = useState<IApplications | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAmount, setEditAmount] = useState<number | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
    const [reportMonth, setReportMonth] = useState<number | null>(null);
    const [status, setStatus] = useState<string>("");
    const { showConfirmation } = usePopup();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Fetch data using custom hook
    const { applicationList, isLoading, refetch } = useApplicationsList({
        applicationGroup,
        groupId,
        page,
        search,
        sort,
        status: status !== "" ? status : undefined,
        filter: undefined,
    });

    const schema = object().shape({
        status: string().required("Status is required"),
        quotationAmount: number().required("Quotation is required"),
        comments: string().required("Comment is required"),
    });

    const { register, reset, control, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: "", quotationAmount: 0, comments: "" },
    });

    useEffect(() => {
        if (selectedApplication) {
            reset({
                status: selectedApplication.status ?? "",
                quotationAmount: selectedApplication.quotationAmount ?? 0,
                comments: selectedApplication.comments ?? "",
            });
        }
    }, [selectedApplication, reset]);




    const requestPDFReportMutation = useMutation({
        mutationFn: (payload: IApplicationPDFReport) =>
            requestApplicationPDFReport(payload),

        onSuccess: () => {
            toast.success("Check your WhatsApp for the PDF report");
        },

        onError: () => {
            toast.error("Request failed");
        },
    });

    const deteleMutation = useMutation({
        mutationFn: (doItForMeId: string) => deleteDoForMe(doItForMeId),
        onSuccess: (res) => {
            toast.success("Request deleted successful");
            refetch();
        },
        onError: (error: any) => {
            toast.error("Delete failed");
        },
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
        mutationFn: ({ id, comments, quotationAmount, status }: { id: string, comments: string, quotationAmount: number, status: string }) => updateStatus(id, comments, quotationAmount, status),
        onSuccess: () => {
            toast.success("Status changed");
            refetch();
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
                deteleMutation.mutate(payload.id, {
                    onSuccess: () => {
                        onClose(); // Close the modal

                        refetch();
                        onRefetch(); // Refetch data in the main group
                    },
                    onError: (error: any) => {
                        toast.error("Delete failed");
                    }
                });
            },
            onCancel: () => { },
        });
    };


    // Edit Principal Amount Handler
    const handleEdit = (content: IApplications) => {
        setIsTenderModalOpen(false);
        setEditAmount(content.principleAmount);
        setSelectedApplication(content);
        setIsEditModalOpen(true);
    };

    // Edit Status Handler
    const handleStatusChange = (content: IApplications) => {
        setIsTenderModalOpen(false);
        setIsTenderModalOpen(false);
        setSelectedApplication(content);
        setIsStatusModalOpen(true);
    };

    // View Tender Details
    const handleView = (application: IApplications) => {
        setIsEditModalOpen(false);
        setSelectedApplication(application);
        setIsTenderModalOpen(true);  // Open tender view modal
    };

    const handlStatusUpdate = () => {
        const { status, comments, quotationAmount } = getValues(); // Extract status and comments from the form

        if (selectedApplication && status && comments) {
            setIsStatusModalOpen(false);
            showConfirmation({
                theme: "warning", // Adjust the theme to fit status updates
                title: "Change Status",
                message: "Are you sure you want to change the status and add comments?",
                onConfirm: () => {
                    updateStatusMutation.mutate(
                        {
                            id: selectedApplication.id,
                            comments: comments,
                            quotationAmount: quotationAmount ?? 0,
                            status: status
                        },
                        {
                            onSuccess: () => {
                                reset(); // Reset form fields
                                onRefetch(); // Trigger refetch for main group data
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
                                onRefetch(); // Trigger refetch for main group data
                            }
                        }
                    );
                },
                onCancel: () => { },
            });
        }
    };

    const viewProfomaInvoice = (applicationGroup: IApplicationGroup, application: IApplications) => {
        navigate(`/application-profoma-invoice`, {
            state: { applicationGroupData: applicationGroup, applicationData: application }
        });
    };


    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";


    const handleCloseModal = () => {
        setSearch("");
        setStatus("");
        onClose();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-1 bg-black bg-opacity-50">
            <div className="modal-content bg-white rounded-lg shadow-lg w-[90%] max-h-[80vh] p-4 z-60 overflow-y-auto"> {/* Set max height and overflow */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-l">{applicationGroup?.bidderCompanyName}</h3>
                    <div className="flex flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Search tender title here..."
                            className="input-normal w-60"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="input-normal w-full sm:w-36"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">ALL</option>
                            {
                                DIFMStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))
                            }
                        </select>

                        {/* PDF Report Section */}
                        <div className="flex flex-row gap-2 items-center">
                            <select
                                className="input-normal w-36"
                                value={reportMonth ?? ""}
                                onChange={(e) => setReportMonth(Number(e.target.value))}
                            >
                                <option value="0">All</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>

                            <Tooltip content={t("difm-request-pdf-report-button-tooltip")}>
                                <Button
                                    label={requestPDFReportMutation.isPending ? "Requesting..." : t("difm-request-pdf-report-button")}
                                    size="sm"
                                    theme="primary"
                                    disabled={!reportMonth}
                                    onClick={() =>
                                        requestPDFReportMutation.mutate({
                                            groupId,
                                            month: reportMonth!,
                                        })
                                    }
                                />
                            </Tooltip>

                        </div>

                    </div>
                    <button onClick={handleCloseModal} className="text-red-500">Close</button>
                </div>

                <div className="border-b border-zinc-200 text-sm  pb-5">

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">

                            {/* Total */}
                            <div className="bg-white border border-gray-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                                        <IconListNumbers size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                            {t("difm-total-requests")}
                                        </p>
                                        <p className="text-md font-bold text-gray-800">
                                            {applicationList?.summary?.total ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Requests */}
                            <div className="bg-white border border-blue-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                        <IconFileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                            {t("difm-requests")}
                                        </p>
                                        <p className="text-md font-bold text-gray-800">
                                            {applicationList?.summary?.request ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* on progress */}
                            <div className="bg-white border border-green-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                        <IconLoader size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                            {t("difm-on-progress")}
                                        </p>
                                        <p className="text-md font-bold text-gray-800">
                                            {applicationList?.summary?.open ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submitted */}
                            <div className="bg-white border border-green-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                                        <IconSend size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                            {t("difm-applied")}
                                        </p>
                                        <p className="text-md font-bold text-gray-800">
                                            {applicationList?.summary?.applied ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Awarded */}
                            <div className="bg-white border border-emerald-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                                        <IconAward size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                            {t("difm-won")}
                                        </p>
                                        <p className="text-md font-bold text-gray-800">
                                            {applicationList?.summary?.awarded ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Cancelled */}
                            <div className="bg-white border border-red-100 rounded-xl p-1 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-red-100 text-red-600">
                                        <IconX size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                            {t("difm-canceled")}
                                        </p>
                                        <p className="text-md font-bold text-gray-800">
                                            {applicationList?.summary?.canceled ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                {isLoading ? (
                    <Loader />
                ) : (
                    <Table
                        columns={applicationListColumns}
                        data={applicationList?.content || []}
                        isLoading={isLoading}
                        hasSelection={false}
                        hasActions={true}
                        actionSlot={(applicationList: IApplications) => (
                            <div className="flex justify-center items-center space-x-3">
                                {applicationList.tenderId != null && (
                                    <Tooltip content={t("difm-application-view-button-tooltip")}>
                                        <button
                                            className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                            onClick={() => handleView(applicationList)}
                                        >
                                            <IconEye size={20} />
                                        </button>
                                    </Tooltip>
                                )}
                                {applicationList.tenderId != null && (userRole === "MANAGER" || userRole === "ADMINISTRATOR" || userRole === "ACCOUNTANT" || userRole === "PUBLISHER") && (
                                    <Tooltip content={t("difm-consultation-fee-update-button-tooltip")}>
                                        <button className="hover:text-green-700" onClick={() => handleEdit(applicationList)}>
                                            <IconEdit size={20} />
                                        </button>
                                    </Tooltip>
                                )}
                                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR" || userRole === "ACCOUNTANT" || userRole === "PUBLISHER") && (
                                    <Tooltip content={t("difm-application-status-update-button-tooltip")}>
                                        <button className="text-xs xl:text-sm text-slate-600 hover:text-green-600" onClick={() => handleStatusChange(applicationList)}>
                                            <IconCheckbox size={20} />
                                        </button>
                                    </Tooltip>
                                )}

                                {(applicationList.status === "COMPLETED" || applicationList.status === "ON_PROGRESS") && (
                                    <Tooltip content={t("difm-application-invoice-generator-button-tooltip")}>
                                        <button
                                            className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                            onClick={() => viewProfomaInvoice(applicationGroup, applicationList)}
                                        >
                                            <IconFile size={20} />
                                        </button>
                                    </Tooltip>
                                )}
                                {userRole === "BIDDER" && applicationList.status === "REQUESTED" && (
                                    <Tooltip content={t("difm-application-delete-button-tooltip")}>
                                        <button className="text-red-600 hover:text-red-700" onClick={() => reject(applicationList)}>
                                            <IconSquareRoundedMinus size={20} />
                                        </button>
                                    </Tooltip>
                                )}
                            </div>
                        )}
                    />
                )}

                {/* Staus Modal */}
                {isStatusModalOpen && selectedApplication && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="modal-content bg-green-100 rounded-lg shadow-lg w-[400px] p-4">
                            <h3 className="font-bold text-lg mb-4">Change Status</h3>
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
                                    {
                                        DIFMStatusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))
                                    }
                                </select>
                                <p className="text-xs text-red-500 mt-1 mx-0.5">
                                    {errors.status?.message?.toString()}
                                </p>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="quotation" className="block mb-2">
                                    Bid Quotation
                                </label>

                                <Controller
                                    name="quotationAmount"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <input
                                            placeholder="Bid Quotation"
                                            className={
                                                errors.quotationAmount
                                                    ? "input-error"
                                                    : "input-normal"
                                            }
                                            type="text"
                                            value={
                                                field.value !== undefined && field.value !== null
                                                    ? field.value
                                                        .toString()
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, "");
                                                field.onChange(raw === "" ? 0 : Number(raw));
                                            }}
                                        />
                                    )}
                                />



                                <p className="text-xs text-red-500 mt-1 mx-0.5">
                                    {errors.quotationAmount?.message?.toString()}
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

                <TenderViewModelDoItForMe
                    open={isTenderModalOpen && selectedApplication !== null}
                    selectedApplication={selectedApplication!}
                    applicationGroup={applicationGroup}
                    onClose={() => setSelectedApplication(null)}
                />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    {applicationList?.pageable && (
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={applicationList.totalPages}
                        />
                    )}
                </div>
            </div>
        </div >
    );
}
