import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import { useUserDataContext } from "@/providers/userDataProvider";
import { Suspense, useState } from "react";
import DIFMAssignModel from "./difmAssignModel";
import PETenderApplicationWizardModal from "./PETenderApplicationWizardModal";
import { IconX } from "@tabler/icons-react";

interface ModalProps {
    selfApply: boolean;
    title: string;
    tenderId: string;
    onClose: () => void;
    children: React.ReactNode;
    isLoading: boolean;
    onDoItForMeClick: () => void;
}

const TenderViewModal = ({ selfApply, title, onClose, tenderId, children, isLoading, onDoItForMeClick }: ModalProps) => {
    const user = useUserDataContext();
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const [assignBidderModalOpen, setAssignBidderModalOpen] = useState(false);


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


    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-green-100 rounded-lg shadow-lg max-w-3xl w-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <div className="flex space-x-4">
                        {/* Conditionally render button or spinner */}
                        {(userRole === "ADMINISTRATOR" || userRole === "MANAGER" || userRole === "PUBLISHER") && (
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
                                    {selfApply && (
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

                <div className="mt-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    {children}
                </div>

                {/* Assign Bidder Modal */}

                {assignBidderModalOpen && (
                    <DIFMAssignModel
                        isOpen={assignBidderModalOpen}
                        onClose={() => setAssignBidderModalOpen(false)}
                        tenderId={tenderId}
                        onSuccess={handleSuccess}
                    />
                )}

                {isTenderApplyModalOpen && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <PETenderApplicationWizardModal
                            isOpen={isTenderApplyModalOpen}
                            onClose={() => setIsTenderApplyModalOpen(false)}
                            tenderId={tenderId}
                            onSuccess={handleSuccess}
                        />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default TenderViewModal;
