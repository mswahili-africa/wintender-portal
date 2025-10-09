import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import { useUserDataContext } from "@/providers/userDataProvider";
import { Suspense, useState } from "react";
import DIFMAssignModel from "./difmAssignModel";
import PETenderApplicationWizardModal from "./PETenderApplicationWizardModal";
import { IconX } from "@tabler/icons-react";
import { ITenders } from "@/types";
import Chip from "@/components/chip/Chip";
import { Countdown } from "@/components/countdown/Countdown";
import { EligibleBidders } from "./eligibleBiddersList";
import { Clarifications } from "./Clarifications";

interface ModalProps {
    tender: ITenders;
    onClose: () => void;
    isLoading: boolean;
    onDoItForMeClick: () => void;
}

const TenderViewModal = ({ onClose, tender, isLoading, onDoItForMeClick }: ModalProps) => {
    const user = useUserDataContext();
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const [assignBidderModalOpen, setAssignBidderModalOpen] = useState(false);

    // JCM Tender Tabs
    const [isDetails, setIsDetails] = useState(true);
    const [isClarification, setIsClarification] = useState(false);
    const [isEligible, setIsEligible] = useState(false);

    const handleTabChange = (tab: string) => {
        if (tab === "DETAILS") {
            setIsDetails(true);
            setIsClarification(false);
            setIsEligible
        } else if (tab === "CLARIFICATION") {
            setIsDetails(false);
            setIsClarification(true);
            setIsEligible(false);
        } else if (tab === "ELIGIBLE") {
            setIsDetails(false);
            setIsClarification(false);
            setIsEligible(true);
        }
    }


    // JCM Tender Apply Modal State
    const [isTenderApplyModalOpen, setIsTenderApplyModalOpen] = useState(false);

    // JCM handle Tender Apply Modal open/Close
    const handleTenderApplyModal = async () => {
        setAssignBidderModalOpen(false);
        new Promise((resolve) => setTimeout(resolve, 500));
        setIsTenderApplyModalOpen(true);
    };


    const handleSuccess = () => {
        console.log("Bidder assignment was successful!");
        // You can handle any additional logic you want when the assignment is successful
        setAssignBidderModalOpen(false); // Close the modal, for example
    };

    // date
    const currentDate = new Date().getTime();
    const closeDate = tender.closeDate;
    const remainingTime = closeDate - currentDate;
    const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-green-100 rounded-lg shadow-lg max-w-4xl w-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{tender.tenderNumber}</h2>
                    <div className="flex space-x-4">
                        {
                            tender.region === "GOVERNMENT" &&
                            < Button
                                label="Go NeST"
                                size="sm"
                                theme="primary"
                                variant="outline"
                                onClick={() => window.open("https://nest.go.tz/")}
                            />
                        }
                        {/* Conditionally render button or spinner */}
                        {/* {(userRole === "ADMINISTRATOR" || userRole === "MANAGER" || userRole === "PUBLISHER" || userRole === "SUPERVISOR" || userRole === "ACCOUNTANT") && ( */}
                        {!["PROCUREMENT_ENTITY","BIDDER"].includes(userRole) && (
                            <div className="flex space-x-4">
                                <Button
                                    label="Assign Bidder"
                                    size="sm"
                                    theme="secondary"
                                    onClick={() => setAssignBidderModalOpen(true)}
                                />
                            </div>
                        )}
                        {userRole === "BIDDER" && (
                            isLoading ? (
                                <Spinner size="sm" />
                            ) : (
                                <div className="flex space-x-4">
                                    {tender.selfApply && (
                                        <Button
                                            label="Apply"
                                            size="sm"
                                            theme="primary"
                                            onClick={handleTenderApplyModal}
                                        />
                                    )}


                                    <Button
                                        label="Request 'Do it for me'"
                                        size="sm"
                                        theme="primary"
                                        onClick={onDoItForMeClick}
                                    />
                                </div>
                            )
                        )}
                        <button onClick={onClose} className="text-red-500 text-xl font-bold">
                            <IconX size={26} />
                        </button>
                    </div>
                </div>

                {tender.selfApply || (userRole === "ADMINISTRATOR" || userRole === "MANAGER" || userRole === "PUBLISHER") && (
                    <div className="flex w-full justify-center mb-4">
                        <div className="flex flex-row w-full border-2 border-gray-400 rounded">
                            <button type="button" onClick={() => handleTabChange("DETAILS")} className={` uppercase w-full p-2 text-sm ${isDetails ? "bg-green-600 text-white" : "text-gray-500"} `}>Details</button>

                            {tender.selfApply && (
                            <button type="button" onClick={() => handleTabChange("CLARIFICATION")} className={` uppercase w-full p-2 text-sm ${isClarification ? "bg-green-600 text-white" : "text-gray-500"} `}>Clarifications</button>
                            )}
                            {(userRole === "ADMINISTRATOR" || userRole === "MANAGER" || userRole === "PUBLISHER") && (
                                <button type="button" onClick={() => handleTabChange("ELIGIBLE")} className={` uppercase w-full p-2 text-sm ${isEligible ? "bg-green-600 text-white" : "text-gray-500"} `}>Eligible Bidders</button>
                            )}
                        </div>
                    </div>
                )}
                <div className="mt-4 overflow-y-auto" style={{ minHeight: '40vh', maxHeight: '70vh' }}>
                    {
                        isDetails && (
                            <div className="px-2 overflow-y-auto">
                                {/* Tender Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">{tender.title}</h3>

                                </div>

                                {/* Tender Details */}
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row w-full justify-between">
                                        <div className="flex items-center">
                                            <strong className="w-32 text-gray-600">Close Date:</strong>
                                            <p className="flex-1">{new Date(tender.closeDate).toLocaleString()}</p>
                                        </div>
                                        <div className="flex flex-col px-4 gap-x-2 items-center">
                                            <p className="flex-1 text-xs">Remaining Time:</p>
                                            <Countdown expirationTime={tender.closeDate} />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">Name:</strong>
                                        <p className="flex-1">{tender.entityName}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">Category:</strong>
                                        <p className="flex-1">{tender.categoryName}</p>
                                    </div>
                                    <div className="flex">
                                        {/* <strong className="w-32 text-gray-600">Summary:</strong> */}
                                        <p className="flex-1 my-3 text-justify" dangerouslySetInnerHTML={{ __html: tender.summary }}></p>
                                    </div>

                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">Status:</strong>
                                        <Chip
                                            label={
                                                (() => {
                                                    if (remainingDays < 0) {
                                                        return 'CLOSED';
                                                    } else {
                                                        return tender.status;
                                                    }
                                                })()
                                            }
                                            size="sm"
                                            theme={
                                                (() => {
                                                    if (remainingDays < 0) {
                                                        return 'danger';
                                                    } else {
                                                        return 'success';
                                                    }
                                                })()
                                            }
                                        />
                                    </div>

                                    {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") && (
                                        <><div className="flex items-center">
                                            <strong className="w-50 text-gray-600">Consultation Fee:</strong>
                                            <p className="flex-1">
                                                TZS {new Intl.NumberFormat().format(tender.consultationFee)}
                                            </p>
                                        </div></>

                                    )}
                                </div>

                                <hr></hr>

                                {/* PDF Viewer */}
                                <div className="mt-4" style={{ overflowY: 'auto' }}>
                                    <iframe
                                        src={tender.filePath}
                                        width="100%"
                                        height={"500px"}
                                        title="Tender Document"
                                    ></iframe>
                                </div>
                            </div>
                        )
                    }
                    {
                        isClarification && <Clarifications tender={tender} />
                    }
                    {
                        isEligible && <EligibleBidders tender={tender} />
                    }
                </div>
                {/* Modal Footer */}

                <div className="flex justify-end space-x-2 mt-6">
                    <Button label="Close" size="sm" theme="danger" onClick={onClose} />
                </div>

                {/* Assign Bidder Modal */}

                {assignBidderModalOpen && (
                    <DIFMAssignModel
                        isOpen={assignBidderModalOpen}
                        onClose={() => setAssignBidderModalOpen(false)}
                        tenderId={tender.id}
                        onSuccess={handleSuccess}
                    />
                )}

                {isTenderApplyModalOpen && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <PETenderApplicationWizardModal
                            isOpen={isTenderApplyModalOpen}
                            onClose={() => setIsTenderApplyModalOpen(false)}
                            tenderId={tender.id}
                            onSuccess={handleSuccess}
                        />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default TenderViewModal;
