import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import { IConsultation } from "@/types/forms";
import { useMutation } from "@tanstack/react-query";
import { createConsultMe } from "@/services/tenders";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { t } from "i18next";
import Modal from "@/components/widgets/Modal";


interface BillboardViewModalProps {
    isOpen: boolean;
    billboard: IConsultation | null;
    onClose: () => void;
    translateFn?: (key: string) => string;
}

export default function BillboardViewModal({
    isOpen,
    billboard,
    onClose,
    translateFn
}: BillboardViewModalProps) {

    // Safe fallback if translation function isn't provided or needed
    const { showConfirmation } = usePopup();

    if (!isOpen || !billboard) return null;


    const requestMutation = useMutation({
        mutationFn: (id: string) => createConsultMe(id),
        onSuccess: () => {
            toast.success("Request send successfully");
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "");
        }
    });

    const handleConsultMeClick = () => {
        showConfirmation({
            theme: "success",
            title: "Request Consultation",
            message: "Request will be send to our team for processing",
            onConfirm: () => requestMutation.mutate(billboard.id),
            onCancel: () => { }
        })

    }

    return (
        // >
        <Modal
            size="2xl"
            isOpen={isOpen}
            zIndex={10}
            onClose={onClose}
            title={""}         >

            {/* MODAL HEADER BLOCK */}
            <div className="flex justify-between items-center mb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {billboard?.title}
                </h2>

                <Button
                    size="sm"
                    label={t('menu-consult-me')}
                    theme="primary"
                    onClick={handleConsultMeClick}
                    disabled={requestMutation.isPending}
                >
                    {requestMutation.isPending ? (
                        <div className="flex items-center gap-2">
                            <Spinner size="sm" />
                            <span>Requesting...</span>
                        </div>
                    ) : (
                        "Request Consultation"
                    )}
                </Button>
            </div>

            {/* MODAL RICH BODY CONTENT */}
            <div
                className="text-gray-600 mb-6 text-sm leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: billboard ? billboard.message : "" }}
            />

            {/* FOOTER ACTIONS */}
            <div className="flex justify-end border-t border-zinc-100 pt-4">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
                >
                    Close
                </button>
            </div>

        </Modal>
    );
}