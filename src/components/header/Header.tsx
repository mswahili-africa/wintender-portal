import { Menu } from "@headlessui/react";
import {
    IconBellFilled,
    IconMenu2,
    IconPower,
    IconUserCircle
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/auth";

const Header = () => {
    const auth = useSnapshot(authStore);
    
    return (
        <div className="lg:flex lg:justify-between lg:-mt-10 lg:mb-20 lg:items-center hidden">
            <div>
                <div className="lg:flex lg:gap-5">
                    <div>
                        <button className="flex justify-center items-center bg-slate-50 hover:bg-slate-100 w-11 h-11 rounded-md">
                            <IconMenu2 className="text-slate-500" />
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div className="lg:flex items-center gap-4">
                    <div className="p-1.5 hover:bg-slate-100 rounded-md">
                        <IconBellFilled className="h-6 w-6 text-slate-600" />
                    </div>

                    <Menu as="div" className="relative inline-block text-left">
                        {
                            auth.user &&
                            <Menu.Button className="flex justify-center items-center h-10 w-10 bg-green-50 rounded-full focus:outline-none ring-2 ring-green-600">
                                <div className="text-center text-lg uppercase text-slate-500 font-medium">
                                {auth.user.displayName[0]}
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
        </div>
    );
};

export default Header;
