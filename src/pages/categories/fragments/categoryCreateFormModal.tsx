import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { createCategory, updateCategory } from "@/services/tenders";
import { ITenderCategory } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";

interface IProps {
    onSuccess: () => void;
    initials?: ITenderCategory;
    open: boolean;
    onClose: () => void;
}

const schema = object().shape({
    categoryGroup: string().required("Group is required"),
    name: string().required("Name is required")
});

export default function CategoryCreateFormModal({ onSuccess, initials, open, onClose }: IProps) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: { categoryGroup: "", name: "" },
    });

    const createCategoryMutation = useMutation({
        mutationFn: (data: ITenderCategory) => createCategory(data),
        onSuccess: (res) => {
            reset();
            toast.success("Category uploaded successfully");
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            toast.error("Failed to upload Category");
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: (data: ITenderCategory) => {
            if (initials && initials.id) {
                return updateCategory(initials.id, data);
            } else {
                throw new Error("Invalid category");
            }
        },
        onSuccess: (res) => {
            reset();
            toast.success(res.message || "Category updated successfully");
            onSuccess();
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || "Failed to update Category");
        },
    });

    useEffect(() => {
        if (initials) {
            setValue("categoryGroup", initials.categoryGroup);
            setValue("name", initials.name ?? "");
        } else {
            reset();
        }
    }, [initials]);

    const submit = (data: ITenderCategory) => {
        if (initials)
            updateCategoryMutation.mutate(data);
        else
            createCategoryMutation.mutate(data);
    }

    return (
        <Modal size="sm" title="Add Category" isOpen={open} onClose={onClose}>
            <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                <div className="mb-2">
                    <label htmlFor="categoryGroup" className="block mb-2">
                        Group
                    </label>

                    <select
                        className={`${errors.deviceComponent?.type === "required"
                            ? "input-error"
                            : "input-normal"
                            }`}
                        {...register("categoryGroup", { required: true })}
                    >
                        <option value="GOODS">GOODS</option>
                        <option value="SERVICE">SERVICE</option>
                        <option value="WORKS">WORKS</option>
                    </select>
                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.categoryGroup?.message?.toString()}
                    </p>
                </div>
                <div className="mb-4">
                    <label htmlFor="Name" className="block mb-2">Name</label>

                    <input
                        type="text"
                        className={`${errors.name?.type === 'required' ? 'input-error' : 'input-normal'}`}
                        {...register('name', { required: true })}
                    />
                </div>


                <Button
                    type="submit"
                    label={initials ? "Update" : "Create"}
                    theme="primary"
                    size="md"
                    disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                    loading={createCategoryMutation.isPending || updateCategoryMutation.isPending} />

            </form>
        </Modal>
    );
}
