import { IconAward, IconCheckbox, IconEdit, IconEye, IconFile, IconFileText, IconFilter, IconFlagCheck, IconListNumbers, IconLoader, IconRecycle, IconReportAnalytics, IconSend, IconSquareRoundedMinus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Table } from "@/components/widgets/table/Table";
import applicationListColumns from "./applicationListColumns";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { useUserDataContext } from "@/providers/userDataProvider";
import { IApplicationGroup, IApplications } from "@/types";
import { deleteDoForMe, updatePrincipleAmount, updateStatus } from "@/services/tenders";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { number, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/button/Button";
import TenderViewModelDoItForMe from "./tenderViewModelDoItForMe";
import useApplicationsList from "@/hooks/useApplicationsList";
import Pagination from "@/components/widgets/table/Pagination";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/spinners/Loader";
import { difmApplicationColumnSearchOptions, difmApplicationQueryParams, DIFMStatusOptions } from "@/types/statuses";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";
import SummaryCard, { ISummaryCardProps } from "@/components/cards/SummaryCard";
import DifmReportGenerationModal from "./DifmReportGenerationModal";
import Select from "react-select";
import { IconAwardOff } from "@tabler/icons-react";

interface ApplicationsListProps {
    applicationGroup: IApplicationGroup;
    groupId: string;
    onClose: () => void; // Function to close the modal
    onRefetch: () => void; // Function to refetch data if needed
}

export default function ApplicationsList({ applicationGroup, groupId, onClose, onRefetch }: ApplicationsListProps) {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [selectedApplication, setSelectedApplication] = useState<IApplications | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAmount, setEditAmount] = useState<number | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const { showConfirmation } = usePopup();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [handleModal, setHandleModal] = useState<{ type: "status" | "tender" | "report" | "", object: any }>({ type: "", object: null });
    const [filterQuery, setFilterQuery] = useState<Record<string, any> | undefined>(difmApplicationQueryParams);
    const [searchColumn, setSearchColumn] = useState<string | undefined>("title");

    const handleCloseAllModals = () => {
        setHandleModal({ type: "", object: null });
    }

    // Fetch data using custom hook
    const { applicationList, isLoading, refetch } = useApplicationsList({
        applicationGroup,
        groupId,
        page,
        search,
        searchValue: search === "" ? undefined : search,
        searchKey: searchColumn,
        sort,
        status: status !== "" ? status : undefined,
        filter: undefined,
    });

    // Handle filter submission
    const handleFilterSubmit = () => {
        setSearch(filterQuery?.searchValue);
        setStatus(filterQuery?.status);
        setSearchColumn(filterQuery?.searchKey);
    };

    // reset filter
    const resetFilter = () => {
        setSearch(undefined);
        setStatus(undefined);
        setSearchColumn("title");

        setFilterQuery({
            status: undefined,
            searchKey: "title",
            searchValue: undefined,
        })
    };

    // Configuration mapping array
    const summaryConfigs: ISummaryCardProps[] = [
        {
            label: "A.W.E",
            value: applicationList?.summary?.total ?? 0,
            icon: <IconListNumbers size={18} />,
            borderColor: "border-gray-100",
            iconBgColor: "bg-gray-100",
            iconTextColor: "text-gray-600",
        },
        {
            label: "Requests",
            value: applicationList?.summary?.request ?? 0,
            icon: <IconFileText size={18} />,
            borderColor: "border-blue-100",
            iconBgColor: "bg-purple-100",
            iconTextColor: "text-purple-600",
        },
        {
            label: "On progress",
            value: applicationList?.summary?.open ?? 0,
            icon: <IconLoader size={18} />,
            borderColor: "border-green-100",
            iconBgColor: "bg-blue-100",
            iconTextColor: "text-blue-600",
        },
        {
            label: "Applied",
            value: applicationList?.summary?.applied ?? 0,
            icon: <IconSend size={18} />,
            borderColor: "border-green-100",
            iconBgColor: "bg-green-100",
            iconTextColor: "text-green-600",
        },
        {
            label: "Won",
            value: applicationList?.summary?.awarded ?? 0,
            icon: <IconAward size={18} />,
            borderColor: "border-emerald-100",
            iconBgColor: "bg-emerald-100",
            iconTextColor: "text-emerald-600",
        },
        {
            label: "Not Won",
            value: applicationList?.summary?.notAwarded ?? 0,
            icon: <IconAwardOff size={18} />,
            borderColor: "border-orange-100",
            iconBgColor: "bg-orange-100",
            iconTextColor: "text-orange-600",
        },
        {
            label: "Executed", // Corrected spelling from 'Excuted'
            value: applicationList?.summary?.executed ?? 0,
            icon: <IconFlagCheck size={18} />,
            borderColor: "border-emerald-100",
            iconBgColor: "bg-amber-100",
            iconTextColor: "text-amber-600",
        },
        {
            label: "Cancelled",
            value: applicationList?.summary?.canceled ?? 0,
            icon: <IconX size={18} />,
            borderColor: "border-red-100",
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-600",
        },
    ];

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




    // const requestPDFReportMutation = useMutation({
    //     mutationFn: (payload: IApplicationPDFReport) =>
    //         requestApplicationPDFReport(payload),

    //     onSuccess: () => {
    //         toast.success("Check your WhatsApp for the PDF report");
    //     },

    //     onError: () => {
    //         toast.error("Request failed");
    //     },
    // });

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
            <div className="modal-content bg-white rounded-lg shadow-lg w-[90%] max-h-[85vh] z-60 overflow-y-auto"> {/* Set max height and overflow */}
                <div className="w-full sticky top-0 bg-white shadow-sm p-4 mb-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-l">{applicationGroup?.bidderCompanyName}</h3>
                        <button onClick={handleCloseModal} className="text-red-500">Close</button>
                    </div>
                    <div className="flex flex-row justify-between gap-2 mb-2 px-5">
                        <div className="flex flex-row gap-x-2">
                            <Select
                                options={difmApplicationColumnSearchOptions}
                                value={difmApplicationColumnSearchOptions.find((option: any) => option.value === filterQuery?.searchKey)}
                                onChange={(selectedOption) => setFilterQuery({ ...filterQuery, searchKey: selectedOption?.value })}
                                placeholder="Search by"
                                className="w-[200px] p-0"
                            />
                            <input
                                type="text"
                                placeholder="Search"
                                value={filterQuery?.searchValue || ""}
                                className="input-normal w-[200px] lg:w-[300px]"
                                onChange={(e) => setFilterQuery({ ...filterQuery, searchValue: e.target.value })} // Update search query
                            />
                        </div>
                        <div className="flex gap-x-2">
                            <select
                                className="input-normal w-full sm:w-36"
                                value={filterQuery?.status || ""}
                                onChange={(e) => setFilterQuery({ ...filterQuery, status: e.target.value })}
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

                            <Button
                                type="button"
                                label="Filter"
                                icon={<IconFilter size={18} />}
                                onClick={handleFilterSubmit}
                                theme="info"
                                size="sm"
                            />
                            {
                                (filterQuery?.searchValue || filterQuery?.status || filterQuery?.searchKey !== 'title') && (
                                    <Button
                                        type="button"
                                        label="Reset"
                                        icon={<IconRecycle size={18} />}
                                        onClick={resetFilter}
                                        theme="warning"
                                        size="sm"
                                    />
                                )
                            }

                            <Tooltip content={t("difm-request-pdf-report-button-tooltip")}>
                                <Button
                                    label={t("difm-request-pdf-report-button")}
                                    size="sm"
                                    icon={<IconReportAnalytics size={18} />}
                                    theme="primary"
                                    onClick={() => setHandleModal({ type: "report", object: null })}
                                />
                            </Tooltip>

                        </div>

                    </div>

                    <div className="border-b border-zinc-200 text-sm  pb-5">

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 w-full">

                                {summaryConfigs.map((config, index) => (
                                    <SummaryCard
                                        key={index}
                                        label={config.label}
                                        value={config.value}
                                        icon={config.icon}
                                        borderColor={config.borderColor}
                                        iconBgColor={config.iconBgColor}
                                        iconTextColor={config.iconTextColor}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                <div className="p-4 lg:px-8">
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

                                {/* {(applicationList.status === "COMPLETED" || applicationList.status === "ON_PROGRESS") && ( */}
                                <Tooltip content={t("difm-application-invoice-generator-button-tooltip")}>
                                    <button
                                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                        onClick={() => viewProfomaInvoice(applicationGroup, applicationList)}
                                    >
                                        <IconFile size={20} />
                                    </button>
                                </Tooltip>
                                {/* )} */}
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


                <div className="flex justify-between items-center p-4 lg:px-8">
                    {applicationList?.pageable && (
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={applicationList.totalPages}
                            totalElements={applicationList.totalElements}
                        />
                    )}
                </div>

                </div>

                <TenderViewModelDoItForMe
                    open={isTenderModalOpen && selectedApplication !== null}
                    selectedApplication={selectedApplication!}
                    applicationGroup={applicationGroup}
                    onClose={() => setSelectedApplication(null)}
                />

                <DifmReportGenerationModal
                    open={handleModal.type === "report"}
                    groupId={groupId}
                    onClose={handleCloseAllModals}
                />
            </div>
        </div >
    );
}
