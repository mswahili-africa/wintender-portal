import { useState } from 'react';
import { IconCheck, IconArrowRight, IconShieldLock } from '@tabler/icons-react';
import Button from "@/components/button/Button";
import { useTranslation, } from 'react-i18next';
import SubscriptionPaymentModal from './SubscriptionPaymentModal';
import { ISubscriptionPlan } from '@/types';
import { SubscriptionPlanDuration } from '@/types/statuses';


interface PriceCardProps {
    plan: ISubscriptionPlan;

}

const PriceCard = ({ plan }: PriceCardProps) => {
    const [showModal, setShowModal] = useState<{ open: "subscribe" | null; plan: object | null }>(
        { open: null, plan: null }
    );
    const { t } = useTranslation();

    const handleModalClose = () => setShowModal({ open: null, plan: null });


    const durationTime = plan.duration === "MONTHLY" ? "mo" : plan.duration === "QUARTERLY" ? "3mo" : plan.duration === "SEMI_ANNUALLY" ? "6mo" :  "yr";

    return (
        <div className={`relative group w-full max-w-sm p-8 rounded-3xl transition-all duration-500 
      ${plan.popular
                ? 'bg-slate-900 border-2 border-green-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]'
                : 'bg-white border border-slate-200 hover:border-green-400 shadow-xl shadow-slate-200/50'
            }`}>

            {/* Popular Badge */}
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full tracking-widest uppercase shadow-lg">
                    Most Reliable
                </div>
            )}

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {SubscriptionPlanDuration[plan.duration as keyof typeof SubscriptionPlanDuration]}
                    </span>
                    <IconArrowRight size={12} className="text-slate-300" />
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-100 text-slate-600'}`}>
                        NEW
                    </span>
                </div>

                <h3 className={`text-2xl font-black mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                </h3>

                <p className={`text-sm leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.description}
                </p>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-2xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {/* tzs price format */}
                    {Intl.NumberFormat("sw-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(plan.amount)}
                </span>
                <span className="text-slate-400 font-medium">
                    /{durationTime}
                </span>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-14">
                {plan.benefits.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                        <div className={`mt-0.5 rounded-full p-0.5 transition-colors ${plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-100 text-emerald-600'}`}>
                            <IconCheck size={14} stroke={3} />
                        </div>
                        <span className={`text-sm font-medium transition-colors ${plan.popular ? 'text-slate-300 group-hover/item:text-white' : 'text-slate-600 group-hover/item:text-slate-900'}`}>
                            {feature.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            {/* <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]
        ${popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-green-900 hover:bg-green-800 text-white shadow-lg shadow-slate-900/10'
                }`}>
                Upgrade to {name}
                <IconShieldLock size={18} />
            </button> */}
            <div className="w-full flex items-center justify-center absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                    type="button"
                    label={t("subscription-card-button-label", { subscriptionPlan: plan.name })}
                    icon={<IconShieldLock size={18} />}
                    size="lg"
                    iconPosition="right"
                    theme="primary"
                    onClick={() => setShowModal({ open: "subscribe", plan: null })}
                // className="w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]"
                />
            </div>


            {/* modals */}
            <SubscriptionPaymentModal open={showModal.open === "subscribe"} onClose={handleModalClose} plan={plan} />
        </div>
    );
};

export default PriceCard;