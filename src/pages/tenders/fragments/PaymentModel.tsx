import { useState } from "react";
import { IconDeviceMobileDollar, IconWallet, IconX } from "@tabler/icons-react";
import { USSDPushRequest, USSDPushEnquiry } from "@/services/payments";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";

export default function PaymentModal({ onClose, }: { onClose: () => void; }) {
    const [warningMessage, setWarningMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false); // JCM Added loading state
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState({
        planId: "66698e3f39cbe2504dd54c57",
        period: 6,
        phoneNumber: "",
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
        mutationFn: (paymentData: { planId: string, period: number, phoneNumber: string, paymentReason: string }) => USSDPushRequest(paymentData),
        onSuccess: (data) => {
            startEnquiry(data.id);  // Start the enquiry API calls
        },
        onError: (error) => {
            setIsProcessing(false);
            toast.error("Payment failed: " + error);
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

    const handlePayment = async (type: "wallet" | "direct") => {
        if (!paymentDetails.phoneNumber) {
            setWarningMessage("Phone number is required.");
            return;
        }

        setWarningMessage("");

        try {
            type === "wallet" ? console.log("Function not implemented") : paymentMutation.mutate(paymentDetails);
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[95%] max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Renew Your Subscription</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <IconX className="text-red-600" size={22} />
                    </button>
                </div>

                {/* Phone Input */}
                <div className="mt-4">
                    <label htmlFor="phoneNumber" className="block text-sm text-gray-600">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={paymentDetails.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="input-normal w-full mt-2"
                    />
                    {warningMessage && <p className="text-red-500 text-sm mt-1">{warningMessage}</p>}
                </div>

                {/* Period Selection */}
                <div className="mt-4">
                    <label htmlFor="period" className="block text-sm text-gray-600">Subscription Period</label>
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
                    <div className="text-center text-lg mt-1">{paymentDetails.period} Month(s)</div>
                </div>

                {/* Total Amount */}
                <div className="mt-4 text-center font-semibold">
                    Total: {new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS" }).format(10000 * paymentDetails.period)}
                </div>



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
                        <p className="mt-4 text-xs text-center">Please check your phone and accept payment by entering your password.</p>
                    }
                </div>

                {
                    !(paymentMutation.isPending || isProcessing) &&
                    <p className="text-green-600 text-center text-sm italic">
                        Choose payment method:
                    </p>
                }
                {/* Action Buttons */}
                <div className="w-full flex flex-row items-center justify-center">
                    {
                        !(paymentMutation.isPending || isProcessing) && <>
                            <button onClick={() => handlePayment("wallet")} className="p-3 w-full hover:bg-green-600 duration-200 cursor-pointer gap-x-3 flex flex-row text-white bg-green-500 items-center justify-center border">
                                <IconWallet />
                                <p>Pay With Wallet</p>
                            </button>
                            <button onClick={() => handlePayment("direct")} className="p-3 w-full hover:bg-green-600 duration-200 cursor-pointer gap-x-3 flex flex-row text-white bg-green-500 items-center justify-center border">
                                <IconDeviceMobileDollar />
                                <p>Pay With Mobile</p>
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
        </div>
    );
}
