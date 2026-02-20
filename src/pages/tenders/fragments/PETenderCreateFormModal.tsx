
import { useUserDataContext } from "@/providers/userDataProvider";
import { createTender, getCategories } from "@/services/tenders";
import { ITenders } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText, IconNewSection, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { mixed, number, object, string } from "yup";
import requirementOptions from "@/pages/complience/data/documents.json";
import Select from "react-select";
import { getEntities } from "@/services/entities";
import { debounce, set } from "lodash";
import Button from "@/components/button/Button";
import { TextEditor } from "@/components/editor/TextEditor";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";
import { motion } from "framer-motion";
import { RequirementStage, RequirementItem } from "@/types/tenderWizard";
import Modal from "@/components/widgets/Modal";



interface IProps {
    onSuccess: () => void;
    initials?: ITenders;
}

const schema = object().shape({
    entityId: string().optional(),
    tenderFile: mixed().required("Document File is required"),
    title: string().required("Title is required"),
    tenderNumber: string().required("Tender number is required"),
    region: string().required("Region is required"),
    summary: string().required("Summary is required"),
    tenderType: string().required("Type is required"),
    openDate: string().required("Open Date is required"),
    closeDate: string().required("Close Date is required"),
    applicationFee: number().required("Application Fee is required"),
    consultationFee: number().required("Consultation Fee is required"),
});

