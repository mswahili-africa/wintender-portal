import { useState } from "react";
import Button from "@/components/button/Button"; // Custom Button Component
import { USSDPushEnquiry, USSDPushWalletRequest } from "@/services/payments";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "@/components/spinners/Loader";
import { IWalletTopUp } from "@/types";

export default function WalletPaymentModal({
    isOpen,
    isLoading,
    onClose,
    children, // Accept children here to allow passing loader or success message
}: {
    isOpen: boolean;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    children: React.ReactNode; // Accept children for dynamic content like loader or success message
}) {
    const [isPayButtonDisabled, setIsPayButtonDisabled] = useState(false); // Disable Pay button
    const [warningMessage, setWarningMessage] = useState(""); // To display warning message
    const [paymentDetails, setPaymentDetails] = useState({ phoneNumber: "", amount: 1000 });
    const [isWalletLoading, setIsWalletLoading] = useState(false);
    const [messages, setMessages] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!paymentDetails.phoneNumber) {
            setWarningMessage("Phone number is required!"); // Show warning message
            return; // Prevent submission if phone number is empty
        }
        if (!paymentDetails.amount) {
            setWarningMessage("Amount is required!"); // Show warning message
            return; // Prevent submission if AMOUNT is empty
        }

        try {
            // Trigger the payment submission (API call)
            onSubmit();
            setIsPayButtonDisabled(true);
            setWarningMessage("");
        } catch (error) {
            setIsPayButtonDisabled(false);
            console.error("Error during payment submission:", error);
        }
    };

    // jcm payment
    const paymentMutation = useMutation({
        mutationFn: async (paymentData: IWalletTopUp) => {
            setIsWalletLoading(true);

            // Step 1: Send initial payment request
            if(paymentData.amount < 1000) {
                throw new Error("Amount should be greater than 1000");
            }
            const response = await USSDPushWalletRequest(paymentData);

            if (response.code !== "SUCCESS") {
                throw new Error(response.message);
            }

            // Step 2: Poll the enquiry endpoint until it's not pending
            const maxTries = 7;
            const interval = 5000; 
            let attempts = 0;
            let finalStatus;

            while (attempts < maxTries) {
                await new Promise((resolve) => setTimeout(resolve, interval));
                finalStatus = await USSDPushEnquiry(response.id);
                setMessages(finalStatus.message);

                if (finalStatus.code !== "PENDING") {
                    break;
                }

                attempts++;
            }

            if (finalStatus.code === "SUCCESS") {
                return finalStatus; 
            } else {
                throw new Error(finalStatus.message || "Payment failed or timed out");
            }
        },

        onSuccess: (data: any) => {
            toast.success(data.message || "Payment successful");
            setMessages('');
            setIsWalletLoading(false);
        },

        onError: (error: any) => {
            setMessages('');
            toast.error("Payment failed");
            setIsWalletLoading(false);
        },

        retry: 0,
    });


    const payload: IWalletTopUp = {
        amount: paymentDetails.amount,
        phoneNumber: paymentDetails.phoneNumber,
        paymentReason: "WALLET_IN"
    }

    const onSubmit = () => {
        paymentMutation.mutate(payload)
    }

    return (
        <div className={`${isOpen ? "block" : "hidden"} fixed inset-0 bg-black bg-opacity-50 flex justify-center h-full items-center z-50`}>
            <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="text-xl font-bold text-gray-800">Top up wallet amount</h3>
                <div className="mt-4">
                    <label className="block text-sm text-gray-600" htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={paymentDetails.phoneNumber}
                        onChange={handleChange}
                        className="input-normal w-full mt-2"
                        placeholder="Enter your phone number"
                    />
                </div>
                {warningMessage && (
                    <div className="mt-2 text-red-500 text-sm">
                        {warningMessage} {/* Display warning message */}
                    </div>
                )}
                <div className="mt-4">
                    <label className="block text-sm text-gray-600" htmlFor="period">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        pattern="[0-9]*"
                        value={paymentDetails.amount}
                        onChange={handleChange}
                        className="input-normal w-full mt-2"
                        placeholder="Enter the amount"
                    />
                </div>

                {/* Dynamic content (Loading/Success Message) */}
                <div className="mt-6">
                    {children}
                </div>

                {/* Success Message */}
                {messages !== "" && (
                    <div className="text-green-600 w-full text-center text-xs">{messages}</div>
                )}
                {isWalletLoading && (
                    <div className="mt-4 text-center text-green-600">
                        <Loader />
                    </div>
                )}

                {/* Submit and Cancel buttons */}
                {!isWalletLoading && (
                    <div className="mt-10 flex justify-end space-x-2">
                        <Button label="Cancel" theme="danger" onClick={onClose} />
                        <Button label="Pay" theme="primary" onClick={handleSubmit} disabled={isPayButtonDisabled} />
                    </div>
                )}
            </div>
        </div>
    );
}
