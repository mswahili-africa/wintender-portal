import { Link, useLocation } from "react-router-dom";
import { useUserDataContext } from "@/providers/userDataProvider";

// Import your route definitions (assumed to be in the same file or imported separately)
import { IRoute, getRoutesByRole } from "@/routes";  // Ensure the import path matches your project structure
import { UserRole } from "@/utils";
import { IconBook, IconBrandWhatsapp, IconChevronDown, IconMail, IconPdf, IconPhoneCall } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import CompanyDocumentsModal from "@/pages/system/system-documents/CompanyDocumentsModal";

export default function SidebarLinks() {
    const location = useLocation();
    const { userData, loading } = useUserDataContext();
    const { t } = useTranslation();
    const [openDocuments, setOpenDocuments] = useState<boolean>(false);

    // Add a type guard to ensure the role is valid or fallback to "BIDDER"
    const isValidUserRole = (role: any): role is UserRole => {
        return ["ADMINISTRATOR", "BIDDER", "PUBLISHER", "ACCOUNTANT", "SUPERVISOR","CUSTOMER_RELATIONSHIP_MANAGER", "MANAGER", "LEGAL", "PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(role);
    };

    const role: UserRole = isValidUserRole(userData?.role) ? userData?.role : "BIDDER";  // Default to BIDDER

    // Get the routes based on the user's role
    const routes: IRoute[] = useMemo(() => getRoutesByRole(role), [role]);

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (path: string) => {
        setOpenDropdown(prev => (prev === path ? null : path));
    };


    useEffect(() => {
        const active = routes.find(route =>
            route.subMenu?.some(sub => sub.path === location.pathname)
        );

        if (active?.type === "dropdown") {
            setOpenDropdown(active.path);
        }
    }, [location.pathname]);

    if (loading) return <SidebarSkeleton />

    return (
        <div className="text-xs md:text-sm text-slate-600 font-medium">
            {routes.map((item) => {
                const isDropdown = item.type === "dropdown" 

                const isStaticGroup = !item.type || item.type === "item";
                const isOpen = openDropdown === item.path;

                return (
                    <div key={item.path} className="mb-2">

                        {/* ✅ DROPDOWN */}
                        {isDropdown && (
                            <div>
                                <button
                                    onClick={() => toggleDropdown(item.path)}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-md hover:bg-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* {item.icon} */}
                                        <span>{t(item.labelKey)}</span>
                                    </div>

                                    <div className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                                        <IconChevronDown size={16}/>
                                    </div>
                                </button>

                                <div className={`transition-all overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
                                    <div className="ml-6 border-l pl-2">
                                        {item.subMenu?.map((subItem) => (
                                            <Link to={subItem.path} key={subItem.path}>
                                                <div className={`flex items-center gap-3 px-3 py-2 rounded-md
                                        ${location.pathname === subItem.path
                                                        ? "bg-green-600 text-white"
                                                        : "hover:bg-slate-100"}`}>
                                                    {subItem.icon}
                                                    <span>{t(subItem.labelKey)}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ✅ STATIC GROUP */}
                        {isStaticGroup && item.subMenu && (
                            <div className="mt-4">
                                <div className="text-slate-800 text-xs font-medium uppercase mb-2 px-4">
                                    {t(item.labelKey)}
                                </div>

                                <div className="space-y-1 ml-4">
                                    {item.subMenu.map((subItem) => (
                                        <Link to={subItem.path} key={subItem.path}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-md
                                    ${location.pathname === subItem.path
                                                    ? "bg-green-600 text-white"
                                                    : "hover:bg-slate-100"}`}>
                                                {subItem.icon}
                                                <span>{t(subItem.labelKey)}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ✅ SINGLE ITEM */}
                        {!item.subMenu && (
                            <Link to={item.path}>
                                <div className={`flex items-center px-4 py-3 rounded-md
                        ${location.pathname === item.path
                                        ? "bg-green-600 text-white"
                                        : "hover:bg-slate-100"}`}>
                                    <div className="pr-3">{item.icon}</div>
                                    <span>{t(item.labelKey)}</span>
                                </div>
                            </Link>
                        )}

                    </div>
                );
            })}

            {["BIDDER", "PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(role) && (
                <>
                    <div className="">
                        <div className="mt-4 mb-4">
                            <div className="text-slate-800 text-xs font-medium uppercase mb-2">{t("auth-guide-documents")}</div>
                            <a
                                href="/documents/Wintender-Supplier-Guide-opt.pdf"
                                download
                                target="_self"
                                className="flex items-center pb-3 rounded-md hover:bg-slate-100"
                            >
                                <div className={`flex items-center px-4 py-3 rounded-md hover:bg-slate-100`}>
                                    <IconBook size={24} className="text-green-600 mr-3" stroke={2} />
                                    <span>{t("auth-user-guide")}</span>
                                </div>
                            </a>
                            <div
                                className="flex items-center pb-3 rounded-md cursor-pointer hover:bg-slate-100"
                                onClick={() => setOpenDocuments(true)}
                            >
                                <div className={`flex items-center px-4 py-3 rounded-md hover:bg-slate-100`}>
                                    <IconPdf size={24} className="text-green-600 mr-3" stroke={2} />
                                    <span>{t("auth-documents")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="mt-4 mb-4">
                            <div className="text-slate-800 text-xs font-medium uppercase mb-2">Contact us</div>
                            <a href="tel:0747098558" target="_blank">
                                <div className={`flex items-center px-4 py-3 rounded-md hover:bg-slate-100`}>
                                    <div className="pr-3"><IconPhoneCall size={24} className="text-green-600" stroke={2} /></div>
                                    <span>+255 747 098 558</span>
                                </div>
                            </a>
                            <a href="https://wa.me/+255766028558" target="_blank">
                                <div className={`flex items-center px-4 py-3 rounded-md hover:bg-slate-100`}>
                                    <div className="pr-3"><IconBrandWhatsapp size={24} className="text-green-600" stroke={2} /></div>
                                    <span>WhatsApp</span>
                                </div>
                            </a>
                            <a target="_blank"
                                href="mailto:info@wintender.co.tz"
                                className="flex items-center px-4 py-3 rounded-md hover:bg-slate-100"
                            >
                                <IconMail size={24} className="text-green-600 mr-3" stroke={2} />
                                <span>info@wintender.co.tz</span>
                            </a>
                        </div>
                    </div>
                    <CompanyDocumentsModal isOpen={openDocuments} onClose={() => setOpenDocuments(false)} />
                </>

            )}
        </div>
    );
}

const SidebarSkeleton = () => (
    <div className="animate-pulse space-y-3 p-4">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded-md" />
        ))}
    </div>
);
