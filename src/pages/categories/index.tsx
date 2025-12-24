import { useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useCategories from "@/hooks/useCategories";
import columns from "./fragments/categoryColumns";
import CategoryCreate from "./fragments/categoryCreateForm";
import { IconAlertTriangle, IconTrash, IconX } from "@tabler/icons-react";
import toast from "react-hot-toast";
import Button from "@/components/button/Button";
import Modal from "@/components/Modal";
import { useMutation } from "@tanstack/react-query";
import { ICategory } from "@/types";
import { deleteCategory } from "@/services/tenders";
import { useUserData } from "@/hooks/useUserData";

export default function CategoryList() {
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [sort, setSort] = useState<string>("createdAt,desc");
    const [filter] = useState<Record<string, any> | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const { userData } = useUserData(); // Assuming you have a user data provider

    const { categories, isLoading, refetch } = useCategories({
        page,
        size: 10,
        search,
        sort,
        filter
    });

    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    // JCM handle category action (visibility toggle)
    const handleCategoryAction = (category: any) => {
        setSelectedCategory(category);
        setIsModalVisible(true);
    };

    // JCM handle delete category
    const handleDeleteCategory = () => {
        setIsDeleting(true);
        deleteCategoryMutation.mutate(selectedCategory?.id || "");
    };
    const handleDeleteModalClose = () => {
        setIsModalVisible(false);
    };

    const deleteCategoryMutation = useMutation({
        mutationKey: ["deleteCategory", selectedCategory?.id],
        mutationFn: (id: string) => deleteCategory(selectedCategory?.id || ""),
        onSuccess: () => {
            toast.success("Category deleted successfully");
            setIsDeleting(false);
            setIsModalVisible(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(`Failed to delete category: ${error.message}`);
            setIsDeleting(false);
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold">Categories</h2>
                <CategoryCreate onSuccess={() => refetch()} />
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
                    hasActions={["ADMINISTRATOR", "PUBLISHER", "SUPERVISOR"].includes(userData?.role || "")}
                    actionSlot={
                        (content: any) => {
                            return (
                                <div className="flex items-center gap-2">
                                    {/* Add any action buttons here */}
                                    <button
                                        className={`text-red-500 hover:text-red-700 cursor-pointer`}
                                        onClick={() => handleCategoryAction(content)}
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
            {
                isModalVisible &&
                <Modal isOpen={isModalVisible} onClose={handleDeleteModalClose} size={"md"} >
                    <h1 className="text-lg font-bold"><strong>Delete Category?</strong></h1>
                    <div className="flex items-center justify-center mb-4">
                        <IconAlertTriangle size={80} className=" text-red-500 mr-2" />
                    </div>
                    <p className="text-sm px-5 text-gray-700">
                        <span className="text-sm">Are you sure you want to delete <span className="font-bold text-gray-900">{selectedCategory?.name || "N/A"}</span> category</span> <br /><br />
                        {/* phone number: <span className="font-bold text-gray-900">{selectedUser?.phoneNumber || "N/A"}</span> */}
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                        {!isDeleting &&
                            <Button
                                label="Cancel"
                                icon={<IconX size={18} />}
                                onClick={handleDeleteModalClose}
                                theme="secondary"
                                size="sm"
                            />
                        }
                        <Button
                            label="DELETE CATEGORY"
                            icon={<IconTrash size={18} />}
                            loading={isDeleting}
                            onClick={handleDeleteCategory}
                            theme="danger"
                            size="sm"
                        />
                    </div>
                </Modal>

            }
        </div>
    );
}
