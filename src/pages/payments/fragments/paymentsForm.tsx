import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../../components/button/Button";
import Modal from "../../../components/widgets/Modal";
import { createPayment } from "../../../services/payments";
import { IPaymentForm } from "../../../types/forms";


interface IProps {
    initials?: any
    onSuccess: () => void
}

export default function ({ ...props }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<IPaymentForm>({
        defaultValues: { controlNumber: "", phoneNumber: "", amount: 0, mno: "00", description: "" }
    });

    const createMutation = useMutation({
        mutationFn: (data: IPaymentForm) => createPayment(data),
        onSuccess: (res) => {
            reset();
            setOpen(false);
            toast.success("POS Requested");
            props.onSuccess();
        }
    })

    const submit = (data: IPaymentForm) => {
        createMutation.mutate(data);
    }

    useEffect(() => {
        if (props.initials) {
            setValue("controlNumber", props.initials.controlNumber);
            setValue("phoneNumber", props.initials.phoneNumber ?? "");
            setValue("amount", props.initials.amount ?? 0);
            setValue("description", props.initials.description ?? "");
        }
    }, [props.initials])

    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Make payment"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            <Modal size="sm" title="Make payment" isOpen={open} onClose={(v) => setOpen(v)}>
                <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                    <div className="mb-4">
                        <label htmlFor="Account" className="block mb-2">Control Number</label>

                        <input
                            type="number"
                            className={`${errors.controlNumber?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('controlNumber', { required: true })}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Phone" className="block mb-2">Phone number</label>

                        <input
                            type="number"
                            className={`${errors.phoneNumber?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('phoneNumber', { required: true })}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Phone" className="block mb-2">Amount</label>

                        <input
                            type="number"
                            className={`${errors.amount?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('amount', { required: true })}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Phone" className="block mb-2">Description</label>

                        <input
                            type="text"
                            placeholder="You  can add MNO or Bank payment reference here"
                            className={`${errors.description?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('description', { required: true })}
                        />
                    </div>


                    <Button
                        type="submit"
                        label="Request"
                        theme="primary"
                        size="md"
                        loading={createMutation.isLoading} />

                </form>
            </Modal>
        </div>
    )
}