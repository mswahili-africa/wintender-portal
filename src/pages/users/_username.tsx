import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import Tabs from "@/components/widgets/Tabs";
import { authStore } from "@/store/auth";
import ChangePasswordForm from "./fragments/change-password-form";
import PasswordResetRequest from "./fragments/password-reset-request";
import { getUserById, updateBidderCompany } from "@/services/user";
import { ICategory, IUser } from "@/types";
import { getCategories } from "@/services/tenders";

export default function UserProfile() {
    const { userId } = useParams();
    const auth = useSnapshot(authStore);

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const accountOwner = (): boolean => {
        return auth.user?.id === userId;
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getUserById(userId!);
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userId]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories({
                    page: 0,
                    search: "",
                    filter: {},
                });
                setCategories(data.content);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        }

        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (user) {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories(prevSelected =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter(id => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!user || !user.company) return; 
    
        const payload = {
            name: user.company.name || "",       // Map company name
            tin: user.company.tin || "",                // Map TIN
            primaryNumber: user.company.primaryNumber || "", // Map phone number
            address: user.company.address || "",        // Map address
            email: user.company.email || "",            // Map company email
            website: user.company.website || "",        // Map website
            categories: selectedCategories              // Include the selected categories (List<String>)
        };
    
        try {
            // Call the updateBidderCompany function with the constructed payload and userId
            const response = await updateBidderCompany(payload, userId!);
            console.log("Successfully updated:", response);
            // Handle success UI changes or notifications
        } catch (error) {
            console.error("Failed to update company info:", error);
            // Handle error, show user-friendly message
        }
    };
    

    return (
        <div className="container mx-auto p-4">
            <Tabs panels={["User Info", "Company Info","Password"]}>
                {
                    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
                        <h2 className="text-lg font-semibold mb-4">User Information</h2>
                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : user ? (
                            <form onSubmit={handleSubmit} className="flex">
                                <div className="w-1/2 pr-4 space-y-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium" htmlFor="account">Account</label>
                                        <input
                                            type="text"
                                            id="account"
                                            name="account"
                                            value={user.account}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                            required
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium" htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={user.name}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium" htmlFor="phoneNumber">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={user.phoneNumber}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium" htmlFor="nationalId">NIDA</label>
                                        <input
                                            type="number"
                                            id="nationalId"
                                            name="nationalId"
                                            value={user.nationalId}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    {/* <div className="flex flex-col">
                                        <button type="submit" className="bg-green-600 text-white rounded-md p-2">
                                            Update
                                        </button>
                                    </div> */}
                                </div>
                                {/* Right Side: Avatar Section */}
                                <div className="w-1/2 flex items-center justify-center"> 
                                    <img
                                        src={user.avatar}
                                        alt="Avatar"
                                        className="mb-2 rounded-full border-2 border-gray-400 w-32 h-32"
                                    />
                                </div>
                            </form>
                        ) : (
                            <p className="text-red-500">User information not found</p>
                        )}
                    </div>
                }

                {
                    <div className="bg-white shadow-md rounded-lg p-6 mt-8 flex">
                        <div className="w-1/2 pr-4">
                            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                            {loading ? (
                                <p className="text-gray-500">Loading...</p>
                            ) : user?.company ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={user.company.name}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium">TIN</label>
                                        <input
                                            type="text"
                                            name="tin"
                                            placeholder="123-322-233"
                                            value={user.company.tin || ""}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium">Company Email</label>
                                        <input
                                            type="email"
                                            name="companyEmail"
                                            value={user.company.email}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium">Primary Number</label>
                                        <input
                                            type="tel"
                                            name="primaryNumber"
                                            value={user.company.primaryNumber}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="eg. Mbezi Beach, Morogoro"
                                            value={user.company.address || ""}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium">Website</label>
                                        <input
                                            type="text"
                                            placeholder="www.mfano.com"
                                            name="website"
                                            value={user.company.website || ""}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <button type="submit" className="bg-green-600 text-white rounded-md p-2">
                                        Update
                                    </button>
                                </form>
                            ) : (
                                <p className="text-red-500">Company information not found</p>
                            )}
                        </div>

                        {/* Right Side: Categories Section */}
                        <div className="w-1/2 pl-4">
                            <h2 className="text-lg font-semibold mb-4">Categories</h2>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <div key={category.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`category-${category.id}`}
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleCategoryChange(category.id)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`category-${category.id}`} className="text-sm">
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }

{
                    <div className="w-1/2 divide-y divide-slate-200">
                        {accountOwner() ? (
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                                <PasswordResetRequest email={auth.user?.email ?? ""} />
                                <div className="mt-6">
                                    <ChangePasswordForm email={auth.user?.email ?? ""} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-500">
                                Password change for another user account not applicable
                            </div>
                        )}
                    </div>
                }
            </Tabs>
        </div>
    );
}