export default function PETenderCreateFormModal({ onSuccess }: IProps) {
    const [requirements, setRequirements] = useState<Record<RequirementStage, RequirementItem[]>>({
        [RequirementStage.PRELIMINARY]: [],
        [RequirementStage.TECHNICAL]: [],
        [RequirementStage.COMMERCIAL]: [],
        [RequirementStage.FINANCIAL]: [],
        [RequirementStage.CONSENT]: [],
    });

    const steps = [
        "DETAILS",
        RequirementStage.PRELIMINARY,
        RequirementStage.TECHNICAL,
        RequirementStage.COMMERCIAL,
        RequirementStage.FINANCIAL,
        RequirementStage.CONSENT,
    ];

    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [open, setOpen] = useState(false);
    const [tenderFile, setTenderFile] = useState<string | undefined>();
    const [currentStep, setCurrentStep] = useState(0);
    const [consentGiven, setConsentGiven] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { userData } = useUserDataContext();  // Use the hook to get user data
    const userRole = userData?.role || "BIDDER";
    const { t } = useTranslation();

    const [marks, setMarks] = useState<number>(100);
    const [totalPercentage, setTotalPercentage] = useState<number>(0);

    // Function to calculate marks based on the percentage values of requirements items marks should not exceed 100


    useEffect(() => {
        // Recalculate total percentage and marks whenever requirements change
        const newTotal = Object.values(requirements)
            .flat()
            .reduce((sum, req) => sum + (Number(req.percentage) || 0), 0);

        setTotalPercentage(newTotal);
        setMarks(100 - newTotal);
    }, [requirements]);

    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: {
            tenderFile: "",
            title: "",
            tenderNumber: "",
            region: "",
            summary: "",
            tenderType: "",
            openDate: "",
            entityId: '',
            categoryId: "",
            closeDate: "",
            applicationFee: 0,
            consultationFee: 0,
        },
    });

    watch((data, { name, type }) => {
        if (name === "tenderFile" && type === "change") {
            setTenderFile(data.tenderFile?.[0]?.name);
        }
    });

    const openDate = watch("openDate");

    const fetchEntities = useCallback(async (search = "") => {
        if (!search) {
            setEntities([]);
            return;
        }

        setLoading(true);
        try {
            const allEntities = await getEntities({ page: 0, size: 5, search });
            setEntities(allEntities.content.map(e => ({ value: e.id, label: e.name.toUpperCase() })));
        } catch (error) {
            console.error("Failed to fetch entities", error);
        } finally {
            setLoading(false);
        }
    }, []);


    // Debounce the fetchEntities function
    const debouncedFetchEntities = useCallback(
        debounce((inputValue) => {
            if (inputValue.length >= 3) { // Only fetch if 3 or more characters
                fetchEntities(inputValue);
            } else {
                setEntities([]); // Clear entities if less than 3 characters
            }
        }, 5),
        [fetchEntities]
    );

    // Fetch categories

    const fetchCategories = useCallback(async (search = "") => {
        if (!search) {
            setCategories([]);
            return;
        }

        setLoading(true);
        try {
            const allEntities = await getCategories({ page: 0, size: 5, search });
            setCategories(allEntities.content.map(e => ({ value: e.id, label: e.name.toUpperCase() })));
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetchCategory = useCallback(
        debounce((inputValue) => {
            if (inputValue.length >= 3) { // Only fetch if 5 or more characters
                fetchCategories(inputValue);
            } else {
                setCategories([]); // Clear entities if less than 5 characters
            }
        }, 5),
        [fetchCategories]
    );

    const addRequirement = (stage: RequirementStage) => {
        setRequirements((prev) => ({
            ...prev,
            [stage]: [...prev[stage], { fieldName: "", required: true, percentage: 0, description: "" }],
        }));
    };

    const updateRequirement = (
        stage: RequirementStage,
        index: number,
        key: keyof RequirementItem,
        value: any
    ) => {
        const updated = [...requirements[stage]];
        updated[index] = { ...updated[index], [key]: value };

        setRequirements((prev) => ({
            ...prev,
            [stage]: updated,
        }));
    };

    const removeRequirement = (stage: RequirementStage, index: number) => {
        setRequirements((prev) => {
            const updated = [...prev[stage]];
            updated.splice(index, 1);
            return { ...prev, [stage]: updated };
        });
    };

    const uploadTenderMutation = useMutation({
        mutationFn: (data: FormData) => createTender(data),
        onSuccess: () => {
            reset();
            setTenderFile(undefined);
            setOpen(false);
            toast.success("Tender uploaded successfully");
            onSuccess();
            setCurrentStep(0);
            setRequirements({
                [RequirementStage.PRELIMINARY]: [],
                [RequirementStage.TECHNICAL]: [],
                [RequirementStage.COMMERCIAL]: [],
                [RequirementStage.FINANCIAL]: [],
                [RequirementStage.CONSENT]: [],
            });
        },
        onError: (error: any) => {
            toast.error("Failed to upload tender: " + error.message || error);
        },
    });


    const handleCompleteStep = (index: number) => {
        if (!completedSteps.includes(index)) {
            setCompletedSteps([...completedSteps, index]);
        }
        setCurrentStep(index + 1);
    };

    const submit = (data: Record<string, any>) => {

        if (!consentGiven) {
            toast.error("You must agree to the terms and conditions.");
            return;
        }

        // Check if there is any requirement item and marks is not equal to 0 then show error
        if (Object.values(requirements).flat().length > 0 && marks !== 0) {
            toast.error("Percentage distribution error, make sure you distribute percentage correctly accross requirement items")
        }

        const formData = new FormData();
        formData.append("file", data.tenderFile[0]);
        if (userData?.role === "PROCUREMENT_ENTITY") {
            formData.append("entityId", userData?.company);
        } else {
            formData.append("entityId", data.entityId);
        }
        formData.append("categoryId", data.categoryId);
        formData.append("title", data.title);
        formData.append("region", data.region);
        formData.append("tenderNumber", data.tenderNumber);
        formData.append("summary", data.summary);
        formData.append("openDate", data.openDate);
        formData.append("closeDate", data.closeDate);
        formData.append("tenderGroup", "PUBLIC");
        formData.append("tenderType", data.tenderType);
        formData.append("consultationFee", data.consultationFee.toString());

        const requirementList = Object.entries(requirements).flatMap(([stage, items]) =>
            items.map((item) => ({
                stage,
                fieldName: item.fieldName,
                required: item.required,
                percentage: item.percentage,
                description: item.description
            }))
        );
        if (requirementList.length > 0) {
            formData.append("requirements", JSON.stringify(requirementList));
        }
        uploadTenderMutation.mutate(formData);
    };

    const renderStepContent = () => {

        if (currentStep === 0) {
            return (
                <>

                    <div className="mb-2">
                        {(userRole !== "PROCUREMENT_ENTITY") && (
                            <>
                                <label htmlFor="com" className="block mb-2">
                                    {t("tender-wizard-form-entity")}
                                </label>
                                <Select
                                    options={entities}
                                    onInputChange={(inputValue) => debouncedFetchEntities(inputValue)} // Debounced fetch
                                    onChange={(selectedOption) => setValue("entityId", selectedOption?.value)}
                                    isLoading={loading}
                                    placeholder="Search for a entity"
                                />
                                <p className="text-xs text-red-500 mt-1 mx-0.5">
                                    {errors.bidder?.message?.toString()}
                                </p>
                            </>
                        )}

                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="mb-2 w-full">
                            <label htmlFor="category" className="block mb-2">
                                {t("tender-wizard-form-category")}
                            </label>

                            <Select
                                options={categories}
                                onInputChange={(inputValue) => debouncedFetchCategory(inputValue)} // Debounced fetch
                                onChange={(selectedOption) => setValue("categoryId", selectedOption?.value)}
                                isLoading={loading}
                                placeholder="Search for a category"
                            />
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.category?.message?.toString()}
                            </p>
                        </div>
                        {/* Region */}
                        <div className="mb-2 w-full">
                            <label htmlFor="region" className="block mb-2">
                                {t("tender-wizard-form-region")}
                            </label>

                            <select
                                className={`${errors.region?.type === "required" ? "input-error" : "input-normal"}`}
                                {...register("region", { required: true })}
                            >
                                <option value="PRIVATE">{t("difm-form-region-private")}</option>
                                <option value="GOVERNMENT">{t("difm-form-region-government")}</option>
                                <option value="INTERNATIONAL">{t("difm-form-region-international")}</option>
                            </select>
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.region?.message?.toString()}
                            </p>
                        </div>
                    </div>
                    {/* Tender Type */}
                    <div className="mb-2">
                        <label htmlFor="tenderType" className="block mb-2">
                            {t("tender-wizard-form-tender-type")}
                        </label>

                        <select
                            className={`${errors.tenderType?.type === "required" ? "input-error" : "input-normal"}`}
                            {...register("tenderType", { required: true })}
                        >

                            <option value="EXPRESSION_OF_INTEREST">{t("tender-wizard-form-tender-type-expression-of-interest")}</option>
                            <option value="REQUEST_OF_PROPOSAL">{t("tender-wizard-form-tender-type-request-of-proposal")}</option>
                            <option value="REQUEST_FOR_QUOTATION">{t("tender-wizard-form-tender-type-request-for-quotations")}</option>
                            <option value="PRE_QUALIFICATION">{t("tender-wizard-form-tender-type-pre-qualification")}</option>
                            <option value="REQUEST_FOR_BID">{t("tender-wizard-form-tender-type-request-for-bid")}</option>
                            <option value="REQUEST_FOR_TENDER">{t("tender-wizard-form-tender-type-request-for-tender")}</option>
                            <option value="INVITATION_TO_TENDER">{t("tender-wizard-form-tender-type-invitation-to-tender")}</option>
                            <option value="INVITATION_TO_BID">{t("tender-wizard-form-tender-type-invitation-to-bid")}</option>
                            <option value="⁠REQUEST_FOR_INFORMATION">{t("tender-wizard-form-tender-type-request-for-information")}</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.tenderType?.message?.toString()}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2">{t("tender-wizard-form-title")}</label>
                        <input className="input-normal" {...register("title")} />
                        <p className="text-xs text-red-500">
                            {typeof errors.title?.message === "string" ? errors.title.message : ""}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label className="block mb-2">{t("tender-wizard-form-tender-number")}</label>
                        <input className="input-normal" {...register("tenderNumber")} />
                        <p className="text-xs text-red-500">
                            {typeof errors.tenderNumber?.message === "string" ? errors.tenderNumber.message : ""}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2">{t("tender-wizard-form-summary")}</label>
                        <TextEditor name="summary" control={control} />
                        <p className="text-xs text-red-500">
                            {typeof errors.summary?.message === "string" ? errors.summary.message : ""}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2">{t("tender-wizard-form-tender-document")}</label>
                        <label
                            htmlFor="tenderFile"
                            className="label block py-6 bg-slate-50 border border-dashed rounded-md cursor-pointer"
                        >
                            <div className="text-center">
                                <IconFileText size={28} className="mx-auto mb-2" />
                                {tenderFile ? <span>{tenderFile}</span> : <span>{t("tender-wizard-form-tender-document-upload")}</span>}
                            </div>
                            <input
                                type="file"
                                id="tenderFile"
                                accept=".pdf"
                                className="hidden"
                                {...register("tenderFile")}
                            />
                        </label>
                        <p className="text-xs text-red-500">
                            {typeof errors.tenderFile?.message === "string" ? errors.tenderFile.message : ""}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="mb-2 w-full">
                            <label htmlFor="openDate" className="block mb-2">
                                {t("tender-wizard-form-open-date")}
                            </label>

                            <input
                                type="datetime-local"
                                className={`${errors.openDate?.type === "required"
                                    ? "input-error"
                                    : "input-normal"
                                    }`}
                                {...register("openDate", { required: true })}
                            />
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.openDate?.message?.toString()}
                            </p>
                        </div>

                        {openDate != "" && (
                            <div className="mb-2 w-full">
                                <label htmlFor="closeDate" className="block mb-2">
                                    {t("tender-wizard-form-close-date")}
                                </label>

                                <input
                                    type="datetime-local"
                                    className={`${errors.closeDate?.type === "required"
                                        ? "input-error"
                                        : "input-normal"
                                        }`}
                                    {...register("closeDate", { required: true })}
                                />
                                <p className="text-xs text-red-500 mt-1 mx-0.5">
                                    {errors.closeDate?.message?.toString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* JCM Application fee input */}
                    <div className="mb-2">
                        <label htmlFor="applicationFee" className="block mb-2">
                            {t("tender-wizard-form-application-fee")}
                        </label>

                        <input
                            type="text"
                            id="applicationFee"
                            inputMode="decimal"
                            className={`${errors.applicationFee?.type ? "input-error" : "input-normal"}`}
                            {...register("applicationFee", {
                                required: true,
                                pattern: {
                                    value: /^\d+(\.\d{1,2})?$/,
                                    message: "Enter a valid number",
                                },
                            })}
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                            }}
                        />

                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.applicationFee?.message?.toString()}
                        </p>
                    </div>


                    {/* JCM Consultation fee input */}
                    {
                        userRole !== "PROCUREMENT_ENTITY" &&
                        <div className="mb-2">
                            <label htmlFor="consultationFee" className="block mb-2">
                                {t("tender-wizard-form-consultation-fee")}
                            </label>

                            <input
                                type="text"
                                inputMode="decimal"
                                className={`${errors.consultationFee?.type ? "input-error" : "input-normal"}`}
                                {...register("consultationFee", {
                                    required: true,
                                    pattern: {
                                        value: /^\d+(\.\d{1,2})?$/,
                                        message: "Enter a valid number",
                                    },
                                })}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                                }}
                            />

                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.consultationFee?.message?.toString()}
                            </p>
                        </div>
                    }

                </>
            );
        }

        const stage = steps[currentStep] as RequirementStage;
        const stageOptions = requirementOptions.filter((opt) => opt.stage === stage);
        const selectedValues = requirements[stage].map((r) => r.fieldName);

        if (currentStep === steps.length - 1) {
            return (
                <div>
                    <div className="mb-2">
                        <p className="text-sm">
                            {t("tender-wizard-pe-consent")}
                        </p>
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={consentGiven}
                                onChange={(e) => setConsentGiven(e.target.checked)}
                            />
                            I agree to the terms and conditions.
                        </label>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {requirements[stage].map((req, idx) => {
                    const filteredStageOptions = stageOptions.filter(
                        (opt) =>
                            !selectedValues.includes(opt.value) ||
                            opt.value === req.fieldName
                    );

                    return (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            key={idx}
                            className="group relative rounded-2xl border border-slate-200 bg-white p-5 mb-5 shadow-sm hover:shadow-lg transition-all"
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                                        {idx + 1}
                                    </span>
                                    <h4 className="text-sm font-semibold text-slate-800">
                                        {filteredStageOptions.find((opt) => opt.value === req.fieldName)?.label || req.fieldName}
                                    </h4>
                                </div>

                                {/* Remove */}
                                <Tooltip content={t("tender-wizard-remove-tooltip")}>
                                    <button
                                        type="button"
                                        onClick={() => removeRequirement(stage, idx)}
                                        className="transition text-red-400 hover:text-red-600 flex flex-row items-center"
                                    >
                                        <IconX size={18} /> {t("tender-wizard-remove-button")}
                                    </button>
                                </Tooltip>
                            </div>

                            {/* MAIN GRID */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* Requirement Select */}
                                <div className="lg:col-span-6">
                                    <label className="label">{t("tender-wizard-form-requirement")}</label>
                                    <select
                                        className={`input-normal w-full ${!req.fieldName ? "border-red-500" : ""
                                            }`}
                                        value={req.fieldName}
                                        onChange={(e) =>
                                            updateRequirement(stage, idx, "fieldName", e.target.value)
                                        }
                                    >
                                        <option value="">{t("tender-wizard-form-select-requirement")}</option>
                                        {filteredStageOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Marks */}
                                <div className="lg:col-span-3 flex flex-col">
                                    <label className="label">{t("tender-wizard-form-percentage")} (%)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        className="input-normal w-full"
                                        value={req.percentage}
                                        onChange={(e) => {
                                            let value = Number(e.target.value);

                                            // Calculate total across all stages
                                            const totalPercentage = Object.values(requirements).flat().reduce(
                                                (sum, r, i) => (r === req ? sum + value : sum + r.percentage),
                                                0
                                            );

                                            if (totalPercentage > 100) {
                                                value = Math.max(0, value - (totalPercentage - 100)); // limit to 100
                                                toast.error("Total percentage for the tender cannot exceed 100");
                                            }

                                            updateRequirement(stage, idx, "percentage", value);
                                        }}
                                    />
                                </div>

                                {/* Required Toggle */}
                                <div className="lg:col-span-3 flex items-end">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        {/* <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={req.required}
                                                onChange={(e) =>
                                                    updateRequirement(stage, idx, "required", e.target.checked)
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition" />
                                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5" />
                                        </div> */}
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                            checked={req.required}
                                            onChange={(e) => updateRequirement(stage, idx, "required", e.target.checked)}
                                        />
                                        <span className="text-sm text-slate-700">{t("tender-wizard-required")}</span>
                                    </label>
                                </div>
                            </div>

                            {/* NOTES */}
                            <div className="mt-4">
                                <label className="label">{t("tender-wizard-form-notes")}</label>
                                <textarea
                                    rows={2}
                                    value={req.description}
                                    className="input-normal w-full resize-none"
                                    placeholder={t("tender-wizard-form-notes-placeholder")}
                                    onChange={(e) =>
                                        updateRequirement(stage, idx, "description", e.target.value)
                                    }
                                />
                            </div>
                        </motion.div>

                    );
                })}


                <button
                    type="button"
                    onClick={() => addRequirement(stage)}
                    className="text-blue-500 text-xs underline"
                >
                    {t("tender-wizard-add-requirement-button", { stage: stage })}
                </button>
            </div>
        );
    };

    return (
        <>
            <Tooltip content={t("tender-new-tender-button-tooltip")}>
                <Button
                    type="button"
                    label={t("tender-new-tender-button")}
                    icon={<IconNewSection size={18} />}
                    theme="secondary"
                    size="md"
                    onClick={() => setOpen(true)}
                />
            </Tooltip>
            {open && (
                <Modal size="xl" isOpen={open} onClose={() => setOpen(false)} title="Upload New Tender">

                    {/* <div className="-mt-10"> */}
                    {/* <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold uppercase">{t("tender-wizard-header")}</h2>
            </div> */}
                    <form onSubmit={handleSubmit(submit)} className="max-w-7xl mx-auto h-auto flex flex-col">

                        {/* PROGRESS BAR */}
                        <div className="flex flex-row justify-between">
                            <div className="text-sm mb-2 font-medium">{t("tender-wizard-progress")}</div>
                            {marks > 0 && <span className="text-xs text-green-500 ml-2">({t("tender-wizard-marks-left", { marks: marks })})</span>}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>


                        {/* MAPPING STEPS */}
                        <div className="flex flex-nowrap gap-2 overflow-x-auto mb-4">
                            {steps.map((title, index) => {
                                const isActive = currentStep === index;
                                const isClickable = index === 0 || completedSteps.includes(index - 1);

                                return (
                                    <button
                                        key={title.toString()}
                                        type="button"
                                        onClick={() => {
                                            if (isClickable) setCurrentStep(index);
                                        }}
                                        className={`flex-1 whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all ${isActive
                                            ? "bg-green-600 text-white"
                                            : isClickable
                                                ? "bg-green-100 text-gray-700 hover:bg-green-200"
                                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {typeof title === "string" ? title : title}
                                    </button>
                                );

                            })}
                        </div>

                        {/* CONTENT */}
                        <div className="bg-white p-6 rounded-md shadow overflow-y-auto flex-grow">
                            {renderStepContent()}
                        </div>

                        <div className="mt-6 flex justify-between">
                            {currentStep > 0 && (
                                <Tooltip content={t("tender-wizard-back-tooltip")}>
                                    <Button
                                        size="md"
                                        type="button"
                                        label={t("tender-wizard-back-button")}
                                        theme="secondary"
                                        onClick={() => setCurrentStep((prev) => prev - 1)}
                                    />
                                </Tooltip>
                            )}
                            {currentStep < steps.length - 1 ? (
                                <Tooltip content={t("tender-wizard-next-tooltip")}>
                                    <Button
                                        size="md"
                                        type="button"
                                        label={t("tender-wizard-next-button")}
                                        theme="primary"
                                        onClick={() => handleCompleteStep(currentStep)}
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip content={t("tender-wizard-publish-tooltip")}>
                                    <Button
                                        size="md"
                                        type="submit"
                                        label={t("tender-wizard-publish-button")}
                                        theme="primary"
                                        loading={uploadTenderMutation.isPending}
                                    />
                                </Tooltip>
                            )
                            }
                        </div>
                    </form>
                    {/* </div> */}
                </Modal>
            )}
        </>
    );
}
