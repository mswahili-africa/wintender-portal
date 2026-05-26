import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "../../../../components/button/Button";
import Modal from "../../../../components/widgets/Modal";
import { createPayment } from "../../../../services/payments";
import { IPaymentForm, PaymentReason } from "../../../../types/forms";
import Select from "react-select";
import { useBidders } from "@/hooks/biddersRepository";
import { useSubscriptionPlans } from "@/hooks/usePayments";
import { SubscriptionPlanDuration } from "@/types/statuses";
import PhoneInput, {parsePhoneNumber} from "react-phone-number-input";
import 'react-phone-number-input/style.css'

interface IProps {
    initials?: any
    onSuccess: () => void
}

const paymentReason = Object.entries(PaymentReason).map(([key, value]) => ({
    value: key,
    label: value
}));

export default function ({ ...props }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
    const { watch, register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm<IPaymentForm>({
        defaultValues: { controlNumber: "", phoneNumber: "", amount: 10000, mno: "", source: "", description: "", bidderId: "", planId: "", duration: "", paymentReason: "" }
    });


    const [search, setSearch] = useState("");

    const { subscriptionPlans, isLoading: plansLoading } = useSubscriptionPlans({});

    const { bidders, isLoading } = useBidders({
        page: 0,
        size: 5,
        column: "companyName",
        search: search

    });


    const createMutation = useMutation({
        mutationFn: (data: IPaymentForm) => createPayment(data),
        onSuccess: () => {
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
            setValue("amount", props.initials.amount ?? 10000);
            setValue("description", props.initials.description ?? "");
            setValue("paymentReason", props.initials.paymentReason ?? "");
            setValue("bidderId", props.initials.bidderId ?? "");
            setValue("source", props.initials.source ?? "");
            setValue("planId", props.initials.planId ?? "");
            setValue("duration", props.initials.duration ?? "");
        }
    }, [props.initials, reset])

    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Receive payment"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            <Modal size="sm" title="Receive payment" isOpen={open} onClose={(v) => setOpen(v)}>
                <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                    {/* JCM bidder search input */}
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <label htmlFor="bidder" className="block mb-2">
                                Bidder
                            </label>
                            <Select
                                options={bidders?.content.map(e => ({ value: e.id, label: e.companyName.toUpperCase() })) ?? []}
                                onInputChange={(inputValue) => setSearch(inputValue)}
                                onChange={(selectedOption) => setValue("bidderId", selectedOption?.value!)}
                                isLoading={isLoading}
                                placeholder="Search for a Bidder"
                            />

                        </div>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.bidderId?.message?.toString()}
                        </p>
                    </div>

                    {/* JCM reason */}
                    <div className="mb-2">
                        <label htmlFor="region" className="block mb-2">
                            Payment Reason
                        </label>

                        <select
                            className={`${errors.paymentReason?.type === "required" ? "input-error" : "input-normal"}`}
                            {...register("paymentReason", { required: true })}
                        >
                            {paymentReason.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {
                        watch("paymentReason") === "SUBSCRIPTION" &&
                        <>
                            <div className="mb-2">
                                <label htmlFor="region" className="block mb-2">
                                    Subscription Plan
                                </label>

                                <select
                                    className={`${errors.paymentReason?.type === "required" ? "input-error" : "input-normal"}`}
                                    {...register("planId", { required: true })}
                                >
                                    {subscriptionPlans?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="region" className="block mb-2">
                                    Duration
                                </label>

                                <select
                                    className={`${errors.paymentReason?.type === "required" ? "input-error" : "input-normal"}`}
                                    {...register("duration", { required: true })}
                                >
                                    {
                                        Object.entries(SubscriptionPlanDuration).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </>
                    }

                    {/* JCM payment method */}
                    <div className="mb-2">
                        <label htmlFor="region" className="block mb-2">
                            Payment Method
                        </label>

                        <select
                            className={`${errors.paymentReason?.type === "required" ? "input-error" : "input-normal"}`}
                            {...register("source", { required: true })}
                        >
                            <option value="CASH">CASH</option>
                            <option value="PAY_BILL">PAY_BILL (Lipa namba)</option>
                            <option value="BANK">BANK</option>
                        </select>
                    </div>



                    {
                        !(watch("paymentReason") === "SUBSCRIPTION" || watch("paymentReason") === "WALLET_IN") && watch("source") !== "CASH" && (
                            <div className="mb-4">
                                <label htmlFor="Account" className="block mb-2">Control Number</label>

                                <input
                                    type="text"
                                    className={`${errors.controlNumber?.type === 'required' ? 'input-error' : 'input-normal'}`}
                                    {...register('controlNumber', { required: true })}
                                />
                            </div>
                        )
                    }

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-500">Phone Number</label>
                        <PhoneInput
                            value={getValues('phoneNumber')}
                            defaultCountry={"TZ"}
                            international={true}
                            className="custom-phone-input"
                            placeholder="e.g., 710101010"
                            name="companyPrimaryNumber"
                            onChange={(value: any) =>setValue("phoneNumber", value)}

                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Phone" className="block mb-2">Amount <span className="text-xs text-green-500">(minimum: 10000)</span></label>

                        <input
                            type="number"
                            className={`${errors.amount?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('amount', { required: true, valueAsNumber: true, min: 10000 })}
                        />
                    </div>

                    {/* // watch("source") !== "CASH" && ( */}
                    <div className="mb-4">
                        <label htmlFor="Phone" className="block mb-2">Description</label>

                        <input
                            type="text"
                            placeholder="You  can add MNO or Bank payment reference here"
                            className={`${errors.description?.type === 'required' ? 'input-error' : 'input-normal'}`}
                            {...register('description', { required: true })}
                        />
                    </div>
                    {/* // ) */}


                    <Button
                        type="submit"
                        label="Request"
                        theme="primary"
                        size="md"
                        loading={createMutation.isPending}
                    />

                </form>

            </Modal>
        </div>
    )
}