import {
    IconLayoutDashboard,
    IconShieldLock,
    IconUser,
    IconFileText,
    IconGitPullRequest,
    IconReport,
    IconGlobe,
    IconBrandOffice,
    IconReportMoney,
    IconCategory,
    IconUsersGroup,
    IconFiles,
    IconCalendarUser,
    IconSpeakerphone,
    IconLockAccessOff,
    IconUserUp,
    IconMan,
    IconSettings,
    IconAlertTriangle,
    IconHeartRateMonitor,
    IconMessages
} from "@tabler/icons-react";
import React from "react";
import { useUserDataContext } from "@/providers/userDataProvider";

export interface IRoute {
    path: string;
    label: string;
    labelKey: string;
    icon?: React.ReactElement;
    permissions?: string[];
    subMenu?: IRoute[];
}

// Define the possible roles as a union type
type UserRole =
    | "ADMINISTRATOR"
    | "BIDDER"
    | "PUBLISHER"
    | "ACCOUNTANT"
    | "MANAGER"
    | "SUPERVISOR"
    | "PROCUREMENT_ENTITY"
    | "LEGAL";

const isValidUserRole = (role: any): role is UserRole => {
    return ["ADMINISTRATOR", "BIDDER", "PUBLISHER", "ACCOUNTANT", "MANAGER", "LEGAL", "PROCUREMENT_ENTITY", "SUPERVISOR"].includes(role);
};

const useUserRole = (): UserRole => {
    const { userData } = useUserDataContext();

    // Check if the role is valid, otherwise default to "BIDDER"
    return isValidUserRole(userData?.role) ? userData.role : "BIDDER";
};

const allMenus: IRoute[] = [
    {
        path: "/",
        label:  "Dashboard",
        labelKey:  "menu-dashboard",
        icon: <IconLayoutDashboard size={20} strokeWidth={1.5} />,
    },
    {
        path: "/tenders",
        label: "Tender",
        labelKey: "menu-tender",
        icon: <IconReport size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/tenders", label: "Private Tenders",labelKey: "menu-private-tenders", icon: <IconFileText size={20} strokeWidth={1.5} /> },
            { path: "/government-tenders", label: "Government Tenders",labelKey: "menu-government-tenders", icon: <IconFileText size={20} strokeWidth={1.5} /> },
            { path: "/categories", label: "Categories",labelKey: "menu-categories", icon: <IconCategory size={20} strokeWidth={1.5} /> },
            { path: "/do-it-for-me", label: "Do It For Me",labelKey: "menu-difm", icon: <IconGitPullRequest size={20} strokeWidth={1.5} /> },
            { path: "/tender-box", label: "Tender Box",labelKey: "menu-tender-box", icon: <IconFiles size={20} strokeWidth={1.5} /> },
            { path: "/submitted-application", label: "My Submissions",labelKey: "menu-my-submissions", icon: <IconFiles size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/applications",
        label: "Consultation",
        labelKey: "menu-consultation",
        icon: <IconGitPullRequest size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/consultation", label: "Billboards",labelKey: "menu-billboards", icon: <IconSpeakerphone size={20} strokeWidth={1.5} /> },
            { path: "/consultation-application", label: "Consult Me",labelKey: "menu-consult-me", icon: <IconUserUp size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/finance",
        label: "Finance",
        labelKey: "menu-finance",
        icon: <IconReportMoney size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/payments", label: "Transactions",labelKey: "menu-transactions", icon: <IconReportMoney size={20} strokeWidth={1.5} /> },
            { path: "/company-plans", label: "Payment Plans",labelKey: "menu-payment-plans", icon: <IconCalendarUser size={20} strokeWidth={1.5} /> },
        ],
    },
    {
        path: "/entities",
        label: "Entities",
        labelKey: "menu-entities",
        icon: <IconBrandOffice size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/bidders", label: "Bidders",labelKey: "menu-bidders", icon: <IconUsersGroup size={20} strokeWidth={1.5} /> },
            { path: "/entities", label: "PE",labelKey: "menu-pe", icon: <IconBrandOffice size={20} strokeWidth={1.5} /> },
            { path: "/entities-users", label: "PE Admins",labelKey: "menu-pe-admins", icon: <IconMan size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/compliance",
        label: "Compliance",
        labelKey: "menu-compliance",
        icon: <IconBrandOffice size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/company-documents", label: "Documents",labelKey: "menu-documents", icon: <IconFiles size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/users",
        label: "Internal",
        labelKey: "menu-internal",
        icon: <IconGlobe size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/users", label: "Staff",labelKey: "menu-staff", icon: <IconUser size={20} strokeWidth={1.5} /> },
            { path: "/roles", label: "Roles",labelKey: "menu-roles", icon: <IconShieldLock size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/inquiries",
        label: "Inquiries & Support",
        labelKey: "menu-inquiries",
        icon: <IconGlobe size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/messages", label: "Messages",labelKey: "menu-messages", icon: <IconMessages size={20} strokeWidth={1.5} /> },
        ],
    },
    {
        path: "/reports/login-attempt",
        label: "Reports",
        labelKey: "menu-reports",
        icon: <IconBrandOffice size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/publisher-perfomance", label: "Publisher Perfomance",labelKey: "menu-publisher-perfomance", icon: <IconUser size={20} strokeWidth={1.5} /> },
            { path: "/login-attempt", label: "Login Attempts",labelKey: "menu-login-attempts", icon: <IconLockAccessOff size={20} strokeWidth={1.5} /> },

        ],
    },
    {
        path: "/settings",
        label: "System",
        labelKey: "menu-system",
        icon: <IconSettings className="duration-300 animate-spin" size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/settings", label: "Settings",labelKey: "menu-settings", icon: <IconSettings size={20} strokeWidth={1.5} /> },
            {
                label: "Logs",
                labelKey: "menu-logs",
                path: "/error-logs",
                icon: <IconAlertTriangle size={20} strokeWidth={1.6} />,
            },
            {
                label: "Health",
                labelKey: "menu-health",
                path: "/system-health",
                icon: <IconHeartRateMonitor size={20} strokeWidth={1.6} />,
            }
        ],
    }
];

