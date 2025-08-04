import { Link, useLocation } from "react-router-dom";
import { useUserDataContext } from "@/providers/userDataProvider";

// Import your route definitions (assumed to be in the same file or imported separately)
import { IRoute, getRoutesByRole } from "@/routes";  // Ensure the import path matches your project structure
import { UserRole } from "@/utils";
import { IconBrandWhatsapp, IconMail } from "@tabler/icons-react";

export default function SidebarLinks() {
    const location = useLocation();
    const { userData } = useUserDataContext();

    // Add a type guard to ensure the role is valid or fallback to "BIDDER"
    const isValidUserRole = (role: any): role is UserRole => {
        return ["ADMINISTRATOR", "BIDDER", "PUBLISHER", "ACCOUNTANT", "SUPERVISOR", "MANAGER", "LEGAL", "PROCUREMENT_ENTITY"].includes(role);
    };

    const role: UserRole = isValidUserRole(userData?.role) ? userData?.role : "BIDDER";  // Default to BIDDER

    // Get the routes based on the user's role
    const routes: IRoute[] = getRoutesByRole(role);

    return (
        <div className="text-xs md:text-sm text-slate-600 font-medium">
            {routes.map((item, index) => (
                <div key={index}>
                    {item.subMenu && item.subMenu.length > 0 ? (
                        <div className="mt-4 mb-4">
                            <div className="text-slate-800 text-xs font-medium uppercase mb-2">{item.label}</div>
                            {item.subMenu.map((subItem, subIndex) => (
                                <Link to={subItem.path} key={subIndex}>
                                    <div className={`flex items-center px-4 py-3 rounded-md ${location.pathname === subItem.path ? 'bg-green-600 text-white' : 'hover:bg-slate-100'}`}>
                                        <div className="pr-3">{subItem.icon}</div>
                                        <span>{subItem.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Link to={item.path} className="mb-4">
                            <div className={`flex items-center px-4 py-3 rounded-md ${location.pathname === item.path ? 'bg-green-600 text-white' : 'hover:bg-slate-100'}`}>
                                <div className="pr-2">{item.icon}</div>
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    )}
                </div>
            ))}

            {["BIDDER", "PROCUREMENT_ENTITY"].includes(role) && (
                <div className="">
                    <div className="mt-4 mb-4">
                        <div className="text-slate-800 text-xs font-medium uppercase mb-2">Contact us</div>
                        <a href="https://wa.me/+255736228228">
                            <div className={`flex items-center px-4 py-3 rounded-md hover:bg-slate-100`}>
                                <div className="pr-3"><IconBrandWhatsapp size={24} className="text-green-600" stroke={2} /></div>
                                <span>WhatsApp</span>
                            </div>
                        </a>
                        <a
                            href="mailto:info@wintender.co.tz"
                            className="flex items-center px-4 py-3 rounded-md hover:bg-slate-100"
                        >
                            <IconMail size={24} className="text-green-600 mr-3" stroke={2} />
                            <span>info@wintender.co.tz</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
