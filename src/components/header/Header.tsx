import { Menu } from "@headlessui/react";
import {
    IconBellFilled,
    IconWallet,
    IconPower,
    IconUserCircle
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";
import { useUserDataContext } from "@/providers/userDataProvider";
import WalletPaymentModal from "@/pages/tenders/fragments/WalletPaymentModel";
import { useState } from "react";
import PaymentModal from "@/pages/tenders/fragments/PaymentModel";
import { Puff } from "react-loader-spinner";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { USSDPushEnquiry, USSDPushRequest } from "@/services/payments";

const Header = () => {
    const auth = useSnapshot(authStore);
    const user = useUserDataContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isLoadingEnquiry, setIsLoadingEnquiry] = useState(false);
    const navigate = useNavigate();

    const walletBalance = user?.userData?.walletAmount;
    const subscription = user?.userData?.subscription;

    const [paymentDetails, setPaymentDetails] = useState({
        planId: "66698e3f39cbe2504dd54c57",
        period: 1,
        phoneNumber: "",
        paymentReason: "SUBSCRIPTION"
    });

    const paymentMutation = useMutation({
        mutationFn: (paymentData: { planId: string, period: number, phoneNumber: string, paymentReason: string }) => USSDPushRequest(paymentData),
        onSuccess: (data) => {
            setIsLoadingEnquiry(true); // Start loading while enquiry is in progress
            startEnquiry(data.id);  // Start the enquiry API calls
        },
        onError: (error) => {
            toast.error("Payment failed: " + error);
        }
    });

    const startEnquiry = (id: string) => {
        let attemptCount = 0;
        const intervalId = setInterval(async () => {
            try {
                const response = await USSDPushEnquiry(id);
                // Check if response is successful
                if (response.code === "SUCCESS") {
                    toast.success("Payment confirmed.");
                    setIsLoadingEnquiry(false);  // Stop loader if payment is confirmed
                    clearInterval(intervalId);
                    navigate("/");
                }
            } catch (error) {
                toast.error("Error checking payment status.");
            }

            attemptCount += 1;
            if (attemptCount >= 5) {
                setIsLoadingEnquiry(false);  // Stop loader after 5 attempts
                clearInterval(intervalId);  // Stop after 5 attempts
                window.location.reload();
            }
        }, 5000);  // 5-second interval
    };

    return (
        <div className="lg:flex lg:justify-between lg:-mt-10 lg:mb-20 lg:items-center hidden">
            <div onClick={() => setIsPaymentModalOpen(true)} className="lg:flex lg:gap-5">
                {typeof subscription === 'number' && (() => {
                    if (subscription === 0) {
                        return (
                            <div className="flex items-center gap-1 p-1.5 hover:bg-slate-100 rounded-md text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium text-red-500">
                                    Subscription Expired
                                </span>
                            </div>
                        );
                    }

                    if (subscription > 0) {
                        const today = new Date();
                        const expiryDate = new Date(today);
                        expiryDate.setDate(today.getDate() + subscription);

                        const formattedDate = expiryDate.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        });

                        return (
                            <div title={`Your Subscription will expire on: ${formattedDate}`} className="flex items-center gap-1 p-1.5 hover:bg-slate-100 rounded-md text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className={`text-xs font-medium ${subscription <= 3 ? 'text-red-500' : 'text-slate-600'}`}>
                                    Subscription: {subscription} {subscription === 1 ? 'day' : 'days'}
                                </span>
                            </div>
                        );
                    }
                    return null;
                })()}
            </div>
            <div className="flex items-center gap-4 min-w-32">
                <div className="lg:flex items-center gap-4 w-full">
                    <div className="p-1.5 hover:bg-slate-100 rounded-md">
                        <IconBellFilled className="h-6 w-6 text-slate-600" />
                    </div>

                    {
                        auth.user &&
                        <div onClick={() => setIsOpen(true)} className="flex cursor-pointer justify-center w-full items-center p-2 h-10 bg-green-50 rounded-lg focus:outline-none ring-2 ring-green-600">
                            <div className="flex justify-center items-center w-9 h-9 rounded-md">
                                <IconWallet className="text-slate-500" />
                            </div>
                            <p className="ml-2 text-center text-md uppercase text-slate-500 font-medium whitespace-nowrap">
                                {new Intl.NumberFormat().format(walletBalance ?? 0)} TZS
                            </p>
                        </div>
                    }

                    <Menu as="div" className="relative inline-block text-left">
                        {
                            auth.user &&
                            <Menu.Button className="flex justify-center items-center h-10 w-10 bg-green-50 rounded-full focus:outline-none ring-2 ring-green-600">
                                <div className="text-center text-lg uppercase text-slate-500 font-medium">
                                    {auth.user.displayName?.charAt(0)}
                                </div>
                            </Menu.Button>
                        }
                        {
                            auth.user &&
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right overflow-hidden bg-white rounded-md shadow-sm focus:outline-none">

                                <div className="py-2 px-4 border-b border-slate-200 bg-green-600">
                                    <div className="text-xs text-center text-white font-medium space-y-2">

                                        <div className="flex justify-between">
                                            <span>Name</span>
                                            <span>{auth.user.displayName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mail</span>
                                            <span>{auth.user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2 text-xs md:text-sm text-slate-600">
                                    <Menu.Item>
                                        <Link
                                            to={`/users/${auth.user.id}`}
                                            className="flex items-center border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-md font-medium py-2 px-3">
                                            <IconUserCircle className="h-5 w-5 text-slate-600 mr-3" />
                                            <span>Profile</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Link
                                            to="/"
                                            className="flex items-center border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-md font-medium py-2 px-3"
                                            onClick={() => auth.logout()}>
                                            <IconPower className="h-5 w-5 text-slate-600 mr-3" />
                                            <span>Logout</span>
                                        </Link>
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        }
                    </Menu>
                </div>
            </div>
            <WalletPaymentModal children={undefined} isOpen={isOpen}
                onClose={() => setIsOpen(false)} isLoading={false} setIsLoading={function (): void {
                    throw new Error("Function not implemented.");
                }} />

            {isPaymentModalOpen && (
                <PaymentModal
                    paymentDetails={paymentDetails}
                    setPaymentDetails={setPaymentDetails}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSubmit={() => paymentMutation.mutate(paymentDetails)}
                >
                    {/* Show loader and message when enquiry is in progress */}
                    {isLoadingEnquiry && (
                        <div className="flex justify-center items-center mt-4">
                            <Puff
                                height="60"
                                width="60"
                                radius="1"
                                color="green"
                                ariaLabel="loading"
                                visible={isLoadingEnquiry}
                            />
                            <p className="mt-4">Please check your phone and accept payment by entering your password.</p>
                        </div>
                    )}
                </PaymentModal>
            )}
        </div>
    );
};

export default Header;
