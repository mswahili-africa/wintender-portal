import { useForm } from "react-hook-form";
import { useState, useCallback, Fragment } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { mixed, number, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { IconFileText } from "@tabler/icons-react";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { TextEditor } from "@/components/editor/TextEditor";
import { createTender, getCategories } from "@/services/tenders";
import { getEntities } from "@/services/entities";
import { getUserRole } from "@/utils";
import { ICompany, ITenders } from "@/types";
import { ServiceAssigningForm } from "./ServiceAssigningForm";
import Tabs from "@/components/widgets/Tabs";
import { useTranslation } from "react-i18next";

interface IProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    onSuccess: () => void;
    bidder?: ICompany;
    initials?: ITenders;
}



export default function PrivateTenderRequestModal({
    open,
    setOpen,
    onSuccess,
    bidder,
}: IProps) {
    const userRole = getUserRole();

    const [tenderFile, setTenderFile] = useState<File | null>();
    const [categories, setCategories] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const schema = object().shape({
        tenderFile: mixed().required(t("difm-form-document-file-required")),
        title: string().required(t("difm-form-title-required")),
        tenderNumber: string().required(t("difm-form-tender-number-required")),
        region: string().required(t("difm-form-region-required")),
        summary: string().required(t("difm-form-summary-required")),
        tenderType: string().required(t("difm-form-type-required")),
        categoryId: string().required(t("difm-form-category-required")),
        entityId: string().required(t("difm-form-entity-required")),
        openDate: string().required(t("difm-form-open-date-required")),
        closeDate: string().required(t("difm-form-close-date-required")),
        consultationFee: number().required(t("difm-form-consultation-fee-required")),
    });

    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const openDate = watch("openDate");

    // Fetch categories based on user input
    const fetchCategories = useCallback(async (search: string) => {
        if (!search || typeof search !== "string") return setCategories([]);
        setLoading(true);
        try {
            const allCategories = await getCategories({ page: 0, size: 5, search });
            setCategories(
                allCategories.content.map((e: any) => ({
                    value: e.id,
                    label: e.name?.toUpperCase() || "UNKNOWN",
                }))
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch entities based on user input
    const fetchEntities = useCallback(async (search: string) => {
        if (!search || typeof search !== "string") return setEntities([]);
        setLoading(true);
        try {
            const allEntities = await getEntities({ page: 0, size: 5, search });
            setEntities(
                allEntities.content.map((e: any) => ({
                    value: e.id,
                    label: e.name?.toUpperCase() || "UNKNOWN",
                }))
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce category and entity fetch calls
    const debouncedFetchCategories = useCallback(
        debounce((inputValue: string) => {
            if (typeof inputValue === "string") fetchCategories(inputValue);
        }, 300),
        [fetchCategories]
    );

    const debouncedFetchEntities = useCallback(
        debounce((inputValue: string) => {
            if (typeof inputValue === "string") fetchEntities(inputValue);
        }, 300),
        [fetchEntities]
    );

    const uploadTenderMutation = useMutation({
        mutationFn: (data: FormData) => createTender(data),
        onSuccess: () => {
            reset();
            setTenderFile(undefined);
            setOpen(false);
            toast.success(t("difm-form-tender-upload-success"));
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(t("difm-form-tender-upload-error", { error: error.message }));
        },
    });

    const submit = (data: any) => {
        const formData = new FormData();
        formData.append("file", data.tenderFile);
        formData.append("title", data.title);
        formData.append("tenderNumber", data.tenderNumber);
        formData.append("region", data.region);
        formData.append("summary", data.summary);
        formData.append("openDate", data.openDate);
        formData.append("closeDate", data.closeDate);
        formData.append("tenderType", data.tenderType);
        formData.append("categoryId", data.categoryId);
        formData.append("entityId", data.entityId);
        formData.append("consultationFee", data.consultationFee);
        formData.append("tenderGroup", "PRIVATE");
        formData.append("bidderId", bidder ? bidder.id : "");


        uploadTenderMutation.mutate(formData);
    };

    return (
        <Modal
            size="sm"
            title={t("difm-form-header")}
            isOpen={open}
            onClose={(v) => setOpen(v)}
        >
            {bidder && (
                <>
                    <span className="text-sm text-green-500 mt-1 mx-0.5">
                        {t("difm-form-sub-header")}
                    </span>
                    <h1 className="text-lg font-bold mb-5">{bidder?.companyName}</h1>
                </>
            )}
            <Tabs panels={[t("difm-form-type-tender-request-tab"), t("difm-form-type-service-request-tab")]}>

                <form className="flex flex-col gap-3" onSubmit={handleSubmit(submit)}>

                    {/* Region */}
                    <div>
                        <label className="block mb-1">{t("difm-form-region")}</label>
                        <select {...register("region")} className="input-normal">
                            <option value="PRIVATE">{t("difm-form-region-private")}</option>
                            <option value="GOVERNMENT">{t("difm-form-region-government")}</option>
                            <option value="INTERNATIONAL">{t("difm-form-region-international")}</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.region?.message?.toString()}
                        </p>
                    </div>

                    {/* Tender Type */}
                    <div className="mb-2">
                        <label htmlFor="tenderType" className="block mb-2">
                            {t("difm-form-tender-type")}
                        </label>

                        <select
                            className={`${errors.tenderType?.type === "required" ? "input-error" : "input-normal"}`}
                            {...register("tenderType")}
                        >
                            {/* 
                            <option value="EXPRESSION_OF_INTEREST">{}EXPRESSION OF INTEREST (EI)</option>
                            <option value="REQUEST_OF_PROPOSAL">REQUEST OF PROPOSAL (RFP)</option>
                            <option value="REQUEST_FOR_QUOTATION">REQUEST FOR QUOTATION (RFQ)</option>
                            <option value="PRE_QUALIFICATION">PRE QUALIFICATION (PQ)</option>
                            <option value="REQUEST_FOR_BID">REQUEST FOR BID (RFB)</option>
                            <option value="REQUEST_FOR_TENDER">REQUEST FOR TENDER (RFT)</option>
                            <option value="INVITATION_TO_TENDER">INVITATION TO TENDER (ITT)</option>
                            <option value="INVITATION_TO_BID">INVITATION TO BID (IFB)</option>
                            <option value="⁠REQUEST_FOR_INFORMATION">⁠REQUEST FOR INFORMATION (RFI)</option> 
                            */}

                            <option value="EXPRESSION_OF_INTEREST">{t("difm-form-tender-type-expression-of-interest")}</option>
                            <option value="REQUEST_OF_PROPOSAL">{t("difm-form-tender-type-request-of-proposal")}</option>
                            <option value="REQUEST_FOR_QUOTATION">{t("difm-form-tender-type-request-for-quotations")}</option>
                            <option value="PRE_QUALIFICATION">{t("difm-form-tender-type-pre-qualification")}</option>
                            <option value="REQUEST_FOR_BID">{t("difm-form-tender-type-request-for-bid")}</option>
                            <option value="REQUEST_FOR_TENDER">{t("difm-form-tender-type-request-for-tender")}</option>
                            <option value="INVITATION_TO_TENDER">{t("difm-form-tender-type-invitation-to-tender")}</option>
                            <option value="INVITATION_TO_BID">{t("difm-form-tender-type-invitation-to-bid")}</option>
                            <option value="⁠REQUEST_FOR_INFORMATION">{t("difm-form-tender-type-request-for-information")}</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.tenderType?.message?.toString()}
                        </p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-1">{t("difm-form-category")}</label>
                        <Select
                            options={categories}
                            onInputChange={(inputValue) => debouncedFetchCategories(inputValue)}
                            onChange={(opt) => setValue("categoryId", opt?.value)}
                            isLoading={loading}
                            placeholder="Search categories..."
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.categoryId?.message?.toString()}
                        </p>
                    </div>

                    {/* Entity */}
                    <div>
                        <label className="block mb-1">{t("difm-form-entity")}</label>
                        <Select
                            options={entities}
                            onInputChange={(inputValue) => debouncedFetchEntities(inputValue)}
                            onChange={(opt) => setValue("entityId", opt?.value)}
                            isLoading={loading}
                            placeholder="Search entities..."
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="Number" className="block mb-2">
                            {t("difm-form-tender-number")}
                        </label>

                        <input
                            type="text"
                            className={`${errors.tenderNumber?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("tenderNumber")}
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.tenderNumber?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="title" className="block mb-2">
                            {t("difm-form-title")}
                        </label>

                        <input
                            type="text"
                            className={`${errors.title?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("title")}
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.title?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="summary" className="block mb-2">
                            {t("difm-form-summary")}
                        </label>


                        <TextEditor control={control} name="summary" />

                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.summary?.message?.toString()}
                        </p>
                    </div>

                    {/* JCM Consultation fee input */}
                    {
                        userRole !== "BIDDER" &&
                        <div className="mb-2">
                            <label htmlFor="consultationFee" className="block mb-2">
                                {t("difm-form-consultation-fee")}
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

                    <div>
                        <label className="block mb-1">{t("difm-form-tender-document")}</label>
                        <label
                            htmlFor="tenderFile"
                            className="block p-6 text-center bg-slate-50 border border-dashed rounded-md cursor-pointer"
                        >
                            {tenderFile ? (
                                <Fragment>
                                    <IconFileText className="mx-auto mb-2" />
                                    <p>{tenderFile.name}</p>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <IconFileText className="mx-auto mb-2" />
                                    <p>{t("difm-form-add-tender-file-message")} </p>
                                </Fragment>
                            )}
                            <input
                                id="tenderFile"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                // {...register("tenderFile")}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setValue("tenderFile", file);
                                        setTenderFile(file);
                                    }
                                }}
                            />

                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.tenderFile?.message?.toString()}
                            </p>
                        </label>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="openDate" className="block mb-2">
                            {t("difm-form-open-date")}
                        </label>

                        <input
                            type="datetime-local"
                            className={`${errors.openDate?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("openDate")}
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.openDate?.message?.toString()}
                        </p>
                    </div>

                    {openDate != "" && (
                        <div className="mb-2">
                            <label htmlFor="closeDate" className="block mb-2">
                                {t("difm-form-close-date")}
                            </label>

                            <input
                                type="datetime-local"
                                className={`${errors.closeDate?.type === "required"
                                    ? "input-error"
                                    : "input-normal"
                                    }`}
                                {...register("closeDate")}
                            />
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.closeDate?.message?.toString()}
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        label={t("difm-form-submit-button")}
                        theme="primary"
                        size="md"
                        loading={uploadTenderMutation.isPending}
                    />
                </form>

                {/* Service assign modal */}
                <ServiceAssigningForm />
            </Tabs>

        </Modal>
    );
}
