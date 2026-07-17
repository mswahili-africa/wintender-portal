import Button from "@/components/button/Button";
import Modal from "@/components/widgets/Modal";
import { ISummaryReport } from "@/types";
import { IconAlertTriangle, IconLock, IconPhoneCall, IconChevronRight } from "@tabler/icons-react";

interface IProps {
    onSuccess: () => void;
    isOpen: boolean;
    onClose: () => void;
}



export default function RenewSubscriptionModal({ onSuccess, isOpen, onClose }: IProps) {
  // Graceful stats parsing safely contained
  let stats: ISummaryReport | null = null;
  try {
    const statsString = localStorage.getItem("stats");
    if (statsString) {
      stats = JSON.parse(statsString);
    }
  } catch (error) {
    console.error("Failed to parse billing stats", error);
  }

  if (!isOpen) return null;

  const openTenders = stats?.tenders?.open ?? 0;
  const govTenders = stats?.tenders?.region?.government ?? 0;
  const privateTenders = stats?.tenders?.region?.private ?? 0;
  const intlTenders = stats?.tenders?.region?.international ?? 0;

  // Build a dynamic array of categories that only includes those with a value greater than 0
  const activeOpportunities = [
    { label: "Total Opened Tenders", count: openTenders },
    { label: "Government Tenders", count: govTenders },
    { label: "Private Sector Contracts", count: privateTenders },
    { label: "International Opportunities", count: intlTenders },
  ].filter(item => item.count && item.count > 0); // Excludes 0, undefined, or null

  return (
    <Modal 
      zIndex={50} 
      size="sm" 
      title="" // Overriding the title slot inside the body for custom dramatic styling
      isOpen={isOpen} 
      onClose={onClose}
    >
      <div className="space-y-6 pt-2 pb-4">
        
        {/* DRAMATIC HEADER & WARNING ICON */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center animate-bounce shadow-sm">
            <IconAlertTriangle size={28} className="stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
              Subscription Expired
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Your connection to the procurement pipeline is temporarily suspended.
            </p>
          </div>
        </div>

        {/* HIGH-STAKES STATS: WHAT IS ON THE LINE */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden shadow-xl border border-slate-800">
          {/* Subtle grid background matrix overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                Live Loss Summary
              </span>
              <span className="text-[10px] font-mono text-slate-400">Wintender Real-Time Feed</span>
            </div>

            {activeOpportunities.length > 0 ? (
              <>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  While your account is inactive, you are actively missing bidding windows on high-value contracts:
                </p>

                {/* Locked Data Tracks (Filtered) */}
                <div className="space-y-2.5">
                  {activeOpportunities.map((opportunity) => (
                    <div 
                      key={opportunity.label} 
                      className="flex justify-between items-center text-xs p-2 bg-white/5 rounded-lg border border-white/5"
                    >
                      <span className="font-semibold text-slate-300">{opportunity.label}</span>
                      <span className="font-mono font-black text-red-400 flex items-center gap-1.5">
                        {opportunity.count} <IconLock size={12} className="text-red-400" />
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                New procurement opportunities are opening up across all sectors right now.
              </p>
            )}
          </div>
        </div>

        {/* SUPPORT / ASSISTANCE CARD */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-100 rounded-lg text-slate-500">
              <IconPhoneCall size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Need Immediate Help?</p>
              <p className="text-[10px] text-slate-400 font-medium">Get assistance processing your payment</p>
            </div>
          </div>
          <a href="tel:0747098558" className="font-mono font-bold text-indigo-600 hover:underline">
            0747 098 558
          </a>
        </div>

        {/* ACTION BUTTON FOOTER */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-slate-500 hover:bg-zinc-50 transition-colors"
          >
            I&apos;ll Risk It
          </button>
          
          <button
            onClick={onSuccess}
            className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white text-xs font-black shadow-lg shadow-red-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            Renew Now & Unlock Tenders
            <IconChevronRight size={14} className="stroke-[3]" />
          </button>
        </div>

      </div>
    </Modal>
  );
}
