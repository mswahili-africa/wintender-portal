import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { setCompanyPlan } from "@/services/entities";
import { IAssignBidder, IPlan } from "@/types/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";
import Select from "react-select";
import { getBidders } from "@/services/user";
import { debounce } from "lodash";
import { assignBidder } from "@/services/tenders";
import { useBidders } from "@/hooks/biddersRepository";

interface IProps {
    onSuccess: () => void;
    initials?: IPlan;
    isOpen: boolean;
    onClose: () => void;
    tenderId: string;
}

const schema = object().shape({
    bidderId: string().required("Bidder is required"),
});


export default function DIFMAssignModel({ onSuccess, isOpen, onClose, tenderId }: IProps) {
    // const [bidders, setBidders] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: {
            bidderId: "",
            tenderId: tenderId
        },
    });

    // ✅ Assign Bidder API Call
    const assignBidderMutation = useMutation({
        mutationFn: (data: IAssignBidder) => assignBidder(data),
        onSuccess: () => {
            reset();
            onClose(); // Close the modal when successful
            toast.success("Bidder assigned successfully");
            onSuccess();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Failed to assign bidder";
            toast.error(errorMessage);
        },
    });

    const submit = (data: IAssignBidder) => {
        assignBidderMutation.mutate({ ...data, tenderId });
    };

    const { bidders, isLoading } = useBidders({
        page: 0,
        size: 5,
        column: "companyName",
        search: search

    });

    return (
        <Modal zIndex={50} size="sm" title="Assign Bidder" isOpen={isOpen} onClose={onClose}>
            <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                {/* ✅ Bidder Selection with Debounced Search */}
                <div className="mb-2">
                    <label htmlFor="bidder" className="block mb-2">
                        Bidder
                    </label>
                    <Select
                        options={bidders?.content.map((e) => ({ value: e.id, label: e.companyName.toUpperCase() })) || []}
                        onInputChange={(inputValue) => setSearch(inputValue)} // Debounced fetch
                        onChange={(selectedOption) => setValue("bidderId", selectedOption?.value)}
                        isLoading={isLoading}
                        placeholder="Search for a Bidder"
                    />
                    <p className="text-xs text-red-500 mt-1 mx-0.5">
                        {errors.bidder?.message?.toString()}
                    </p>
                </div>

                {/* ✅ Assign Button */}
                <Button
                    type="submit"
                    label={assignBidderMutation.isLoading ? "Assigning..." : "Assign"}
                    theme="primary"
                    size="md"
                    disabled={assignBidderMutation.isLoading}
                />
            </form>
        </Modal>
    );
}
