import {
  IconUsers,
  IconFileSpreadsheet,
  IconWallet,
  IconCoin,
  IconBuildingStore,
  IconGitPullRequest,
  IconMessageDots,
  IconAlertTriangle,
  IconInfoCircle,
  IconCircleCheck,
  IconCircleX,
  IconListLetters,
  IconBuilding,
  IconArrowRight,
  IconBrandWhatsapp,
  IconMail,
  IconFolderOpen,
  IconFiles
} from "@tabler/icons-react";
import { useUserDataContext } from "@/providers/userDataProvider";
import { t } from "i18next";
import { RatingDisplay } from "../bidders/fragments/ratingDisplay";
import Tooltip from "@/components/tooltip/Tooltip";
import { Link } from "react-router-dom";
import { useBillboards } from "@/hooks/useBillboards";
import { useState } from "react";
import BillboardViewModal from "./fragments/BillboardViewModal";
import { IConsultation } from "@/types/forms";
import { useSummary } from "@/hooks/useSystemDetails";
import Skeleton from "react-loading-skeleton";
import { IconGraph } from "@tabler/icons-react";
import StatGroupCard from "./fragments/StatGroupCard";



export default function Dashboard() {
  const { userData } = useUserDataContext();
  const userRole = userData?.role || "BIDDER";
  const { consultationServices } = useBillboards({ page: 1 });
  const { summary, isLoading } = useSummary();

  const [handleModal, setHandleModal] = useState<{ type: "viewBillboard" | "sendBulk" | "", object: any }>(
    { type: "", object: null }
  );

  const handleCloseModal = () => {
    setHandleModal({ type: "", object: null });
  };

  const stats = summary?.statistics;

  // Save tender region stats to local storage
  if (stats) {
    localStorage.removeItem("stats");
    localStorage.setItem("stats", JSON.stringify(stats));
  }


  // loading
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="bg-white shadow-md p-4 sm:p-6 rounded-lg">
          <Skeleton width={32} height={32} circle />
          <h3 className="text-base font-bold mt-4"><Skeleton width={150} /></h3>
          <p className="text-gray-600 text-sm"><Skeleton width={100} /></p>
        </div>
      ))}
    </div>
  );

  const SkeletonBillboardCard = () => (
    <div className="animate-pulse bg-green-50 shadow-md rounded-xl w-full h-32 sm:h-40 md:h-48 lg:h-56">
      <div className="flex justify-between">
        <div className="flex flex-col p-4 sm:p-5 gap-2 w-full">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
  if (isLoading) {
    return (
      <div className="p-2 min-h-screen flex flex-col">
        <div className="flex justify-between">
          <div className="flex flex-col p-4 gap-2 w-full sm:w-1/2 mb-5">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="flex p-4 gap-2 w-full sm:w-1/2 justify-end">
            <div className="h-6 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        <div className="flex flex-row gap-4 mb-5">
          {Array(3).fill(0).map((_, i) => (
            <SkeletonBillboardCard key={i} />
          ))}
        </div>
        <SkeletonLoader />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs font-medium">
        No platform statistical data payload received.
      </div>
    );
  }

  const Billboards = () => (
    <>
      <h2 className="text-xl mb-4">{t("dashboard-billboards-title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {consultationServices?.map((board, index) => {
          // Array of distinct dashboard gradients to rotate through cards natively
          const gradients = [
            "from-indigo-600 to-blue-600 border-indigo-500/30",
            "from-emerald-600 to-teal-600 border-emerald-500/30",
            "from-violet-600 to-purple-600 border-violet-500/30",
            "from-blue-600 to-cyan-600 border-blue-500/30"
          ];
          const currentGradient = gradients[index % gradients.length];

          return (
            <div
              key={board.id}
              className={`group bg-gradient-to-br ${currentGradient} border text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative overflow-hidden`}
              onClick={() => {
                setHandleModal({ type: "viewBillboard", object: board });
              }}
            >
              {/* Subtle decorative vector background element */}
              <div className="absolute -right-6 -bottom-6 text-white/5 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 pointer-events-none">
                <IconGitPullRequest size={120} />
              </div>

              {/* Top Header Row */}
              <div className="flex items-start justify-between gap-2 relative z-[5]">
                <div className="p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white shrink-0">
                  <IconGitPullRequest size={18} />
                </div>
                {/* <span className="text-[10px] uppercase font-mono font-bold bg-white/20 text-white/90 px-2 py-0.5 rounded-md backdrop-blur-sm">
                TRACK #{board.id}
              </span> */}
              </div>

              {/* Title Content Block */}
              <div className="space-y-1 relative z-[5]">
                <h5 className="text-md font-extrabold text-white tracking-tight line-clamp-2 leading-snug">
                  {board.title}
                </h5>
                {board.message && (
                  <p className="text-[11px] font-medium text-white/75 line-clamp-2 leading-relaxed">
                    {board.message.replace(/<[^>]*>/g, '').substring(0, 65)}...
                  </p>
                )}
              </div>

              {/* Card Footer Call-to-Action */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-[11px] font-bold text-white/80 group-hover:text-white transition-colors relative z-[5]">
                <span>Request Consultation</span>
                <IconArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </>

  );

  // Parse total SMS balance to evaluate low-balance warnings safely
  const onFonMediaBalance = parseFloat(stats.messageBalance.onfonMedia || "0");
  const onSMSBalance = parseFloat(stats.messageBalance.onSMS || "0");
  const nextSMSBalance = parseFloat(stats.messageBalance.nextSMS || "0");
  const isSmsLow = nextSMSBalance < 100 ||onFonMediaBalance < 100 || onSMSBalance < 100;

  return (
    <div className="pb-6 mx-auto text-slate-800 antialiased selection:bg-emerald-100 space-y-8">

      {/* HEADER META ROW */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-200/60 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Live Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Wintender 360° Control Matrix
          </h1>
          {
            !["BIDDER", "PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) &&

            <p className="text-xs text-slate-500 mt-0.5">
              System Status Code: <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded font-bold text-slate-700">{summary.code}</span>
            </p>
          }
          <div className="text-xl font-[200]">{t("dashboard-welcome", { name: (userData?.companyName) })}</div>
          {
            ["BIDDER"].includes(userRole) &&
            <RatingDisplay rating={{ star: userData?.rating ?? 1, reason: null }} showReason={false} />
          }

        </div>

        {
          ["BIDDER"].includes(userRole) &&
          <div className="flex flex-col  gap-3">
            <div className="text-gray-900 font-bold  w-full text-end text-md sm:text-xs">{t("dashboard-account", { account: userData?.account })}</div>
            {/* TWO BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Tooltip content={t("dashboard-private-tenders-tooltip")}>
                <Link
                  to="/tenders"
                  className="flex flex-row gap-2 px-3 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
                >
                  <IconListLetters size={20} />
                  {t("dashboard-private-tenders-button")}
                </Link>
              </Tooltip>
              <Tooltip content={t("dashboard-government-tenders-tooltip")}>
                <Link
                  to="/government-tenders"
                  className="flex flex-row gap-2 px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  <IconBuilding size={20} />
                  {t("dashboard-government-tenders-button")}
                </Link>
              </Tooltip>
            </div>
          </div>
        }

        {/* TOP LEVEL GLOBAL ALERTS */}
        {
          !["BIDDER", "PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) &&
          <div className="flex flex-col sm:flex-row gap-2">
            {stats.unreadMessages > 0 && (
              <Link to="/messages" className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium max-w-xs shadow-sm">
                <IconAlertTriangle size={22} className="text-amber-600 shrink-0" />
                <span><strong>Unread Messages: </strong> You have <strong>{stats.unreadMessages}</strong> unread messages.</span>
              </Link>
            )}
            {isSmsLow && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium max-w-xs shadow-sm">
                <IconAlertTriangle size={22} className="text-amber-600 shrink-0" />
                <span><strong>SMS Level Alert: </strong> Main SMS credits fall below operational baselines.</span>
              </div>
            )}
            {stats.requests.request > 0 && (
              <Link to="/do-it-for-me" className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium max-w-xs shadow-sm">
                <IconAlertTriangle size={22} className="text-amber-600 shrink-0" />
                <span><strong>New Requests: </strong> You have {stats.requests.request} new DIFM applications requests.</span>
              </Link>
            )}
            {/* {stats.requests.request > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium max-w-xs shadow-sm">
                <IconCircleX size={22} className="text-rose-600 shrink-0" />
                <span><strong>Failed Requests: </strong> {stats.requests.canceled} tender requests timed out or failed processing loops.</span>
              </div>
            )} */}
          </div>
        }

      </header>

      {
        !["PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) &&
        <Billboards />
      }


      {/* SECTION 1: SYSTEM CORE HIGH-LEVEL METRICS */}
      {
        !["PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) &&
        <>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <IconGraph size={16} className="text-slate-500" />
              Brief Summary
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">Quick summary of key metrics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
              !["BIDDER"].includes(userRole) &&
              <MetricCard
                icon={<IconUsers className="text-blue-600" />}
                title="Total Registered Bidders"
                value={stats.bidders.total}
                subtitle={`<span style="color: #000000; font-weight: 700">${stats.bidders.active}</span> Active bidders`}
              />
            }
            <MetricCard
              icon={<IconFileSpreadsheet className="text-emerald-600" />}
              title="Active Tenders System-Wide"
              value={stats.tenders.total}
              subtitle={`<span style="color: #000000; font-weight: 700">${stats.tenders.open}</span> Open • <span style="color: #000000; font-weight: 700">${stats.tenders.thisMonth}</span> This month • <span style="color: #000000; font-weight: 700">${stats.tenders.categories}</span> Categories`}
            />
            {
              ["ADMINISTRATOR", "ACCOUNTANT"].includes(userRole) &&
              <MetricCard
                icon={<IconWallet className="text-amber-600" />}
                title="Total Financial Payments"
                value={`TZS ${stats.payments.totalAmount.toLocaleString()}`}
                subtitle={`<span style="color: #000000; font-weight: 700">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(stats.payments.thisMonth)}</span> This month • <span style="color: #000000; font-weight: 700">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(stats.payments.walletBalance)}</span> Wallet`}
              />
            }
            <MetricCard
              icon={<IconGitPullRequest className="text-indigo-600" />}
              title="Private Applications"
              value={stats.applications}
              subtitle={`Active P.E Applications`}
            />
          </div>
        </>
      }


      {/* GRID: REQUESTS CYCLE & CORE ENTITIES SPECTRUM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {
          !["PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) &&

          // {/* REQUESTS PIPELINE LIFECYCLE TRACKER */ }
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <IconGitPullRequest size={16} className="text-slate-500" />
                  Do it for Me Pipeline
                </h3>
                <p className="text-[11px] text-slate-400 font-normal">DIFM lifecycle monitoring of digital tender requests.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-zinc-100 text-slate-800 px-2.5 py-1 rounded-lg">
                Total Requests: {stats.requests.total}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatusMetricBox label="Requests" value={stats.requests.request} border="border-l-slate-400" />
              <StatusMetricBox label="On progress" value={stats.requests.open} border="border-l-blue-500" />
              <StatusMetricBox label="Applied" value={stats.requests.applied} border="border-l-purple-500" />
              <StatusMetricBox label="Won" value={stats.requests.awarded} border="border-l-emerald-500" textClass="text-emerald-600" />
              <StatusMetricBox label="Not Won" value={stats.requests.notAwarded} border="border-l-zinc-400" />
              <StatusMetricBox label="Executed Final" value={stats.requests.executed} border="border-l-indigo-500" />
              <StatusMetricBox label="Canceled States" value={stats.requests.canceled} border="border-l-amber-500" textClass="text-amber-600" />
              <StatusMetricBox label="Failed Loops" value={0} border="border-l-rose-500" textClass={stats.requests.canceled > 0 ? "text-rose-600 font-bold" : ""} />
            </div>

            <InformantBox>
              Failed or canceled request instances are carefully processed and reviewed.
            </InformantBox>
          </div>
        }

        {
          !["BIDDER", "PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) &&

          // {/* PROCUREMENT ENTITIES DEMOGRAPHICS MIX */ }
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <IconBuildingStore size={16} className="text-slate-500" />
                Procuring Entities (P.Es) Mix
              </h3>
              <p className="text-[11px] text-slate-400 font-normal">Active structural demographics split across the system ecosystem.</p>
            </div>

            <div className="space-y-2.5 my-auto">
              <DemographicBar label="Government Sectors" count={stats.procurementEntities.GOVERNMENT} total={stats.procurementEntities.GOVERNMENT + stats.procurementEntities.MANUFACTURER + stats.procurementEntities.PRIVATE} color="bg-zinc-900" />
              <DemographicBar label="Private Corporations" count={stats.procurementEntities.PRIVATE} total={stats.procurementEntities.GOVERNMENT + stats.procurementEntities.MANUFACTURER + stats.procurementEntities.PRIVATE} color="bg-green-500" />
              <DemographicBar label="Manufacturers & Vendors" count={stats.procurementEntities.MANUFACTURER} total={stats.procurementEntities.GOVERNMENT + stats.procurementEntities.MANUFACTURER + stats.procurementEntities.PRIVATE} color="bg-purple-300" />
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl text-[11px] text-slate-500 flex gap-2">
              <IconInfoCircle size={14} className="shrink-0 text-slate-400 mt-0.5" />
              <span>Entity profiles undergo automatic security validation before gaining tender authorization flags.</span>
            </div>
          </div>
        }

      </div>

      {
        !["BIDDER", "PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) &&
        <>
          {/* GRID: FINANCIAL QUOTATIONS MATRIX & ALERTS GATEWAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
              ["ADMINISTRATOR", "MANAGER", "ACCOUNTANT"].includes(userRole) &&

              // {/* COMPREHENSIVE FINANCIAL QUOTATIONS METRIC SET */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="space-y-1 pb-3 border-b border-zinc-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <IconCoin size={16} className="text-slate-500" />
                    Quotations & Commercial Ledger
                  </h3>
                  <p className="text-[11px] text-slate-400 font-normal">Financial aggregation tracking matching tender quote streams.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800 border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-200 uppercase font-bold tracking-wider">Total Value Processed</span>
                    <p className="text-md font-extrabold text-white mt-0.5">TZS {stats.quotations.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Processed This Month</span>
                    <p className="text-md font-extrabold text-slate-900 mt-0.5">TZS {stats.quotations.thisMonth.toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Wallet Balance:</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 rounded-md">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(stats.payments.walletBalance)}
                  </span>
                </div>
              </div>
            }


            {/* COMMUNICATIONS & GATEWAY METRIC POOLS */}


            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="space-y-1 pb-3 border-b border-zinc-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <IconMessageDots size={16} className="text-slate-500" />
                  Notification Gateways & SMS Credits
                </h3>
                <p className="text-[11px] text-slate-400 font-normal">Realtime link metrics mapping operational alert engines.</p>
              </div>

              <div className="divide-y divide-zinc-100 text-xs">
                <div className="flex justify-between items-center py-2.5">
                  <span className="font-semibold text-slate-700">Onfon Media</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${onFonMediaBalance < 100 ? "bg-amber-100 text-amber-900 font-extrabold" : "bg-green-100 text-slate-900"}`}>
                    {stats.messageBalance.onfonMedia}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="font-semibold text-slate-700">NextSMS</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${nextSMSBalance < 100 ? "bg-amber-100 text-amber-900 font-extrabold" : "bg-green-100 text-slate-900"}`}>
                    {stats.messageBalance.nextSMS}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="font-semibold text-slate-700">OnSMS</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${onSMSBalance < 100 ? "bg-amber-100 text-amber-900 font-extrabold" : "bg-zinc-100 text-slate-900"}`}>
                    {stats.messageBalance.onSMS}
                  </span>
                </div>
              </div>

              {isSmsLow && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex gap-2 font-medium">
                  <IconAlertTriangle size={14} className="shrink-0 text-amber-600 mt-0.5" />
                  <span>Low system SMS thresholds detected. Replenish sMS balance to prevent notification interruptions.</span>
                </div>
              )}
            </div>

          </div>

          {/* SECTION: FINANCIAL PAYMENTS SUMMARY ARCHITECTURE */}
          {
            ["ADMINISTRATOR", "ACCOUNTANT"].includes(userRole) &&
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <IconWallet size={16} className="text-slate-500" />
                    Procurement Financial Ledger
                  </h3>
                  <p className="text-[11px] text-slate-400 font-normal">Audit overview of processing fees, security bonds, and escrow allocations.</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gateway Secure
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800 border border-slate-200/60 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">All Time Payments</span>
                  <p className="text-lg font-black text-white">TZS {stats.payments.totalAmount.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400 block">Accumulated non-refundable submission fees</span>
                </div>

                <div className="p-4 bg-green-50 border border-zinc-200/60 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">This Month Payments</span>
                  <p className="text-lg font-black text-green-700">TZS {stats.payments.thisMonth.toLocaleString()}</p>
                  <span className="text-[10px] text-green-700 block">This month non-refundable submission fees</span>
                </div>

                <div className="p-4 bg-purple-50 border border-zinc-200/60 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Active Bid Wallet Bonds</span>
                  <p className="text-lg font-black text-purple-600">TZS {stats.payments.walletBalance.toLocaleString()}</p>
                  <span className="text-[10px] text-purple-600 block">Held in system escrow pools</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-start gap-2 text-xs text-slate-500">
                <IconInfoCircle size={14} className="shrink-0 text-slate-400 mt-0.5" />
                <span>Financial summaries include direct integrations from mobile money and bank API settlements. Discrepancies clear automatically during night-cycle reconciliation loops.</span>
              </div>
            </div>
          }

          {/* SECTION: TENDER MARKETPLACE HEALTH SUMMARY */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <IconFileSpreadsheet size={16} className="text-slate-500" />
                  Tender Lifecycle & Bidding Volume
                </h3>
                <p className="text-[11px] text-slate-400 font-normal">System-wide performance indicators for published procurement advertisements.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-zinc-100 text-slate-800 px-2.5 py-1 rounded-lg">
                Total Tenders: {stats.tenders.total}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual breakdown bars using your existing DemographicBar logic */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tender Document Status Metrics</h4>
                <div className="space-y-5">
                  <DemographicBar
                    label="Open for Competitive Bidding"
                    count={stats.tenders.open}
                    total={stats.tenders.total}
                    color="bg-emerald-500"
                  />
                  <DemographicBar
                    label="Won and Executed by Bidders"
                    count={stats.requests.awarded + stats.requests.executed}
                    total={stats.tenders.total}
                    color="bg-blue-500"
                  />
                  <DemographicBar
                    label="Closed without Competitive Bidding"
                    count={(stats.tenders.total - stats.tenders.open) - (stats.requests.awarded + stats.requests.executed)}
                    total={stats.tenders.total}
                    color="bg-red-500"
                  />
                </div>
              </div>

              {/* Competitive metrics breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-zinc-50 border border-zinc-200/60 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Monthly Intake</span>
                  <span className="text-xl font-black text-slate-600 mt-1">+{stats.tenders.thisMonth}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">New procurement openings</span>
                </div>

                <div className="p-3.5 bg-green-700 border border-zinc-200/60 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-200 tracking-wider">P.E Expressions of Interest</span>
                  <span className="text-xl font-black text-slate-50 mt-1">{stats.applications}</span>
                  <span className="text-[10px] text-slate-200 mt-0.5">Total uploaded proposal tracks</span>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-200/60 rounded-xl flex flex-col justify-between col-span-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <span>Marketplace Competitiveness Ratio</span>
                    <span className="text-slate-700 font-mono text-xs">
                      {(stats.tenders.total > 0 ? (stats.applications / stats.tenders.open) * 100 : 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(stats.tenders.total > 0 ? (stats.applications / stats.tenders.open) : 0) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5">Average submitted vendor bids evaluated per open publication package.</span>
                </div>
              </div>
            </div>

          </div>
        </>
      }

      {/* SECTION: TENDER REGIONAL BREAKDOWN */}
      {
        !["PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <IconFileSpreadsheet size={16} className="text-slate-500" />
                  Tender Regional Breakdown
                </h3>
                <p className="text-[11px] text-slate-400 font-normal">Geographic and sector distributions for published procurement packages.</p>
              </div>
              <span className="self-start sm:self-auto text-xs font-mono font-bold bg-zinc-100 text-slate-800 px-2.5 py-1 rounded-lg">
                Total Active Tenders: {stats.tenders.open}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left Side: Demographic Progress Bars */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Market Distribution Percentage</h4>
                <div className="space-y-5 bg-zinc-50/50 border border-zinc-100 p-4 rounded-xl">
                  <DemographicBar
                    label="Private Sector Tenders"
                    count={stats.tenders.region.private}
                    total={stats.tenders.open}
                    color="bg-emerald-500"
                  />
                  <DemographicBar
                    label="Government / Public Tenders"
                    count={stats.tenders.region.government}
                    total={stats.tenders.open}
                    color="bg-blue-500"
                  />
                  <DemographicBar
                    label="International Competitive Bidding"
                    count={stats.tenders.region.international}
                    total={stats.tenders.open}
                    color="bg-orange-500"
                  />
                </div>
              </div>

              {/* Right Side: Clean Structured Metric Cards */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volume Demographics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">

                  {/* Private Tenders Card */}
                  <div className="p-3.5 bg-emerald-50/40 border border-emerald-100/80 border-l-4 border-l-emerald-500 rounded-xl flex lg:flex-row items-baseline lg:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Private Sector</span>
                      <span className="text-[10px] text-slate-400 block lg:inline">Commercial marketplace openings</span>
                    </div>
                    <span className="text-xl font-black text-emerald-700 font-mono">{stats.tenders.region.private}</span>
                  </div>

                  {/* Government Tenders Card */}
                  <div className="p-3.5 bg-blue-50/40 border border-blue-100/80 border-l-4 border-l-blue-500 rounded-xl flex lg:flex-row items-baseline lg:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">Government Sector</span>
                      <span className="text-[10px] text-slate-400 block lg:inline">Public authority procurements</span>
                    </div>
                    <span className="text-xl font-black text-blue-700 font-mono">{stats.tenders.region.government}</span>
                  </div>

                  {/* International Tenders Card */}
                  <div className="p-3.5 bg-orange-50/40 border border-orange-100/80 border-l-4 border-l-orange-500 rounded-xl flex lg:flex-row items-baseline lg:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-orange-800 tracking-wider block">International Bids</span>
                      <span className="text-[10px] text-slate-400 block lg:inline">Cross-border competitive tracks</span>
                    </div>
                    <span className="text-xl font-black text-orange-700 font-mono">{stats.tenders.region.international}</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )
      }


      {/* procurement entity */}
      {
        ["PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) && (
          <div className="bg-white px-4 py-3 rounded-xl w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <Link to="/tenders">
                <StatGroupCard
                  title={t("dashboard-my-tenders-title")}
                  icon={<IconFiles size={20} />}
                  items={[{ label: t("dashboard-my-tenders-total-published"), value: summary?.statistics?.tenders?.total ?? 0 },]}
                />
              </Link>
              <Link to="/tender-box">
                <StatGroupCard
                  title={t("dashboard-my-tender-box")}
                  icon={<IconFolderOpen size={20} />}
                  items={[{ label: t("dashboard-my-tender-box"), value: summary?.statistics?.applications ?? 0 },]}
                />
              </Link>
              <Link to="/tender-box">
                <StatGroupCard
                  title={t("dashboard-tender-awarded-title")}
                  icon={<IconFolderOpen size={20} />}
                  items={[{ label: t("dashboard-tender-awarded"), value: 0 },]}
                />
              </Link>
            </div>
          </div>
        )
      }
      {
        ["BIDDER", "PROCUREMENT_ENTITY", "PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userRole) && (
          <div className="fixed bottom-6 right-5 z-50 flex flex-col space-y-3">
            <a
              href="https://wa.me/+255766028558"
              target="_blank"
              rel="noopener noreferrer"
              className="flex group bg-green-200 hover:bg-green-400 text-green-800 p-2 rounded-full shadow-md transition-all duration-200"
            >
              <IconBrandWhatsapp size={20} />
            </a>

            <a
              href="mailto:info@wintender.co.tz"
              className="flex items-center bg-blue-200 hover:bg-blue-400 text-blue-800 p-2 rounded-full shadow-md transition-all duration-200"
            >
              <IconMail size={20} />
            </a>
          </div>
        )
      }

      {/* <Billboards /> */}
      <BillboardViewModal isOpen={handleModal.type === "viewBillboard"} onClose={handleCloseModal} billboard={handleModal.object as IConsultation} />

    </div >
  );
}

/* -------------------- INTERNAL CLEAN DESIGN COMPONENTS -------------------- */

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
}

function MetricCard({ icon, title, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-2">
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-1.5 bg-zinc-50 border border-zinc-200 rounded-xl shrink-0">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        <div className="text-[11px] font-medium text-slate-400 mt-0.5 truncate" dangerouslySetInnerHTML={{ __html: subtitle }}></div>
      </div>
    </div>
  );
}

interface StatusMetricBoxProps {
  label: string;
  value: number;
  border: string;
  textClass?: string;
}

function StatusMetricBox({ label, value, border, textClass = "text-slate-900" }: StatusMetricBoxProps) {
  return (
    <div className={`p-3 bg-zinc-50 border border-zinc-200 border-l-4 ${border} rounded-xl shadow-sm flex flex-col justify-between`}>
      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">{label}</span>
      <span className={`text-md font-extrabold mt-1 tracking-tight ${textClass}`}>{value}</span>
    </div>
  );
}

function InformantBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-start gap-2 text-xs text-slate-600 font-normal leading-relaxed">
      <div className="p-0.5 bg-emerald-50 rounded text-emerald-600 shrink-0">
        <IconCircleCheck size={14} />
      </div>
      <span>{children}</span>
    </div>
  );
}

interface DemographicBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function DemographicBar({ label, count, total, color }: DemographicBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-600">{label}</span>
        <span className="font-mono text-slate-900">{count} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/30">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
