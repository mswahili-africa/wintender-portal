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
    const [bidders, setBidders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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

    const fetchBidders = useCallback(async (search = "") => {
        if (!search) {
            setBidders([]);
            return;
        }

        setLoading(true);
        try {
            const allBidders = await getBidders({ page: 0, size: 5, search });
            setBidders(allBidders.content.map(e => ({ value: e.id, label: e.companyName.toUpperCase() })));
        } catch (error) {
            console.error("Failed to fetch Bidders", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedFetchBidders = useCallback(
        debounce((inputValue) => {
            if (inputValue.length >= 3) { // Only fetch if 5 or more characters
                fetchBidders(inputValue);
            } else {
                setBidders([]); // Clear entities if less than 5 characters
            }
        }, 5),
        [fetchBidders]
    );

    return (
        <Modal size="sm" title="Assign Bidder" isOpen={isOpen} onClose={onClose}>
            <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                {/* ✅ Bidder Selection with Debounced Search */}
                <div className="mb-2">
                    <label htmlFor="bidder" className="block mb-2">
                        Bidder
                    </label>
                    <Select
                        options={bidders}
                        onInputChange={(inputValue) => debouncedFetchBidders(inputValue)} // Debounced fetch
                        onChange={(selectedOption) => setValue("bidderId", selectedOption?.value)}
                        isLoading={loading}
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
