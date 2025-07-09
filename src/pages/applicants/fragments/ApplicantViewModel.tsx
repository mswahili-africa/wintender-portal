import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import BidderTenderApplicationFormModel from "@/pages/tenders/fragments/bidderTenderApplicationForm";
import DIFMAssignModel from "@/pages/tenders/fragments/difmAssignModel";
import { useUserDataContext } from "@/providers/userDataProvider";
import { lazy, Suspense, useState } from "react";

interface ModalProps {
    applicant:any
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    isLoading: boolean;
}

const ApplicantViewModal = ({ applicant,title, onClose, children, isLoading, }: ModalProps) => {

    // JCM Tender Apply Modal State




    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-green-100 rounded-lg shadow-lg max-w-3xl w-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{applicant.tenderIdTitle}</h2>
                    <div className="flex space-x-4">
                        {/* Conditionally render button or spinner */}
                            <div className="flex space-x-4">
                                <Button
                                    label="Accept"
                                    size="sm"
                                    theme="primary"
                                    onClick={()=>{}}
                                />
                                <Button
                                    label="Reject"
                                    size="sm"
                                    theme="danger"
                                    onClick={()=>{}}
                                />
                            </div>
                        <button onClick={onClose} className="text-red-500 text-xl font-bold">
                            X
                        </button>
                    </div>
                </div>

                <div className="mt-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ApplicantViewModal;
