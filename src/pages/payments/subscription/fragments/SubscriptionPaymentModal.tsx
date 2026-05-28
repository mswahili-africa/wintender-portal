import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Puff } from "react-loader-spinner";
import {
    IconDeviceMobileDollar,
    IconWallet,
    IconX,
    IconPhone,
    IconInfoCircle,
    IconCircleCheckFilled
} from "@tabler/icons-react";

import { USSDPushRequest, USSDPushEnquiry } from "@/services/payments";
import { paymentOptions, SubscriptionPlanDuration } from "@/types/statuses";
import { useUserDataContext } from "@/providers/userDataProvider";
import { AlternativePaymentSection } from "../../fragments/AlternativePaymentSection";
import { ISubscriptionPlan } from "@/types";
import Modal from "@/components/Modal";

interface SubscriptionPaymentModalProps {
    open: boolean;
    onClose: () => void;
    plan: ISubscriptionPlan;
}

export default function SubscriptionPaymentModal({ open, onClose, plan }: SubscriptionPaymentModalProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { userData } = useUserDataContext();

    const [warningMessage, setWarningMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState<keyof typeof SubscriptionPlanDuration>("MONTHLY");

    const durationMeta: Record<string, { subtitle: string; badge?: string }> = {
        MONTHLY: { subtitle: "1-Month", badge: "Standard" },
        QUARTERLY: { subtitle: "3-Months", badge: "Save 10%" },
        SEMI_ANNUALLY: { subtitle: "6-Months", badge: "Save 15%" },
        ANNUALLY: { subtitle: "12-Months", badge: "Best Value" },
    };

    const [paymentDetails, setPaymentDetails] = useState({
        planId: plan.id || "",
        phoneNumber: "",
        mno: "",
        source: "",
        reason: "SUBSCRIPTION",
        duration: duration
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const digitRegex = /^[0-9\b]+$/;

        if (name === "phoneNumber" && value !== "" && !digitRegex.test(value)) {
            return;
        }

        setPaymentDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const paymentMutation = useMutation({
        mutationFn: (paymentData: typeof paymentDetails) => USSDPushRequest(paymentData),
        onSuccess: (data) => {
            startEnquiry(data.id);
        },
        onError: (error: any) => {
            setIsProcessing(false);
            toast.error(error.data?.message || error.message || "Unknown error occurred.");
        }
    });

    const startEnquiry = (id: string) => {
        setIsProcessing(true);
        let attemptCount = 0;

        const intervalId = setInterval(async () => {
            try {
                const response = await USSDPushEnquiry(id);
                if (response.code === "SUCCESS") {
                    toast.success("Payment confirmed.");
                    clearInterval(intervalId);
                    navigate("/");
                }
            } catch (error) {
                toast.error("Error checking payment status.");
            }

            attemptCount += 1;
            if (attemptCount >= 5) {
                setIsProcessing(false);
                clearInterval(intervalId);
                window.location.reload();
            }
        }, 5000);
    };

    const handlePayment = async (type: "WALLET" | "MOBILE") => {
        const updatedDetails = { ...paymentDetails, source: type };

        if (!updatedDetails.phoneNumber) {
            setWarningMessage(t("payment-modal-phone-error"));
            return;
        }

        if (type === "MOBILE" && !updatedDetails.mno) {
            setWarningMessage(t("payment-modal-mno-error"));
            return;
        }

        if (type === "WALLET" && userData) {
            if ((userData?.walletAmount || 0) < plan.amount) {
                setWarningMessage(t("payment-modal-wallet-amount-error"));
                return;
            }
        }

        setWarningMessage("");

        paymentMutation.mutate(updatedDetails);
    };





    // final amount
    let finalAmount = plan.amount;

    switch (duration) {
        case "QUARTERLY":
            finalAmount = plan.amount * 3;
            break;
        case "SEMI_ANNUALLY":
            finalAmount = plan.amount * 6;
            break;
        case "ANNUALLY":
            finalAmount = plan.amount * 12;
            break;
        default:
            finalAmount = plan.amount;
            break;
    }

    const formattedAmount = new Intl.NumberFormat("en-TZ", {
        style: "currency",
        currency: "TZS",
        maximumFractionDigits: 0
    }).format(finalAmount);

    return (
        // <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all animate-fadeIn">
        //     <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative p-6 md:p-8">
        <Modal size="xxl" zIndex={60} isOpen={open} onClose={onClose}>

            {/* Close Button Trigger */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
                <IconX size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Main Checkout Section */}
                <div className="md:col-span-2 flex flex-col justify-between space-y-6">
                    <div>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-1">
                            {plan.name} Package Checkout
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                            {t("subscription-modal-header")}
                        </h3>
                        <p className="text-sm font-medium text-blue-600 mt-1">
                            {t("subscription-modal-sub-header")}
                        </p>
                    </div>

                    {/* Error Message banner */}
                    {warningMessage && (
                        <div className="flex items-start gap-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl p-3 text-xs font-medium">
                            <IconInfoCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                            <span>{warningMessage}</span>
                        </div>
                    )}

                    {!(paymentMutation.isPending || isProcessing) ? (
                        <div className="space-y-5">
                            {/* Mobile Phone Input Row */}
                            <div>
                                <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    {t("subscription-modal-phone")}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">
                                        <IconPhone size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={paymentDetails.phoneNumber}
                                        onChange={handleChange}
                                        placeholder={t("subscription-modal-phone-input-placeholder") || "e.g., 255658191222"}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
                                    />
                                </div>
                            </div>

                            {/* Mobile Network Operator Selection Array Container */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    {t("subscription-modal-payment-method")}
                                </label>
                                <div className="grid grid-cols-5 gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200/50">
                                    {paymentOptions.map((method) => {
                                        const isSelected = paymentMethod === method.name;
                                        return (
                                            <button
                                                type="button"
                                                key={method.name}
                                                onClick={() => {
                                                    setPaymentMethod(method.name);
                                                    setPaymentDetails((prev) => ({ ...prev, mno: method.name }));
                                                }}
                                                className={`relative aspect-square bg-white border rounded-lg p-2 flex items-center justify-center transition-all shadow-sm ${isSelected
                                                    ? "border-green-600 ring-2 ring-blue-50 bg-blue-50/10 scale-105"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <img
                                                    src={method.img}
                                                    className="object-contain max-h-10 max-w-10 rounded"
                                                    alt={method.name}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Subscription duration selection */}
                            <div>
                                {/* Field Title Section Header */}
                                <div className="flex items-center justify-between mb-2.5">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">
                                        {t("subscription-modal-duration")}
                                    </label>
                                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        Flexible Commitments
                                    </span>
                                </div>

                                {/* Advanced Select Cards Matrix Grid Wrapper */}
                                {/* Note: Changed grid-cols-5 to grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 for cleaner rendering across devices */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-100/70 p-2 rounded-2xl border border-slate-200/60">
                                    {Object.entries(SubscriptionPlanDuration).map(([key, value]) => {
                                        // Safeguard against missing array configurations gracefully
                                        if (!["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY"].includes(key)) return null;

                                        const isSelected = duration === key;
                                        const meta = durationMeta[key];

                                        return (
                                            <div
                                                key={key}
                                                onClick={() => {
                                                    setDuration(key as keyof typeof SubscriptionPlanDuration);
                                                    setPaymentDetails((prev) => ({
                                                        ...prev,
                                                        duration: key as keyof typeof SubscriptionPlanDuration,
                                                    }));
                                                }}
                                                className={`relative cursor-pointer rounded-xl p-3 flex flex-col justify-between transition-all duration-200 min-h-[90px] select-none border group ${isSelected
                                                    ? "bg-white border-emerald-500 shadow-md shadow-emerald-950/5 ring-2 ring-emerald-500/10 scale-[1.01]"
                                                    : "bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-sm"
                                                    }`}
                                            >
                                                {/* Active Radial Node Anchor Pin */}
                                                {isSelected && (
                                                    <div className="absolute bottom-3 right-3 text-emerald-500 animate-scaleIn">
                                                        <IconCircleCheckFilled size={18} />
                                                    </div>
                                                )}

                                                {/* Marketing Value Tag / Badge Pill */}
                                                {/* {meta?.badge && (
                                                        <div className={`absolute bottom-3 right-3 text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${isSelected
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'bg-slate-200/70 text-slate-500 group-hover:bg-slate-200'
                                                            }`}>
                                                            {meta.badge}
                                                        </div>
                                                    )} */}

                                                {/* Node Typography Structure Layout */}
                                                <div className="space-y-1 pr-2">
                                                    <p className={`text-xs font-black tracking-tight transition-colors ${isSelected ? "text-slate-900" : "text-slate-700"
                                                        }`}>
                                                        {value}
                                                    </p>
                                                    <p className={`text-xs font-medium transition-colors ${isSelected ? "text-slate-500" : "text-slate-400"
                                                        }`}>
                                                        {meta?.subtitle || "Subscription Package"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Pricing Summary Breakdown Component */}
                            <div className="bg-gray-50 border-gray-100 rounded-xl p-4 space-y-3">
                                <div className=" flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Package name
                                    </span>
                                    <span className="text-xl font-bold text-green-700 tracking-tight">
                                        {plan.name}
                                    </span>
                                </div>
                                <div className=" flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Total Charge Due
                                    </span>
                                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                                        {formattedAmount}
                                    </span>
                                </div>
                            </div>

                            {/* Interactive Action Triggers */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => handlePayment("WALLET")}
                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white hover:bg-gray-800 font-semibold text-sm rounded-xl transition-colors shadow-sm"
                                >
                                    <IconWallet size={18} />
                                    <span>{t("subscription-modal-pay-with-wallet")}</span>
                                </button>

                                {
                                    finalAmount <= 5000000 &&
                                    <button
                                        type="button"
                                        onClick={() => handlePayment("MOBILE")}
                                        className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold text-sm rounded-xl transition-colors shadow-sm"
                                    >
                                        <IconDeviceMobileDollar size={18} />
                                        <span>{t("subscription-modal-pay-with-mobile")}</span>
                                    </button>
                                }

                            </div>

                            {
                                finalAmount > 5000000 &&
                                <div className="mt-4 text-red-500 text-sm font-medium text-center">
                                    <span className="font-bold">{formattedAmount}</span> is greater that allowed amount (5,000,000) should be paid using bank transfer or e-wallet
                                </div>
                            }
                        </div>
                    ) : (
                        /* Polling Intermediary System Loading State Card */
                        <div className="flex flex-col items-center justify-center text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                            <Puff
                                height="60"
                                width="60"
                                radius="2"
                                color="#2563eb"
                                ariaLabel="payment-processing-loader"
                                visible={true}
                            />
                            <div className="space-y-1 px-4">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Awaiting Payment Authorization...
                                </h4>
                                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                                    {t("subscription-modal-processing-notice", {
                                        provider: userData?.paymentMode === "AZAM_PAY" ? "Azam Pay" : "Ewallet Africa",
                                    })}
                                </p>
                                <p className="text-[11px] font-medium text-blue-600 pt-2 animate-pulse">
                                    Please keep this window open and accept the incoming push notification on your device.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Alternative Cross-Section Partition Column Group */}
                <div className="md:col-span-2 border-t text-black md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                    <AlternativePaymentSection />
                </div>

            </div>
        </Modal>
        //     {/* </div>
        // </div> */}
    );
}