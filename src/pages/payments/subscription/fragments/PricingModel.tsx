import { IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import PriceCard from "./PriceCard";
import { useSubscriptionPlans } from "@/hooks/usePayments";


export default function PricingModal({ open, onClose, }: { open: boolean; onClose: () => void; }) {
    if (!open) return null

    const { t } = useTranslation();

    const { subscriptionPlans, isLoading } = useSubscriptionPlans({});


    return (
        <div className="fixed inset-0 bg-black overflow-y-auto bg-opacity-50 flex justify-center z-50">
            <div className="bg-white rounded-lg my-10 h-fit p-6 w-[90%] sm:w-[80%] relative">
                <div className="flex flex-col ">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold col-span-full text-gray-800">{t("subscription-pricing-modal-header")}</h3>
                        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 absolute t0p-3 right-5">
                            <IconX className="text-red-600" size={22} />
                        </button>
                    </div>
                    <div>
                        <div className="text-green-600 font-bold text-lg mb-2 mt-5">{t("subscription-pricing-modal-sub-header")}</div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-5">
                            {
                                isLoading ?
                                    Array(4).fill(0).map((_, i) => (
                                        <div key={i} className="w-full h-96 bg-gray-300 rounded-3xl animate-pulse ">

                                        </div>
                                    ))
                                    :
                                    subscriptionPlans?.length == 0 ? 
                                    <div className="col-span-full text-center h-40 w-full">{t("subscription-pricing-modal-no-plans")}</div> 
                                    : subscriptionPlans?.map((plan) =>
                                        <PriceCard plan={plan} />
                                    )
                                    
                            }
                        </div>



                        {/* Total Amount */}
                        {/* <div className="mt-4 text-center font-semibold">
                            {t("subscription-modal-total", { amount: new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS" }).format(10000 * paymentDetails.period) })}
                        </div> */}

                    </div>
                </div>
            </div>
        </div>
    );
}


