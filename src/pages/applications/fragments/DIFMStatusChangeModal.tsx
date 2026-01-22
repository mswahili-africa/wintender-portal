import React from 'react'
import { object } from 'yup';
import { useMutation } from '@tanstack/react-query';
import { updateStatus } from '@/services/tenders';
import { toast } from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { number, string } from 'yup';
import usePopup from '@/hooks/usePopup';
import Button from '@/components/button/Button';
import { DIFMStatusOptions } from '@/types/statuses';

type props = {
    setIsStatusModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    application: { id: string } | null; 
    refetch: () => void
    onClose?: () => void;
    onRefetch: () => void;
}

export const DIFMStatusChangeModal = ({ setIsStatusModalOpen, application, refetch, onClose, onRefetch }: props) => {

    const { showConfirmation } = usePopup();


    const schema = object().shape({
        status: string().required("Status is required"),
        quotationAmount: number().required("Quotation is required"),
        comments: string().required("Comment is required"),
    });

    const { register, control, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { status: "", quotationAmount: 0, comments: "" },
    });


    const updateStatusMutation = useMutation({
        mutationFn: ({ id, comments, quotationAmount, status }: { id: string, comments: string, quotationAmount: number, status: string }) => updateStatus(id, comments, quotationAmount, status),
        onSuccess: () => {
            toast.success("Status changed");
            refetch();
            setIsStatusModalOpen(false);
        },
        onError: () => {
            toast.error("Update failed");
        },
    });

    const handlStatusUpdate = () => {
        const { status, comments, quotationAmount } = getValues(); // Extract status and comments from the form

        if (application && status && comments) {
            setIsStatusModalOpen(false);
            showConfirmation({
                theme: "warning", // Adjust the theme to fit status updates
                title: "Change Status",
                message: "Are you sure you want to change the status and add comments?",
                onConfirm: () => {
                    updateStatusMutation.mutate(
                        {
                            id: application.id,
                            comments: comments,
                            quotationAmount: quotationAmount ?? 0,
                            status: status
                        },
                        {
                            onSuccess: () => {
                                onRefetch(); // Trigger refetch for main group data
                            }
                        }
                    );
                },
                onCancel: () => { },
            });
        } else {
            toast.error("Please fill in both status and comments.");
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-content bg-green-100 rounded-lg shadow-lg w-[400px] p-4">
                <h3 className="font-bold text-lg mb-4">Change Status</h3>
                <div className="mb-2">
                    <label htmlFor="status" className="block mb-2">
                        Status
                    </label>

                    <select
                        className={`${errors.status?.type === "required"
                            ? "input-error"
                            : "input-normal"
                            }`}
                        {...register("status", { required: true })}
                    >
                        {
                            DIFMStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))
                        }
                    </select>
                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.status?.message?.toString()}
                    </p>
                </div>
                <div className="mb-2">
                    <label htmlFor="quotation" className="block mb-2">
                        Bid Quotation
                    </label>
                    <Controller
                        name="quotationAmount"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input
                                placeholder="Bid Quotation"
                                className={`${errors.quotationAmount?.type === "required"
                                    ? "input-error"
                                    : "input-normal"
                                    }`}
                                type="text"
                                value={
                                    field.value
                                        ? field.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        : ""
                                }
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    field.onChange(rawValue ? Number(rawValue) : 0);
                                }}
                            />
                        )}
                    />

                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.quotationAmount?.message?.toString()}
                    </p>
                </div>



                <div className="mb-2">
                    <label htmlFor="comments" className="block mb-2">
                        Comments
                    </label>

                    <textarea
                        rows={3}
                        className={`${errors.comments?.type === "required"
                            ? "input-error"
                            : "input-normal"
                            }`}
                        {...register("comments", { required: true })}
                    ></textarea>
                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.comments?.message?.toString()}
                    </p>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button label="Cancel" theme="danger" onClick={() => setIsStatusModalOpen(false)} />
                    <Button label="Save" theme="primary" onClick={handlStatusUpdate} />
                </div>
            </div>
        </div>
    )
}
