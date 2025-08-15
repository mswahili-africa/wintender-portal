import Tabs from "@/components/widgets/Tabs";
import { SMSSettings } from "./SMSSettings";
import { PaymentSettings } from "./PaymentSettings";
import { GeneralSettings } from "./GeneralSettings";
import useSettings from "@/hooks/useSettings";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Button from "@/components/button/Button";
import { paymentSchema, smsSchema, generalSchema } from "./fragments/schemas";
import { useMutation } from "@tanstack/react-query";
import { updateSettings } from "@/services/settings";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { set } from "lodash";

const settingsSchema = yup.object().shape({
    general: generalSchema,
    payment: paymentSchema,
    sms: smsSchema,
});

export default function Settings() {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const { settings } = useSettings();


    const { handleSubmit, control, reset,formState } = useForm({
        resolver: yupResolver(settingsSchema),
        defaultValues: {
            general:  {},
            payment: {},
            sms:  {},
        },
    });

    useEffect(() => {
        if (settings) {
            reset({
                general: settings.general || {},
                payment: settings.payment || {},
                sms: settings.sms || {},
            });
        }
    }, [settings, reset]);

    // Handle form submission
    const updateSettingsMutation = useMutation({
        mutationKey: ["updateSettings"],
        mutationFn: async (data: any) => updateSettings(data),
        onSuccess: (data: any) => {
            toast.success(data.message || "Settings updated successfully");
            setConfirmation("");
            setModalOpen(false);
            console.log("Settings updated successfully");
        },
    });

    return (
        <form>
            <div className="w-full ms-auto flex flex-row justify-end">
                {
                     !updateSettingsMutation.isPending ? (
                        <button className={`${formState.isDirty ? "bg-red-500 text-white" : "bg-gray-200 text-black"} px-4 py-2 rounded text-sm`} onClick={() => setModalOpen(true)} type="button" disabled={!formState.isDirty}>Save changes</button>
                    ) : null
                }
            </div>

            <Tabs panels={["General", "SMS", "Payment"]}>
                <GeneralSettings control={control} />
                <SMSSettings control={control} />
                <PaymentSettings control={control} />
            </Tabs>


            <Modal
                closeIcon={true}
                isOpen={modalOpen}
                size={"md"}
                onClose={() => { setModalOpen(false); setConfirmation(""); }}
            >
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">Confirm Settings Update</h2>
                    <p className="text-sm text-gray-600">
                        This action will update your system settings.
                        To proceed, please type <strong>"confirm"</strong> below.
                    </p>

                    {/* Confirmation input */}
                    <input
                        type="text"
                        placeholder="Type 'confirm' to proceed"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                    />

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            label="Cancel"
                            theme="secondary"
                            size="md"
                            onClick={() => setModalOpen(false)}
                        />

                        <Button
                            type="button"
                            label="Confirm & Save"
                            theme="danger"
                            disabled={updateSettingsMutation.isPending}
                            loading={updateSettingsMutation.isPending}
                            size="md"
                            onClick={() => {
                                handleSubmit((data) => {
                                    if (confirmation !== "confirm") {
                                        toast.error("You must type 'confirm' to proceed");
                                        return;
                                    }
                                    const formData = {
                                        general: data.general,
                                        payment: data.payment,
                                        sms: data.sms,
                                    };
                                    updateSettingsMutation.mutate(formData);
                                    setModalOpen(false);
                                })();
                            }}
                        />
                    </div>
                </div>
            </Modal>

        </form>
    )
}