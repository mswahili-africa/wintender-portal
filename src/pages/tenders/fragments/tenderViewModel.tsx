import { ReactNode } from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

const TenderViewModal = ({ title, onClose, children }: ModalProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-green-100 rounded-lg shadow-lg max-w-2xl w-full p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{title}</h2>
                <button onClick={onClose}>X</button>
            </div>
            <div className="mt-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                {children}
            </div>
        </div>
    </div>
    );
};

export default TenderViewModal;
