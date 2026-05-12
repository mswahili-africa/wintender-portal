import { IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import PriceCard from "./PriceCard";

export default function PricingModal({open, onClose, }: { open: boolean; onClose: () => void; }) {
    const { t } = useTranslation();


    
    if(!open) return null

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
                            <PriceCard name="MWANZO" predecessor="ALPHA" description="Lorem ipsum dolor" price={"20000"} features={["Feature 1", "Feature 2", "Feature 3"]} />
                            <PriceCard name="OMBA" predecessor="APPLY" description="Lorem ipsum dolor" price={"60000"} features={["Feature 1", "Feature 2", "Feature 3"]} />
                            <PriceCard name="SHINDA" predecessor="WIN" description="Lorem ipsum dolor" price={"120000"} features={["Feature 1", "Feature 2", "Feature 3"]} />
                            <PriceCard name="TIMIZA" isPopular predecessor="EXECUTE" description="Lorem ipsum dolor" price={"240000"} features={["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]} />
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


