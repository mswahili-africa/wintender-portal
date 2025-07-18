import Button from "@/components/button/Button";
import Modal from "@/components/Modal";
import Spinner from "@/components/spinners/Spinner";
import { useUserDataContext } from "@/providers/userDataProvider";
import { reviewApplication } from "@/services/tenders";
import { IconAlertTriangle, IconFileDownload, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface ModalProps {
    applicant: any;
    title: string;
    onClose: () => void;
    isLoading: boolean;
}

const ApplicantViewModal = ({ applicant, title, onClose }: ModalProps) => {
    const { userData } = useUserDataContext();

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [data, setData] = useState({ id: "", status: "" });

    const applicationReviewMutation = useMutation({
        mutationFn: async (data: { id: string, status: string }) => {
            return await reviewApplication(data.id, data.status);
        },
        onSuccess: (response: any) => {
            toast.success(response?.message || "Request sent successfully");
        },
        onError: () => {
            toast.error("Failed to submit request.");
        },
    });

    const handleConfirmation = (status: string, id: string) => {
        setData({ id, status });
        setIsConfirmationModalOpen(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
            <div className="bg-green-100 rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-y-auto max-h-[95vh]">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{title || applicant.reference}</h2>
                    <button onClick={onClose} className="text-red-600 hover:text-red-800">
                        <IconX size={26} />
                    </button>
                </div>

                {/* Status Buttons */}
                <div className="mb-6">
                    {["PROCUREMENT_ENTITY"].includes(userData?.role || "") &&
                        applicant.status === "SUBMITTED" &&
                        applicant.comment === null && (
                            <div className="flex gap-3">
                                <Button
                                    label="Accept"
                                    size="sm"
                                    theme="primary"
                                    disabled={applicationReviewMutation.isLoading}
                                    onClick={() => handleConfirmation("ACCEPTED", applicant.id)}
                                />
                                <Button
                                    label="Reject"
                                    size="sm"
                                    theme="danger"
                                    disabled={applicationReviewMutation.isLoading}
                                    onClick={() => handleConfirmation("REJECTED", applicant.id)}
                                />
                            </div>
                        )}

                    {["ADMINISTRATOR", "MANAGER", "PROCUREMENT_ENTITY"].includes(userData?.role || "") &&
                        applicant.status === "CLOSED" && (
                            <div className={`rounded-lg px-4 py-2 inline-block text-sm font-medium ${
                                applicant.comment === "ACCEPTED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}>
                                {applicant.comment}
                            </div>
                        )}
                </div>

                {/* Bidder Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <strong className="w-32 text-gray-600">Bidder:</strong>
                            <span className="text-gray-800">{applicant?.companyName}</span>
                        </div>
                        <div className="flex items-center">
                            <strong className="w-32 text-gray-600">Phone:</strong>
                            <a href={`tel:${applicant.companyPrimaryNumber}`} className="text-blue-600 hover:underline">
                                {applicant.companyPrimaryNumber}
                            </a>
                        </div>
                        <div className="flex items-center">
                            <strong className="w-32 text-gray-600">Email:</strong>
                            <a href={`mailto:${applicant.companyEmail}`} className="text-blue-600 hover:underline">
                                {applicant.companyEmail}
                            </a>
                        </div>
                        <div className="flex items-center">
                            <strong className="w-32 text-gray-600">Application Date:</strong>
                            <span>{new Date(applicant.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex">
                            <strong className="w-32 text-gray-600">Tender:</strong>
                            <span className="text-gray-800">{applicant?.tenderIdTitle}</span>
                        </div>
                        <div className="flex items-center">
                            <strong className="w-32 text-gray-600">Closing Date:</strong>
                            <span>{new Date(Number(applicant.tenderCloseDate)).toLocaleString()}</span>
                        </div>
                        <div>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={applicant.tenderFilePath}
                                className="flex items-center gap-2 p-4 bg-green-100 border-2 border-green-400 rounded-md text-green-800 hover:bg-green-200 transition"
                            >
                                <IconFileDownload size={32} />
                                <span className="font-semibold">View Tender Document</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* PDF Files */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Application Package ({applicant.files?.length ?? 0})
                    </h3>
                    <ul className="text-sm italic text-red-600 space-y-1 mb-4">
                        {applicant.files?.map((file: any, index: number) => (
                            <li key={index}>- <a href={`#${file.stage}`}>{file.stage}</a></li>
                        ))}
                    </ul>
                    {applicant.files?.map((file: any, index: number) => (
                        <div key={index} id={file.stage} className="mb-6">
                            <h4 className="text-base font-bold mb-2">{file.stage}</h4>
                            <div className="border rounded overflow-hidden">
                                <iframe
                                    src={file.filePath}
                                    width="100%"
                                    height="500px"
                                    title={file.stage}
                                ></iframe>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Confirmation Modal */}
                <Modal
                    isOpen={isConfirmationModalOpen}
                    onClose={() => setIsConfirmationModalOpen(false)}
                    size="sm"
                >
                    <div className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <IconAlertTriangle
                                size={40}
                                className={
                                    data.status === "ACCEPTED" ? "text-green-500" : "text-red-500"
                                }
                            />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Confirm {data.status}</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to {" "}
                            <span className={`font-semibold text-${
                                data.status === "ACCEPTED" ? "green" : "red"
                            }-600`}>
                                {data.status.toLowerCase()}
                            </span>{" "}
                            this application? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <Button
                                label="Cancel"
                                theme="secondary"
                                onClick={() => setIsConfirmationModalOpen(false)}
                            />
                            <Button
                                label={`I confirm ${data.status.toLowerCase()}`}
                                theme={data.status === "ACCEPTED" ? "primary" : "danger"}
                                loading={applicationReviewMutation.isLoading}
                                onClick={() => {
                                    applicationReviewMutation.mutate({
                                        id: data.id,
                                        status: data.status,
                                    });
                                    setIsConfirmationModalOpen(false);
                                    onClose();
                                }}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default ApplicantViewModal;
