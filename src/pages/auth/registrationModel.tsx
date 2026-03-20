import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { bidderRegister } from "@/services/auth";
import { BusinessType, IBidderRegisterForm } from "@/types/forms";
import TextInput from "@/components/widgets/forms/TextInput";
import * as yup from "yup";
import Select from "react-select";
import { ICategory } from "@/types";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchCategories } from "@/hooks/categoriesRepository";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'
import { AxiosError } from "axios";

interface IProps {
    onSuccess: () => void;
    initials?: any;
    isOpen: boolean;
    onClose: () => void;
    openDocuments?: () => void;
}

export default function RegistrationModel({ onSuccess, isOpen, onClose, openDocuments }: IProps) {
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

    // business type options from enum
    const businessTypeOptions = Object.entries(BusinessType).map(([value, label]) => ({ value, label })); // Convert enum to array of optionsBusinessType

    
    const { t } = useTranslation();

    const { showMessage, closePopup } = usePopup();
    const schema = yup.object().shape({
        firstName: yup
            .string()
            .required(t("registration-form-first-name-required"))
            .min(3, "First name must be at least 3 characters long"),

        lastName: yup
            .string()
            .required(t("registration-form-last-name-required"))
            .min(3, "Last name must be at least 3 characters long"),

        email: yup
            .string()
            .email(t("registration-form-email-invalid"))
            .required(t("registration-form-email-required")),

        phoneNumber: yup
            .string()
            .required(t("registration-form-phone-required"))
            .min(10, "Phone number must be at least 10 digits long"),

        confirmPhoneNumber: yup
            .string()
            .oneOf(
                [yup.ref("phoneNumber")],
                t("registration-form-phone-not-match")
            )
            .required(t("registration-form-confirm-phone-required"))
            .min(10, "Phone number must be at least 10 digits long"),

        tin: yup
            .string()
            .required(t("registration-form-tin-required"))
            .matches(
                /^\d{3}-\d{3}-\d{3}$/,
                t("registration-form-tin-format")
            ),

        companyName: yup
            .string()
            .required(t("registration-form-company-name-required"))
            .min(3, "Company name must be at least 3 characters long"),

        companyPhoneNumber: yup
            .string()
            .required(t("registration-form-company-phone-required"))
            .min(10, "Phone number must be at least 10 digits long"),

        companyAddress: yup
            .string()
            .required(t("registration-form-address-required")),

        companyBusinessType: yup
            .string()
            .oneOf(
                businessTypeOptions.map((option) => option.value)
            )
            .required(t("registration-form-business-type-required")),

        categoryIds: yup
            .array()
            .of(yup.string().required())
            .min(1, t("registration-form-category-min"))
            .required(t("registration-form-category-required")),
    });


    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [searchCategory, setSearchCategory] = useState<string | undefined>(undefined);
    const debouncedSearch = useDebounce(searchCategory, 500);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<IBidderRegisterForm>({
        resolver: yupResolver(schema)
    });

    const { categories: categoryList, isLoading: categoryLoading } = useSearchCategories({
        page: 0,
        size: 5,
        search: debouncedSearch
        
    });

    useEffect(() => {
        if (categoryList) {
            setCategories(categoryList.content);
        }
    }, [categoryList]);

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
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || "Registration failed");
        },
    });

    const submit = (data: IBidderRegisterForm) => {
        if (!agreeTerms) {
            toast.error("Please agree to terms and conditions");
            return;
        }
        const categoryIds = selectedCategories.map((c) => c.id);

        const cleanTIN = data.tin.replace(/-/g, ""); // remove dashes before submit

        // console.log(data);

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
            title={t("registration-form-title")}
            isOpen={isOpen}
            onClose={onClose}
        >
            <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <TextInput
                        type="text"
                        label={t("registration-form-first-name")}
                        placeholder={t("registration-form-first-name-placeholder")}
                        hasError={!!errors.firstName}
                        error={errors.firstName?.message}
                        register={register("firstName")}
                        onChange={(e) => {
                            const clean = e.target.value.replace(/[^A-Za-z ]/g, ""); // only letters
                            setValue("firstName", clean, { shouldValidate: true });
                        }}
                    />
                    <TextInput
                        type="text"
                        label={t("registration-form-last-name")}
                        placeholder={t("registration-form-last-name-placeholder")}
                        hasError={!!errors.lastName}
                        error={errors.lastName?.message}
                        register={register("lastName")}
                        onChange={(e) => {
                            const clean = e.target.value.replace(/[^A-Za-z ]/g, ""); // only letters
                            setValue("lastName", clean, { shouldValidate: true });
                        }}
                    />
                    {/* <TextInput
                        type="text"
                        label={t("registration-form-phone")}
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.phoneNumber}
                        error={errors.phoneNumber?.message}
                        register={register("phoneNumber")}
                        onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, ""); // only numbers
                            setValue("phoneNumber", clean, { shouldValidate: true });
                        }}
                    /> */}

                    {/* international phone input */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-semibold text-gray-500">{t("registration-form-phone")}</label>
                        <PhoneInput
                            value={getValues("phoneNumber")}
                            defaultCountry={"TZ"}
                            international={true}
                            placeholder="e.g., 710101010"
                            className="custom-phone-input"
                            onChange={(value: any) => setValue("phoneNumber", value)}

                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-semibold text-gray-500">{t("registration-form-confirm-phone")}</label>
                        <PhoneInput
                            value={getValues("confirmPhoneNumber")}
                            defaultCountry={"TZ"}
                            international={true}
                            className="custom-phone-input"
                            placeholder="e.g., 710101010"
                            onChange={(value: any) => setValue("confirmPhoneNumber", value)}

                        />
                        {errors.confirmPhoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPhoneNumber.message}</p>
                        )}
                    </div>

                    {/* <TextInput
                        type="text"
                        label={t("registration-form-confirm-phone")}
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.confirmPhoneNumber}
                        error={errors.confirmPhoneNumber?.message}
                        register={register("confirmPhoneNumber")}
                    /> */}
                </div>
                <span>{t("registration-form-company-info")}</span>
                <hr></hr>
                <br></br>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <TextInput
                        type="text"
                        label={t("registration-form-company-name")}
                        placeholder="e.g., Mswahili Limited"
                        hasError={!!errors.companyName}
                        error={errors.companyName?.message}
                        register={register("companyName")}
                    />
                    <TextInput
                        type="email"
                        label={t("registration-form-email")}
                        placeholder={t("registration-form-email-placeholder")}
                        hasError={!!errors.email}
                        error={errors.email?.message}
                        register={register("email")}
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
                    {/* <TextInput
                        type="text"
                        label={t("registration-form-phone")}
                        placeholder="e.g., 0710000000"
                        hasError={!!errors.companyPhoneNumber}
                        error={errors.companyPhoneNumber?.message}
                        register={register("companyPhoneNumber")}
                    /> */}
                    <div className="flex flex-col gap-y-1">
                        <label className="text-sm font-semibold text-gray-500">{t("registration-form-phone")}</label>
                        <PhoneInput
                            value={getValues("companyPhoneNumber")}
                            defaultCountry={"TZ"}
                            international={true}
                            className="custom-phone-input"
                            placeholder="e.g., 710101010"
                            onChange={(value: any) => setValue("companyPhoneNumber", value)}

                        />
                        {errors.companyPhoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyPhoneNumber.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="block mb-2">{t("registration-form-company-address")}</label>
                        <Select
                            options={options}
                            onChange={(selectedOption) => setValue("companyAddress", selectedOption?.value || "")}
                            placeholder="Select a region"
                        />
                        {errors.companyAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="block mb-2">{t("registration-form-company-business-type")}</label>
                        <Select
                            options={businessTypeOptions}
                            onChange={(selectedOption) => setValue("companyBusinessType", selectedOption?.value || "")}
                            placeholder="Select a business type"
                        />
                        {errors.companyBusinessType && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyBusinessType.message}</p>
                        )}
                    </div>

                </div>
                <span>{t("registration-form-categories")}</span>
                <hr></hr>
                <br></br>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
                    <div className="space-y-4">
                        <div className="flex flex-row items-center justify-between">
                            <Select
                                options={availableOptions}
                                onInputChange={(inputValue) => setSearchCategory(inputValue)}
                                onChange={(selectedOption) => {
                                    const selected = categories.find((c) => c.id === selectedOption?.value);
                                    if (selected) addCategory(selected);
                                }}
                                placeholder={t("registration-form-search-category")}
                                className="w-full"
                                isLoading={categoryLoading}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </div>
                        <div>
                            <div className="flex flex-col gap-2 mb-4">
                                {selectedCategories.length === 0 ? (
                                    <span className="text-sm text-gray-400 my-10 w-full text-center">
                                        {t("registration-form-category-min")}
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
                                        <span>{t("registration-form-category-selected", { count: selectedCategories.length })}</span>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:underline"
                                            onClick={() => setSelectedCategories([])}
                                        >
                                            {t("registration-form-clear-all")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-4 mb-6">
                    {/* Terms and Conditions */}
                    <div className="flex flex-row items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            required
                            className="mr-2"
                        />
                        <label htmlFor="terms" className="text-sm gap-1" onClick={openDocuments}>
                            {t("registration-form-agree")} <span className="text-green-600 hover:underline hover:text-green-700">{t("registration-form-terms")}</span>
                        </label>
                    </div>
                </div>
                <Button
                    type="submit"
                    label={t("registration-form-submit")}
                    theme="primary"
                    size="md"
                    loading={createMutation.isPending}
                />
            </form>
        </Modal>
    );
}
