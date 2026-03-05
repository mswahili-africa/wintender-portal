import { useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { useCategories } from "@/hooks/categoriesRepository";
import columns from "./fragments/categoryColumns";
import CategoryCreate from "./fragments/categoryCreateFormModal";
import { IconAlertTriangle, IconEdit, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import toast from "react-hot-toast";
import Button from "@/components/button/Button";
import Modal from "@/components/Modal";
import { useMutation } from "@tanstack/react-query";
import { ICategory } from "@/types";
import { deleteCategory } from "@/services/tenders";
import { useUserDataContext } from "@/providers/userDataProvider";
import CategoryCreateFormModal from "./fragments/categoryCreateFormModal";

export default function CategoryList() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<Record<string, any> | undefined>(undefined);
    const [handleModal, setHandleModal] = useState<{ type: "create" | "edit" | "delete" | "", object: any }>(
        { type: "", object: null }
    )

    const handleModalClose = () => {
        setHandleModal({ type: "", object: null });
    }

    const { userData } = useUserDataContext(); // Assuming you have a user data provider

    const { categories, isLoading, refetch } = useCategories({
        page,
        size: 30,
        search,
        sort,
        filter
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    // JCM handle delete category
    const handleDeleteCategory = () => {
        deleteCategoryMutation.mutate(handleModal.object?.id || "");
    };

    const deleteCategoryMutation = useMutation({
        mutationKey: ["deleteCategory", handleModal.object?.id],
        mutationFn: (id: string) => deleteCategory(handleModal.object?.id || ""),
        onSuccess: () => {
            toast.success("Category deleted successfully");
            handleModalClose();
            refetch();
        },
        onError: (error: any) => {
            toast.error(`Failed to delete category: ${error.message}`);
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Categories</h2>
                <Button
                    type="button"
                    label="Category"
                    icon={<IconPlus size={18} />}
                    theme="primary"
                    size="md"
                    onClick={() => setHandleModal({ type: "create", object: null })}
                />
                <CategoryCreateFormModal open={handleModal.type === "create" || handleModal.type === "edit"} initials={handleModal.object} onClose={handleModalClose} onSuccess={() => refetch()} />
            </div>

            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input-normal py-2 w-1/2 lg:w-1/4"
                        onChange={(e) => setSearch(e.target.value)} />
                </div>

                <Table
                    columns={columns}
                    data={categories?.content || []}
                    isLoading={isLoading}
                    hasSelection={false}
                    onSorting={handleSorting}
                    hasActions={["PUBLISHER"].includes(userData?.role || "")}
                    actionSlot={
                        (content: any) => {
                            return (
                                <div className="flex items-center gap-2">
                                    {/* Add any action buttons here */}
                                    <button
                                        className={`text-slate-500 hover:text-slate-700 cursor-pointer`}
                                        onClick={() => setHandleModal({ type: "edit", object: content })}
                                    >
                                        <IconEdit size={24} />
                                    </button>
                                    <button
                                        className={`text-red-500 hover:text-red-700 cursor-pointer`}
                                        onClick={() => setHandleModal({ type: "delete", object: content })}
                                    >
                                        <IconTrash size={24} />
                                    </button>
                                </div>
                            );
                        }
                    }
                />

                <div className="flex justify-between items-center p-4 lg:px-8">
                    <div></div>

                    {categories?.pageable && (
                        <Pagination
                            currentPage={page}
                            setCurrentPage={setPage}
                            pageCount={categories.totalPages}
                        />
                    )}
                </div>
            </div>

            {/* Handle empty state */}
            {categories?.content?.length === 0 && !isLoading && (
                <div className="text-center p-4">
                    <p>No categories found.</p>
                </div>
            )}


            {/* JCM handle delete modal */}
            <Modal isOpen={handleModal.type === "delete"} onClose={handleModalClose} size={"md"} >
                <h1 className="text-lg font-bold"><strong>Delete Category?</strong></h1>
                <div className="flex items-center justify-center mb-4">
                    <IconAlertTriangle size={80} className=" text-red-500 mr-2" />
                </div>
                <p className="text-sm px-5 text-gray-700">
                    <span className="text-sm">Are you sure you want to delete <span className="font-bold text-gray-900">{handleModal.object?.name || "N/A"}</span> category</span> <br /><br />
                    {/* phone number: <span className="font-bold text-gray-900">{selectedUser?.phoneNumber || "N/A"}</span> */}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button
                        label="Cancel"
                        icon={<IconX size={18} />}
                        onClick={handleModalClose}
                        disabled={deleteCategoryMutation.isPending}
                        theme="secondary"
                        size="sm"
                    />
                    <Button
                        label="DELETE CATEGORY"
                        icon={<IconTrash size={18} />}
                        disabled={deleteCategoryMutation.isPending}
                        loading={deleteCategoryMutation.isPending}
                        onClick={handleDeleteCategory}
                        theme="danger"
                        size="sm"
                    />
                </div>
            </Modal>
        </div>
    );
}
