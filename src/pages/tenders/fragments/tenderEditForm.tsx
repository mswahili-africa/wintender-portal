import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { getEntities } from "@/services/entities";
import { getCategories, updateTender } from "@/services/tenders";
import { ITenders } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { number, object, string } from "yup";
import Select from "react-select";
import { debounce } from "lodash";
import { TextEditor } from "@/components/editor/TextEditor";
import { useUserDataContext } from "@/providers/userDataProvider";

interface IProps {
    onSuccess: () => void;
    initials?: ITenders;
    onClose: () => void;
}

const schema = object().shape({
    title: string().required("Title is required"),
    tenderNumber: string().required("Tender number is required"),
    region: string().required("Region is required"),
    summary: string().required("Summary is required"),
    tenderType: string().required("Type is required"),
    // categoryId: string().required("Category is required"),
    // entityId: string().required("Entity is required"),
    openDate: string().required("Open Date is required"),
    closeDate: string().required("Close Date is required"),
});

export default function TenderEdit({ onSuccess, initials, onClose }: IProps) {

    const [open, setOpen] = useState<boolean>(true);
    const [tenderFile, setTenderFile] = useState<string | any>();
    const [categories, setCategories] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";


    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        setValue, // Added for setting values programmatically
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: {
            tenderFile: "",
            title: initials?.title,
            tenderNumber: initials?.tenderNumber,
            region: initials?.region,
            summary: initials?.summary,
            tenderType: initials?.tenderType,
            categoryId: initials?.categoryId,
            entityId: initials?.entityId,
            openDate: initials?.openDate,
            closeDate: initials?.closeDate,
            applicationFee: initials?.applicationFee,
            consultationFee: initials?.consultationFee,
        },
    });

    useEffect(() => {
        if (initials) {
            setValue("title", initials.title);
            setValue("tenderNumber", initials.tenderNumber);
            setValue("region", initials.region);
            setValue("summary", initials.summary);
            setValue("tenderType", initials.tenderType);
            setValue("categoryId", initials.categoryId);
            setValue("entityId", initials.entityId);
            setValue("applicationFee", initials.applicationFee);
            setValue("consultationFee", initials.consultationFee);

            // Convert milliseconds to datetime-local format (yyyy-MM-ddThh:mm)
            const formatDateForInput = (date: number) => {
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                const hours = String(d.getHours()).padStart(2, "0");
                const minutes = String(d.getMinutes()).padStart(2, "0");
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };

            // Set formatted dates for input (using datetime-local format)
            setValue("openDate", initials.openDate ? formatDateForInput(initials.openDate) : "");
            setValue("closeDate", initials.closeDate ? formatDateForInput(initials.closeDate) : "");

            // Fetch and set selected category
            getCategories({ page: 0, size: 1, search: initials.categoryId }).then((res) => {
                const category = res.content.find(cat => cat.id === initials.categoryId);
                if (category) {
                    setCategories(prev => [...prev, { value: category.id, label: category.name.toUpperCase() }]);
                    setValue("categoryId", { value: category.id, label: category.name.toUpperCase() });
                }
            });

            // Fetch and set selected entity
            getEntities({ page: 0, size: 1, search: initials.entityId }).then((res) => {
                const entity = res.content.find(ent => ent.id === initials.entityId);
                if (entity) {
                    setEntities(prev => [...prev, { value: entity.id, label: entity.name.toUpperCase() }]);
                    setValue("entityId", { value: entity.id, label: entity.name.toUpperCase() });
                }
            });
        }
    }, [initials, setValue]);

    // Watch for file changes
    watch((data, { name, type }) => {
        if (name === "tenderFile" && type === "change") {
            setTenderFile(data.tenderFile[0]?.name);
        }
    });

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

    // Handle form submission
    const submit = (data: Record<string, any>) => {
        const formData = new FormData();
        if (data.tenderFile[0] !== undefined) {
            formData.append("file", data.tenderFile[0]);
        }
        formData.append("title", data.title);
        formData.append("region", data.region);
        formData.append("tenderNumber", data.tenderNumber);
        formData.append("summary", data.summary);
        formData.append("openDate", data.openDate);
        formData.append("closeDate", data.closeDate);
        formData.append("tenderGroup", "PUBLIC");
        formData.append("tenderType", data.tenderType);
        formData.append("categoryId", data.categoryId?.value || "");
        formData.append(
            "entityId",
            userRole === "PROCUREMENT_ENTITY" ?
                userData?.company as string
                : data.entityId?.value
        );
        formData.append("applicationFee", data.applicationFee)
        formData.append("consultationFee", data.consultationFee)

        updateTenderMutation.mutate(formData);
    };

    // Use mutation for uploading tender
    const updateTenderMutation = useMutation({
        mutationFn: (data: FormData) => updateTender(initials?.id ?? "", data),
        onSuccess: () => {
            reset();
            setTenderFile(undefined);
            setOpen(false);
            toast.success("Tender Updated successfully");
            onSuccess();
        },
        onError: (error: any) => {
            toast.error("Failed to update tender " + error);
        },
    });

    const openDate = watch("openDate");

    return (
        <div className="max-w-max">

            <Modal
                size="md"
                title="Edit Tender"
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    onClose(); // Call the parent handler when closing the modal
                }}
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
                    {(userRole !== "PROCUREMENT_ENTITY") && (
                        <div className="mb-2">
                            <label htmlFor="com" className="block mb-2">
                                Entity
                            </label>
                            <Select
                                options={entities}
                                value={watch("entityId") || null}   // expects object
                                onInputChange={(inputValue) => debouncedFetchEntities(inputValue)}
                                onChange={(selectedOption) => setValue("entityId", selectedOption)} // store object
                                isLoading={loading}
                                placeholder="Search for an entity"
                            />
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.bidder?.message?.toString()}
                            </p>
                        </div>
                    )}

                    {/* Category with search */}
                    <div className="mb-2">
                        <label htmlFor="category" className="block mb-2">
                            Category
                        </label>


                        <Select
                            options={categories}
                            value={watch("categoryId") || null} // expects object
                            onInputChange={(inputValue) => debouncedFetchCategory(inputValue)}
                            onChange={(selectedOption) => setValue("categoryId", selectedOption)} // store object
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

                        <TextEditor name="summary" control={control} />

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
                            id="openDate"
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
                                id="closeDate"
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
                    <Button
                        type="submit"
                        label="Update"
                        theme="primary"
                        size="md"
                        loading={updateTenderMutation.isPending}
                    />
                </form>
            </Modal>
        </div>
    );
}
