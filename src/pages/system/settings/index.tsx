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
import { updateSettings } from "@/services/settingsService";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { BackupSettings } from "./BackupSettings";
import { IconSettingsCheck } from "@tabler/icons-react";

const settingsSchema = yup.object().shape({
    general: generalSchema,
    payment: paymentSchema,
    sms: smsSchema,
});

// infer type
type TSettingsSchema = yup.InferType<typeof settingsSchema>;


export default function Settings() {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const { settings } = useSettings();

    const { handleSubmit, control, reset, formState: { isDirty, errors } } = useForm({
        resolver: yupResolver(settingsSchema),
        defaultValues: {
            general: {},
            payment: {},
            sms: {},
        },
    });

    // Debugging tool: Logging errors if validation is failing on submit
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error("Form Validation Errors:", errors);

            if(errors.payment) {
                if(errors.payment.aggregator) toast.error(errors.payment.aggregator.message!);
                if(errors.payment.currency) toast.error(errors.payment.currency.message!);
                return;
            }
            if(errors.general) {
                if(errors.general.language) toast.error(errors.general.language.message!);
                return;
            }
            if(errors.sms) {
                if(errors.sms.aggregator) toast.error(errors.sms.aggregator.message!);
                return;
            }
            toast.error("There is an error with your settings form. Please check the console.");
        }
    }, [errors]);

    useEffect(() => {
        if (settings) {
            reset({
                general: settings.general || {},
                payment: settings.payment || {},
                sms: settings.sms || {},
            });
        }
    }, [settings, reset]);

    const updateSettingsMutation = useMutation({
        mutationKey: ["updateSettings"],
        mutationFn: async (data: any) => updateSettings(data),
        onSuccess: (data: any) => {
            toast.success(data.message || "Settings updated successfully");
            setConfirmation("");
            setModalOpen(false);
            window.location.reload();
        },
    });

    // 2. The actual submission logic executed ONLY when form is valid and modal is confirmed
    const onFormSubmit = (data: TSettingsSchema) => {
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
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="w-full ms-auto flex flex-row justify-end">
                <Button
                    theme={isDirty ? "danger" : undefined}
                    onClick={() => setModalOpen(true)}
                    label="Save changes"
                    icon={<IconSettingsCheck />}
                    size="md"
                    type="button" 
                    disabled={!isDirty}
                    loading={updateSettingsMutation.isPending}
                />
            </div>

            <Tabs panels={["General", "SMS", "Payment", "Backup & Reports"]}>
                <GeneralSettings control={control as any} />
                <SMSSettings control={control as any} />
                <PaymentSettings control={control as any} />
                <BackupSettings />
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

                    <input
                        type="text"
                        placeholder="Type 'confirm' to proceed"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={confirmation}
                        onChange={(e) => setConfirmation(e.target.value)}
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            label="Cancel"
                            theme="secondary"
                            size="md"
                            onClick={() => setModalOpen(false)}
                        />

                        {/* 4. Changed type to "submit" so it triggers the form submission */}
                        <Button
                            type="button" 
                            label="Confirm & Save"
                            theme="danger"
                            disabled={updateSettingsMutation.isPending || confirmation !== "confirm"}
                            loading={updateSettingsMutation.isPending}
                            size="md"
                            onClick={handleSubmit(onFormSubmit)}
                        />
                    </div>
                </div>
            </Modal>
        </form>
    );
}