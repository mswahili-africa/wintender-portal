import { IconX, IconShieldCheck, IconInfoCircle, IconArrowUpRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import PriceCard from "./PriceCard";
import { useSubscriptionPlans } from "@/hooks/usePayments";
import { useUserDataContext } from "@/providers/userDataProvider";
import { ISubscriptionPlan } from "@/types";
import Modal from "@/components/Modal";

export default function PricingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const { userData } = useUserDataContext();
  const { t } = useTranslation();
  const { subscriptionPlans, isLoading } = useSubscriptionPlans({});

  // Safely locate current user tier fallback reference context
  const currentPlan = userData?.currentPlanId
    ? subscriptionPlans?.find((p: ISubscriptionPlan) => p.id === userData?.currentPlanId)
    : null;

  return (
    // <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-start overflow-y-auto z-10 p-4 sm:p-6 animate-fadeIn">
    //   <div className="bg-slate-50 rounded-3xl w-full max-w-7xl my-8 md:my-12 shadow-2xl border border-gray-200/60 overflow-hidden relative flex flex-col">
    <Modal size="xxxl" zIndex={60} isOpen={open} onClose={onClose}>

      {/* Dynamic Close Button Action Trigger */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-30 p-2 rounded-full bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-100 transition-all"
        aria-label="Close pricing dashboard"
      >
        <IconX size={18} stroke={2.5} />
      </button>

      {/* Hero Marketing Header Segment */}
      <div className="bg-white border-b border-gray-100 px-6 pt-10 pb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
          {t("subscription-pricing-modal-header")}
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2 font-medium">
          {t("subscription-pricing-modal-sub-header")}
        </p>

        {/* Premium Value Anchor Banner: Displays context when user has an active tier */}
        {userData?.role === "BIDDER" && currentPlan && (
          <div className="mt-6 inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-2.5 text-left shadow-sm max-w-md mx-auto">
            <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0">
              <IconArrowUpRight size={16} stroke={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider leading-none">
                {t("subscription-pricing-modal-current-plan")}
              </p>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {currentPlan?.name}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Layout Container Matrix */}
      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">

        <div className="w-full flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-7xl justify-items-center items-stretch">
            {isLoading ? (
              // Modern Skeleton Loading State Components
              Array(4).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="w-full max-w-sm h-[520px] bg-white border border-gray-100 rounded-3xl p-8 flex flex-col justify-between animate-pulse shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-16 bg-gray-200 rounded-xl w-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full mt-4" />
                </div>
              ))
            ) : !subscriptionPlans || subscriptionPlans.length === 0 ? (
              // Structured Fallback for Empty Configurations
              <div className="col-span-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-gray-200/60 w-full shadow-sm">
                <div className="p-3 bg-gray-50 rounded-full border border-gray-100 text-gray-400 mb-3">
                  <IconInfoCircle size={24} />
                </div>
                <p className="text-sm font-semibold text-gray-600">
                  {t("subscription-pricing-modal-no-plans")}
                </p>
              </div>
            ) : (
              // Functional Premium Price Card Arrays Iteration 
              subscriptionPlans.map((plan: ISubscriptionPlan) => (
                <PriceCard key={plan.id} plan={plan} />
              ))
            )}
          </div>
        </div>

        {/* Direct Conversion Trust Anchors Segment */}
        <div className="mt-6 pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2.5 text-slate-500">
            <IconShieldCheck size={20} className="text-emerald-500 shrink-0" />
            <p className="text-xs font-semibold tracking-wide">
              Secure encrypted payment channels. Subscribe or change plans anytime.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            <span>Mobile Money Pushes</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <span>Wallet Deductions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <span>Instant Setup</span>
          </div>
        </div>

      </div>
    </Modal>
    //   </div>
    // </div>
  );
}