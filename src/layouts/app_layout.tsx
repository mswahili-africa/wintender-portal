import { Outlet } from "react-router-dom";
import MobileMenu from "@/components/sidebar/MobileMenu";
import Sidebar from "@/components/sidebar/Sidebar";
import AuthLayout from "@/layouts/auth_layout";
import Header from "@/components/header/Header";



export default function() {

    return (
        <AuthLayout>
            <div className="flex">
                <div className="hidden lg:block lg:w-1/5 2xl:w-[15%]">
                    <Sidebar />
                </div>


                <div className="flex-1 h-screen overflow-y-auto">
                    <div className="container pt-4 xl:py-10">
                        <div className="flex justify-between items-center mb-4">
                            <MobileMenu />
                        </div>

                        <Header/>
                        <Outlet />
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}