import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { object, string, number, array, boolean } from "yup";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { IPlan, ISubscriptionPlanForm } from "@/types/forms";
import { createSubscriptionPlan, updateSubscriptionPlan } from "@/services/payments";
import { useSubscriptionBenefits } from "@/hooks/usePayments";
import { ISubscriptionPlan } from "@/types";
import { SubscriptionPlanDuration, SubscriptionPlanStatus } from "@/types/statuses";



interface IProps {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    initials?: ISubscriptionPlan;
}

const schema = object().shape({
    name: string().required("Plan name is required"),
    duration: string().oneOf(Object.values(SubscriptionPlanDuration)).required("Duration is required"),
    amount: number().typeError("Amount must be a number").positive("Amount must be greater than 0").required("Amount is required"),
    benefits: array().of(string()).min(1, "Select at least one benefit"),
    popular: boolean(),
    status: string().oneOf(Object.values(SubscriptionPlanStatus)).required("Status is required"),
});

export default function SubscriptionPlanFormModal({ open, onClose, refresh, initials }: IProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ISubscriptionPlanForm>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            duration: SubscriptionPlanDuration.MONTHLY,
            status: SubscriptionPlanStatus.ACTIVE,
            popular: false,
            benefits: [],
        },
    });

    const { subscriptionPlanBenefits, isLoading } = useSubscriptionBenefits({});
    const currentStatus = watch("status");
    const popularity = watch("popular");

    // Populate data if editing (initials are present)
    useEffect(() => {
        if (initials) {
            reset({
                name: initials.name,
                duration: initials.duration,
                amount: initials.amount,
                popular: initials.popular ?? false,
                status: initials.status,
                benefits: initials.benefitsId,
            });
        } else {
            reset({
                duration: SubscriptionPlanDuration.MONTHLY,
                status: SubscriptionPlanStatus.ACTIVE,
                popular: false,
                benefits: [],
            });
        }
    }, [initials, open, reset]);

    const createSubscriptionPlanMutation = useMutation({
        mutationFn: (data: ISubscriptionPlanForm) => createSubscriptionPlan(data),
        onSuccess: () => {
            reset();
            refresh();
            onClose();
            toast.success("Subscription plan saved successfully");
        },
        onError: () => {
            toast.error("Failed to save subscription plan");
        },
    });

    const updateSubscriptionPlanMutation = useMutation({
        mutationFn: (data: ISubscriptionPlanForm) => updateSubscriptionPlan(data, initials?.id ?? ""),
        onSuccess: () => {
            reset();
            refresh();
            onClose();
            toast.success("Subscription plan saved successfully");
        },
        onError: () => {
            toast.error("Failed to save subscription plan");
        },
    });

    const submit = (data: ISubscriptionPlanForm) => {
        // console.log(data);

        if (initials) {
            updateSubscriptionPlanMutation.mutate(data);

        } else {
            createSubscriptionPlanMutation.mutate(data);
        }
    };

    return (
        <Modal size="md" title={initials ? "Edit Subscription Plan" : "Create Subscription Plan"} isOpen={open} onClose={onClose}>
            <form className="space-y-5 py-2" onSubmit={handleSubmit(submit)}>

                {/* Row 1: Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Plan Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Premium Tier"
                            className={`w-full px-3 py-2 border rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 ${errors.name
                                    ? "border-red-300 focus:ring-red-100 bg-red-50/30"
                                    : "border-gray-200 focus:ring-blue-100"
                                }`}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Price (Amount)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                className={`w-full pl-5 pr-3 py-2 border rounded-lg text-sm transition-shadow focus:outline-none focus:ring-2 ${errors.amount
                                        ? "border-red-300 focus:ring-red-100 bg-red-50/30"
                                        : "border-gray-200 focus:ring-blue-100"
                                    }`}
                                {...register("amount")}
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{errors.amount.message}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Dynamic Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Billing Duration
                        </label>
                        <select
                            className={`w-full px-3 py-2 border rounded-lg text-sm bg-white transition-shadow focus:outline-none focus:ring-2 ${errors.duration ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100"
                                }`}
                            {...register("duration")}
                        >
                            {Object.entries(SubscriptionPlanDuration).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {value.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                        {errors.duration && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{errors.duration.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Popularity
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200/60">
                            <button
                                type="button"
                                onClick={() => setValue("popular", true)}
                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${popularity === true
                                        ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Popular
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("popular", false)}
                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${popularity === false
                                        ? "bg-white text-gray-700 shadow-sm border border-gray-200"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Not Popular
                            </button>
                        </div>
                        <input type="hidden" {...register("popular")} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Availability Status
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200/60">
                            <button
                                type="button"
                                onClick={() => setValue("status", SubscriptionPlanStatus.ACTIVE)}
                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${currentStatus === SubscriptionPlanStatus.ACTIVE
                                        ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("status", SubscriptionPlanStatus.INACTIVE)}
                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${currentStatus === SubscriptionPlanStatus.INACTIVE
                                        ? "bg-white text-gray-700 shadow-sm border border-gray-200"
                                        : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                Inactive
                            </button>
                        </div>
                        <input type="hidden" {...register("status")} />
                    </div>
                </div>

                {/* Benefits Segment Selection Block */}
                <div className="border-t border-gray-100 pt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Included Benefits &amp; Core Permissions
                    </label>

                    <div className="max-h-[300px] overflow-y-auto border border-gray-100 bg-gray-50/50 rounded-xl p-3 space-y-2">
                        {isLoading ? (
                            <div className="space-y-2">
                                {Array(3).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-full rounded-lg" />
                                ))}
                            </div>
                        ) : !subscriptionPlanBenefits || subscriptionPlanBenefits.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-400 italic">
                                No predefined system benefits found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1">
                                {subscriptionPlanBenefits.map((benefit: any) => (
                                    <label
                                        key={benefit.id}
                                        htmlFor={benefit.id}
                                        className="flex items-center gap-3 bg-white p-2.5 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors select-none group"
                                    >
                                        <input
                                            type="checkbox"
                                            id={benefit.id}
                                            value={benefit.id} // Wire your required string parameter type to RHF array namespace mapping
                                            className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                                            {...register("benefits")}
                                        />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            {benefit.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.benefits && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.benefits.message}</p>
                    )}
                </div>

                {/* Form Action Controls */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/70 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        label={initials ? "Save Changes" : "Create Plan"}
                        theme="primary"
                        size="md"
                        loading={createSubscriptionPlanMutation.isPending || updateSubscriptionPlanMutation.isPending}
                        disabled={createSubscriptionPlanMutation.isPending || updateSubscriptionPlanMutation.isPending}
                    />
                </div>
            </form>
        </Modal>
    );
}