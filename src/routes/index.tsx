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
    IconFiles
} from "@tabler/icons-react";
import React from "react";

export interface IRoute {
    path: string;
    label: string;
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
    | "MANAGER";

const getUserRole = (): UserRole => {
    const userInfo = JSON.parse(localStorage.getItem("sr-dash-client") || "{}");
    return userInfo.role?.role || "BIDDER"; // Default to "BIDDER" if no role found
};

const userRole = getUserRole();

const allMenus: IRoute[] = [
    {
        path: "/",
        label: "Dashboard",
        icon: <IconLayoutDashboard size={20} strokeWidth={1.5} />,
    },
    {
        path: "/tenders",
        label: "Tender",
        icon: <IconReport size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/tenders", label: "Tenders", icon: <IconFileText size={20} strokeWidth={1.5} /> },
            { path: "/categories", label: "Categories", icon: <IconCategory size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/applications",
        label: "Do it for me",
        icon: <IconGitPullRequest size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/do-it-for-me", label: "Do it for me", icon: <IconGitPullRequest size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/entities",
        label: "Entities",
        icon: <IconBrandOffice size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/entities", label: "Procurement Entities", icon: <IconBrandOffice size={20} strokeWidth={1.5} /> },
        ],
    },
    {
        path: "/finance",
        label: "Finance",
        icon: <IconReportMoney size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/payments", label: "Payments", icon: <IconReportMoney size={20} strokeWidth={1.5} /> },
        ],
    },
    {
        path: "/bidders",
        label: "Bidders",
        icon: <IconGlobe size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/bidders", label: "Bidders", icon: <IconUsersGroup size={20} strokeWidth={1.5} /> },
        ],
    },
    {
        path: "/users",
        label: "Internal",
        icon: <IconGlobe size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/users", label: "Staff", icon: <IconUser size={20} strokeWidth={1.5} /> },
            { path: "/roles", label: "Roles", icon: <IconShieldLock size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/reports",
        label: "Reports",
        icon: <IconBrandOffice size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/publisher-perfomance", label: "Publisher Perfomance", icon: <IconUser size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/compliance",
        label: "Compliance",
        icon: <IconBrandOffice size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/company-documents", label: "Documents", icon: <IconFiles size={20} strokeWidth={1.5} /> }
        ],
    }
];

const visibilityRules: Record<UserRole, () => IRoute[]> = {
    ADMINISTRATOR: () => allMenus,
    MANAGER: () =>
        allMenus.map(menu =>
            menu.label === "Entities"
                ? {
                      ...menu,
                      subMenu: menu.subMenu?.filter(sub => sub.label !== "Roles"),
                  }
                : menu
        ), 
    ACCOUNTANT: () => allMenus.filter(menu => menu.label !== "Internal" && menu.label !== "Compliance"),
    PUBLISHER: () => allMenus.filter(menu => menu.label !== "Bidders" && menu.label !== "Internal" && menu.label !== "Compliance"),
    BIDDER: () => allMenus
        .filter(menu => ["Tender", "Finance", "Do it for me", "Dashboard","Compliance"].includes(menu.label))  // Only show the allowed menus
        .map(menu =>
            menu.label === "Tender"
                ? {
                      ...menu,
                      subMenu: menu.subMenu?.filter(sub => sub.label !== "Categories"),  // Exclude Categories sub-menu
                  }
                : menu
        ),
};


const getRoutesByRole = (role: UserRole): IRoute[] => {
    const getRoutes = visibilityRules[role];
    if (typeof getRoutes === "function") {
        return getRoutes();
    }
    return [];
};

export const routes: IRoute[] = getRoutesByRole(userRole);
