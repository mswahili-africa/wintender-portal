import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";
import { createSubscriptionBenefit } from "@/services/payments";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const schema = object().shape({
    name: string().required("Subscription benefit name is required"),
    description: string().required("Description is required"),
});

export default function SubscriptionBenefitFormModal({ open, onClose }: IProps) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
    });

    const createBenefit = useMutation({
        mutationFn: (data: any) => createSubscriptionBenefit(data),
        onSuccess: () => {
            reset();
            onClose();
            toast.success("Subscription Benefit successfully added");
        },
        onError: () => {
            toast.error("Failed to add Subscription Benefit");
        },
    });

    const submit = (data: any) => {
        createBenefit.mutate(data);
    };

    return (


        <Modal size="sm" title="Add Subscription Benefit" isOpen={open} onClose={onClose}>
            <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                

                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-2">Subscription benefit</label>
                    <input
                        type="text"
                        className={errors.amount ? "input-error" : "input-normal"}
                        {...register('name', { required: true })}
                    />
                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.name?.message?.toString()}
                    </p>
                </div>
                

                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-2">Description</label>
                    <textarea
                        rows={3}
                        className={errors.amount ? "input-error" : "input-normal"}
                        {...register('description', { required: true })}
                    />
                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.description?.message?.toString()}
                    </p>
                </div>

                <Button
                    type="submit"
                    label={"Add"}
                    loading={createBenefit.isPending}
                    theme="primary"
                    size="md"
                    disabled={createBenefit.isPending}
                />
            </form>
        </Modal>
    );
}
