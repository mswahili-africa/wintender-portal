

export function formatPhoneNumber(number: string) {
    const regex = /\d{1,3}(?=(\d{3})+(?!\d))/g;
    return number.toString().replace(regex, '$&-');
}

// Define the possible roles as a union type
export type UserRole =
    | "ADMINISTRATOR"
    | "BIDDER"
    | "PUBLISHER"
    | "ACCOUNTANT"
    | "MANAGER"
    | "LEGAL";

export const getUserRole = (): UserRole => {
    const userInfo = JSON.parse(localStorage.getItem("sr-dash-client") || "{}");
    return userInfo?.role; // Default to "BIDDER" if no role found
};