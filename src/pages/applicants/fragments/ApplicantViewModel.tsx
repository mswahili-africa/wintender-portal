import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import { useUserDataContext } from "@/providers/userDataProvider";
import { reviewApplication } from "@/services/tenders";
import { IconFileDownload, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { string } from "yup";

interface ModalProps {
    applicant: any
    title: string;
    onClose: () => void;
    isLoading: boolean;
}

const ApplicantViewModal = ({ applicant, title, onClose, isLoading, }: ModalProps) => {
    const { userData } = useUserDataContext();
    const [loading, setLoading] = useState(false);

    // JCM accept or reject tender
    const applicationReviewMutation = useMutation({
        mutationFn: async (data: { id: string, status: string }) => {
            setLoading(true);
            return await reviewApplication(data.id, data.status)
        },
        onSuccess: (response: any) => {
            setLoading(false);
            toast.success(response?.message || "Request send successfully");
        },
        onError: (error: any) => {
            setLoading(false);
            toast.error("Failed to submit request.");
        },
    })


    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-green-100 rounded-lg shadow-lg max-w-4xl w-full p-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{applicant.reference}</h2>
                    <div className="flex space-x-4">
                        {/* Conditionally render button or spinner */}
                        <div className="flex space-x-4">
                            {
                                ["ADMINISTRATOR", "MANAGER", "PROCUREMENT_ENTITY"].includes(userData?.role || "") && applicant.status === "SUBMITTED" && applicant.comment === null && (
                                    !loading ? (
                                        <>
                                            <Button
                                                label="ACCEPT"
                                                size="sm"
                                                theme="primary"
                                                onClick={() => { applicationReviewMutation.mutate({ id: applicant.id, status: "ACCEPTED" }) }}
                                            />
                                            <Button
                                                label="REJECT"
                                                size="sm"
                                                theme="danger"
                                                onClick={() => { applicationReviewMutation.mutate({ id: applicant.id, status: "REJECTED" }) }}
                                            />
                                        </>

                                    ) : (
                                        <div className=".w-full.flex.items-center.justify-center" >
                                            <Spinner />
                                        </div>
                                    )
                                )

                            }
                            {
                                ["ADMINISTRATOR", "MANAGER", "PROCUREMENT_ENTITY"].includes(userData?.role || "") && applicant.status === "CLOSED" && (
                                    applicant.comment === "ACCEPTED" ? (
                                        <div className="rounded-lg p-2 text-sm border bg-green-500 border-green-500 text-white">{applicant.comment}</div>
                                    ) : (
                                        <div className="rounded-lg p-2 text-sm border bg-red-500 border-red-500 text-white">{applicant.comment}</div>
                                    )
                                )
                            }
                        </div>
                        <button onClick={onClose} className="text-red-500 text-xl font-bold">
                            <IconX size={26} />
                        </button>
                    </div>
                </div>

                <div className="mt-4 overflow-y-auto" style={{ maxHeight: '75vh' }}>
                    <>
                        <hr /><hr /><br /><br />
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="order-2 md:order-1">
                                <div className="space-y-4">
                                    <div className="flex items-center  mb-4">
                                        <strong className="w-32 text-gray-600">Bidder:</strong>
                                        <h3 className="text-l font-semi-bold text-gray-800">{applicant?.companyName}</h3>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <strong className="w-32 text-gray-600">Phone:</strong>
                                        <a href={`tel:${applicant.companyPrimaryNumber}`} className="text-l font-semi-bold text-gray-800">
                                            {applicant.companyPrimaryNumber}
                                        </a>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <strong className="w-32 text-gray-600">Email:</strong>
                                        <a href={`mailto:${applicant.companyEmail}`} className="text-l font-semi-bold text-gray-800">
                                            {applicant.companyEmail}
                                        </a>
                                    </div>

                                </div>
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">Application Date:</strong>
                                        <p className="flex-1">{new Date(applicant.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="space-y-4">
                                    <div className="flex items-center  mb-4">
                                        <strong className="w-32 text-gray-600">Tender:</strong>
                                        <h3 className="text-l font-semi-bold text-gray-800">{applicant?.tenderIdTitle}</h3>
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <div className="flex items-center">
                                            <strong className="w-32 text-gray-600">Closing Date:</strong>
                                            <p className="flex-1">{new Date(Number(applicant.tenderCloseDate)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {/* LInk to download document */}
                                    <div className="flex flex-col  mb-4">
                                        {/* <strong className=" text-gray-600">Tender document:</strong> */}
                                        <a target="_blank" href={`${applicant.tenderFilePath}`} className="text-l rounded-lg border-4 border-green-400 p-2 bg-green-200 md:p-4 gap-2 flex items-center flex-col gap-x-2 my-3 font-semi-bold text-gray-800">
                                            <IconFileDownload size={40} />
                                            <div className="text-xs">View tender document here</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* PDF Viewer */}
                        <div className="font-bold text-lg my-4 uppercase" id={applicant.companyName}>Application package ({applicant.files?.length ?? 0})</div>
                        <ul className="flex flex-col text-red-600 italic text-sm list-inside ">
                            {
                                applicant.files?.map((file: any, index: number) => (
                                    <li key={index}>
                                        - <a href={`#${file.stage}`}>
                                            {file.stage}
                                        </a>
                                    </li>
                                )
                                )

                            }
                        </ul>
                        {
                            applicant.files?.map((file: any, index: number) => (
                                <div key={index} className="mt-4" id={file.stage}>
                                    <h2 className="text-base font-bold mb-2">{file.stage}</h2>
                                    <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <iframe
                                            src={file.filePath}
                                            width="100%"
                                            height="500px"
                                            title="Tender Document"
                                        ></iframe>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                </div>
            </div>
        </div >
    );
};

export default ApplicantViewModal;
