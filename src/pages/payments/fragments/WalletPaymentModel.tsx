import { useState } from "react";
import Button from "@/components/button/Button"; // Custom Button Component
import { USSDPushEnquiry, USSDPushWalletRequest } from "@/services/payments";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "@/components/spinners/Loader";
import { IWalletTopUp } from "@/types";
import { set } from "lodash";
import { useUserData } from "@/hooks/useUserData";
import { IconX } from "@tabler/icons-react";

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
    const [warningMessage, setWarningMessage] = useState(""); // To display warning message
    const [paymentMethod, setPaymentMethod] = useState(""); // payment method state
    const [paymentDetails, setPaymentDetails] = useState({
        phoneNumber: "",
        amount: 10000,
        mno: ""
    }); // Initial payment details
    const [messages, setMessages] = useState('');

    const { userData } = useUserData(); // Fetch user data to check payment mode

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
            setWarningMessage("");
        } catch (error) {
            console.error("Error during payment submission:", error);
        }
    };


    // jcm payment
    const paymentMutation = useMutation({
        mutationFn: async (paymentData: IWalletTopUp) => {

            // Step 1: Send initial payment request
            if (paymentData.amount < 1000) {
                setWarningMessage("Amount should be greater than 1000");
                throw new Error("Amount should be greater than 1000");
            }
            if(paymentData.mno===""){
                setWarningMessage("Select payment provider (MNO) is required.");
                throw new Error("Select payment provider (MNO) is required.");
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
            onClose();
        },

        onError: (error: any) => {
            setMessages('');
            toast.error(error.response.data.message || "Payment failed");
        },

        retry: 0,
    });


    const payload: IWalletTopUp = {
        amount: paymentDetails.amount,
        phoneNumber: paymentDetails.phoneNumber,
        paymentReason: "WALLET_IN",
        mno: paymentDetails.mno,
        source: "MOBILE"
    }

    const onSubmit = () => {
        paymentMutation.mutate(payload)
    }

    return (
        <div className={`${isOpen ? "block" : "hidden"} fixed inset-0 bg-black bg-opacity-50 flex justify-center h-full items-center z-50`}>
            <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[60%] relative">
                <button type="button" onClick={onClose} className="absolute text-red-600 top-5 right-5"><IconX /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                    <h3 className="text-xl font-bold text-gray-800 col-span-full">Top up wallet amount</h3>
                    <div>
                        <div className="mt-4">
                        <div className="text-green-600 font-bold text-lg mb-2">Pay direct from your mobile</div>
                            {warningMessage && (
                                <div className="mt-2 text-red-500 text-sm w-full text-center mb-2">
                                    {warningMessage} {/* Display warning message */}
                                </div>
                            )}
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
                        <div className="mt-4">
                            <label className="block text-sm text-gray-600" htmlFor="period">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                pattern="[0-9]*"
                                min={10000}
                                value={paymentDetails.amount}
                                onChange={handleChange}
                                className="input-normal w-full mt-2"
                                placeholder="Enter the amount"
                            />
                        </div>

                        {
                            !paymentMutation.isPending && (
                                <>
                                    <p className="text-green-600 text-center mt-5 mb-3 text-sm italic">
                                        Choose payment method:
                                    </p>
                                    <div className="w-full flex flex-col justify-center items-center">
                                        <div className="grid grid-cols-5 justify-between items-center gap-5">
                                            {[
                                                { name: "Mpesa", img: "/payment_logo/voda.png" },
                                                { name: "Tigo", img: "/payment_logo/yas.png" },
                                                { name: "Airtel", img: "/payment_logo/airtel.png" },
                                                { name: "Halopesa", img: "/payment_logo/halopesa.png" },
                                                { name: "Azampesa", img: "/payment_logo/azam.jpg" },
                                            ].map((method) => (
                                                <div
                                                    key={method.name}
                                                    onClick={() => { setPaymentMethod(method.name); setPaymentDetails((prev) => ({ ...prev, mno: method.name })); }}
                                                    className={`w-12 h-12 rounded cursor-pointer transition-all duration-200 ${paymentMethod === method.name ? "ring-4 ring-green-500 scale-110" : "opacity-70 hover:opacity-100"}`}
                                                >
                                                    <img src={method.img} className="object-cover rounded w-full h-full" alt={method.name} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}


                        {/* Dynamic content (Loading/Success Message) */}
                        <div className="mt-6">
                            {children}
                        </div>

                        {/* Success Message */}
                        {messages !== "" && (
                            <div className="text-green-600 w-full text-center text-xs">{messages}</div>
                        )}
                        {paymentMutation.isPending && (
                            <div className="mt-4 text-center flex flex-col items-center text-green-600">
                                <Loader />
                                <p>payment name: <strong>"{userData?.paymentMode === "AZAM_PAY" ? "Azam Pay" : "Ewallet Africa"}"</strong></p>
                            </div>
                        )}

                        {/* Submit and Cancel buttons */}
                        {!paymentMutation.isPending && (
                            <div className="mt-10 flex justify-end space-x-2">
                                <Button label="Cancel" theme="danger" onClick={onClose} />
                                <Button label="Pay" theme="primary" onClick={handleSubmit} disabled={paymentMutation.isPending} />
                            </div>
                        )}
                    </div>
                    <div className="p-5 sm:border-l-4 sm:border-green-600 ps-3 text-sm">
                        <p className="text-sm"><span className="text-green-600 font-bold text-lg">Altenatively,</span><br /> you can pay with <span className="font-bold">LIPA NAMBA</span> below: </p>
                        <div className="flex flex-col sm:flex-row gap-x-5 my-1 w-full justify-center sm:justify-between">
                            <div>
                                <div className="flex flex-row gap-x-5 my-1 items-center">
                                    <img src="/payment_logo/voda.png" className="w-8 h-8 rounded-lg" alt="" />
                                    <p className="text-lg font-bold">58224582</p>
                                </div>
                                <p>Name: <span className="text-md font-bold">WINTENDER P SHOP</span></p>
                            </div>
                            <img className="object-fit  h-28 w-28 sm:h-20 sm:w-20 mx-auto" src='/payment_logo/wintender_lipa.png' alt="qr code" />
                        </div>

                        <div className="font-bold text-green-600 text-md w-full sm:my-3 my-6">--------OR--------</div>

                        <p className="text-sm mb-2">You can pay with <span className="font-bold">BANK ACCOUNT</span> details below: </p>
                        <p>Bank name: <span className="text-md font-bold">CRDB Bank PLC</span></p>
                        <p>Account Name: <span className="text-md font-bold">Hatuamoja Company Limited</span></p>
                        <p>Account Number: <span className="text-md font-bold">0150388028500</span></p>
                        <p>Branch: <span className="text-md font-bold">Goba</span></p>
                        <p>SwiftCode: <span className="text-md font-bold">CORUTZTZ</span></p>

                        {/* General instructions with emphasis */}
                        <div className="font-bold text-green-600 my-3">Important:</div>
                        <p className="text-center text-sm text-red-600">
                            "Once payment is made via LIPA NAMBA or BANK ACCOUNT, share the receipt to email <a href="mailto:finance@wintender.tz" target="_blank" className="font-bold hover:underline">finance@wintender.tz</a>"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
