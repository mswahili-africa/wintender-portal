import Button from '@/components/button/Button';
import { ICompany, IUser } from '@/types';
import { IMessage, RatingReason } from '@/types/forms';
import { IconLoader, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedUser?: ICompany | null;
}

// Dropdown option type
export interface DropdownOption {
  value: keyof typeof RatingReason; // enum key
  label: string;                        // enum value
}

// Generate options
export const options: DropdownOption[] = Object.entries(RatingReason).map(
  ([key, value]) => ({
    value: key as keyof typeof RatingReason,
    label: value
  })
);

// const options = Object.values(RatingReason).map(reason => ({
//     value: reason,
//     label: reason
// }));

export default function RatingModal({ isOpen, onClose, selectedUser}: ModalProps) {
    if (!isOpen) return null;

    const [message, setMessage] = useState<string>("");
    const [reason, setReason] = useState<string>(''); // url for media type

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<any>(null);

    // useEffect(() => {
    //     setMediaType('');
    //     setMedia('');
    //     setMessage('');
    //     if (selectedUser) {
    //         setIsMessageToAll(false);
    //         setNumberOfRecipient(selectedUser?.phoneNumber || '');
    //     } else {
    //         setIsMessageToAll(true);
    //     }
    // }, [selectedUser]);

    const ratingMutation = useMutation({
        mutationFn: async ( data: any) => {console.log(data)},
        onSuccess: () => {
            toast.success("Sent successfully");
            setMessage("");
            setReason('');
            setRating(0);
            toast.success("Rating submitted");
            onClose();

        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Send failed");
        },
    });

    const handleRating = () => {
        const payload = {
            userId: selectedUser?.id,
            rating,
            reason,
            message
        };
        ratingMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Overlay - Blocks interaction with behind elements */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
                aria-label="Close modal"
                style={{ pointerEvents: 'auto' }}  // Block interaction with background
            />

            <div
                className="relative z-60 bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
                style={{ pointerEvents: 'auto' }} // Allow interaction with modal
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Close"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-6 text-center">Rate <span className='text-green-600'>{selectedUser?.name}</span></h2>

                <div className="flex flex-col gap-y-4">
                    

                    <div className="flex flex-col items-center">
                        <label className="block mb-2 font-medium">Rate</label>

                        <div className="flex gap-6">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = star <= (hoverRating || rating);

                                return (
                                    <span
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        className="cursor-pointer transition-transform hover:scale-110"
                                    >
                                        {isActive ? (
                                            <IconStarFilled className="w-12 h-12 text-yellow-500" />
                                        ) : (
                                            <IconStar className="w-12 h-12 text-gray-400" />
                                        )}
                                    </span>
                                );
                            })}
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            {rating > 0 ? `${rating} / 5` : "Select rating"}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <label className="block mb-2">Reason for rating</label>
                        <Select
                            options={options}
                            onChange={(value) => setReason(value?.value || '')}
                            placeholder="Select a reason"
                        />
                        {/* {errors.companyAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
                        )} */}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <textarea
                            className="input-normal w-full mb-4"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your remarks here"
                        />
                    </div>


                    <div className="flex flex-row items-center justify-between gap-3 mt-4">
                        {
                            ratingMutation.isPending ? (
                                <div className="col-span-full flex mx-auto items-center">
                                    <IconLoader className="animate-spin duration-300 w-8 h-8 text-green-500" />
                                </div>
                            ) :
                                <div className="flex flex-col w-full gap-3">
                                    <div className="flex flex-row items-center justify-center w-full gap-2">
                                        <Button
                                            variant="filled"
                                            label='Rate this user'
                                            size="md"
                                            theme="primary"
                                            onClick={() => {
                                                handleRating();
                                            }}
                                        />

                                    </div>
                                </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}
