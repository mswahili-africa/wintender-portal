import { useState } from "react";
import { IconDeviceMobileDollar, IconWallet, IconX } from "@tabler/icons-react";
import { USSDPushRequest, USSDPushEnquiry } from "@/services/payments";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";
import { useUserData } from "@/hooks/useUserData";
import { paymentOptions } from "@/types/statuses";
import { Trans, useTranslation } from "react-i18next";

export default function PaymentModal({ onClose, }: { onClose: () => void; }) {
    const [warningMessage, setWarningMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isProcessing, setIsProcessing] = useState(false); // JCM Added loading state
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { userData } = useUserData();

    const [paymentDetails, setPaymentDetails] = useState({
        planId: "66698e3f39cbe2504dd54c57",
        period: 6,
        phoneNumber: "",
        mno: "",
        source: "",
        paymentReason: "SUBSCRIPTION"
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const regex = /^[0-9\b]+$/;

        if (name === "phoneNumber" && !regex.test(value)) {
            return;
        }
        setPaymentDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // paymentMutation for making the payment
    const paymentMutation = useMutation({
        mutationFn: (paymentData: { planId: string, period: number, phoneNumber: string, paymentReason: string, mno: string, source: string }) => USSDPushRequest(paymentData),
        onSuccess: (data) => {
            startEnquiry(data.id);  // Start the enquiry API calls
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
                // Check if response is successful
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
                clearInterval(intervalId);  // Stop after 5 attempts
                window.location.reload();
            }
        }, 5000);  // 5-second interval
    };

    const handlePayment = async (type: "WALLET" | "MOBILE") => {

        const updatedDetails = { ...paymentDetails, source: type }; // Set source to WALLET for wallet payments

        if (!updatedDetails.phoneNumber) {
            setWarningMessage("Phone number is required.");
            return;
        }

        if (type === "MOBILE" && !updatedDetails.mno) {
            setWarningMessage("Select payment provider (MNO) is required.");
            return;
        }

        if (type === "WALLET" && userData) {
            if (userData?.walletAmount < (updatedDetails.period * 10000)) {
                setWarningMessage("Insufficient wallet balance. Please top up your wallet or choose a different payment method.");
                return;
            }
        }

        setWarningMessage("");

        try {
            paymentMutation.mutate(updatedDetails);
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[60%] relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                    <h3 className="text-xl font-bold col-span-full text-gray-800">{t("subscription-modal-header")}</h3>
                    <div>
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 absolute t0p-3 right-5">
                                <IconX className="text-red-600" size={22} />
                            </button>
                        </div>
                        <div className="text-green-600 font-bold text-lg mb-2 mt-5">{t("subscription-modal-sub-header")}</div>
                        {warningMessage && <p className="text-red-500 text-sm mt-1 text-center">{warningMessage}</p>}
                        {/* Phone Input */}
                        <div className="mt-4">
                            <label htmlFor="phoneNumber" className="block text-sm text-gray-600">{t("subscription-modal-phone")} </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={paymentDetails.phoneNumber}
                                onChange={handleChange}
                                placeholder={t("subscription-modal-phone-input-placeholder")}
                                className="input-normal w-full mt-2"
                            />
                        </div>

                        {/* Period Selection */}
                        <div className="mt-4">
                            <label htmlFor="period" className="block text-sm text-gray-600">{t("subscription-modal-period")}</label>
                            <input
                                type="range"
                                id="period"
                                name="period"
                                value={paymentDetails.period}
                                onChange={handleChange}
                                min="1"
                                max="12"
                                step="1"
                                className="w-full mt-2"
                            />
                            <div className="text-center text-lg mt-1">{t("subscription-modal-months-count", { count: paymentDetails.period })}</div>
                        </div>

                        {/* Total Amount */}
                        <div className="mt-4 text-center font-semibold">
                            {t("subscription-modal-total", { amount: new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS" }).format(10000 * paymentDetails.period) })}
                        </div>


                        {/* payment providers */}
                        {
                            !(paymentMutation.isPending || isProcessing) && <>
                                <p className="text-green-600 text-center mt-5 mb-3 text-sm italic">
                                    {t("subscription-modal-payment-method")}:
                                </p>
                                <div className="w-full flex flex-col mb-5 justify-center items-center">
                                    <div className="grid grid-cols-5 justify-between items-center gap-5">
                                        {paymentOptions.map((method) => (
                                            <div
                                                key={method.name}
                                                onClick={() => { setPaymentMethod(method.name); setPaymentDetails((prev) => ({ ...prev, mno: method.name })) }}
                                                className={`w-12 h-12 rounded cursor-pointer transition-all duration-200 ${paymentMethod === method.name ? "ring-4 ring-green-500 scale-110" : "opacity-70 hover:opacity-100"}`}
                                            >
                                                <img src={method.img} className="object-cover rounded w-full h-full" alt={method.name} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        }




                        {/* Dynamic Content Slot */}
                        <div className="flex flex-col justify-center items-center mt-4">
                            {
                                (paymentMutation.isPending || isProcessing) &&
                                <Puff
                                    height="60"
                                    width="60"
                                    radius="1"
                                    color="green"
                                    ariaLabel="loading"
                                    visible={(paymentMutation.isPending || isProcessing)}
                                />
                            }
                            {
                                isProcessing &&
                                <p className="mt-4 text-center text-xs">
                                    {t("subscription-modal-processing-notice", {
                                        provider: userData?.paymentMode === "AZAM_PAY" ? "Azam Pay" : "Ewallet Africa",
                                    })}
                                    "
                                </p>
                                // <p className="mt-4 text-xs text-center">Please check your phone for payment confirmation. payment name: <strong>"{userData?.paymentMode === "AZAM_PAY" ? "Azam Pay" : "Ewallet Africa"}"</strong></p>
                            }
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full flex flex-row items-center justify-center">
                            {
                                !(paymentMutation.isPending || isProcessing) && <>
                                    <button onClick={() => handlePayment("WALLET")} className="p-3 w-full hover:bg-green-600 duration-200 cursor-pointer gap-x-3 flex flex-row text-white bg-green-500 items-center justify-center border">
                                        <IconWallet />
                                        <p>{t("subscription-modal-pay-with-wallet")}</p>
                                    </button>
                                    <button onClick={() => handlePayment("MOBILE")} className="p-3 w-full hover:bg-green-600 duration-200 cursor-pointer gap-x-3 flex flex-row text-white bg-green-500 items-center justify-center border">
                                        <IconDeviceMobileDollar />
                                        <p>{t("subscription-modal-pay-with-mobile")}</p>
                                    </button>
                                </>

                            }
                        </div>

                        {(paymentMutation.isPending || isProcessing) && (
                            <div className="mt-4 text-center text-green-600">
                                Processing Payment...
                            </div>
                        )}
                    </div>
                    <div className="p-5 sm:border-l-4 sm:border-green-600 ps-3 text-sm">
                        <p className="text-sm"><span className="text-green-600 font-bold text-lg">{t("payment-modal-alternatively")},</span> </p>
                        <div className="flex flex-col sm:flex-row gap-x-5 my-1 w-full justify-center sm:justify-between">
                            <div>
                                <div className="flex flex-row gap-x-5 my-1 items-center">
                                    <img src="/payment_logo/voda.png" className="w-8 h-8 rounded-lg" alt="" />
                                    <p className="text-lg font-bold">58224582</p>
                                </div>
                                <p>{t("payment-modal-lipa-name")}: <span className="text-md font-bold">WINTENDER P SHOP</span></p>
                            </div>
                            <img className="object-fit  h-28 w-28 sm:h-20 sm:w-20 mx-auto" src='/payment_logo/wintender_lipa.png' alt="qr code" />
                        </div>

                        <div className="font-bold text-green-600 text-md w-full sm:my-3 my-6">--------{t("payment-modal-or")}--------</div>

                        <p className="text-sm mb-2">{t("payment-modal-you-can-pay-with")}: </p>
                        <p>{t("payment-modal-bank-name")}: <span className="text-md font-bold">CRDB Bank PLC</span></p>
                        <p>{t("payment-modal-account-name")}: <span className="text-md font-bold">Hatuamoja Company Limited</span></p>
                        <p>{t("payment-modal-account-number")}: <span className="text-md font-bold">0150388028500</span></p>
                        <p>{t("payment-modal-branch")}: <span className="text-md font-bold">Goba</span></p>
                        <p>{t("payment-modal-swift-code")}: <span className="text-md font-bold">CORUTZTZ</span></p>

                        {/* General instructions with emphasis */}
                        <div className="font-bold text-green-600 my-3">{t("payment-modal-instructions")}:</div>
                        <p className="text-center text-sm text-red-600">
                            <Trans
                                i18nKey="payment-share-proof"
                                components={{
                                    email: <a href="mailto:finance@bantu.tz" className="font-semibold text-blue-600 hover:underline" />,
                                    phone: (
                                        <a href="https://wa.me/255755135201" className="font-semibold text-blue-600 hover:underline" />
                                    ),
                                }}
                                values={{
                                    email: "finance@bantu.tz",
                                    phone: "+255755135201",
                                }}
                            />
                            {/* "Once payment is made via LIPA NAMBA or BANK ACCOUNT, share the receipt to email <a href="mailto:finance@wintender.tz" target="_blank" className="font-bold hover:underline">finance@wintender.tz</a>" */}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
