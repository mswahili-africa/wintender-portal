import Chip from '@/components/chip/Chip';
import React from 'react';

interface ModalProps {
    tenderGroup: string;
    onClose: () => void;
    children: React.ReactNode;
}

const TenderViewModelDoItForMe = ({ tenderGroup, onClose, children }: ModalProps) => {
    const theme: "primary" | "warning" = tenderGroup === "PRIVATE" ? "warning" : "primary";

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-green-100 rounded-lg shadow-lg w-[800px] p-4"> {/* Set width to 800px */}
                <div className="flex justify-between items-center mb-4">
                    {/* Tender Group and Chip */}
                    <div className="flex items-center space-x-2">
                        <Chip label={tenderGroup} size="sm" theme={theme} variant="outline" />
                    </div>
                    {/* Close Button */}
                    <button onClick={onClose} className="text-red-500 text-xl font-bold">
                        X
                    </button>
                </div>

                {/* Modal Content */}
                <div className="mt-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default TenderViewModelDoItForMe;
