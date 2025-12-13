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
import { useContacts } from "@/hooks/notificationRepository";
import { ConversationModal } from "@/pages/messages/fragments/ConversationModal";

const Header = () => {
    const auth = useSnapshot(authStore);
    const user = useUserDataContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [handleModal, setHandleModal] = useState<{ type: "view" | "", object: any }>(
        {
            type: "",
            object: null
        }
    );

    const handleModalClose = () => {
        setHandleModal({
            type: "",
            object: null
        });
    }

    const walletBalance = user?.userData?.walletAmount;
    const subscription = user?.userData?.subscription;

    const { contacts } = useContacts({ page: 0, size: 10 });


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
                        {
                            !["BIDDER", "PROCUREMENT_ENTITY"].includes(user?.userData?.role as string) &&
                                <Menu as="div" className="relative inline-block text-left">
                                    <Menu.Button className="p-1.5 hover:bg-slate-100 rounded-md">
                                        <div className="relative">
                                            <IconBellFilled className="h-6 w-6 text-slate-600" />
                                            <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                                {contacts?.content && contacts?.content.filter((contact) => contact.status === "UNREAD").length}
                                            </div>
                                        </div>
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right overflow-hidden bg-white rounded-md shadow-lg focus:outline-none">
                                        <div className="text-sm text-gray-500 p-3">Notifications</div>
                                        {
                                            contacts?.content && contacts?.content.length === 0 &&
                                            <div className="p-4 w-full text-center text-sm text-slate-600">
                                                No new notifications
                                            </div>
                                        }

                                        {/* Array of notifications */}
                                        {
                                            contacts?.content && contacts?.content.length > 0 && contacts?.content.filter((contact) => contact.status === "UNREAD").map((contact) => (
                                                <Menu.Item key={contact.phoneNumber} as={"div"} className="border-b border-slate-200 py-2 px-4 hover:bg-slate-50 hover:cursor-pointer">
                                                    <div className="flex items-center gap-3" onClick={() => setHandleModal({ type: "view", object: contact })}>
                                                        <IconBrandWhatsapp size={25} className="text-green-600" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-slate-600">{contact.name}</span>
                                                            <span className="text-xs text-slate-400">{new Date(contact.updatedAt).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </Menu.Item>
                                            ))
                                        }


                                        <Menu.Item>
                                            <Link
                                                to="/messages"
                                                className="flex items-center justify-center border-t border-slate-200 hover:bg-slate-50 rounded-b-md font-medium py-2 px-3">
                                                <span className="text-xs text-gray-400">View All</span>
                                            </Link>
                                        </Menu.Item>

                                    </Menu.Items>
                                </Menu>
                        }

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

                {/* Message modal */}
                <ConversationModal
                    open={handleModal.type === "view"}
                    onClose={handleModalClose}
                    contact={handleModal.object}
                />
            </div>
        </div >
    );
};

export default Header;
