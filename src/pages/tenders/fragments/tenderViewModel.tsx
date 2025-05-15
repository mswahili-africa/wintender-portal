import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import { useUserDataContext } from "@/providers/userDataProvider";
import { useState } from "react";
import DIFMAssignModel from "./difmAssignModel";

interface ModalProps {
    title: string;
    tenderId: string;
    onClose: () => void;
    children: React.ReactNode;
    isLoading: boolean;
    onDoItForMeClick: () => void;
}

const TenderViewModal = ({ title, onClose, tenderId, children, isLoading, onDoItForMeClick }: ModalProps) => {
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const [assignBidderModalOpen, setAssignBidderModalOpen] = useState(false);

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
                            <Button
                                label="Assign Bidder"
                                size="sm"
                                theme="secondary"
                                onClick={() => setAssignBidderModalOpen(true)}
                            />
                        )}
                        {userRole === "BIDDER" && (
                            isLoading ? (
                                <Spinner size="sm" />
                            ) : (
                                <Button
                                    label="Request 'Do it for me'"
                                    size="sm"
                                    theme="primary"
                                    onClick={onDoItForMeClick}
                                />
                            )
                        )}
                        <button onClick={onClose} className="text-red-500 text-xl font-bold">
                            X
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
            </div>
        </div>
    );
};

export default TenderViewModal;
