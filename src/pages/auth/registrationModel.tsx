import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { bidderRegister } from "@/services/auth";
import { IBidderRegisterForm } from "@/types/forms";
import TextInput from "@/components/widgets/forms/TextInput";
import * as yup from "yup";

interface IProps {
    onSuccess: () => void;
    initials?: any;
    isOpen: boolean;
    onClose: () => void;
}

const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    confirmPhoneNumber: yup
        .string()
        .oneOf([yup.ref("phoneNumber")], "Phone numbers do not match") // Remove 'null'
        .required("Phone number confirmation is required"),
    tin: yup.string().required("TIN is required"),
    companyName: yup.string().required("Company name is required"),
});

export default function RegistrationModel({ onSuccess, initials, isOpen, onClose }: IProps) {

    const { showMessage, closePopup } = usePopup();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const createMutation = useMutation({
        mutationFn: (data: IBidderRegisterForm) => bidderRegister(data),
        onSuccess: (res) => {
            onClose(); 
            showMessage({
                title: "Registration successful",
                message: "Temporary Password has been sent to your Email and SMS, You can change your your password any time you wish through profile.",
                theme: "success",
            });
            setTimeout(() => {closePopup(); reset();}, 10000)

            onSuccess();
        },
        onError: (error: any) => {
            toast.error("Failed to register");
        },
    });

    const submit = (data: IBidderRegisterForm) => {
        createMutation.mutate(data);
    };

    return (
        <Modal
            size="md"
            title="Registration"
            isOpen={isOpen}
            onClose={onClose}
        >
            <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <TextInput
                        type="text"
                        label="First name"
                        placeholder="e.g., John"
                        hasError={!!errors.firstName}
                        error={errors.firstName?.message}
                        register={register("firstName")}
                    />
                    <TextInput
                        type="text"
                        label="Last name"
                        placeholder="e.g., Trevor"
                        hasError={!!errors.lastName}
                        error={errors.lastName?.message}
                        register={register("lastName")}
                    />
                    <TextInput
                        type="text"
                        label="Phone number"
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.phoneNumber}
                        error={errors.phoneNumber?.message}
                        register={register("phoneNumber")}
                    />

                    <TextInput
                        type="text"
                        label="Confirm Phone Number"
                        placeholder="e.g., 0710101010"
                        hasError={!!errors.confirmPhoneNumber}
                        error={errors.confirmPhoneNumber?.message}
                        register={register("confirmPhoneNumber")}
                    />
                    <TextInput
                        type="email"
                        label="Email"
                        placeholder="e.g., info@mail.com"
                        hasError={!!errors.email}
                        error={errors.email?.message}
                        register={register("email")}
                    />
                </div>
                <span>Company Information</span>
                <hr></hr>
                <br></br>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <TextInput
                        type="text"
                        label="Company Name"
                        placeholder="e.g., Mswahili Limited"
                        hasError={!!errors.companyName}
                        error={errors.companyName?.message}
                        register={register("companyName")}
                    />
                    <TextInput
                        type="text"
                        label="TIN"
                        placeholder="278-292-192"
                        hasError={!!errors.tin}
                        error={errors.tin?.message}
                        register={register("tin")}
                    />
                </div>
                <Button
                    type="submit"
                    label="Register"
                    theme="primary"
                    size="md"
                    loading={createMutation.isLoading} // Show loading state during mutation
                />
            </form>
        </Modal>
    );
}
