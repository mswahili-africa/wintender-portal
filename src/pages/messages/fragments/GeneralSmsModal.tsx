import { sendTexts } from '@/services/notificationServices';
import { ICompany, IUser } from '@/types';
import { IMessage } from '@/types/forms';
import { IconLoader } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    selectedUser?: ICompany | null;
    setSelectedUser?: (user: ICompany | null) => void;
    bulkSendGroup?: string;
}

export default function GeneralSMSModal({ isOpen, onClose, title, selectedUser, bulkSendGroup, setSelectedUser }: ModalProps) {
    if (!isOpen) return null;

    const [message, setMessage] = useState<string>("");
    const [isMessageToAll, setIsMessageToAll] = useState<boolean>(true); // true means bulk message 
    const [mediaType, setMediaType] = useState<'video' | 'image' | ''>(''); // null means no media, just text
    const [media, setMedia] = useState<string>(''); // url for media type
    const [numberOfRecipient, setNumberOfRecipient] = useState<string>(''); // number of recipients

    useEffect(() => {
        setMediaType('');
        setMedia('');
        setMessage('');
        if (selectedUser) {
            setIsMessageToAll(false);
            setNumberOfRecipient(selectedUser?.phoneNumber || '');
        } else {
            setIsMessageToAll(true);
        }
    }, [selectedUser]);

    const sendSMS = useMutation({
        mutationFn: ({ data, group }: { data: IMessage; group: string }) => sendTexts(data, group),
        onSuccess: () => {
            toast.success("Sent successfully");
            setMessage("");
            setMediaType('');
            setMedia('');
            setNumberOfRecipient('');
            setSelectedUser && setSelectedUser(null);
            onClose();

        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Send failed");
        },
    });
    const handleSendSMS = (messageMode: "WHATSAPP" | "SMS") => {
        let sendGroup = "SINGLE";

        const phoneNumber = isMessageToAll ? "0100000000" : numberOfRecipient; // Default number for bulk 
        if (!phoneNumber) return;

        // Check if it's a default number
        if (phoneNumber === "0100000000") {
            sendGroup = bulkSendGroup!;
        }
        sendSMS.mutate({ data: { phoneNumber, message, mediaType, media, messageMode, name: selectedUser?.name! }, group: sendGroup });
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

                <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

                <div>
                    {/* send as single or bulk */}
                    {
                        selectedUser === null &&
                        <div className="mb-4 flex flex-row w-full">
                            <button className={`${isMessageToAll ? 'bg-green-500 text-white' : ''} p-2 w-full border`} onClick={() => setIsMessageToAll(true)}  >Bulk</button>
                            <button className={`${!isMessageToAll ? 'bg-green-500 text-white' : ''} p-2 w-full border`} onClick={() => setIsMessageToAll(false)}>Single</button>
                        </div>
                    } 


                    {/* If message is for SINGLE user */}
                    {!isMessageToAll && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>

                                <input
                                    type="text"
                                    className="input-normal w-full mb-4"
                                    value={numberOfRecipient}
                                    onChange={(e) => setNumberOfRecipient(e.target.value)}
                                    readOnly={selectedUser ? true : false}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver name</label>
                                <input
                                    type="text"
                                    className="input-normal w-full mb-4"
                                    value={selectedUser?.companyName}
                                />
                            </div>

                        </>
                    )}


                    {/* media type */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    value=""
                                    checked={mediaType === ''}
                                    onChange={(e) => setMediaType(e.target.value as 'video' | 'image' | "")}
                                />
                                <span className="ml-2">None</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    value="video"
                                    checked={mediaType === 'video'}
                                    onChange={(e) => setMediaType(e.target.value as 'video' | 'image' | '')}
                                />
                                <span className="ml-2">Video</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio"
                                    value="image"
                                    checked={mediaType === 'image'}
                                    onChange={(e) => setMediaType(e.target.value as 'video' | 'image' | '')}
                                />
                                <span className="ml-2">Image</span>
                            </label>
                        </div>
                    </div>
                    {mediaType && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{mediaType === 'video' ? 'Video' : 'Image'} URL</label>
                            <input
                                type="url"
                                className="input-normal w-full mb-4"
                                value={media}
                                onChange={(e) => setMedia(e.target.value)}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            className="input-normal w-full mb-4"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here"
                            maxLength={160} // Limit to 160 characters
                        />
                        <p className="text-sm text-gray-500">
                            {message.length}/160 characters
                        </p>
                    </div>


                    <div className="flex flex-row items-center justify-between gap-3 mt-4">
                        {
                            sendSMS.isPending ? (
                                <div className="col-span-full flex mx-auto items-center">
                                    <IconLoader className="animate-spin duration-300 w-8 h-8 text-green-500" />
                                </div>
                            ) : 
                            <div className="flex flex-col w-full gap-3">
                                <div className="col-span-full w-full text-center font-bold">Send as</div>
                            <div className="flex flex-row items-center w-full gap-2">

                                {/* whatsapp */}
                                <button
                                    className={`flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500 ${sendSMS.isPending ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    onClick={() => handleSendSMS("WHATSAPP")}
                                    disabled={sendSMS.isPending}
                                >
                                    {"Whatsapp"}
                                </button>

                                {/* sms */}
                                {
                                    mediaType === '' && (
                                        <button
                                            className={`flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500 ${sendSMS.isPending ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            onClick={() => handleSendSMS("SMS")}
                                            disabled={sendSMS.isPending}
                                        >{" SMS"}</button>
                                    )
                                }
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}
