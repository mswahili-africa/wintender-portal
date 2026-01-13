import { IconAward, IconCheckbox, IconEdit, IconEye, IconFile, IconFileText, IconListNumbers, IconLoader, IconSend, IconSquareRoundedMinus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Table } from "@/components/widgets/table/Table";
import applicationListColumns from "./applicationListColumns";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { useUserDataContext } from "@/providers/userDataProvider";
import { IApplicationGroup, IApplications } from "@/types";
import { deleteDoForMe, requestApplicationPDFReport, updatePrincipleAmount, updateStatus } from "@/services/tenders";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/button/Button";
import TenderViewModelDoItForMe from "./tenderViewModelDoItForMe";
import Chip from "@/components/chip/Chip";
import useApplicationsList from "@/hooks/useApplicationsList";
import Pagination from "@/components/widgets/table/Pagination";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/spinners/Loader";
import { IApplicationPDFReport } from "@/types/forms";
import { request } from "http";
import { DIFMStatusOptions } from "@/types/statuses";


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
        comments: string().required("Comment is required"),
    });

    const { register, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: "", comments: "" },
    });

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
        mutationFn: ({ id, comments, status }: { id: string, comments: string, status: string }) => updateStatus(id, comments, status),
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
                            status: status
                        },
                        {
                            onSuccess: () => {
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

    const currentDate = new Date().getTime();
    const closeDate = selectedApplication?.closeDate;
    const remainingTime = closeDate! - currentDate;
    const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

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

                            <Button
                                label={requestPDFReportMutation.isLoading ? "Requesting..." : "Request PDF"}
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
                                            Total
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
                                            Requests
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
                                            On progress
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
                                            Applied
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
                                            Win
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
                                            Cancelled
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
                                    <button
                                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                                        onClick={() => handleView(applicationList)}
                                    >
                                        <IconEye size={20} />
                                    </button>
                                )}
                                {userRole === "BIDDER" && applicationList.status === "REQUESTED" && (
                                    <button className="text-red-600 hover:text-red-700" onClick={() => reject(applicationList)}>
                                        <IconSquareRoundedMinus size={20} />
                                    </button>
                                )}
                                {applicationList.tenderId != null && (userRole === "MANAGER" || userRole === "ADMINISTRATOR" || userRole === "ACCOUNTANT" || userRole === "PUBLISHER") && (
                                    <button className="hover:text-green-700" onClick={() => handleEdit(applicationList)}>
                                        <IconEdit size={20} />
                                    </button>
                                )}
                                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR" || userRole === "ACCOUNTANT" || userRole === "PUBLISHER") && (
                                    <button className="text-xs xl:text-sm text-slate-600 hover:text-green-600" onClick={() => handleStatusChange(applicationList)}>
                                        <IconCheckbox size={20} />
                                    </button>
                                )}

                                {(applicationList.status === "COMPLETED" || applicationList.status === "ON_PROGRESS") && (
                                    <button
                                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                        onClick={() => viewProfomaInvoice(applicationGroup, applicationList)}
                                    >
                                        <IconFile size={20} />
                                    </button>
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

                {isTenderModalOpen && selectedApplication && (
                    <TenderViewModelDoItForMe
                        tenderGroup={selectedApplication.tenderGroup}
                        onClose={() => setSelectedApplication(null)}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center mb-4">
                                <strong className="w-32 text-gray-600">Bidder:</strong>
                                <h3 className="text-l font-semi-bold text-gray-800"><strong className="w-32 text-gray-600">{applicationGroup.bidderAccount}</strong> : {applicationGroup.bidderAccount}</h3>
                            </div>
                            <div className="flex items-center mb-4">
                                <strong className="w-32 text-gray-600">Phone:</strong>
                                <a href={`tel:${applicationGroup.bidderCompanyPrimaryNumber}`} className="text-l font-semi-bold text-gray-800">
                                    {applicationGroup.bidderCompanyPrimaryNumber}
                                </a>
                            </div>
                            <div className="flex items-center mb-4">
                                <strong className="w-32 text-gray-600">Email:</strong>
                                <a href={`mailto:${applicationGroup.bidderCompanyEmail}`} className="text-l font-semi-bold text-gray-800">
                                    {applicationGroup.bidderCompanyEmail}
                                </a>
                            </div>
                            <div className="flex items-center mb-4">
                                <strong className="w-32 text-gray-600">Assignor name:</strong>
                                <a href={`mailto:${applicationGroup.assignorName}`} className="text-l font-semi-bold text-gray-800">
                                    {applicationGroup.assignorName}
                                </a>
                            </div>

                        </div>

                        <hr></hr>
                        <br></br>

                        <div className="space-y-4">
                            {/* Tender Header */}
                            <div className="flex items-center justify-between mb-4">
                                <strong className="w-32 text-gray-600">Title:</strong>
                                <h3 className="flex-1 font-bold text-gray-800">{selectedApplication.tenderNumber} : {selectedApplication.title}</h3>
                            </div>

                            {/* Tender Details */}
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">PE:</strong>
                                    <p className="flex-1 font-bold text-gray-800">{selectedApplication.entityName.toUpperCase()}</p>
                                </div>
                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Category:</strong>
                                    <p className="flex-1">{selectedApplication.categoryName}</p>
                                </div>
                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Summary:</strong>
                                    <p className="flex-1" dangerouslySetInnerHTML={{ __html: selectedApplication.summary }}></p>
                                </div>

                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Status:</strong>
                                    <Chip
                                        label={(() => {


                                            // Determine the label based on the remaining days
                                            if (remainingDays < 0) {
                                                return 'CLOSED';
                                            } else if (remainingDays <= 2) {
                                                return 'CLOSING';
                                            } else {
                                                return selectedApplication.status;
                                            }
                                        })()}
                                        size="sm"
                                        // theme="danger"
                                        theme={
                                            remainingDays < 0 ? 'danger' : remainingDays <= 2 ? 'warning' : "success"
                                        }
                                    />
                                </div>

                                <div className="flex items-center">
                                    <strong className="w-32 text-gray-600">Close Date:</strong>
                                    <p className="flex-1">{new Date(selectedApplication.closeDate).toLocaleString()}</p>
                                </div>

                                <br></br>
                                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") && (
                                    <><hr></hr><div className="flex items-center">
                                        <strong className="w-50 text-gray-600">Consultation Fee:</strong>
                                        <p className="flex-1">
                                            <strong className="w-40 text-gray-600">
                                                TZS {new Intl.NumberFormat().format(selectedApplication.principleAmount)}
                                            </strong>
                                        </p>
                                    </div></>

                                )}
                            </div>

                            <hr></hr>


                            {/* PDF Viewer */}
                            <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <iframe
                                    src={selectedApplication.filePath}
                                    width="100%"
                                    height="500px"
                                    title="Tender Document"
                                ></iframe>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end space-x-2 mt-6">
                                <Button label="Close" size="sm" theme="danger" onClick={() => setSelectedApplication(null)} />
                            </div>
                        </div>
                    </TenderViewModelDoItForMe>
                )}

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
