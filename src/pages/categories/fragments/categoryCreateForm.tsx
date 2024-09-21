import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import useEntities from "@/hooks/useEntities";
import { createCategory } from "@/services/tenders";
import { ITenderCategory } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";

interface IProps {
    onSuccess: () => void;
    initials?: ITenderCategory;
}

const schema = object().shape({
    categoryGroup: string().required("Group is required"),
    name: string().required("Name is required")
});

export default function CategoryCreate({ onSuccess, initials }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
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
            setOpen(false);
            toast.success("Category uploaded successfully");
            onSuccess();
        },
        onError: (error: any) => {
            toast.error("Failed to upload Category");
        },
    });

    useEntities({
        page: 0,
        search: "",
        filter: {},
    });

    useEffect(() => {
        if (initials) {
            setValue("categoryGroup", initials.categoryGroup);
            setValue("name", initials.name ?? "");
            setOpen(true);
        }
    }, [initials, setValue]);

    const submit = (data: ITenderCategory) => {
        createCategoryMutation.mutate(data);
    }

    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Category"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            <Modal size="sm" title="Add Category" isOpen={open} onClose={(v) => setOpen(v)}>
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
                            <option value="WORK">WORK</option>
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
                        label="Register"
                        theme="primary"
                        size="md"
                        loading={createCategoryMutation.isLoading} />

                </form>
            </Modal>
        </div>
    );
}
