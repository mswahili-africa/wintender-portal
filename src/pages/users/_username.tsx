import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import Tabs from "@/components/widgets/Tabs";
import { authStore } from "@/store/auth";
import ChangePasswordForm from "./fragments/changePasswordForm";
import PasswordResetRequest from "./fragments/passwordResetRequest";
import { getUserById, updateBidderCompany } from "@/services/user";
import { ICategory, ICompany, IUser } from "@/types";
import { getCategories } from "@/services/tenders";
import toast from "react-hot-toast";
import Select from "react-select";
import { IconX } from "@tabler/icons-react";

interface UserProfileProps {
  selectedUser: ICompany;
  selectedLoading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ selectedUser, selectedLoading }) => {
  // component code here
// };

// export default function UserProfile() {
    const { userId } = useParams();
    const auth = useSnapshot(authStore);

    const [user, setUser] = useState<ICompany | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
    const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>([]);
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
        // JCM if user passed as prop, use it directly
        selectedUser && setUser(selectedUser);
        selectedLoading && setLoading(selectedLoading);
        
        async function fetchUser() {
            try {
                if(selectedUser){
                    setUser(selectedUser);
                    setLoading(selectedLoading);
                    setSelectedCategoriesIds(selectedUser.companyCategories || []);
                    return;
                }
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
                    size: 1000,
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

            // Update user-level fields
            return {
                ...prevUser,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) return;

        const payload: ICompany = {
            id: user.id || "",
            account: user.account || "", // Add this line
            name: user.name || "", // Add this line
            email: user.email || "", // Add this line
            avatar: user.avatar || "", // Add this line
            phoneNumber: user.phoneNumber || "", // Add this line
            createdAt: user.createdAt || Date.now(), // Add this line
            updatedAt: user.updatedAt || Date.now(), // Add this line
            createdBy: user.createdBy || "", // Add this line
            updatedBy: user.updatedBy || "", // Add this line
            planExpiryDate: user.planExpiryDate || Date.now(), // Add this line
            currentPlanId: user.currentPlanId || "", // Add this line
            companyName: user.companyName || "",
            companyStatus: user.companyStatus || "", // Add this line
            companyPrimaryNumber: user.companyPrimaryNumber || "",
            companyAddress: user.companyAddress || "",
            companyEmail: user.companyEmail || "",
            companyWebsite: user.companyWebsite || "",
            companyTin: user.companyTin || "",
            companyVrn: user.companyVrn || "",
            companyLogoFilePath: user.companyLogoFilePath || "",
            companyTinFilePath: user.companyTinFilePath || "",
            categoryIds: selectedCategoriesIds.filter(cat => cat !== null),
            companyCategories: []
        };

        setIsUpdating(true); // Set loading state to true
        try {
            const response = await updateBidderCompany(payload, userId!);
            toast.success("Successfully updated");

            const updatedUser = await getUserById(userId!);
            setUser(updatedUser);
            if (updatedUser.company && updatedUser.company.categories) {
                setSelectedCategoriesIds(updatedUser.company.categories);
            }

        } catch (error) {
            console.error("Failed to update company info:", error);
            toast.error("Failed to update company info");
        } finally {
            setIsUpdating(false); // Reset loading state
        }
    };

    // JCM input style
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: state.isFocused ? 'green' : 'green',
            boxShadow: state.isFocused ? '0 0 0 1px green' : 'none',
            '&:hover': {
                borderColor: 'green',
            },
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#d1fae5'
                : state.isFocused
                    ? '#f0fdf4'
                    : 'white',
            color: 'black',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'black',
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 9999,
        }),
    };

    // JCM manage categories selection
    const manageCategoriesSelection = (category: any) => {
        if (!selectedCategories.find((c: any) => c.id === category.id)) {
            setSelectedCategories([...selectedCategories, category]);
            setSelectedCategoriesIds([...selectedCategoriesIds, category.id]);
        } else {
            setSelectedCategories(prev =>
                prev.filter((c: any) => c.id !== category.id)
            );
            setSelectedCategoriesIds(prevSelected => prevSelected.filter(id => id !== category.id));
        }
    }


    // JCM available options for select
    const availableOptions = categories
        .filter((cat) => !selectedCategories.find((sc: any) => sc.id === cat.id))
        .map((cat) => ({ value: cat.id, label: cat.name }));


    // JCM useEffect to set initial selected categories
    useEffect(() => {
        if (user?.companyCategories && categories.length > 0) {
            const initialSelected = categories.filter((cat: any) =>
                user.companyCategories.includes(cat.id)
            );
            setSelectedCategories(initialSelected);
        }
    }, [user, categories]);


    return (
        <div className="container mx-auto p-4">
            <Tabs panels={!accountOwner() ? ["User Info", "Company Info"] : ["User Info", "Company Info", "Password"]}>
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
                        <h2 className="text-lg font-semibold mb-4">Company information</h2>
                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : user?.companyName ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={user.companyName}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">TIN</label>
                                    <input
                                        type="text"
                                        name="companyTin"
                                        placeholder="123-322-233"
                                        value={user.companyTin || ""}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Company Email</label>
                                    <input
                                        type="email"
                                        name="companyEmail"
                                        value={user.companyEmail}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Primary Number</label>
                                    <input
                                        type="tel"
                                        name="companyPrimaryNumber"
                                        value={user.companyPrimaryNumber}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Address</label>
                                    <input
                                        type="text"
                                        name="companyAddress"
                                        placeholder="eg. Mbezi Beach, Morogoro"
                                        value={user.companyAddress}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium">Website</label>
                                    <input
                                        type="text"
                                        name="companyWebsite"
                                        value={user.companyWebsite || ""}
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

                    {/* JCM new categories */}
                    <div className="flex flex-col md:w-1/2">
                        <Select
                            options={availableOptions}
                            onChange={(selectedOption) => {
                                const selected = categories.find((c: any) => c.id === selectedOption?.value);
                                if (selected) manageCategoriesSelection(selected);
                            }}
                            placeholder="Search or select category"
                            className="w-full border-0 border-green-700 focus:ring-0"
                            styles={customStyles}
                        />

                        {/*JCM Selected Categories */}
                        <div className="flex flex-col gap-2 mt-5 mb-4">
                            {selectedCategories.length === 0 ? (
                                <span className="text-sm text-gray-400 my-10 w-full text-center">
                                    No categories
                                </span>
                            ) : (
                                selectedCategories.map((category: any) => (
                                    <span
                                        key={category.id}
                                        className="flex items-center w-fit gap-1 px-3 py-1 text-black rounded-full text-sm"
                                    >
                                        {category.name}
                                        <button
                                            type="button"
                                            onClick={() => manageCategoriesSelection(category)}
                                            className="text-red-500 hover:text-red-700 ml-2 text-xs"
                                        >
                                            <IconX size={16} />
                                        </button>
                                    </span>
                                ))
                            )}
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

export default UserProfile;
