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
    IconInfoCircle
} from "@tabler/icons-react";

import { USSDPushRequest, USSDPushEnquiry } from "@/services/payments";
import { paymentOptions } from "@/types/statuses";
import { useUserDataContext } from "@/providers/userDataProvider";
import { AlternativePaymentSection } from "../../fragments/AlternativePaymentSection";
import { ISubscriptionPlan } from "@/types";

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

    const [paymentDetails, setPaymentDetails] = useState({
        planId: plan.id || "",
        phoneNumber: "",
        mno: "",
        source: "",
        reason: "SUBSCRIPTION"
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

    if (!open) return null;

    const formattedAmount = new Intl.NumberFormat("en-TZ", {
        style: "currency",
        currency: "TZS"
    }).format(plan.amount);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl w-full max-h-[90vh] overflow-y-auto relative p-6 md:p-8">

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
                                {plan.name} Checkout
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

                                {/* Pricing Summary Breakdown Component */}
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Total Charge Due
                                    </span>
                                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                                        {formattedAmount}
                                    </span>
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

                                    <button
                                        type="button"
                                        onClick={() => handlePayment("MOBILE")}
                                        className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold text-sm rounded-xl transition-colors shadow-sm"
                                    >
                                        <IconDeviceMobileDollar size={18} />
                                        <span>{t("subscription-modal-pay-with-mobile")}</span>
                                    </button>
                                </div>
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
                    <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                        <AlternativePaymentSection />
                    </div>

                </div>
            </div>
        </div>
    );
}