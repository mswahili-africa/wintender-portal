
import { Table } from "@/components/widgets/table/Table";
import columns from "./fragments/columns";
import { IconMessage, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { ConversationModal } from "./fragments/ConversationModal";
import { useContacts } from "@/hooks/notificationRepository";
import { IContacts } from "@/types";
import Button from "@/components/button/Button";
import Pagination from "@/components/widgets/table/Pagination";

export default function Messages() {
    const [page, setPage] = useState<number>(0);
    const [handleModal, setHandleModal] = useState<{ type: "view" | "sendBulk" | "", object: any }>(
        {
            type: "",
            object: null
        }
    );

    const handleModalClose = () => {
        setHandleModal({
            type: "",
            object: null
        });
    }

    const { contacts, refetch, isLoading } = useContacts({ page: page, size: 10 });

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Contacts</h2>
                <div className="flex gap-2">
                    <Button label="Refresh" icon={<IconRefresh />} theme="secondary" loading={isLoading} onClick={() => refetch()} />
                </div>
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

                <Table
                    columns={columns}
                    data={contacts?.content || []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={true}
                    actionSlot={(content: IContacts) => {
                        return (
                            <div className="flex justify-center space-x-2">
                                <button
                                    className="flex items-center text-xs xl:text-sm text-green-600 hover:text-green-900"
                                    onClick={() => setHandleModal({ type: "view", object: content })}
                                >
                                    <IconMessage size={20} />
                                </button>
                            </div>
                        );
                    }}
                />

            </div>
            <div className="flex justify-center p-4">
                {contacts?.pageable && (
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        pageCount={contacts?.totalPages!}
                    />
                )}
            </div>

            {/* Message modal */}
            <ConversationModal
                open={handleModal.type === "view"}
                onClose={handleModalClose}
                contact={handleModal.object}
            />
        </div>
    );
}
