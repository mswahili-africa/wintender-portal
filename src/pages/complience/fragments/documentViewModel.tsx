import Button from "@/components/button/Button";
import { ReactNode } from "react";
import Spinner from "@/components/spinners/Spinner";

interface ModalProps {
    documentType: string;
    onClose: () => void;
    children: React.ReactNode;
}


const DocumentViewModal = ({ documentType, onClose, children }: ModalProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-green-100 rounded-lg shadow-lg max-w-3xl w-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{documentType}</h2>
                <div className="flex space-x-4">
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

export default DocumentViewModal;
