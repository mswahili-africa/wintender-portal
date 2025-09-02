import { useState } from "react";
import { IconChevronDown, IconChevronUp, IconSend } from "@tabler/icons-react";
import useClarifications from "@/hooks/useClarifications";
import { IClarification, IReply, ITenders } from "@/types";
import Spinner from "@/components/spinners/Spinner";
import { useMutation } from "@tanstack/react-query";
import { addClarification, replyClarification } from "@/services/clarifications";
import Button from "@/components/button/Button";
import { useUserData } from "@/hooks/useUserData";

type ClarificationsProps = {
    tender: ITenders;
};

export const Clarifications = ({ tender }: ClarificationsProps) => {
    const [openId, setOpenId] = useState<string | null>(null);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [newClarification, setNewClarification] = useState("");

    const { clarifications, isLoading, refetch } = useClarifications({ id: tender.id });
    const user = useUserData()

    //Add new clarification
    //   mutation
    const addClarificationMutation = useMutation({
        mutationFn: (data: any) => addClarification(tender.id, data),
        onSuccess: () => {
            refetch();
        },
    });

    const handleNewClarification = () => {
        if (!newClarification.trim()) return;

        const newClar = {
            message: newClarification,
        };
        addClarificationMutation.mutate(newClar);

        setNewClarification(""); // clear input
    };

    // send reply process
    // mutation
    const sendReplyMutation = useMutation({
        mutationFn: (data: IReply) => replyClarification(data?.repliedMessageId ?? "", { message: data.message }),
        onSuccess: () => {
            refetch();
        },
    })
    const handleSend = (clarId: string) => {
        const text = inputs[clarId]?.trim();
        if (!text) return;

        sendReplyMutation.mutate({ repliedMessageId: clarId, message: text });

        setInputs((prev) => ({ ...prev, [clarId]: "" }));
        refetch();
    };

    // toggle accordion
    const toggleAccordion = (id: string) => {
        if (openId === id) {
            setOpenId(null);
        } else {
            setOpenId(id);
        }
    };

    return (
        <div className="w-full max-w-4xl px-3 mx-auto">
            <h1 className="text-lg font-bold">Clarifications</h1>

            {/* Global New Clarification Box */}
            <div className="flex items-start gap-2 my-4">
                <textarea
                    value={newClarification}
                    rows={2}
                    onChange={(e) => setNewClarification(e.target.value)}
                    placeholder="Start a new clarification..."
                    className="flex-1 border rounded-lg p-2 text-sm focus:border-green-500 focus:ring-green-500"
                ></textarea>
                <Button
                    type="button"
                    label="Add"
                    theme="primary"
                    size="md"
                    loading={addClarificationMutation.isPending}
                    onClick={handleNewClarification}
                />
            </div>

            {
                isLoading ? (
                    <div className="w-full  min-h-[100px] flex justify-center items-center">
                        <Spinner size="lg" />
                    </div>
                ) : clarifications?.content && clarifications?.content?.length === 0 ? (
                    <p className="text-sm text-gray-500 w-full min-h-[100px] flex justify-center items-center">
                        No clarifications yet. Add one above ⬆️
                    </p>
                ) : (
                    clarifications?.content?.length > 0 && clarifications?.content?.map((clar: IClarification) => (
                        <div key={clar.id} className="border rounded-lg mb-4 overflow-hidden">
                            {/* Accordion Header */}
                            <button
                                className="w-full flex justify-between items-center p-4 text-left rounded bg-green-200 hover:bg-green-300 transition"
                                onClick={() => toggleAccordion(clar.id!)}
                            >
                                <div className="max-w-[95%]">
                                    {/* <span className="text-xs font-bold text-blue-600">{tender?.createdBy === clar?.createdBy ? tender.entityName : clar.createdBy === user?.userData?.userId ? "You" : "Bidder"}</span> */}
                                    <p className="font-semibold text-gray-800 text-justify">
                                        {clar.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(clar.createdAt!).toLocaleString()}
                                    </p>
                                </div>
                                <IconChevronUp className={`w-5 transition duration-300 ease-in-out h-5 ${openId !== clar.id ? "rotate-180" : ""}`} />
                            </button>

                            {/* Accordion Body */}
                            {openId === clar.id && (
                                <div className={`transition duration-300 ease-in-out`}>
                                    <div className={` p-6 space-y-3 bg-green-100 `}>
                                        {/* Replies */}
                                        {clar?.replies && clar.replies.length > 0 ? (
                                            <div className="max-h-[500px] overflow-y-auto">
                                                {clar.replies.map((reply: IReply) => (
                                                    <div key={reply.id} className={`${tender.createdBy === reply.createdBy ? "items-end" : "items-start"} flex flex-col  w-full`}>
                                                        <span className="text-xs font-bold text-blue-600">{tender.entityName }</span>
                                                        <div className={`px-4 py-2 ${tender.createdBy === user.userData?.userId ? "bg-green-500 text-white rounded-br-none " : "bg-white text-gray-800 border-green-500 rounded-bl-none"}  rounded-2xl border shadow-sm max-w[80%]`}>
                                                            {reply.message}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(reply.createdAt!).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>
                                                ))
                                                }</div>
                                        ) : (
                                            <p className="text-md text-gray-500 w-full text-center">No replies yet</p>
                                        )}

                                        {/* Reply input */}
                                        {
                                            tender.createdBy === user.userData?.userId &&
                                            <div className="flex items-start gap-2 pt-3 border-t">
                                                <textarea
                                                    value={inputs[clar.id!] || ""}
                                                    onChange={(e) => setInputs((prev) => ({ ...prev, [clar.id as string]: e.target.value }))}
                                                    onKeyDown={(e) => e.key === "Enter" && handleSend(clar.id as string)}
                                                    rows={2}
                                                    placeholder="Type your reply..."
                                                    className="flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                                <Button
                                                    type="button"
                                                    icon={<IconSend size={20} />}
                                                    theme="primary"
                                                    loading={sendReplyMutation.isPending}
                                                    size="md"
                                                    onClick={() => handleSend(clar.id as string)}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    ))
                )
            }
        </div>
    );
};

