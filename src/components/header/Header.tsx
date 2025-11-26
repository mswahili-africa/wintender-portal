import { Menu } from "@headlessui/react";
import {
    IconBellFilled,
    IconBrandWhatsapp,
    IconMail,
    IconPhoneCall,
    IconPower,
    IconUserCircle
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";
import { useUserDataContext } from "@/providers/userDataProvider";
import WalletPaymentModal from "@/pages/tenders/fragments/WalletPaymentModel";
import { useState } from "react";
import PaymentModal from "@/pages/tenders/fragments/PaymentModel";
import { WalletButton } from "../button/WalletButton";

const Header = () => {
    const auth = useSnapshot(authStore);
    const user = useUserDataContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const walletBalance = user?.userData?.walletAmount;
    const subscription = user?.userData?.subscription;



    return (
        <div className="flex flex-col lg:-mt-10 lg:mb-20">
            {
                ["BIDDER", "PROCUREMENT_ENTITY"].includes(user?.userData?.role as string) && (

                    <div className="text-xs hidden sm:flex flex-row justify-end w-full mb-2">
                        <a href="tel:0747098558" target="_blank">
                            <div className={`flex items-center px-4 flex-row rounded-md hover:bg-slate-100`}>
                                <div className="pr-3"><IconPhoneCall size={22} className="text-green-600" stroke={2} /></div>
                                <span>+255 747 098 558</span>
                            </div>
                        </a>
                        <a href="https://wa.me/+255766028558" target="_blank">
                            <div className={`flex items-center px-4 flex-row rounded-md hover:bg-slate-100`}>
                                <div className="pr-3"><IconBrandWhatsapp size={22} className="text-green-600" stroke={2} /></div>
                                <span>WhatsApp</span>
                            </div>
                        </a>
                        <a target="_blank"
                            href="mailto:info@wintender.co.tz"
                            className="flex items-center px-4 flex-row rounded-md hover:bg-slate-100"
                        >
                            <IconMail size={22} className="text-green-600 mr-3" stroke={2} />
                            <span>info@wintender.co.tz</span>
                        </a>
                    </div>
                )
            }
            <div className="flex flex-row justify-between items-center ">
                <div onClick={() => setIsPaymentModalOpen(true)} className="flex flex-row lg:gap-5 cursor-pointer">
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
                    <div className="flex flex-row items-center gap-4 w-full">
                        <div className="p-1.5 hover:bg-slate-100 rounded-md">
                            <IconBellFilled className="h-6 w-6 text-slate-600" />
                        </div>

                        {
                            auth.user &&
                            <WalletButton amount={walletBalance} onClick={() => setIsOpen(true)} />
                        }

                        <Menu as="div" className="relative inline-block  text-left">
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
                        onClose={() => setIsPaymentModalOpen(false)}
                    />

                )}
            </div>
        </div >
    );
};

export default Header;
