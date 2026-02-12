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
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const { showMessage, closePopup } = usePopup();
    const schema = yup.object().shape({
        firstName: yup
            .string()
            .required(t("registration-form-first-name-required")),

        lastName: yup
            .string()
            .required(t("registration-form-last-name-required")),

        email: yup
            .string()
            .email(t("registration-form-email-invalid"))
            .required(t("registration-form-email-required")),

        phoneNumber: yup
            .string()
            .required(t("registration-form-phone-required")),

        confirmPhoneNumber: yup
            .string()
            .oneOf(
                [yup.ref("phoneNumber")],
                t("registration-form-phone-not-match")
            )
            .required(t("registration-form-confirm-phone-required")),

        tin: yup
            .string()
            .required(t("registration-form-tin-required"))
            .matches(
                /^\d{3}-\d{3}-\d{3}$/,
                t("registration-form-tin-format")
            ),

        companyName: yup
            .string()
            .required(t("registration-form-company-name-required")),

        companyPhoneNumber: yup
            .string()
            .required(t("registration-form-company-phone-required")),

        companyAddress: yup
            .string()
            .required(t("registration-form-address-required")),

        categoryIds: yup
            .array()
            .of(yup.string().required())
            .min(1, t("registration-form-category-min"))
            .required(t("registration-form-category-required")),
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
            toast.error(error.data.message || "Registration failed");
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
                    />
                    <TextInput
                        type="text"
                        label={t("registration-form-last-name")}
                        placeholder={t("registration-form-last-name-placeholder")}
                        hasError={!!errors.lastName}
                        error={errors.lastName?.message}
                        register={register("lastName")}
                    />
                    <TextInput
                        type="text"
                        label={t("registration-form-phone")}
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.phoneNumber}
                        error={errors.phoneNumber?.message}
                        register={register("phoneNumber")}
                    />

                    <TextInput
                        type="text"
                        label={t("registration-form-confirm-phone")}
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.confirmPhoneNumber}
                        error={errors.confirmPhoneNumber?.message}
                        register={register("confirmPhoneNumber")}
                    />
                    <TextInput
                        type="email"
                        label={t("registration-form-email")}
                        placeholder={t("registration-form-email-placeholder")}
                        hasError={!!errors.email}
                        error={errors.email?.message}
                        register={register("email")}
                    />
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
                        label={t("registration-form-phone")}
                        placeholder="e.g., 0710000000"
                        hasError={!!errors.companyPhoneNumber}
                        error={errors.companyPhoneNumber?.message}
                        register={register("companyPhoneNumber")}
                    />
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
                        {errors.companyAddress && (
                            <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>
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
                                onChange={(selectedOption) => {
                                    const selected = categories.find((c) => c.id === selectedOption?.value);
                                    if (selected) addCategory(selected);
                                }}
                                placeholder={t("registration-form-search-category")}
                                className="w-full"
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
