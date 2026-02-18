import Button from "@/components/button/Button";
import Modal from "@/components/Modal";
import { useUserDataContext } from "@/providers/userDataProvider";
import { reviewApplication } from "@/services/tenders";
import { IApplicationInterface, IFiles } from "@/types/tenderWizard";
import {
    IconAlertTriangle,
    IconFileDownload,
    IconX,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface ModalProps {
    applicant: IApplicationInterface;
    title?: string;
    onClose: () => void;
}

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-800">{value || "-"}</span>
    </div>
);

export default function ApplicantViewModal({
    applicant,
    title,
    onClose,
}: ModalProps) {
    const { userData } = useUserDataContext();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [decision, setDecision] = useState<{
        id: string;
        status: "ACCEPTED" | "REJECTED";
        comment?: string;
    } | null>(null);

    const reviewMutation = useMutation({
        mutationFn: ({ id, status,comment }: { id: string; status: string; comment?: string }) =>
            reviewApplication(id, status,comment),
        onSuccess: (res: any) => {
            toast.success(res?.message || "Application reviewed");
            setConfirmOpen(false);
            onClose();
        },
        onError: () => toast.error("Failed to review application"),
    });

    const openConfirm = (status: "ACCEPTED" | "REJECTED") => {
        setDecision({ id: applicant.id, status });
        setConfirmOpen(true);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {title || "Application Review"}
                        </h2>
                        <p className="text-xs text-slate-500">
                            Ref: {applicant.reference}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100"
                    >
                        <IconX />
                    </button>
                </div>

                {/* STATUS AND ACTIONS */}
                <div className="px-6 py-3 border-b bg-slate-50 flex justify-between items-center">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
              ${applicant.comment === "ACCEPTED"
                                ? "bg-green-100 text-green-700"
                                : applicant.comment === "REJECTED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                    >
                        {applicant.comment || applicant.status}
                    </span>

                    {userData?.role === "PROCUREMENT_ENTITY" &&
                        applicant.status === "SUBMITTED" && (
                            <div className="flex gap-2">
                                <Button
                                    label="Accept"
                                    size="sm"
                                    theme="primary"
                                    onClick={() => openConfirm("ACCEPTED")}
                                />
                                <Button
                                    label="Reject"
                                    size="sm"
                                    theme="danger"
                                    onClick={() => openConfirm("REJECTED")}
                                />
                            </div>
                        )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* BIDDER */}
                    <div className="border rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-slate-700">
                            Bidder Information
                        </h3>
                        <InfoRow label="Company" value={applicant.companyName} />
                        <InfoRow label="Phone" value={applicant.companyPrimaryNumber} />
                        <InfoRow label="Email" value={applicant.companyEmail} />
                        <InfoRow
                            label="Submitted At"
                            value={new Date(applicant.createdAt).toLocaleString()}
                        />
                    </div>

                    {/* TENDER */}
                    <div className="border rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-slate-700">
                            Tender Information
                        </h3>
                        <InfoRow label="Title" value={applicant.tenderIdTitle} />
                        <InfoRow label="Tender No." value={applicant.tenderNumber} />
                        <InfoRow
                            label="Closing Date"
                            value={new Date(+applicant.tenderCloseDate).toLocaleString()}
                        />

                        <a
                            href={applicant.tenderFilePath}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mt-2"
                        >
                            <IconFileDownload size={18} />
                            View Tender Document
                        </a>
                    </div>

                    {/* DOCUMENTS */}
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">
                            {applicant?.reviewStage ?? "Review Documents"} - ({applicant.files?.length || 0})
                        </h3>

                        <div className="space-y-4">
                            {applicant.files?.map((file: IFiles, idx: number) => (
                                <details
                                    key={idx}
                                    className="border rounded-lg overflow-hidden"
                                >
                                    <summary className="cursor-pointer px-4 py-2 bg-slate-50 text-sm font-medium">
                                        {file.documentType}
                                    </summary>
                                    <iframe
                                        src={file.filePath}
                                        className="w-full h-[500px]"
                                    />
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* CONFIRM MODAL */}
            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                size="sm"
                zIndex={50}
            >
                <div className="p-6 text-center">
                    <IconAlertTriangle
                        size={42}
                        className={`mx-auto mb-3 ${decision?.status === "ACCEPTED"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                    />
                    <h3 className="text-lg font-semibold">
                        Confirm {decision?.status === "ACCEPTED" ? "Acceptance" : "Rejection"}
                    </h3>

                    {/* <p className="text-sm text-slate-600 mt-2">
                        This action cannot be undone.
                    </p> */}
                    { decision?.status === "REJECTED" && ( <div className="flex flex-col items-center mt-4 gap-2"> <strong className="text-gray-600">Comment</strong> <textarea onChange={(e)=>setDecision({...decision,comment:e.target.value})}  className="w-full p-2 border rounded input-normal" ></textarea> </div> ) }

                    <div className="mt-6 flex justify-center gap-3">
                        <Button
                            label="Cancel"
                            theme="secondary"
                            onClick={() => setConfirmOpen(false)}
                        />
                        <Button
                            label="Confirm"
                            theme={decision?.status === "ACCEPTED" ? "primary" : "danger"}
                            loading={reviewMutation.isPending}
                            onClick={() =>
                                decision &&
                                reviewMutation.mutate({
                                    id: decision.id,
                                    status: decision.status,
                                    comment:""
                                })
                            }
                        />
                    </div>
                </div>
            </Modal>

        </div>
    );
}
