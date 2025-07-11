import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { bidderRegister } from "@/services/auth";
import { IBidderRegisterForm } from "@/types/forms";
import TextInput from "@/components/widgets/forms/TextInput";
import * as yup from "yup";
import Select from "react-select";
import { ICategory } from "@/types";
import { getCategories } from "@/services/tenders";

interface IProps {
    onSuccess: () => void;
    initials?: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function RegistrationModel({ onSuccess, isOpen, onClose }: IProps) {
    const tanzaniaRegions = [
        "Arusha",
        "Dar es Salaam",
        "Dodoma",
        "Geita",
        "Iringa",
        "Kagera",
        "Katavi",
        "Kigoma",
        "Kilimanjaro",
        "Lindi",
        "Manyara",
        "Mara",
        "Mbeya",
        "Morogoro",
        "Mtwara",
        "Mwanza",
        "Njombe",
        "Pemba North",
        "Pemba South",
        "Pwani",
        "Rukwa",
        "Ruvuma",
        "Shinyanga",
        "Simiyu",
        "Singida",
        "Tabora",
        "Tanga",
        "Zanzibar North",
        "Zanzibar South and Central",
        "Zanzibar Urban West",
    ];

    const options = tanzaniaRegions.map(region => ({
        value: region,
        label: region,
    }));

    const { showMessage, closePopup } = usePopup();
    const schema = yup.object().shape({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        email: yup.string().email("Email is invalid").required("Email is required"),
        phoneNumber: yup.string().required("Phone number is required"),
        confirmPhoneNumber: yup
            .string()
            .oneOf([yup.ref("phoneNumber")], "Phone numbers do not match") // Remove 'null'
            .required("Phone number confirmation is required"),
        tin: yup
            .string()
            .required("TIN is required")
            .matches(/^\d{3}-\d{3}-\d{3}$/, "TIN must be in ###-###-### format"),
        companyName: yup.string().required("Company name is required"),
        companyPhoneNumber: yup.string().required("Company Phone Number is required"),
        companyAddress: yup.string().required("Company Address is required"),
        categoryIds: yup
            .array()
            .of(yup.string().required())
            .min(1, "At least one category must be selected")
            .required("Category is required"),
    });

    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<IBidderRegisterForm>({
        resolver: yupResolver(schema),
    });

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

    useEffect(() => {
        const categoryIds = selectedCategories.map((c) => c.id);
        setValue("categoryIds", categoryIds);
    }, [selectedCategories, setValue]);

    const createMutation = useMutation({
        mutationFn: (data: IBidderRegisterForm) => bidderRegister(data),
        onSuccess: (res) => {
            onClose();
            showMessage({
                title: "Registration successful",
                message: "Temporary Password has been sent to your Email and SMS, You can change your your password any time you wish through profile.",
                theme: "success",
            });
            setTimeout(() => { closePopup(); reset(); }, 10000)

            onSuccess();
        },
        onError: (error: any) => {
            toast.error("Failed to register");
        },
    });

    const submit = (data: IBidderRegisterForm) => {
        const categoryIds = selectedCategories.map((c) => c.id);

        const cleanTIN = data.tin.replace(/-/g, ""); // remove dashes before submit

        createMutation.mutate({
            ...data,
            tin: cleanTIN,
            categoryIds,
        });
    };

    const addCategory = (category: ICategory) => {
        if (!selectedCategories.find((c) => c.id === category.id)) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const removeCategory = (category: ICategory) => {
        setSelectedCategories(
            selectedCategories.filter((c) => c.id !== category.id)
        );
    };

    const availableOptions = categories
        .filter((cat) => !selectedCategories.find((sc) => sc.id === cat.id))
        .map((cat) => ({ value: cat.id, label: cat.name.toUpperCase() }));

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

    return (
        <Modal
            size="md"
            title="Registration"
            isOpen={isOpen}
            onClose={onClose}
        >
            <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <TextInput
                        type="text"
                        label="First name"
                        placeholder="e.g., Chambua"
                        hasError={!!errors.firstName}
                        error={errors.firstName?.message}
                        register={register("firstName")}
                    />
                    <TextInput
                        type="text"
                        label="Last name"
                        placeholder="e.g., Peter"
                        hasError={!!errors.lastName}
                        error={errors.lastName?.message}
                        register={register("lastName")}
                    />
                    <TextInput
                        type="text"
                        label="Phone number"
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.phoneNumber}
                        error={errors.phoneNumber?.message}
                        register={register("phoneNumber")}
                    />

                    <TextInput
                        type="text"
                        label="Confirm Phone Number"
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.confirmPhoneNumber}
                        error={errors.confirmPhoneNumber?.message}
                        register={register("confirmPhoneNumber")}
                    />
                    <TextInput
                        type="email"
                        label="Email"
                        placeholder="e.g., info@mail.com"
                        hasError={!!errors.email}
                        error={errors.email?.message}
                        register={register("email")}
                    />
                </div>
                <span>Company Information</span>
                <hr></hr>
                <br></br>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <TextInput
                        type="text"
                        label="Company Name"
                        placeholder="e.g., Mswahili Limited"
                        hasError={!!errors.companyName}
                        error={errors.companyName?.message}
                        register={register("companyName")}
                    />
                    <TextInput
                        type="text"
                        label="TIN"
                        placeholder="278-292-192"
                        hasError={!!errors.tin}
                        error={errors.tin?.message}
                        register={register("tin")}
                        onChange={(e) => {
                            let rawValue = e.target.value.replace(/\D/g, ""); // remove non-digits
                            rawValue = rawValue.slice(0, 9); // limit to 9 digits max

                            const formatted = rawValue
                                .match(/.{1,3}/g) // group every 3 digits
                                ?.join("-") ?? "";

                            setValue("tin", formatted); // update the field with formatted value
                        }}
                    />
                    <TextInput
                        type="text"
                        label="Phone Number"
                        placeholder="e.g., 0710000000"
                        hasError={!!errors.companyPhoneNumber}
                        error={errors.companyPhoneNumber?.message}
                        register={register("companyPhoneNumber")}
                    />
                    <div className="flex flex-col">
                        <label className="block mb-2">Address</label>
                        <Select
                            options={options}
                            onChange={(selectedOption) => setValue("companyAddress", selectedOption?.value || "")}
                            placeholder="Select a region"
                        />
                        {errors.companyAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
                        )}
                        {errors.companyAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
                        )}
                    </div>

                </div>
                <span>Categories</span>
                <hr></hr>
                <br></br>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
                    <div className="space-y-4">
                        <div className="flex flex-row items-center justify-between">
                            <Select
                                options={availableOptions}
                                onChange={(selectedOption) => {
                                    const selected = categories.find((c) => c.id === selectedOption?.value);
                                    if (selected) addCategory(selected);
                                }}
                                placeholder="Search or select category"
                                className="w-full"
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </div>
                        <div>
                            <div className="flex flex-col gap-2 mb-4">
                                {selectedCategories.length === 0 ? (
                                    <span className="text-sm text-gray-400 my-10 w-full text-center">
                                        At least one category must be selected
                                    </span>
                                ) : (
                                    selectedCategories.map((category) => (
                                        <span
                                            key={category.id}
                                            className="flex items-center w-fit gap-1 px-3 py-1 text-black rounded-full text-sm"
                                        >
                                            {category.name.toUpperCase()}
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(category)}
                                                className="text-red-500 hover:text-red-700 ml-2 text-xs"
                                            >
                                                X
                                            </button>
                                        </span>
                                    ))
                                )}

                                {selectedCategories.length > 0 && (
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span>{selectedCategories.length} category(ies) selected</span>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:underline"
                                            onClick={() => setSelectedCategories([])}
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    label="Register"
                    theme="primary"
                    size="md"
                    loading={createMutation.isLoading}
                />
            </form>
        </Modal>
    );
}
