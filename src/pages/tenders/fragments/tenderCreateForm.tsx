import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import useEntities from "@/hooks/useEntities";
import useCategories from "@/hooks/useCategories";
import { createTender } from "@/services/tenders";
import { ITenders } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { mixed, object, string } from "yup";

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
});

export default function TenderUpload({ onSuccess, initials }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [tenderFile, setTenderFile] = useState<string | any>();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: { tenderFile: "", title: "", tenderNumber: "", region: "", summary: "", tenderType: "", category: "", entity: "", openDate: "", closeDate: "" },
    });

    watch((data, { name, type }) => {
        if (name === "tenderFile" && type === "change") {
            setTenderFile(data.tenderFile[0]?.name);
        }
    });

    const openDate = watch("openDate");

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

    const { entities } = useEntities({
        page: 0,
        search: "",
        filter: {},
    });

    const { categories } = useCategories({
        page: 0,
        search: "",
        filter: {},
    });

    const submit = (data: Record<string, any>) => {
        const formData = new FormData();
        formData.append("file", data.tenderFile[0]);
        formData.append("title", data.title);
        formData.append("region", data.region);
        formData.append("tenderNumber", data.tenderNumber);
        formData.append("summary", data.summary);
        formData.append("openDate", data.openDate);
        formData.append("closeDate", data.closeDate);
        formData.append("tenderType", data.tenderType);
        formData.append("category", data.category);
        formData.append("entity", data.entity);

        uploadTenderMutation.mutate(formData);
    };

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
                    <div className="mb-2">
                        <label htmlFor="region" className="block mb-2">
                            Region
                        </label>

                        <select
                            className={`${errors.region?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("region", { required: true })}
                        >
                            <option value="LOCAL">LOCAL</option>
                            <option value="INTERNATIONAL">INTERNATIONAL</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.region?.message?.toString()}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="Entity" className="block mb-2">
                            Entity
                        </label>

                        <select
                            className={`${errors.entity?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("entity", { required: true })}
                        >
                            <option value=""></option>
                            {
                                entities &&
                                entities.content.map((item) => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))}
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.entity?.message?.toString()}
                        </p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tenderType" className="block mb-2">
                            Type
                        </label>

                        <select
                            className={`${errors.tenderType?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("tenderType", { required: true })}
                        >
                            <option value="EXPRESSION_OF_INTEREST">EXPRESSION OF INTEREST (EI)</option>
                            <option value="REQUEST_OF_PROPOSAL">REQUEST OF PROPOSAL (RFP)</option>
                            <option value="REQUEST_FOR_QUOTATION">REQUEST FOR QUOTATION (RFQ)</option>
                            <option value="PRE_QUALIFICATION">PRE QUALIFICATION (PQ)</option>
                            <option value="REQUEST_FOR_BID">REQUEST FOR BID (RFB)</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.tenderType?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="category" className="block mb-2">
                            Category
                        </label>

                        <select
                            className={`${errors.category?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("category", { required: true })}
                        >
                            <option value=""></option>
                            {
                                categories &&
                                categories.content.map((item) => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))}
                        </select>
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
                            type="date"
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
                                type="date"
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
