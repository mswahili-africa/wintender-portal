import { useState } from "react";
import Button from "@/components/button/Button";
import { IconDeviceMobileDollar, IconLoader, IconPhone, IconWallet, IconX } from "@tabler/icons-react";
import Spinner from "@/components/spinners/Spinner";
import Loader from "@/components/spinners/Loader";

export default function PaymentModal({
    paymentDetails,
    setPaymentDetails,
    onClose,
    onPayWallet,
    onPayDirect,
    children,
}: {
    paymentDetails: { phoneNumber: string; period: number };
    setPaymentDetails: React.Dispatch<React.SetStateAction<{ planId: string; period: number; phoneNumber: string; paymentReason: string }>>;
    onClose: () => void;
    onPayWallet: () => void;
    onPayDirect: () => void;
    children?: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

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

    const handlePayment = async (type: "wallet" | "direct") => {
        if (!paymentDetails.phoneNumber) {
            setWarningMessage("Phone number is required.");
            return;
        }

        setIsLoading(true);
        setWarningMessage("");

        try {
            type === "wallet" ? await onPayWallet() : await onPayDirect();
        } catch (error) {
            console.error("Payment Error:", error);
        } finally {
            setIsLoading(false);
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

                {/* Info Text */}
                <p className="text-green-600 text-center text-sm mt-4 italic">
                    Choose payment method:
                </p>

                {/* Dynamic Content Slot */}
                <div className="mt-4">{children}</div>

                {/* Action Buttons */}
                <div className="w-full flex flex-row items-center justify-center">
                    {
                        isLoading ? (
                            <Loader/>
                        ) : (<>
                            <button onClick={() => handlePayment("wallet")} className="p-3 w-full hover:bg-green-600 duration-200 cursor-pointer gap-x-3 flex flex-row text-white bg-green-500 items-center justify-center border">
                                <IconWallet />
                                <p>Pay With Wallet</p>
                            </button>
                            <button onClick={() => handlePayment("direct")} className="p-3 w-full hover:bg-green-600 duration-200 cursor-pointer gap-x-3 flex flex-row text-white bg-green-500 items-center justify-center border">
                                <IconDeviceMobileDollar />
                                <p>Pay With Mobile</p>
                            </button></>
                        )
                    }
                </div>

                {isLoading && (
                    <div className="mt-4 text-center text-green-600">
                        Processing Payment...
                    </div>
                )}
            </div>
        </div>
    );
}
