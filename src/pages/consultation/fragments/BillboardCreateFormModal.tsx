import Button from "@/components/button/Button";
import { TextEditor } from "@/components/editor/TextEditor";
import Modal from "@/components/widgets/Modal";
import { createBillboard, updateBillboard } from "@/services/tenders";
import { IConsultation } from "@/types/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";

interface IProps {
    onSuccess: () => void;
    initials?: IConsultation;
    open: boolean;
    onClose: () => void;
}

const schema = object().shape({
    title: string().required("title is required"),
    message: string().required("message is required")
});

export default function BillboardCreateFormModal({ onSuccess, initials, open, onClose }: IProps) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
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
            toast.success(res.message || "Consultation Billboard successfully");
            onClose();
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to upload Billboard");
        },
    });

    const updateBillboardMutation = useMutation({
        mutationFn: (data: IConsultation) => updateBillboard(initials?.id ?? "",data),
        onSuccess: (res) => {
            reset();
            toast.success(res.message || "Consultation Billboard Updated Successfully");
            onClose();
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update Billboard");
        },
    });

    useEffect(() => {
        if (initials) {
            setValue("title", initials.title ?? "");
            setValue("message", initials.message ?? "");
        } else {
            reset();
        }
    }, [initials, setValue]);

    const submit = (data: IConsultation) => {
        if (initials)
            updateBillboardMutation.mutate(data);
        else
            createBillboardMutation.mutate(data);
    }

    return (
        <Modal
            size="md"
            title={initials ? "Update Billboard" : "Add Billboard"}
            isOpen={open}
            onClose={onClose}
        >
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

                    {/* <textarea
                        rows={10}
                        className={`${errors.message?.type === "required"
                            ? "input-error"
                            : "input-normal"
                            }`}
                        {...register("message", { required: true })}
                    ></textarea> */}
                    <TextEditor control={control} name="message"/>
                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.message?.message?.toString()}
                    </p>
                </div>
                <Button
                    type="submit"
                    label={initials ? "Update" : "Post"}
                    theme="primary"
                    size="md"
                    disabled={createBillboardMutation.isPending || updateBillboardMutation.isPending}
                    loading={createBillboardMutation.isPending || updateBillboardMutation.isPending} />

            </form>
        </Modal>
    );
}
