import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { setCompanyPlan } from "@/services/entities";
import { IPlan } from "@/types/forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { object, string } from "yup";
import Select from "react-select";
import { getBidders } from "@/services/user";
import { debounce } from "lodash";

interface IProps {
    onSuccess: () => void;
    initials?: IPlan;
}

const schema = object().shape({
    numberOfMonths: string().required("Months is required"),
    maxTenders: string().required("Max Tenders is required")
});

export default function ContractModal({ onSuccess, initials }: IProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [entities, setEntities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [planType, setPlanType] = useState<string>("RETAINER");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: { planType: "", maxTenders: 10, numberOfMonths: 3, amount: 0 },
    });

    const createPlan = useMutation({
        mutationFn: (data: IPlan) => setCompanyPlan(data),
        onSuccess: () => {
            reset();
            setOpen(false);
            toast.success("Plan successfully set");
            onSuccess();
        },
        onError: () => {
            toast.error("Failed to set plan");
        },
    });

    const submit = (data: IPlan) => {
        createPlan.mutate(data);
    };

    const fetchEntities = useCallback(async (search = "") => {
        if (!search) {
            setEntities([]);
            return;
        }

        setLoading(true);
        try {
            const allEntities = await getBidders({ page: 0, size: 5, search });
            setEntities(allEntities.content.map(e => ({ value: e.id, label: e.companyName })));
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

    const handlePlanTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPlan = event.target.value;
        setPlanType(selectedPlan);
        setValue("maxTenders", selectedPlan === "RETAINER" ? 10 : undefined); // Clear maxTenders if CONTRACT
    };

    return (
        <div className="max-w-max">
            <Button
                type="button"
                label="Plan"
                icon={<IconPlus size={18} />}
                theme="primary"
                size="md"
                onClick={() => setOpen(true)}
            />

            <Modal size="sm" title="Create Company Plan" isOpen={open} onClose={(v) => setOpen(v)}>
                <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
                    <div className="mb-2">
                        <label htmlFor="com" className="block mb-2">
                            Bidder
                        </label>
                        <Select
                            options={entities}
                            onInputChange={(inputValue) => debouncedFetchEntities(inputValue)} // Debounced fetch
                            onChange={(selectedOption) => setValue("bidder", selectedOption?.value)}
                            isLoading={loading}
                            className={errors.bidder ? "input-error" : "input-normal"}
                            placeholder="Search for a bidder"
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.bidder?.message?.toString()}
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="planType" className="block mb-2">
                            Plan
                        </label>
                        <select
                            className={errors.planType ? "input-error" : "input-normal"}
                            {...register("planType", { required: true })}
                            onChange={handlePlanTypeChange}
                        >
                            <option value="RETAINER">RETAINER</option>
                            <option value="CONTRACT">CONTRACT</option>
                        </select>
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.planType?.message?.toString()}
                        </p>
                    </div>

                    {planType === "CONTRACT" && (
                        <div className="mb-4">
                            <label htmlFor="maxTenders" className="block mb-2">Tenders</label>
                            <input
                                type="number"
                                className={errors.maxTenders ? "input-error" : "input-normal"}
                                {...register('maxTenders', { required: planType === "CONTRACT" })}
                            />
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.maxTenders?.message?.toString()}
                            </p>
                        </div>
                    )}

                    {planType === "RETAINER" && (
                        <div className="mb-2">
                            <label htmlFor="numberOfMonths" className="block mb-2">
                                Months
                            </label>
                            <select
                                className={errors.numberOfMonths ? "input-error" : "input-normal"}
                                {...register("numberOfMonths", { required: true })}
                            >
                                {[...Array(12).keys()].map(i => (
                                    <option key={i} value={i + 3}>{i + 3}</option>
                                ))}
                            </select>
                            <p className="text-xs text-red-500 mt-1 mx-0.5">
                                {errors.numberOfMonths?.message?.toString()}
                            </p>
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="amount" className="block mb-2">Amount</label>
                        <input
                            type="number"
                            className={errors.amount ? "input-error" : "input-normal"}
                            {...register('amount', { required: true })}
                        />
                        <p className="text-xs text-red-500 mt-1 mx-0.5">
                            {errors.amount?.message?.toString()}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        label={createPlan.isLoading ? "Creating..." : "Create"}
                        theme="primary"
                        size="md"
                        disabled={createPlan.isLoading}
                    />
                </form>
            </Modal>
        </div>
    );
}
