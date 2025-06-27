import { Fragment } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function SMSModal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background Overlay */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-6 animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Modal Title */}
                <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

                {/* Modal Body */}
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
