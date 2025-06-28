import { useState } from "react";
import Button from "@/components/button/Button"; // Custom Button Component

export default function WalletPaymentModal({
    paymentDetails,
    setPaymentDetails,
    isOpen,
    isLoading,
    setIsLoading,
    onClose,
    onSubmit,
    children, // Accept children here to allow passing loader or success message
}: {
    paymentDetails: { phoneNumber: string; amount: number };
    setPaymentDetails: React.Dispatch<React.SetStateAction<{  amount: number; phoneNumber: string; paymentReason: string }>>;
    isOpen: boolean;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode; // Accept children for dynamic content like loader or success message
}) {
    const [showMessage, setShowMessage] = useState(false); // To show the success message
    const [isPayButtonDisabled, setIsPayButtonDisabled] = useState(false); // Disable Pay button
    const [warningMessage, setWarningMessage] = useState(""); // To display warning message

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
            setIsLoading(true); // Start loading
            setShowMessage(true); // Hide the success message
            setIsPayButtonDisabled(true);
            setWarningMessage("");
        } catch (error) {
            setIsLoading(false);
            setShowMessage(false);
            setIsPayButtonDisabled(false);
            console.error("Error during payment submission:", error);
        }
    };

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
                {isLoading &&  (
                    <div className="mt-4 text-center text-green-600">
                        <span>Processing...</span>
                    </div>
                )}

                {/* Submit and Cancel buttons */}
                {!isLoading && (
                    <div className="mt-10 flex justify-end space-x-2">
                        <Button label="Cancel" theme="danger" onClick={onClose} />
                        <Button label="Pay" theme="primary" onClick={handleSubmit} disabled={isPayButtonDisabled} />
                    </div>
                )}
            </div>
        </div>
    );
}
