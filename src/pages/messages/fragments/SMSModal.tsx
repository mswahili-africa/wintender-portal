import { useState } from "react";


import { sendTexts } from "@/services/notificationServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/Modal";
import Button from "@/components/button/Button";
import { IconSend, IconX } from "@tabler/icons-react";
import Loader from "@/components/spinners/Loader";
import { useMessages } from "@/hooks/notificationRepository";
import { IContacts } from "@/types";
import { IMessage } from "@/types/forms";
import toast from "react-hot-toast";

type TModal = {
  open: boolean;
  onClose: () => void;
  contact: IContacts | null;
};

export const SMSModal = ({ open, onClose, contact }: TModal) => {
  const [reply, setReply] = useState<string>("");
  const phoneNumber = contact?.phoneNumber;
  const queryClient = useQueryClient();

  const { messages, isLoading, refetch } = useMessages({
    page: 0,
    size: 50,
    phoneNumber,
  });

  // sendingi sms
  const sendSmsMutation = useMutation({
    mutationFn: (data: { message: IMessage; group: string }) => sendTexts(data.message, data.group),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMessages"] });
      refetch();
      toast.success("SMS sent successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send message");
    },
  });

  if (!contact) return null;

  const handleSend = () => {
    if (reply.length < 3) return;

    const message: IMessage = {
      phoneNumber: phoneNumber!,
      message: reply,
      messageMode: "WHATSAPP",
    };
    const group = "SINGLE";

    const payload = {
      message,
      group,
    };

    sendSmsMutation.mutate(payload);

    setReply("");
  };

  return (
    <Modal size="lg" isOpen={open} onClose={onClose}>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center space-x-2">
            Messages: <span className="font-medium">{contact.name}</span>
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-red-200 ">
            <IconX/>
          </button>
        </div>
      </div>

      <div className="pb-0 overflow-visible">
        <div className="max-h-[600px] min-h-[200px] w-full overflow-y-auto">
          <div className="max-h-[600px] min-h-[200px] w-full overflow-y-auto pt-5">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center py-10">
                <Loader />
              </div>
            ) : messages && messages.content.length > 0 ? (
              [...messages.content]
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((message, index) => {
                  const isSent = message.action === "SENT";
                  const time = new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={message.id || index}
                      className={`mb-3 flex w-full ${isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[75%] flex-col ${isSent ? "items-end" : "items-start"}`}>
                        <div
                          className={`rounded-2xl  px-4 py-2 text-[14px] shadow-sm ${isSent
                            ? "rounded-br-none bg-blue-100 text-black"
                            : "rounded-bl-none bg-green-100 text-black"
                            }`}
                        >
                          <span>{message.message}</span>
                        </div>

                        <span className={`mt-1 text-[10px] text-gray-500 ${isSent ? "text-right" : "text-left"}`}>
                          {time}
                          {isSent && ` • ${message.status}`}
                        </span>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="flex h-full w-full items-center justify-center py-10">
                <span>No messages found</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-2 pt-3 border-t">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            rows={2}
            placeholder="Type your reply..."
            className="flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button
            type="button"
            icon={<IconSend size={20} />}
            theme="primary"
            loading={sendSmsMutation.isPending}
            size="md"
            onClick={handleSend}
          />
        </div>
      </div>

      
    </Modal>
  );
};
