import { IconPlus, IconEdit, IconTrash, IconRecycle, IconEye } from "@tabler/icons-react";
import { useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/columns";
import { IPEPerson, IUser } from "@/types";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePePerson } from "@/services/user";
import { usePEPersons } from "@/hooks/entitiesRepository";
import PEPersonFormModal from "./fragments/PEPersonFormModal";
import Button from "@/components/button/Button";
import GeneralSMSModal from "@/pages/messages/fragments/GeneralSmsModal";
import usePopup from "@/hooks/usePopup";
import Select from "react-select";
import { PEPersonDetailsModal } from "./fragments/PEPersonDetailsModal";
import { set } from "lodash";

const columnSearchOptions: any[] = [
    { value: "name", label: "Name" },
    { value: "phoneNumber", label: "Phone number" },
];

export default function ProcurementEntitiesPersons() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>();
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter, setFilter] = useState<any>();
    const [isModalOpen, setIsModalOpen] = useState<{ type: "view" | "create" | "update" | "delete" | "reset" | "sms" | null, user: IUser | IPEPerson | null }>({ type: null, user: null });
    const [searchColumn, setSearchColumn] = useState<string>("name");
    const { showConfirmation } = usePopup();

    const { pes, isLoading, refetch } = usePEPersons({
        page: page,
        searchKey: searchColumn,
        searchValue: search,
        sort: sort,
        filter: filter,
    });

    const handleCloseModal = () => {
        setIsModalOpen({ type: null, user: null });
    }

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    const deleteMutation = useMutation({
        mutationFn: (data: string) => deletePePerson(data),
        onSuccess: () => {
            toast.success("Delete successfully");
            handleCloseModal // Close modal on success
            refetch();
        },
        onError: () => {
            toast.error("Failed to delete");
        },
    });

    // show confirmation modal
    const handleDelete = (user: IUser) => {
        showConfirmation({
            theme: "danger",
            title: "Delete this PE user?",
            message:
                "This action cannot be undone. Please verify that you want to delete.",
            onConfirm: () => {
                deleteMutation.mutate(isModalOpen.user?.id!);
            },
            onCancel: () => { },
        });
    };

    const resetFilter = () => {
        setSearch("");
        setSearchColumn("name");
    }
    return (

        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">PE Persons</h2>

                <Button
                    type="button"
                    label="PE Person"
                    icon={<IconPlus size={18} />}
                    theme="primary"
                    size="md"
                    onClick={() => setIsModalOpen({ type: "create", user: null })}
                />
                <PEPersonFormModal
                    refetch={refetch}
                    initials={isModalOpen.user as IPEPerson}
                    open={isModalOpen.type === "create" || isModalOpen.type === "update"}
                    onClose={handleCloseModal}
                />
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div className="flex flex-row gap-x-2">
                        <Select
                            options={columnSearchOptions}
                            value={columnSearchOptions.find((option: any) => option.value === searchColumn)}
                            onChange={(selectedOption) => setSearchColumn(selectedOption?.value)}
                            placeholder="Search by"
                            className="w-[200px] p-0"
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            className="input-normal w-[200px] lg:w-[300px]"
                            onChange={(e) => setSearch(e.target.value)} // Update search query
                        />
                    </div>
                    <Button
                        type="button"
                        label="Reset"
                        variant="pastel"
                        icon={<IconRecycle size={18} />}
                        onClick={resetFilter}
                        theme="warning"
                        size="sm"
                    />
                </div>

                <Table
                    columns={columns}
                    data={pes ? pes.content : []}
                    isLoading={isLoading}
                    hasSelection={false}
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(content: any) => {
                        return (
                            <>
                                <Button
                                    type="button"
                                    variant="text"
                                    icon={<IconEye size={20} />}
                                    theme="primary"
                                    size="md"
                                    onClick={() => setIsModalOpen({ type: "view", user: content })}
                                />
                                <div className="flex justify-center space-x-3">
                                    <button
                                        onClick={() => setIsModalOpen({ type: "update", user: content })}
                                    >
                                        <IconEdit
                                            className="h-5 w-5 text-grey-500"
                                        />
                                    </button>

                                </div>

                                <Button
                                    type="button"
                                    variant="text"
                                    icon={<IconTrash size={20} />}
                                    theme="danger"
                                    size="md"
                                    onClick={() => handleDelete(content)}
                                />
                            </>
                        );
                    }}
                />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>
                    {pes?.pageable && (
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={pes.totalPages}
                            totalElements={pes.totalElements}
                        />
                    )}
                </div>

                <PEPersonDetailsModal
                    isOpen={isModalOpen.type === "view"}
                    person={isModalOpen.user as IPEPerson}
                    onClose={handleCloseModal}
                />
            </div>
        </div>
    );
}
