import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { ICompanyDocuments } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconFileText, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { mixed, object, string } from "yup";
import { uploadDocument } from "@/services/entities";

// JCM import document from documents json
import documents from "../data/documents.json";

interface IProps {
    onSuccess: () => void;
    initials?: ICompanyDocuments;
}

const schema = object().shape({
    documentFile: mixed().required("Document File is required"),
    documentType: string().required("Document Type is required"),
    documentNumber: string().required("Document number is required"),
});

export default function DocumentUpload({ onSuccess }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [documentFile, setDocumentFile] = useState<string | any>();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: { documentFile: "", documentType: "", documentNumber: "" },
    });

    watch((data, { name, type }) => {
        if (name === "documentFile" && type === "change") {
            setDocumentFile(data.documentFile[0]?.name);
        }
    });

    const uploadDocumentMutation = useMutation({
        mutationFn: (data: FormData) => uploadDocument(data),
        onSuccess: () => {
            reset();
            setDocumentFile(undefined);
            setOpen(false);
            toast.success("Document uploaded successfully");
            onSuccess();
        },
        onError: (error: any) => {
            toast.error("Failed to Document firmware " + error);
        },
    });

    const submit = (data: Record<string, any>) => {
        const formData = new FormData();
        formData.append("file", data.documentFile[0]);
        formData.append("documentType", data.documentType);
        formData.append("documentNumber", data.documentNumber);

        uploadDocumentMutation.mutate(formData);
    };

    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Document"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            <Modal
                size="sm"
                title="Upload Document"
                isOpen={open}
                onClose={(v) => setOpen(v)}
            >
                <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                    <div className="mb-2">
                        <label htmlFor="documentType" className="block mb-2">
                            Type
                        </label>

                        <select
                            className={`${errors.documentType?.type === "required" ? "input-error" : "input-normal"
                                }`}
                            {...register("documentType", { required: true })}
                        >
                             <option value="">Select Document Type</option>

                                {/* JCM pull documents from json */}
                             {
                                documents
                                .sort((a: any, b: any) => a.label.localeCompare(b.label))
                                .map((document: any, index: number) => (
                                    <option key={index} value={document.value}>{document.label}</option>
                                ))
                             }
                            {/* <option value="BANK_STATEMENT">BANK STATEMENT</option>
                            <option value="BRELA_ANNUAL_RETURNS">BRELA ANNUAL RETURNS</option>
                            <option value="BRELA_SEARCH">BRELA SEARCH</option>
                            <option value="CATALOG">CATALOG</option>
                            <option value="CERTIFICATE_OF_INCORPORATION">CERTIFICATE OF INCORPORATION</option>
                            <option value="CODE_OF_CONDUCT">CODE OF CONDUCT</option>
                            <option value="COMPANY_PROFILE">COMPANY PROFILE</option>
                            <option value="CONTRACTOR_REGISTRATION_BOARD">CONTRACTOR REGISTRATION BOARD</option>
                            <option value="EFD_RECEIPT">EFD RECEIPT</option>
                            <option value="EWURA_LSSP_NUMBER">EWURA LSSP NUMBER</option>
                            <option value="FINANCIAL_STATEMENT">FINANCIAL STATEMENT</option>
                            <option value="HSE_POLICY">HSE POLICY</option>
                            <option value="INDEMNITY_COVER">INDEMNITY COVER</option>
                            <option value="ISO">ISO</option>
                            <option value="LICENCE">LICENCE</option>
                            <option value="LOCAL_CONTENT_PLAN">LOCAL CONTENT PLAN</option>
                            <option value="MANUFACTURER_AUTHORIZATION">MANUFACTURER AUTHORIZATION</option>
                            <option value="MEMART">MEMART</option>
                            <option value="NSSF">NSSF</option>
                            <option value="OFFICE_LEASE_AGREEMENT">OFFICE LEASE AGREEMENT</option>
                            <option value="OSHA">OSHA</option>
                            <option value="PROFESSIONAL_BOARD_CERTIFICATE">PROFESSIONAL BOARD CERTIFICATE</option>
                            <option value="TANZANIA_MEDICINE_AND_DEVICES_AUTHORITY">TANZANIA MEDICINE AND DEVICES AUTHORITY</option>
                            <option value="TAX_CLEARANCE">TAX CLEARANCE</option>
                            <option value="TFDA">TFDA</option>
                            <option value="TIN">TIN</option>
                            <option value="VAT">VAT</option>
                            <option value="WCF">WCF</option> */}
                        </select>

                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.documentType?.message?.toString()}
                        </p>
                    </div>


                    <div className="mb-2">
                        <label htmlFor="documentNumber" className="block mb-2">
                            Number/Serial
                        </label>

                        <input
                            type="text"
                            className={`${errors.documentNumber?.type === "required"
                                ? "input-error"
                                : "input-normal"
                                }`}
                            {...register("documentNumber", { required: true })}
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.documentNumber?.message?.toString()}
                        </p>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2">Document</label>
                        <label
                            htmlFor="documentFile"
                            className="label block py-10 bg-slate-50 border border-dashed border-slate-200 rounded-md cursor-pointer"
                        >
                            <div className="text-slate-500 text-xs text-center font-light">
                                <IconFileText
                                    size={32}
                                    strokeWidth={1.5}
                                    className="mx-auto mb-4"
                                />
                                {documentFile ? (
                                    <div>{documentFile}</div>
                                ) : (
                                    <Fragment>
                                        <p>Add your document .pdf file here</p>
                                        <p className="text-green-500 font-medium">Click to browse</p>
                                    </Fragment>
                                )}
                            </div>
                            <input
                                type="file"
                                id="documentFile"
                                accept=".pdf"
                                className="hidden"
                                {...register("documentFile")}
                            />
                        </label>

                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.documentFile?.message?.toString()}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        label="Upload"
                        theme="primary"
                        size="md"
                        loading={uploadDocumentMutation.isLoading}
                    />
                </form>
            </Modal>
        </div>
    );
}
