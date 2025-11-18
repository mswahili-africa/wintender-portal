import Button from '@/components/button/Button';
import { getBidders } from '@/services/user';
import { IServiceForm } from '@/types/forms';
import { debounce } from 'lodash';
import Select from 'react-select';
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { number, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBillboards } from '@/hooks/useBillboards';

const schema = object().shape({
    bidderId: string().required("Bidder is required"),
    title: string().required("Title is required"),
    description: string().required("Description is required"),
    consultationFee: number().required("Consultation Fee is required"),

});

export const ServiceAssigningForm = () => {
    const { watch, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<IServiceForm>({
        resolver: yupResolver(schema),
        defaultValues: { id: "", bidderId: "", title: "", description: "", consultationFee: 10000 }
    });


    const { consultationServices, refetch, isLoading } = useBillboards({ page: 1 });


    const serviceAssigningMutation = useMutation({
        mutationFn: async (data: IServiceForm) => {
            console.log(data);
            return data;
        },
        onSuccess: () => {
            reset();
            toast.success("Service Requested");
        },
    });


    const submit = (data: IServiceForm) => {
        serviceAssigningMutation.mutate(data);
    }


    const [bidders, setBidders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    // JCM Debounced function to fetch bidders

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
        <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
            {/* JCM bidder search input */}
            <div className="flex flex-col">
                <div className="mb-2">
                    <label htmlFor="bidder" className="block mb-2">
                        Bidder
                    </label>
                    <Select
                        options={bidders}
                        onInputChange={(inputValue) => debouncedFetchBidders(inputValue)}
                        onChange={(selectedOption) => setValue("bidderId", selectedOption?.value)}
                        isLoading={loading}
                        placeholder="Search for a Bidder"
                    />

                </div>
                <p className="text-xs text-red-500 mt-1 mx-0.5">
                    {errors.bidderId?.message?.toString()}
                </p>
            </div>

            {/* JCM reason */}
            <div className="mb-2">
                <label htmlFor="region" className="block mb-2">
                    Title
                </label>

                <select
                    className={`${errors.title?.type === "required" ? "input-error" : "input-normal"}`}
                    {...register("title", { required: true })}
                >
                    <option value="WALLET_IN">WALLET_IN</option>
                    <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                    <option value="CONSULT_ME">CONSULT_ME</option>
                    <option value="DO_IT_FOR_ME">DO_IT_FOR_ME</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="Phone" className="block mb-2">Description</label>

                <input
                    type="text"
                    placeholder="You  can add MNO or Bank payment reference here"
                    className={`${errors.description?.type === 'required' ? 'input-error' : 'input-normal'}`}
                    {...register('description', { required: true })}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="Phone" className="block mb-2">Consultation Fee</label>

                <input
                    type="number"
                    className={`${errors.consultationFee?.type === 'required' ? 'input-error' : 'input-normal'}`}
                    {...register('consultationFee', { required: true, valueAsNumber: true, min: 10000 })}
                />
            </div>


            <Button
                type="submit"
                label="Request"
                theme="primary"
                size="md"
                loading={serviceAssigningMutation.isPending}
            />

        </form>
    )
}
