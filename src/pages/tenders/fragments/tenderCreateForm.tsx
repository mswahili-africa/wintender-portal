import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { createTender, getCategories } from "@/services/tenders";
import { ITenders } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { mixed, number, object, string } from "yup";
import Select from "react-select";
import { debounce } from "lodash";
import { getEntities } from "@/services/entities";

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
    category: string().required("Category is required"),
    entity: string().required("Entity is required"),
    openDate: string().required("Open Date is required"),
    closeDate: string().required("Close Date is required"),
    consultationFee: number().required("Consultation Fee is required"),
});

export default function TenderUpload({ onSuccess, initials }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [tenderFile, setTenderFile] = useState<string | any>();
    const [categories, setCategories] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue, // Added for setting values programmatically
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
            category: "",
            entity: "",
            openDate: "",
            closeDate: "",
            consulatationFee: 0,
        },
    });

    // Watch for file changes
    watch((data, { name, type }) => {
        if (name === "tenderFile" && type === "change") {
            setTenderFile(data.tenderFile[0]?.name);
        }
    });

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

    // Handle form submission
    const submit = (data: Record<string, any>) => {
        const formData = new FormData();
        formData.append("file", data.tenderFile[0]);
        formData.append("title", data.title);
        formData.append("region", data.region);
        formData.append("tenderNumber", data.tenderNumber);
        formData.append("summary", data.summary);
        formData.append("openDate", data.openDate);
        formData.append("closeDate", data.closeDate);
        formData.append("tenderGroup", "PUBLIC");
        formData.append("tenderType", data.tenderType);
        formData.append("category", data.category);
        formData.append("entity", data.entity);
        formData.append("consultationFee", data.consultationFee)

        uploadTenderMutation.mutate(formData);
    };

    // Use mutation for uploading tender
    const uploadTenderMutation = useMutation({
        mutationFn: (data: FormData) => createTender(data),
        onSuccess: () => {
            reset();
            setTenderFile(undefined);
            setOpen(false);
            toast.success("Tender uploaded successfully");
            onSuccess();
        },
        onError: (error: any) => {
            toast.error("Failed to upload tender " + error);
        },
    });

    const openDate = watch("openDate");

    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Tender"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            <Modal
                size="sm"
                title="Upload New Tender"
                isOpen={open}
                onClose={(v) => setOpen(v)}
            >
                <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
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

                    {/* Entity with search */}
                    <div className="mb-2">
                        <label htmlFor="com" className="block mb-2">
                            Entity
                        </label>
                        <Select
                            options={entities}
                            onInputChange={(inputValue) => debouncedFetchEntities(inputValue)} // Debounced fetch
                            onChange={(selectedOption) => setValue("entity", selectedOption?.value)}
                            isLoading={loading}
                            placeholder="Search for a entity"
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.bidder?.message?.toString()}
                        </p>
                    </div>

                    {/* Category with search */}
                    <div className="mb-2">
                        <label htmlFor="category" className="block mb-2">
                            Category
                        </label>

                        <Select
                            options={categories}
                            onInputChange={(inputValue) => debouncedFetchCategory(inputValue)} // Debounced fetch
                            onChange={(selectedOption) => setValue("category", selectedOption?.value)}
                            isLoading={loading}
                            placeholder="Search for a category"
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.category?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="Number" className="block mb-2">
                            Number
                        </label>

                        <input
                            type="text"
                            className={`${errors.tenderNumber?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("tenderNumber", { required: true })}
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.tenderNumber?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="title" className="block mb-2">
                            Title
                        </label>

                        <input
                            type="text"
                            className={`${errors.title?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("title", { required: true })}
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.title?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="summary" className="block mb-2">
                            Summary
                        </label>

                        <textarea
                            rows={3}
                            className={`${errors.summary?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("summary", { required: true })}
                        ></textarea>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.summary?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2">Tender Document</label>
                        <label
                            htmlFor="tenderFile"
                            className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md cursor-pointer"
                        >
                            <div className="text-slate-500 text-xs text-center font-light">
                                <IconFileText
                                    size={32}
                                    strokeWidth={1.5}
                                    className="mx-auto mb-4"
                                />
                                {tenderFile ? (
                                    <div>{tenderFile}</div>
                                ) : (
                                    <Fragment>
                                        <p>Add your tender document .pdf file here</p>
                                        <p className="text-blue-500 font-medium">Click to browse</p>
                                    </Fragment>
                                )}
                            </div>
                            <input
                                type="file"
                                id="tenderFile"
                                accept=".pdf"
                                className="hidden"
                                {...register("tenderFile")}
                            />
                        </label>

                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.tenderFile?.message?.toString()}
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

                    <div className="mb-2">
                        <label htmlFor="consultationFee" className="block mb-2">
                            Consultation Fee
                        </label>

                        <select
                            className={`${errors.consultationFee?.type === "required" ? "input-error" : "input-normal"}`}
                            {...register("consultationFee", { required: true })}
                        >
                            <option value="200000">200,000</option>
                            <option value="250000">250,000</option>
                            <option value="300000">300,000</option>
                            <option value="350000">350,000</option>
                            <option value="400000">400,000</option>
                            <option value="450000">450,000</option>
                            <option value="500000">500,000</option>
                            <option value="550000">550,000</option>
                            <option value="600000">⁠600,000</option>
                            <option value="650000">650,000</option>
                            <option value="700000">700,000</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.consultationFee?.message?.toString()}
                        </p>
                    </div>
                    <Button
                        type="submit"
                        label="Upload"
                        theme="primary"
                        size="md"
                        loading={uploadTenderMutation.isLoading}
                    />
                </form>
            </Modal>
        </div>
    );
}
