import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { IEntity } from "@/types";
import { IconAlertTriangle, IconBallpen, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import columns from "./fragments/entityColumns";
import VendorForm from "./fragments/entityForm";
import { useEntities } from "@/hooks/useEntities";
import { useUserData } from "@/hooks/useUserData";
import Modal from "@/components/Modal";
import Button from "@/components/button/Button";

export default function () {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<any>();
    const { entities, isLoading, refetch } = useEntities({
        page: page,
        search: search,
        sort: sort,
        filter: filter
    });

    // JCM MODALS STATE
    const [isModalOpen, setIsModalOpen] = useState<
        {
            type: "create" | "update" | "delete" | null,
            user: IEntity | null
        }
    >({ type: null, user: null });


    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    }

    const handleDeleteModalClose = () => {
        setIsModalOpen({ type: null, user: null });
    }
    const handleDeleteBidder = () => {
        refetch();
    }

    return (

        <div className="border border-slate-200 bg-white rounded-md overflow-hidden">

            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <input
                    type="text"
                    placeholder="Search"
                    className="input-normal py-2 w-1/2 lg:w-1/4"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <VendorForm
                    initials={isModalOpen }
                    setIsModalOpen={setIsModalOpen}
                    onSuccess={() => {
                        setIsModalOpen({ type: null, user: null });
                        refetch();
                    }}
                />
            </div>

            <Table
                columns={columns}
                data={entities ? entities.content : []}
                isLoading={isLoading}
                hasSelection={false}
                hasActions={true}
                onSorting={handleSorting}
                actionSlot={(content: IEntity) => {
                    return (
                        <div className="flex justify-center space-x-3">

                            <button
                                className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                                onClick={() => setIsModalOpen({ type: "update", user: content })}>
                                <IconBallpen size={20} />
                            </button>
                        </div>
                    )
                }} />

            {/* JCM PE DELETE MODAL */}
            {
                <Modal isOpen={isModalOpen.type === "delete"} onClose={handleDeleteModalClose} size={"md"} >
                    <h1 className="text-lg font-bold"><strong>Delete PE?</strong></h1>
                    <div className="flex items-center justify-center mb-4">
                        <IconAlertTriangle size={80} className=" text-red-500 mr-2" />
                    </div>
                    <p className="text-sm px-5 text-gray-700">
                        <span className="text-sm">Are you sure you want to delete PE with the following details, this action cannot be undone</span> <br /><br />
                        Company name: <span className="font-bold text-gray-900">{isModalOpen.user?.name || "N/A"}</span> <br />
                        Company email: <span className="font-bold text-gray-900">{isModalOpen.user?.email || "N/A"}</span> <br />
                        Admin name: <span className="font-bold text-gray-900">{isModalOpen.user?.createdBy || "N/A"}</span> <br />
                        Admin email: <span className="font-bold text-gray-900">{isModalOpen.user?.email || "N/A"}</span> <br />
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                        {!false &&
                            <Button
                                label="Cancel"
                                icon={<IconX size={18} />}
                                onClick={handleDeleteModalClose}
                                theme="secondary"
                                size="sm"
                            />
                        }
                        <Button
                            label="DELETE PE"
                            icon={<IconTrash size={18} />}
                            onClick={handleDeleteBidder}
                            theme="danger"
                            size="sm"
                        />
                    </div>
                </Modal>

            }

            <div className="flex justify-between items-center p-4 lg:px-8">
                <div></div>

                {
                    entities?.pageable &&
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        pageCount={entities.totalPages}
                    />
                }
            </div>
        </div>
    )

}