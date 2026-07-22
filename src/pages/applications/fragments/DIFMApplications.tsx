import { IconAward, IconAwardOff, IconCheckbox, IconChevronDown, IconEdit, IconEye, IconFile, IconFileText, IconFilter, IconFlagCheck, IconLoader, IconRecycle, IconSend, IconSquareRoundedMinus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Table } from "@/components/widgets/table/Table";
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
import DIFMListColumns from "./DIFMListColumns";
import { difmApplicationColumnSearchOptions, difmApplicationQueryParams, DIFMStatusOptions } from "@/types/statuses";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";
import Select from "react-select";
import SummaryCard, { ISummaryCardProps } from "@/components/cards/SummaryCard";



export default function DIFMapplications() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>();
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [selectedApplication, setSelectedApplication] = useState<IApplications | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAmount, setEditAmount] = useState<number | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
    const [searchColumn, setSearchColumn] = useState<string | undefined>("title");
    const [filterQuery, setFilterQuery] = useState<Record<string, any> | undefined>(difmApplicationQueryParams);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const { showConfirmation } = usePopup();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // subscription date state
        const [open, setOpen] = useState(false);
        const [filter, setFilter] = useState<string | undefined>(undefined);
        const [subscriptionFilter, setSubscriptionFilter] = useState<string | undefined>("");
    
        // handle subscription filter select
        const dateMap: Record<string, number> = {
            "3days": 3,
            "1week": 7,
            "1month": 30,
        };

    // Fetch data using custom hook
    const { applicationList, isLoading, refetch } = useApplicationsList({
        applicationGroup: null,
        groupId: "e0c7d6a4-7b5a-4f7f-9a7e-9e0a9e0a9e0a", // Dummy ID for all applications
        page,
        search,
        sort,
        status: status === "" || status === undefined ? undefined : status,
        searchKey: searchColumn,
        searchValue: search === "" || search === undefined ? undefined : search,
        filter: undefined,
        visibility: "all",

    });

    // Configuration mapping array
    const summaryConfigs: ISummaryCardProps[] = [
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

    // submit filter
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
        });
    };

    const schema = object().shape({
        status: string().required("Status is required"),
        quotationAmount: number().required("Quotation is required"),
        comments: string().required("Comment is required"),
    });

    const { register, control, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: "", quotationAmount: 0, comments: "" },
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
        mutationFn: ({ id, quotationAmount, comments, status }: { id: string, quotationAmount: number, comments: string, status: string }) => updateStatus(id, comments, quotationAmount, status),
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

                        refetch();
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
        console.log("application--" + application);

        setIsEditModalOpen(false);
        setSelectedApplication(application);
        setIsTenderModalOpen(true);  // Open tender view modal
    };

    const handlStatusUpdate = () => {
        const { status, comments } = getValues(); // Extract status and comments from the form

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
                            quotationAmount: getValues().quotationAmount ?? 0,
                            status: status
                        },
                        {
                            onSuccess: () => {
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
                                // onRefetch(/); // Trigger refetch for main group data
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

    return (
        // <div className="fixed inset-0 flex items-center justify-center z-1 bg-black bg-opacity-50">
        <div className="modal-content rounded-lg shadow-lg p-4 z-60"> {/* Set max height and overflow */}
            <div className="flex flex-col items-start">
                <h3 className="font-bold text-lg">{t("difm-tabs-all-applications-header")}</h3>
                <div className="flex flex-row gap-2 w-full justify-between mb-4">
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
                            className={`input-normal w-[150px]`}
                            value={filterQuery?.status || ""}
                            onChange={(e) => setFilterQuery({ ...filterQuery, status: e.target.value })}
                        >
                            <option value=''>Status</option>
                            {
                                DIFMStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))
                            }
                        </select>

                        {/* Date filter */}
                        <div className="relative w-64">

                            {/* Trigger */}
                            <button
                                onClick={() => setOpen(!open)}
                                className="w-full mt-1 flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm shadow-sm hover:border-green-500"
                            >
                                <span className="text-gray-700">
                                    {filter === "3days" && "Last 3 Days"}
                                    {filter === "1week" && "Last 1 Week"}
                                    {filter === "1month" && "Last 1 Month"}
                                    {/* {filter === "custom" && "Custom Date"} */}
                                    {!filter && "Subscription Filter"}
                                </span>
                                <IconChevronDown size={18} />
                            </button>

                            {/* Dropdown */}
                            {open && (
                                <div className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-lg p-2 space-y-1">
                                    <button
                                        // onClick={() => handleSelect("3days")}
                                        className="dropdown-item"
                                    >
                                        3 Days
                                    </button>

                                    <button
                                        // onClick={() => handleSelect("1week")}
                                        className="dropdown-item"
                                    >
                                        1 Week
                                    </button>

                                    <button
                                        // onClick={() => handleSelect("1month")}
                                        className="dropdown-item"
                                    >
                                        1 Month
                                    </button>

                                    {/* <button
                                                            onClick={() => handleSelect("custom")}
                                                            className="dropdown-item flex items-center gap-2"
                                                        >
                                                            <IconCalendar size={16} />
                                                            Custom Date
                                                        </button> */}

                                    {/* Custom Date Input */}
                                    {/* {filter === "custom" && (
                                                            <div className="pt-2 border-t">
                                                                <input
                                                                    type="datetime-local"
                                                                    className="input-normal"
                                                                    value={subscriptionFilter}
                                                                    onChange={(e) => setSubscriptionFilter(e.target.value)}
                                                                />
                                                            </div>
                                                        )} */}
                                </div>
                            )}
                        </div>

                        <Button
                            type="button"
                            label="Filter"
                            icon={<IconFilter size={18} />}
                            onClick={handleFilterSubmit}
                            theme="info"
                            size="sm"
                        />
                        {
                            (filterQuery?.searchValue || filterQuery?.status !== undefined || filterQuery?.searchKey !== 'title') && (
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
                    </div>
                </div>
            </div>

            <div className="border-b border-zinc-200 text-sm  pb-5">

                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 w-full">

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


            {isLoading ? (
                <Loader />
            ) : (
                <Table
                    columns={DIFMListColumns}
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
                            {(userRole === "MANAGER" || userRole === "ADMINISTRATOR" || userRole === "ACCOUNTANT" || userRole === "PUBLISHER") && (applicationList.status === "REQUESTED" || applicationList.status === "ON_PROGRESS") && (
                                <Tooltip content={t("difm-application-status-update-button-tooltip")}>
                                    <button className="text-xs xl:text-sm text-slate-600 hover:text-green-600" onClick={() => handleStatusChange(applicationList)}>
                                        <IconCheckbox size={20} />
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
                                        className={`${errors.quotationAmount?.type === "required"
                                            ? "input-error"
                                            : "input-normal"
                                            }`}
                                        type="text"
                                        value={
                                            field.value
                                                ? field.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, "");
                                            field.onChange(rawValue ? Number(rawValue) : 0);
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
        // </div>
    );
}
