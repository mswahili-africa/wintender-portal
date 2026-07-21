import Button from '@/components/button/Button';
import MediaDropzone from '@/components/inputs/MediaDropzone';
import Modal from '@/components/widgets/Modal';
import { sendTexts } from '@/services/notificationServices';
import { ICompany, IUser } from '@/types';
import { MediaType } from '@/types/enums';
import { IMessage } from '@/types/forms';
import { IconBrandWhatsapp, IconHash, IconLink, IconLoader, IconMessage2Bolt, IconPaperclip, IconUser } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    selectedUser?: ICompany | null;
    bulkSendGroup?: string;
}

export default function GeneralSMSModal({ isOpen, onClose, title, selectedUser, bulkSendGroup }: ModalProps) {
    if (!isOpen) return null;

    const [message, setMessage] = useState<string>("");
    const [isMessageToAll, setIsMessageToAll] = useState<boolean>(true); // true means bulk message 
    // const [mediaType, setMediaType] = useState<'file' | ''>(''); // null means no media, just text
    const [media, setMedia] = useState<string>(''); // url for media type
    const [numberOfRecipient, setNumberOfRecipient] = useState<string>(''); // number of recipients
    const [mediaType, setMediaType] = useState<keyof typeof MediaType | undefined>("TEXT");
    const [messageMode, setMessageMode] = useState<"SMS" | "WHATSAPP">('SMS');

    useEffect(() => {
        setMediaType("TEXT");
        setMessageMode('SMS');
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
            setMediaType("TEXT");
            setMessageMode('SMS');
            setMedia('');
            setNumberOfRecipient('');
            onClose();

        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Send failed");
        },
    });
    const handleSendSMS = (mode: "SMS" | "WHATSAPP") => {
        let sendGroup = "SINGLE";

        const phoneNumber = isMessageToAll ? "0100000000" : numberOfRecipient; // Default number for bulk 
        if (!phoneNumber) return;

        // Check if it's a default number
        if (phoneNumber === "0100000000") {
            sendGroup = bulkSendGroup!;
        }

        const mtype = mediaType =="DOCUMENT" ? "file" : mediaType;
        sendSMS.mutate({ data: { phoneNumber, message, mediaType: mtype, media, messageMode:mode, name: selectedUser?.name! }, group: sendGroup });
    };

    const onTabChange = (tab: keyof typeof MediaType) => {
        if (tab !== "TEXT") {
            setMessageMode('WHATSAPP');
        } else {
            setMessageMode("SMS");
        }
        setMediaType(tab);
        // setMediaFile(null);
    }

    return (
        <Modal size="lg" isOpen={isOpen} onClose={onClose} zIndex={50} title={title}>

            <div>
                {/* send as single or bulk */}
                {!selectedUser && (
                    <div className="bg-slate-100 p-1 rounded-xl flex w-full border border-slate-200">
                        <button
                            type="button"
                            className={`py-2 text-sm font-semibold rounded-lg w-full transition-all ${isMessageToAll
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                                }`}
                            onClick={() => setIsMessageToAll(true)}
                        >
                            Bulk Broadcast
                        </button>
                        <button
                            type="button"
                            className={`py-2 text-sm font-semibold rounded-lg w-full transition-all ${!isMessageToAll
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                                }`}
                            onClick={() => setIsMessageToAll(false)}
                        >
                            Single Recipient
                        </button>
                    </div>
                )}


                {/* If message is for SINGLE user */}
                {!isMessageToAll && (

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Recipient Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <IconHash size={16} />
                                </span>

                                <input
                                 type="text"
                                 className="input-normal w-full mb-4 ps-4"
                                 value={numberOfRecipient}
                                 onChange={(e) => setNumberOfRecipient(e.target.value)}
                                 readOnly={selectedUser ? true : false}
                             />

                            </div>
                        </div>

                        {selectedUser && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Receiver Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <IconUser size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm opacity-60 cursor-not-allowed focus:outline-none"
                                        value={selectedUser?.name}
                                        readOnly
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* media type */}
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 mt-4">Media Type</label>
                <div className=" mb-6 w-full sm:px-8">
                    <div className="inline-flex w-full justify-between  rounded-full bg-gray-100 p-1 shadow-inner">
                        {Object.entries(MediaType)
                            .filter(([key]) => ['TEXT', 'DOCUMENT'].includes(key))
                            .map(([key, value]) => {
                                const isActive = mediaType === key;

                                const IconComponent = mediaType === key ? <IconMessage2Bolt size={16} /> : <IconPaperclip size={16} />;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => onTabChange(key as keyof typeof MediaType)}
                                        className={`relative px-5 flex gap-x-2 py-2 text-sm w-full justify-center font-medium rounded-full transition-all duration-300 ease-out ${isActive ? "bg-white text-green-600 shadow-md" : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {IconComponent} {value}
                                    </button>
                                );
                            })}

                    </div>
                </div>


                {mediaType && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{mediaType === 'DOCUMENT' ? 'File' : ''} URL</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <IconLink size={16} />
                            </span>
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm opacity-60 focus:outline-none"
                                value={media}
                                onChange={(e) => setMedia(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Modular Reusable Attachment Sub-fragment rendering */}
                {/* {["DOCUMENT"].includes(mediaType) && (
                    <>
                        <MediaDropzone
                            mediaType={"DOCUMENT"}
                            selectedFile={mediaFile}
                            onFileSelect={(file, _) => {
                                setMedia(file);
                            }}
                        />
                    </>
                )} */}


                {/* Text Area Section */}
                <div className='mt-6'>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Message Content</label>
                        <span className={`text-xs font-medium ${message.length >= 140 ? 'text-amber-500' : 'text-slate-400'}`}>
                            {messageMode === "WHATSAPP" && "Message will be sent via whatsapp "}
                            {message.length}/
                            {messageMode === "WHATSAPP" ?
                                2500 :
                                160
                            }
                        </span>
                    </div>
                    <textarea
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-green-500 transition-all placeholder-slate-400 resize-none"
                        rows={4}
                        value={message}
                        onChange={(e) => {
                            message.length >= 159 ? setMessageMode("WHATSAPP") : setMessageMode("SMS");
                            // setMessage(e.target.value)

                            // Replace newlines with spaces
                            const replacedMessage = e.target.value.replace(/\n/g, " ");
                            setMessage(replacedMessage);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                        onPaste={(e) => {
                            // 1. Get the raw text from the clipboard
                            const pastedText = e.clipboardData.getData('text');

                            // 2. Check length and dynamically toggle the message mode
                            pastedText.length >= 159 ? setMessageMode("WHATSAPP") : setMessageMode("SMS");
                        }}

                        placeholder="Type your outbound message panel context here..."
                        maxLength={messageMode === "WHATSAPP" ? 2500 : 160}
                    />
                </div>

                {/* Form Modal Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                    {sendSMS.isPending ? (
                        <div className="flex items-center pr-4">
                            <IconLoader className="animate-spin text-orange-500" size={24} />
                        </div>
                    ) : (
                        <>
                            <Button
                                theme="success"
                                onClick={() => handleSendSMS("WHATSAPP")}
                                label="WhatsApp"
                                icon={<IconBrandWhatsapp size={18} />}
                                size="md"
                                type="button"
                                disabled={sendSMS.isPending}
                            />
                            { messageMode !== 'WHATSAPP' && mediaType === "TEXT" && (
                                <Button
                                    theme="info"
                                    onClick={() => handleSendSMS("SMS")}
                                    label="Standard SMS"
                                    icon={<IconMessage2Bolt size={18} />}
                                    size="md"
                                    type="button"
                                    disabled={sendSMS.isPending}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}
