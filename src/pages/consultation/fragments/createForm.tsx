import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import useEntities from "@/hooks/useEntities";
import { createBillboard } from "@/services/tenders";
import { IConsultation } from "@/types/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";

interface IProps {
    onSuccess: () => void;
    initials?: IConsultation;
}

const schema = object().shape({
    title: string().required("title is required"),
    message: string().required("message is required")
});

export default function BillboardCreate({ onSuccess, initials }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: { title: "", message: "" },
    });

    const createBillboardMutation = useMutation({
        mutationFn: (data: IConsultation) => createBillboard(data),
        onSuccess: (res) => {
            reset();
            setOpen(false);
            toast.success("Billboard successfully");
            onSuccess();
        },
        onError: (error: any) => {
            toast.error("Failed to upload Billboard");
        },
    });

    useEntities({
        page: 0,
        search: "",
        filter: {},
    });

    useEffect(() => {
        if (initials) {
            setValue("title", initials.title ?? "");
            setValue("message", initials.message ?? "");
            setOpen(true);
        }
    }, [initials, setValue]);

    const submit = (data: IConsultation) => {
        createBillboardMutation.mutate(data);
    }

    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Billboard"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            <Modal size="sm" title="Add Billboard" isOpen={open} onClose={(v) => setOpen(v)}>
                <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                    
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2">Title</label>
                        <input
                            type="text"
                            className={`${errors.title?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('title', { required: true })}
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="message" className="block mb-2">
                            Message
                        </label>

                        <textarea
                            rows={3}
                            className={`${errors.message?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("message", { required: true })}
                        ></textarea>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.message?.message?.toString()}
                        </p>
                    </div>
                    <Button
                        type="submit"
                        label="Post"
                        theme="primary"
                        size="md"
                        loading={createBillboardMutation.isLoading} />

                </form>
            </Modal>
        </div>
    );
}