//  Assign routes based on user role
const visibilityRules: Record<UserRole, () => IRoute[]> = {
    ADMINISTRATOR: () => allMenus,
    MANAGER: () => allMenus
    .filter(menu => ["Tender", "Dashboard","Consultation","Entities","Inquiries & Support"].includes(menu.label)) // Only show the allowed menus
        .map(menu => menu.label === "Tender"
            ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "My Submissions"), // Exclude Do It For Me and Tender Box sub-menus
            }
            : menu.label === "System" ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Setting"), // Exclude Logs and Health sub-menus
            } : menu

    ),
    ACCOUNTANT: () => allMenus
    .filter(menu => ["Tender", "Dashboard","Consultation","Entities","Finance","System","Inquiries & Support"].includes(menu.label)) // Only show the allowed menus
        .map(menu => menu.label === "Tender"
            ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "My Submissions"), // Exclude Do It For Me and Tender Box sub-menus
            }
            : menu.label === "System" ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Setting"), // Exclude Logs and Health sub-menus
            } : menu

    ),

    PUBLISHER: () => allMenus
    .filter(menu => ["Tender", "Dashboard","Consultation","Entities","Inquiries & Support"].includes(menu.label)) // Only show the allowed menus
        .map(menu => menu.label === "Tender"
            ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "My Submissions"), // Exclude Do It For Me and Tender Box sub-menus
            }
            : menu.label === "System" ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Setting"), // Exclude Logs and Health sub-menus
            } : menu

    ),
    SUPERVISOR: () => allMenus
        .filter(menu =>!["Internal", "Compliance"].includes(menu.label)) // Exclude Internal and Compliance menus
        .map(menu => menu.label === "Entities"
            ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Roles"),
            }
            : menu.label === "Tender" ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "My Submissions"), // Exclude Do It For Me and Tender Box sub-menus
            }
            : menu.label === "Consultation" ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Billboards"), // Exclude Billboards sub-menu
            }
            : menu.label === "System" ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Settings"), // Exclude Logs and Health sub-menus
            }
            : menu
        ),
    PROCUREMENT_ENTITY: () => allMenus
        .filter(menu => ["Tender", "Dashboard"].includes(menu.label)) // Only show the allowed menus
        .map(menu => menu.label === "Tender"
            ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Categories" && sub.label !== "Billboards" && sub.label !== "Do It For Me" && sub.label !== "My Submissions" && sub.label !== "Government Tenders"), // Exclude Categories sub-menu
            }
            : menu
        ),
    BIDDER: () => allMenus
        .filter(menu => ["Tender", "Finance", "Consultation", "Dashboard", "Compliance"].includes(menu.label)) // Only show the allowed menus
        .map(menu => menu.label === "Tender"
            ? {
                ...menu,
                subMenu: menu.subMenu?.filter(sub => sub.label !== "Categories" && sub.label !== "Billboards" && sub.label !== "Tender Box"), // Exclude Categories sub-menu
            }
            : menu.label === "Finance"
                ? {
                    ...menu,
                    subMenu: menu.subMenu?.filter(sub => sub.label !== "Payment Plans"), // Exclude Payment Plans sub-menu
                }
                : menu.label === "Consultation"
                    ? {
                        ...menu,
                        subMenu: menu.subMenu?.filter(sub => sub.label !== "Billboards"), // Exclude Billboards sub-menu
                    }
                    : menu
        ),
    LEGAL: function (): IRoute[] {
        throw new Error("Function not implemented.");
    }
};


// JCM Function to get routes based on user role
export const getRoutesByRole = (role: UserRole): IRoute[] => {
    const getRoutes = visibilityRules[role];
    if (typeof getRoutes === "function") {
        return getRoutes();
    }
    return [];
};

// Use the hook to get the user's role
const MyComponent: React.FC = () => {
    const role = useUserRole();  // Get role from context

    // Now fetch the routes based on the user's role
    const routes: IRoute[] = getRoutesByRole(role);

    return (
        <div>
            {/* Render your menus or routes here */}
            {routes.map(route => (
                <div key={route.path}>
                    <h3>{route.label}</h3>
                    {/* Render other details or submenus */}
                </div>
            ))}
        </div>
    );
};

export default MyComponent;
