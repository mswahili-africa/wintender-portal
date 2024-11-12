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
import toast from "react-hot-toast";

export default function UserProfile() {
    const { userId } = useParams();
    const auth = useSnapshot(authStore);

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const accountOwner = (): boolean => {
        return auth.user?.id === userId;
    };

    const filteredCategories = categories
    .filter(category =>
        `${category.categoryGroup} ${category.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.categoryGroup.localeCompare(b.categoryGroup) || a.name.localeCompare(b.name));


    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getUserById(userId!);
                setUser(data);

                // Check if company and categories exist
                if (data.company && data.company.categories) {
                    console.log("Fetched categories:", data.company.categories);
                    setSelectedCategories(data.company.categories);
                }
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
                    size: 300,
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
        const { name, value } = e.target;

        setUser(prevUser => {
            if (!prevUser) return prevUser;

            if (name.startsWith("company.")) {
                const companyField = name.split(".")[1];
                return {
                    ...prevUser,
                    company: {
                        ...prevUser.company,
                        [companyField]: value
                    }
                };
            } else {
                // Update user-level fields
                return {
                    ...prevUser,
                    [name]: value
                };
            }
        });
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
            name: user.company.name || "",
            tin: user.company.tin || "",
            primaryNumber: user.company.primaryNumber || "",
            address: user.company.address || "",
            email: user.company.email || "",
            website: user.company.website || "",
            categories: selectedCategories.filter(cat => cat !== null)
        };

        setIsUpdating(true); // Set loading state to true
        try {
            const response = await updateBidderCompany(payload, userId!);
            console.log("Successfully updated:", response);
            toast.success("Successfully updated");

            const updatedUser = await getUserById(userId!);
            setUser(updatedUser);
            if (updatedUser.company && updatedUser.company.categories) {
                setSelectedCategories(updatedUser.company.categories);
            }

        } catch (error) {
            console.error("Failed to update company info:", error);
            toast.error("Failed to update company info");
        } finally {
            setIsUpdating(false); // Reset loading state
        }
    };


    return (
        <div className="container mx-auto p-4">
            <Tabs panels={["User Info", "Company Info", "Password"]}>
                {/* User Information Tab */}
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
                            </div>
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

                {/* Company Information Tab */}
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
                                        name="company.name"
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
                                        name="company.tin"
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
                                        name="company.email"
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
                                        name="company.primaryNumber"
                                        value={user.company.primaryNumber}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Address</label>
                                    <input
                                        type="text"
                                        name="company.address"
                                        placeholder="eg. Mbezi Beach, Morogoro"
                                        value={user.company.address}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Website</label>
                                    <input
                                        type="text"
                                        name="company.website"
                                        value={user.company.website || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white rounded-md p-2 w-full"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <span>Loading...</span>
                                    ) : (
                                        "Update"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <p className="text-red-500">Company information not available</p>
                        )}
                    </div>
                    
                    <div className="w-1/2 pl-4">
            <h2 className="text-lg font-semibold mb-4">Select Categories</h2>
            <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <div className="max-h-64 overflow-y-auto">
                {filteredCategories.map(category => (
                    <div key={category.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="mr-2"
                        />
                        <label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.categoryGroup} - {category.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>

                </div>

                {/* Password Tab */}
                {
                    accountOwner() ?

                        <div className="space-y-12 divide-y divide-slate-200">
                            <PasswordResetRequest email={auth.user?.email ?? ""} />

                            <div className="w-full md:w-3/4 xl:w-1/3 py-12">
                                <ChangePasswordForm email={auth.user?.email ?? ""} />
                            </div>
                        </div> :

                        <div className="text-xs">
                            Password change for another user account not applicable
                        </div>
                }
            </Tabs>
        </div>
    );
}
