import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconCheck, IconArrowRight, IconShieldLock, IconCrown } from '@tabler/icons-react';

import Button from "@/components/button/Button";
import SubscriptionPaymentModal from './SubscriptionPaymentModal';
import { ISubscriptionPlan } from '@/types';
import { SubscriptionPlanDuration } from '@/types/statuses';
import { useUserDataContext } from '@/providers/userDataProvider';

interface PriceCardProps {
  plan: ISubscriptionPlan;
}

const PriceCard = ({ plan }: PriceCardProps) => {
  const { t } = useTranslation();
  const { userData } = useUserDataContext();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Parse duration strings for formatting consistency
  const durationTime = 
    plan.duration === "MONTHLY" ? "mo" : 
    plan.duration === "QUARTERLY" ? "3mo" : 
    plan.duration === "SEMI_ANNUALLY" ? "6mo" : "yr";

  // Validate active membership constraints
  const isCurrentPlan =
    userData?.currentPlanId != null &&
    plan.id === userData?.currentPlanId &&
    (userData?.subscription ?? 0) >= 1 &&
    userData?.role === "BIDDER";

  const plansOrderedList = ["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY"];

  let description ;
  if(plan.duration === SubscriptionPlanDuration.MONTHLY) {
    description = "ALPHA";
  } else if (plan.duration === SubscriptionPlanDuration.QUARTERLY) {
    description ='APPLY';
  } else if (plan.duration === SubscriptionPlanDuration.SEMI_ANNUALLY) {
    description = 'WIN';
  } else {
    description = 'EXECUTE';
  }
  
  // Find current active index based on the user's active plan duration token, not the ID
  const currentUserPlanDuration = userData?.currentPlanId && plan.id === userData?.currentPlanId ? plan.duration : ""; 
  const currentPlanIndex = userData?.currentPlanId ? plansOrderedList.indexOf(currentUserPlanDuration as string) : -1;
  const targetPlanIndex = plansOrderedList.indexOf(plan.duration.toString());
  
  // A plan is smaller if the user has an active subscription and the target rank is lower
  const isSmallerPlan = currentPlanIndex !== -1 && targetPlanIndex < currentPlanIndex;

  // PREMIUM COMPUTATION: Verify if this plan is the highest configuration element in the tier array list
  const isPremiumPlan = targetPlanIndex === plansOrderedList.length - 1;

  // Consolidated CSS Dynamic Style Themes
  let cardStyleTheme = "bg-white border border-slate-200 text-slate-800 hover:border-emerald-500/50 shadow-slate-200/40 shadow-xl";
  
  if (isPremiumPlan) {
    cardStyleTheme = "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_0_50px_-12px_rgba(99,102,241,0.35)] border border-indigo-500/40";
  } else if (plan.popular) {
    cardStyleTheme = "bg-slate-900 text-white shadow-xl shadow-emerald-950/20 border-2 border-emerald-500";
  }

  // Adjust borders to prioritize active indicators safely without layout shifting
  if (isCurrentPlan) {
    cardStyleTheme += " border-2 border-amber-500";
  }

  return (
    <div 
      className={`relative flex flex-col justify-between w-full max-w-sm p-8 rounded-3xl transition-all duration-300 min-h-[530px] ${cardStyleTheme}`}
    >
      {/* Smaller Plan Downgrade Protection Mask */}
      {isSmallerPlan && (
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] rounded-3xl z-20 flex items-center justify-center p-6 text-center" />
      )}

      {/* Conditional Badge Rendering Logic */}
      {isPremiumPlan ? (
        <div className="absolute z-20 -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-black rounded-full tracking-widest uppercase shadow-lg shadow-indigo-500/20 whitespace-nowrap flex items-center gap-1">
          <IconCrown size={12} className="text-amber-300 fill-amber-300" />
          <span>Ultimate Premium</span>
        </div>
      ) : plan.popular ? (
        <div className="absolute z-20 -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black rounded-full tracking-widest uppercase shadow-md whitespace-nowrap">
          Most Popular Tier
        </div>
      ) : null}

      {isCurrentPlan && (
        <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm animate-pulse z-10">
          Active Plan
        </div>
      )}

      {/* Main Structural Body */}
      <div className="space-y-6">
        {/* Card Header Content */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isPremiumPlan ? 'text-indigo-300' : 'text-slate-400'}`}>
              {SubscriptionPlanDuration[plan.duration as keyof typeof SubscriptionPlanDuration] || plan.duration}
            </span>
            <IconArrowRight size={12} className={isPremiumPlan ? "text-indigo-500" : "text-slate-300"} />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isPremiumPlan ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
              plan.popular ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-600'
            }`}>
              {isPremiumPlan ? "BEST VALUE" : "PROMO"}
            </span>
          </div>

          <h3 className={`text-2xl font-black tracking-tight ${isPremiumPlan ? 'bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent' : ''}`}>
            {plan.name}
          </h3>

          <p className={`text-xs leading-relaxed mt-2 ${isPremiumPlan ? 'text-slate-400' : plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
            {description}
          </p>
        </div>

        {/* Pricing Segment */}
        <div className={`flex items-baseline gap-1 py-2 border-y border-dashed ${isPremiumPlan ? 'border-indigo-500/20' : 'border-slate-200/20'}`}>
          <span className="text-2xl font-extrabold tracking-tight">
            {Intl.NumberFormat("sw-TZ", { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(plan.amount)}
          </span>
          <span className="text-xs text-slate-400 font-medium font-mono">
            /{durationTime}
          </span>
        </div>

        {/* Dynamic Benefits Feature Node Maps */}
        <div className="space-y-3 pt-2">
          {plan.benefits?.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 group/item">
              <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                isPremiumPlan ? 'bg-indigo-500/20 text-indigo-400' :
                plan.popular ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <IconCheck size={12} stroke={3} />
              </div>
              <span className={`text-xs font-medium transition-colors ${
                isPremiumPlan ? 'text-slate-300 group-hover/item:text-white' :
                plan.popular ? 'text-slate-300 group-hover/item:text-white' : 'text-slate-600 group-hover/item:text-slate-900'
              }`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Button Module Footer Wrapper */}
      <div className="pt-8 w-full flex justify-center">
        <Button
          type="button"
          label={isCurrentPlan ? "Active Membership" : userData?.subscription == null || userData?.subscription <=0 ? t("subscription-card-button-label", { subscriptionPlan: plan.name }): !isSmallerPlan && !isCurrentPlan ? t("subscription-card-button-label-upgrade", { subscriptionPlan: plan.name }) : t("subscription-card-button-label", { subscriptionPlan: plan.name })}
          icon={<IconShieldLock size={16} />}
          size="lg"
          iconPosition="right"
          theme={isPremiumPlan ? "primary" : plan.popular ? "success" : "primary"}
          disabled={isCurrentPlan || isSmallerPlan}
          onClick={() => setIsPaymentOpen(true)}
          className={`w-full justify-center text-sm font-bold tracking-wide py-3 rounded-xl transition-all shadow-sm ${
            isPremiumPlan && !isCurrentPlan && !isSmallerPlan
              ? "!bg-gradient-to-r !from-indigo-600 !via-purple-600 !to-pink-600 hover:opacity-95 text-white border-0 transform hover:scale-[1.01]"
              : ""
          }`}
        />
      </div>

      {/* Subscription Checkout Modal Handler */}
      <SubscriptionPaymentModal 
        open={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        plan={plan} 
      />
    </div>
  );
};

export default PriceCard;