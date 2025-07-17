
import { useUserDataContext } from "@/providers/userDataProvider";
import { createTender, getCategories } from "@/services/tenders";
import { ITenders } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText, IconNewSection } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { mixed, number, object, string } from "yup";
import requirementOptions from "@/pages/complience/data/documents.json";
import Select from "react-select";
import { getEntities } from "@/services/entities";
import { debounce } from "lodash";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import Spinner from "@/components/spinners/Spinner";

export enum RequirementStage {
    PRELIMINARY = "PRELIMINARY",
    TECHNICAL = "TECHNICAL",
    COMMERCIAL = "COMMERCIAL",
    CONSENT = "CONSENT",
    FINANCIAL = "FINANCIAL",
}

export interface RequirementItem {
    fieldName: string;
    required: boolean;
}

interface IProps {
    onSuccess: () => void;
    initials?: ITenders;
}

const schema = object().shape({
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

export default function PETenderUpload({ onSuccess }: IProps) {
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
    const entityId = userData?.company;

    const {
        register,
        handleSubmit,
        watch,
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
            entityId: entityId,
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

    const debouncedFetchEntities = useCallback(
        debounce((inputValue) => {
            if (inputValue.length >= 3) { // Only fetch if 5 or more characters
                fetchEntities(inputValue);
            } else {
                setEntities([]); // Clear entities if less than 5 characters
            }
        }, 5),
        [fetchEntities]
    );

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
            [stage]: [...prev[stage], { fieldName: "", required: true }],
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

        const formData = new FormData();
        formData.append("file", data.tenderFile[0]);
        formData.append("entityId", data.entityId);
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
            }))
        );
        formData.append("requirements", JSON.stringify(requirementList));

        uploadTenderMutation.mutate(formData);
    };

    const renderStepContent = () => {

        if (currentStep === 0) {
            return (
                <>
                    <div className="mb-2">
                        {(userRole === "PUBLISHER" || userRole === "ADMINISTRATOR") && (
                            <><label htmlFor="com" className="block mb-2">
                                Entity
                            </label><Select
                                    options={entities}
                                    onInputChange={(inputValue) => debouncedFetchEntities(inputValue)} // Debounced fetch
                                    onChange={(selectedOption) => setValue("entityId", selectedOption?.value)}
                                    isLoading={loading}
                                    placeholder="Search for a entity" /><p className="text-xs text-red-500 mt-1 mx-0.5">
                                    {errors.bidder?.message?.toString()}
                                </p></>
                        )}

                    </div>
                    <div className="mb-2">
                        <label htmlFor="category" className="block mb-2">
                            Category
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
                    <div className="mb-2">
                        <label htmlFor="region" className="block mb-2">
                            Region
                        </label>

                        <select
                            className={`${errors.region?.type === "required" ? "input-error" : "input-normal"}`}
                            {...register("region", { required: true })}
                        >
                            <option value="PRIVATE">PRIVATE</option>
                            <option value="GOVERNMENT">GOVERNMENT</option>
                            <option value="INTERNATIONAL">INTERNATIONAL</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.region?.message?.toString()}
                        </p>
                    </div>
                    {/* Tender Type */}
                    <div className="mb-2">
                        <label htmlFor="tenderType" className="block mb-2">
                            Type
                        </label>

                        <select
                            className={`${errors.tenderType?.type === "required" ? "input-error" : "input-normal"}`}
                            {...register("tenderType", { required: true })}
                        >
                            <option value="EXPRESSION_OF_INTEREST">EXPRESSION OF INTEREST (EI)</option>
                            <option value="REQUEST_OF_PROPOSAL">REQUEST OF PROPOSAL (RFP)</option>
                            <option value="REQUEST_FOR_QUOTATION">REQUEST FOR QUOTATION (RFQ)</option>
                            <option value="PRE_QUALIFICATION">PRE QUALIFICATION (PQ)</option>
                            <option value="REQUEST_FOR_BID">REQUEST FOR BID (RFB)</option>
                            <option value="REQUEST_FOR_TENDER">REQUEST FOR TENDER (RFT)</option>
                            <option value="INVITATION_TO_TENDER">INVITATION TO TENDER (ITT)</option>
                            <option value="INVITATION_TO_BID">INVITATION TO BID (IFB)</option>
                            <option value="⁠REQUEST_FOR_INFORMATION">⁠REQUEST FOR INFORMATION (RFI)</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.tenderType?.message?.toString()}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2">Title</label>
                        <input className="input-normal" {...register("title")} />
                        <p className="text-xs text-red-500">
                            {typeof errors.title?.message === "string" ? errors.title.message : ""}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label className="block mb-2">Tender Number</label>
                        <input className="input-normal" {...register("tenderNumber")} />
                        <p className="text-xs text-red-500">
                            {typeof errors.tenderNumber?.message === "string" ? errors.tenderNumber.message : ""}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2">Summary</label>
                        <textarea className="input-normal" rows={3} {...register("summary")} />
                        <p className="text-xs text-red-500">
                            {typeof errors.summary?.message === "string" ? errors.summary.message : ""}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-2">Tender Document</label>
                        <label
                            htmlFor="tenderFile"
                            className="label block py-6 bg-slate-50 border border-dashed rounded-md cursor-pointer"
                        >
                            <div className="text-center">
                                <IconFileText size={28} className="mx-auto mb-2" />
                                {tenderFile ? <span>{tenderFile}</span> : <span>Click to upload PDF</span>}
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
                    <div className="mb-2">
                        <label htmlFor="openDate" className="block mb-2">
                            Open Date
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
                        <div className="mb-2">
                            <label htmlFor="closeDate" className="block mb-2">
                                Close Date
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

                    {/* JCM Application fee input */}
                    <div className="mb-2">
                        <label htmlFor="applicationFee" className="block mb-2">
                            Application Fee
                        </label>

                        <input
                            type="text"
                            id="applicationFee"
                            inputMode="decimal"
                            className={`${errors.consultationFee?.type ? "input-error" : "input-normal"}`}
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
                                Consultation Fee
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
                            By submitting this application, I/we hereby acknowledge and agree to the terms and conditions outlined in the tender documents. I/we confirm that all information provided is accurate and complete to the best of our knowledge.
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
                        (opt) => !selectedValues.includes(opt.value) || opt.value === req.fieldName
                    );

                    return (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                            <select
                                className={`input-normal flex-1 ${!req.fieldName ? "border-red-500" : ""}`}
                                value={req.fieldName}
                                onChange={(e) => updateRequirement(stage, idx, "fieldName", e.target.value)}
                            >
                                <option value="">Select Requirement</option>
                                {filteredStageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <label className="text-xs whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    className="mr-1"
                                    checked={req.required}
                                    onChange={(e) => updateRequirement(stage, idx, "required", e.target.checked)}
                                />
                                Required
                            </label>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => removeRequirement(stage, idx)}
                                className="text-red-500 text-xs underline ml-2"
                            >
                                X
                            </button>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() => addRequirement(stage)}
                    className="text-blue-500 text-xs underline"
                >
                    + Add {stage} Requirement
                </button>
            </div>
        );
    };

    return (
        <>
            <Button
                type="button"
                label="New Tender"
                icon={<IconNewSection size={18} />}
                theme="secondary"
                size="md"
                onClick={() => setOpen(true)}
            />

            {open && (
                <Modal size="lg" isOpen={open} onClose={() => setOpen(false)} title="Upload New Tender">
                    <form onSubmit={handleSubmit(submit)} className="max-w-7xl mx-auto h-auto flex flex-col">
                        <div className="text-sm mb-2 font-medium">Creating Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>
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

                        <div className="bg-white p-6 rounded-md shadow overflow-y-auto flex-grow">
                            {renderStepContent()}
                        </div>

                        <div className="mt-6 flex justify-between">
                            {currentStep > 0 && (
                                <Button
                                    size="md"
                                    type="button"
                                    label="Back"
                                    theme="secondary"
                                    onClick={() => setCurrentStep((prev) => prev - 1)}
                                />
                            )}
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    size="md"
                                    type="button"
                                    label="Next"
                                    theme="primary"
                                    onClick={() => handleCompleteStep(currentStep)}
                                />
                            ) : (
                                // 
                                uploadTenderMutation.isLoading ? (
                                    <Spinner size="md" />
                                ) : (
                                    <Button
                                        size="md"
                                        type="submit"
                                        label="Upload"
                                        theme="primary"
                                        loading={uploadTenderMutation.isLoading}
                                    />
                                )
                            )}
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
