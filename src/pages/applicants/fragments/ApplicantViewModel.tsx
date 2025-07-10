import Button from "@/components/button/Button";
import { useUserDataContext } from "@/providers/userDataProvider";

interface ModalProps {
    applicant: any
    title: string;
    onClose: () => void;
    isLoading: boolean;
}

const ApplicantViewModal = ({ applicant, title, onClose, isLoading, }: ModalProps) => {
    const { userData } = useUserDataContext();

    // JCM Tender Apply Modal State




    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-green-100 rounded-lg shadow-lg max-w-3xl w-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{applicant.tenderIdTitle}</h2>
                    <div className="flex space-x-4">
                        {/* Conditionally render button or spinner */}
                        <div className="flex space-x-4">
                            {
                                ["ADMINISTRATOR","MANAGER","PUBLISHER","PROCUREMENT_ENTITY"].includes(userData?.role || "") && (
                                    <>
                                        <Button
                                            label="Accept"
                                            size="sm"
                                            theme="primary"
                                            onClick={() => { }}
                                        />
                                        <Button
                                            label="Reject"
                                            size="sm"
                                            theme="danger"
                                            onClick={() => { }}
                                        />
                                    </>
                                )
                            }

                        </div>
                        <button onClick={onClose} className="text-red-500 text-xl font-bold">
                            X
                        </button>
                    </div>
                </div>

                <div className="mt-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <>
                        <hr /><hr /><br /><br />
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
                        {/* PDF Viewer */}
                        <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <iframe
                                src={applicant.filePath}
                                width="100%"
                                height="500px"
                                title="Tender Document"
                            ></iframe>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
};

export default ApplicantViewModal;
