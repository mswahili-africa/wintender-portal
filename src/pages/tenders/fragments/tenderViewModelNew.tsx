import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import { useUserDataContext } from "@/providers/userDataProvider";
import React, { act, Fragment, Suspense, useRef, useState } from "react";
import DIFMAssignModel from "./difmAssignModel";
import PETenderApplicationWizardModal from "./PETenderApplicationWizardModal";
import { IconX } from "@tabler/icons-react";
import { ITenders } from "@/types";
import Chip from "@/components/chip/Chip";
import { Countdown } from "@/components/countdown/Countdown";
import { EligibleBidders } from "./eligibleBiddersList";
import { Clarifications } from "./Clarifications";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
    isOpen: boolean;
    tender: ITenders | null;
    onClose: () => void;
    isLoading: boolean;
    onDoItForMeClick: () => void;
}

const TenderViewModal = ({ onClose, tender, isLoading, onDoItForMeClick, isOpen }: ModalProps) => {
    const user = useUserDataContext();
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const [assignBidderModalOpen, setAssignBidderModalOpen] = useState(false);

    // JCM Tender Tabs
    const [activeTab, setActiveTab] = useState<"DETAILS" | "CLARIFICATION" | "ELIGIBLE">("DETAILS");



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
    const closeDate = tender?.closeDate;
    const remainingTime = closeDate! - currentDate;
    const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

    console.log(tender)

    return (
        <>

            <Dialog open={isOpen} onClose={onClose} className="relative z-20">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />


                <div className="fixed inset-0 flex items-center justify-center p-4">

                    <div className="bg-green-100 rounded-lg shadow-lg max-w-4xl w-full p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{tender?.tenderNumber}</h2>
                            <div className="flex space-x-4">
                                {
                                    tender?.region === "GOVERNMENT" && remainingTime > 0 &&
                                    < Button
                                        label="Go NeST"
                                        size="sm"
                                        theme="primary"
                                        variant="outline"
                                        onClick={() => window.open("https://nest.go.tz/")}
                                    />
                                }
                                {/* Conditionally render button or spinner */}
                                {!["PROCUREMENT_ENTITY", "BIDDER"].includes(userRole) && remainingTime > 0 && (
                                    <div className="flex space-x-4">
                                        <Button
                                            label="Assign Bidder"
                                            size="sm"
                                            theme="secondary"
                                            onClick={() => setAssignBidderModalOpen(true)}
                                        />
                                    </div>
                                )}
                                {userRole === "BIDDER" && remainingTime > 0 && (
                                    isLoading ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <div className="flex space-x-4">
                                            {tender?.selfApply && (
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

                        {/* {tender?.selfApply ||  ["ADMINISTRATOR","MANAGER","PUBLISHER","ACCOUNTANT","SUPERVISOR"].includes(userRole) && ( */}
                            <div className="flex w-full justify-center mb-4">
                                <div className="flex flex-row w-full border-2 border-gray-400 rounded">
                                    <button type="button" onClick={() => setActiveTab("DETAILS")} className={` uppercase w-full p-2 text-sm ${activeTab === "DETAILS" ? "bg-green-600 text-white" : "text-gray-500"} `}>Details</button>

                                    {tender?.selfApply && (
                                        <button type="button" onClick={() => setActiveTab("CLARIFICATION")} className={` uppercase w-full p-2 text-sm ${activeTab === "CLARIFICATION" ? "bg-green-600 text-white" : "text-gray-500"} `}>Clarifications</button>
                                    )}
                                    {(userRole === "ADMINISTRATOR" || userRole === "MANAGER" || userRole === "PUBLISHER" || userRole === "ACCOUNTANT" || userRole === "SUPERVISOR") && (
                                        <button type="button" onClick={() => setActiveTab("ELIGIBLE")} className={` uppercase w-full p-2 text-sm ${activeTab === "ELIGIBLE" ? "bg-green-600 text-white" : "text-gray-500 bg-transparent"} `}>Eligible Bidders</button>
                                    )}
                                </div>
                            </div>
                        {/* )}  */}
                        <div className="mt-4 overflow-y-auto" style={{ minHeight: '40vh', maxHeight: '70vh' }}>
                            {
                                activeTab === "DETAILS" && (
                                    <div className="px-2 overflow-y-auto">
                                        {/* Tender Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">{tender?.title}</h3>

                                        </div>

                                        {/* Tender Details */}
                                        <div className="space-y-2">
                                            <div className="flex flex-col sm:flex-row w-full justify-between">
                                                <div className="flex items-center">
                                                    <strong className="w-24 sm:w-32 text-gray-600">Close Date:</strong>
                                                    <p className="flex-1">{new Date(tender?.closeDate!).toLocaleString()}</p>
                                                </div>
                                                <div className="flex flex-col px-4 gap-x-2 items-center">
                                                    <p className="flex-1 text-xs">Remaining Time:</p>
                                                    <Countdown expirationTime={tender?.closeDate!} />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <strong className="w-32 text-gray-600">Name:</strong>
                                                <p className="flex-1">{tender?.entityName}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center">
                                                <strong className="w-32 text-gray-600">Category:</strong>
                                                <p className="flex-1">{tender?.categoryName}</p>
                                            </div>
                                            <div className="flex">
                                                {/* <strong className="w-32 text-gray-600">Summary:</strong> */}
                                                <p className="flex-1 my-3 text-justify" dangerouslySetInnerHTML={{ __html: tender?.summary! }}></p>
                                            </div>

                                            <div className="flex items-center">
                                                <strong className="w-32 text-gray-600">Status:</strong>
                                                <Chip
                                                    label={
                                                        (() => {
                                                            if (remainingDays < 0) {
                                                                return 'CLOSED';
                                                            } else {
                                                                return tender?.status!;
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
                                                        TZS {new Intl.NumberFormat().format(tender?.consultationFee!)}
                                                    </p>
                                                </div></>

                                            )}
                                        </div>

                                        <hr></hr>

                                        {/* PDF Viewer */}
                                        <div className="mt-4" style={{ overflowY: 'auto' }}>
                                            <iframe
                                                src={tender?.filePath}
                                                width="100%"
                                                height={"500px"}
                                                title="Tender Document"
                                            ></iframe>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                activeTab === "CLARIFICATION" && <Clarifications tender={tender!} />
                            }
                            {
                                activeTab === "ELIGIBLE" && <EligibleBidders tender={tender!} />
                            }
                        </div>
                        {/* Modal Footer */}

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button label="Close" size="sm" theme="danger" onClick={onClose} />
                        </div>



                    </div>
                </div>


                {/* MOdALS */}
                {/* Assign Bidder Modal */}
                {assignBidderModalOpen && (
                    <DIFMAssignModel
                        isOpen={assignBidderModalOpen}
                        onClose={() => setAssignBidderModalOpen(false)}
                        tenderId={tender?.id!}
                        onSuccess={handleSuccess}
                    />
                )}

                {isTenderApplyModalOpen && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <PETenderApplicationWizardModal
                            isOpen={isTenderApplyModalOpen}
                            onClose={() => setIsTenderApplyModalOpen(false)}
                            tenderId={tender?.id!}
                            onSuccess={handleSuccess}
                        />
                    </Suspense>
                )}
            </Dialog>



        </>
    );
};

export default TenderViewModal;
