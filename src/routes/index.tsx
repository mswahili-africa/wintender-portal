import {
    IconBox,
    IconBoxSeam,
    IconCpu,
    IconCurrencyDollar,
    IconFileBarcode,
    IconLayoutDashboard,
    IconPackages,
    IconShieldLock,
    IconTerminal2,
    IconUser,
    IconUserBolt,
    IconUsersGroup,
    IconReport,
    IconGlobe,
    IconCurrencyEuro,
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
    | "FULL_ADMIN"
    | "VENDOR_ADMIN"
    | "COUNTRY_ADMIN"
    | "VENDOR_FINANCE_ACCOUNTANT"
    | "COUNTRY_FINANCE_ACCOUNTANT"
    | "VENDOR_FINANCE_MANAGER"
    | "COUNTRY_FINANCE_MANAGER"
    | "FACTORY_ADMIN"
    | "CUSTOMER_SUPPORT"
    | "RESELLER";

const getUserRole = (): UserRole => {
    const userInfo = JSON.parse(localStorage.getItem("sr-dash-client") || "{}");
    return userInfo.role?.role || "RESELLER"; // Default to "RESELLER" if no role found
};

const userRole = getUserRole();

const allMenus: IRoute[] = [
    {
        path: "/",
        label: "Dashboard",
        icon: <IconLayoutDashboard size={20} strokeWidth={1.5} />,
    },
    {
        path: "/customer-report",
        label: "Customer",
        icon: <IconReport size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/customers", label: "Customers", icon: <IconUsersGroup size={20} strokeWidth={1.5} /> },
            { path: "/customer-report", label: "Reports", icon: <IconReport size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/products",
        label: "Warehouse",
        icon: <IconPackages size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/products", label: "Products", icon: <IconPackages size={20} strokeWidth={1.5} /> },
            { path: "/products/groups", label: "Groups", icon: <IconBox size={20} strokeWidth={1.5} /> },
            { path: "/orders", label: "Orders", icon: <IconBoxSeam size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/finance",
        label: "Finance",
        icon: <IconCurrencyDollar size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/packages", label: "Packages", icon: <IconPackages size={20} strokeWidth={1.5} /> },
            { path: "/payments", label: "Payments", icon: <IconCurrencyDollar size={20} strokeWidth={1.5} /> },
            { path: "/credit-note", label: "Credit note", icon: <IconCurrencyEuro size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/devices",
        label: "Devices",
        icon: <IconBoxSeam size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/devices", label: "Devices", icon: <IconBoxSeam size={20} strokeWidth={1.5} /> },
            { path: "/firmware", label: "Firmware", icon: <IconCpu size={20} strokeWidth={1.5} /> },
            { path: "/commands", label: "Commands", icon: <IconTerminal2 size={20} strokeWidth={1.5} /> },
            { path: "/logs", label: "Logs", icon: <IconFileBarcode size={20} strokeWidth={1.5} /> }
        ],
    },
    {
        path: "/vendors",
        label: "Entities",
        icon: <IconGlobe size={20} strokeWidth={1.5} />,
        subMenu: [
            { path: "/vendors", label: "Vendors", icon: <IconUserBolt size={20} strokeWidth={1.5} /> },
            { path: "/users", label: "Users", icon: <IconUser size={20} strokeWidth={1.5} /> },
            { path: "/roles", label: "Roles", icon: <IconShieldLock size={20} strokeWidth={1.5} /> }
        ],
    }
];

const visibilityRules: Record<UserRole, () => IRoute[]> = {
    FULL_ADMIN: () => allMenus,
    VENDOR_ADMIN: () =>
        allMenus.map(menu =>
            menu.label === "Entities"
                ? {
                      ...menu,
                      subMenu: menu.subMenu?.filter(sub => sub.label !== "Roles"),
                  }
                : menu
        ),
    COUNTRY_ADMIN: () =>
        allMenus.map(menu =>
            menu.label === "Entities"
                ? {
                      ...menu,
                      subMenu: menu.subMenu?.filter(sub => sub.label !== "Roles"),
                  }
                : menu
        ),
    VENDOR_FINANCE_ACCOUNTANT: () => allMenus.filter(menu => menu.label !== "Entities" && menu.label !== "Devices"),
    COUNTRY_FINANCE_ACCOUNTANT: () => allMenus.filter(menu => menu.label !== "Entities" && menu.label !== "Devices"),
    VENDOR_FINANCE_MANAGER: () => allMenus.filter(menu => menu.label !== "Entities" && menu.label !== "Devices"),
    COUNTRY_FINANCE_MANAGER: () => allMenus.filter(menu => menu.label !== "Entities" && menu.label !== "Devices"),
    FACTORY_ADMIN: () => allMenus.filter(menu => menu.label === "Devices"),
    CUSTOMER_SUPPORT: () => allMenus.filter(menu => menu.label === "Customer"),
    RESELLER: () => [],
};


const getRoutesByRole = (role: UserRole): IRoute[] => {
    const getRoutes = visibilityRules[role];
    if (typeof getRoutes === "function") {
        return getRoutes();
    }
    return [];
};

export const routes: IRoute[] = getRoutesByRole(userRole);
