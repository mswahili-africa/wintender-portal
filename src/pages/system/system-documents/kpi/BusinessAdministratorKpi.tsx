import React from "react";
import { 
  IconActivity, 
  IconTarget 
} from "@tabler/icons-react";

export default function BusinessAdministratorDataOfficerKpi() {
  const effectiveDate = "22nd July, 2026";

  const dataOfficerKPIs = [
    { category: "Tender Publication Volume", kpi: "Number of tenders published per month", target: "≥ 900 tenders/month", frequency: "Monthly" },
    { category: "Tender Publication Volume", kpi: "Daily publication consistency", target: "≥ 95% consistency rate", frequency: "Daily/Monthly" },
    { category: "Tender Publication Volume", kpi: "Backlog control", target: "Zero backlog beyond 24 hours", frequency: "Daily" },
    { category: "Publication Speed & Responsiveness", kpi: "Time from receipt to publication", target: "≤ 3 hours average turnaround", frequency: "Daily" },
    { category: "Publication Speed & Responsiveness", kpi: "Timely publishing of all tenders", target: "100% within a few hours of release", frequency: "Real-time" },
    { category: "Publication Speed & Responsiveness", kpi: "24/7 responsiveness capability", target: "Full operational readiness maintained", frequency: "Continuous" },
    { category: "Platform Reliability & System Performance", kpi: "Wintender portal uptime", target: "100% system functionality", frequency: "Weekly/Monthly" },
    { category: "Platform Reliability & System Performance", kpi: "Issue resolution time", target: "≤ 24 hours from identification", frequency: "As needed" },
    { category: "Platform Reliability & System Performance", kpi: "System health checks", target: "Weekly monitoring and reporting", frequency: "Weekly" },
    { category: "Order Tracking & Fulfilment Efficiency", kpi: "Order tracking compliance", target: "100% of orders tracked same business day", frequency: "Daily" },
    { category: "Order Tracking & Fulfilment Efficiency", kpi: "Untracked/overdue orders", target: "Zero tolerance", frequency: "Daily" },
    { category: "Order Tracking & Fulfilment Efficiency", kpi: "Order completion accuracy", target: "≥ 98% accuracy rate", frequency: "Monthly" },
    { category: "Market Position & Competitive Leadership", kpi: "Market ranking", target: "Position Wintender as #1 tender platform", frequency: "Quarterly" },
    { category: "Market Position & Competitive Leadership", kpi: "Platform growth performance", target: "≥ 10% growth in visibility/engagement QoQ", frequency: "Quarterly" },
    { category: "Market Position & Competitive Leadership", kpi: "Competitive speed advantage", target: "Maintain faster publication vs competitors", frequency: "Ongoing" },
    { category: "Stakeholder Engagement & Governance", kpi: "Quarterly meeting attendance", target: "100% attendance (4/4 meetings annually)", frequency: "Quarterly" },
    { category: "Stakeholder Engagement & Governance", kpi: "Reporting compliance", target: "100% timely submission of reports", frequency: "Quarterly" },
    { category: "Stakeholder Engagement & Governance", kpi: "Participation in strategic reviews", target: "≥ 95% participation rate", frequency: "Quarterly" },
    { category: "Quality & Accuracy of Publications", kpi: "Publication accuracy", target: "≥ 99% error-free postings", frequency: "Daily/Monthly" },
    { category: "Quality & Accuracy of Publications", kpi: "Compliance breaches", target: "Zero critical breaches", frequency: "Continuous" },
    { category: "Quality & Accuracy of Publications", kpi: "Error correction time", target: "≤ 2 hours after detection", frequency: "As needed" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconActivity size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Performance Metrics</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Key Performance Indicators (KPI) — BUSINESS ADMINISTRATOR / DATA OFFICER
        </h2>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 flex items-center gap-1.5">
          <span>Effective Date:</span>
          <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono font-medium">
            {effectiveDate}
          </span>
        </p>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <div className="space-y-10 text-[14px] leading-relaxed text-slate-600">
        
        {/* ROLE OVERVIEW STATEMENT */}
        <section className="text-slate-700 leading-relaxed max-w-4xl">
          <p className="text-base text-slate-800 font-medium leading-relaxed">
            The Business Administrator – Data Officer is responsible for executing high-volume tender publications, maintaining daily publishing consistency, ensuring prompt turnaround times, monitoring portal uptime, and tracking order completion accuracy across the Wintender platform.
          </p>
        </section>

        {/* 1. EXECUTIVE TARGET SUMMARY */}
        <Section title="1. Primary Operational Targets">
          <p className="mb-3">Core volume, speed, and accuracy standards for data operations:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProcessCard title="Monthly Volume" desc="≥ 900 tenders published per month." />
            <ProcessCard title="Publication Speed" desc="≤ 3 hours average turnaround from receipt." />
            <ProcessCard title="Publishing Accuracy" desc="≥ 99% error-free postings with quick error corrections." />
            <ProcessCard title="Order Tracking" desc="100% of orders tracked same business day with zero backlog." />
          </div>
        </Section>

        {/* 2. KEY PERFORMANCE INDICATORS MATRIX */}
        <Section title="2. Key Performance Indicators (KPI) Matrix">
          <p className="mb-4">
            Structured table detailing performance metrics, standards, and evaluation frequencies:
          </p>

          <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">KPI Area</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Key Performance Indicator</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Target / Standard</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider text-right">Measurement Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[13px]">
                  {dataOfficerKPIs.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {row.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-normal leading-snug max-w-xs sm:max-w-sm">
                        {row.kpi}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium leading-snug">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded text-xs inline-block">
                          {row.target}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap text-slate-500 font-medium">
                        {row.frequency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}

/* -------------------- INTERNAL CLEAN DESIGN COMPONENTS -------------------- */

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="space-y-2.5">
      <h3 className="text-md font-bold text-slate-900 tracking-tight border-l-4 border-emerald-500 pl-3">
        {title}
      </h3>
      <div className="space-y-3 text-slate-600 font-normal leading-relaxed pl-4">
        {children}
      </div>
    </section>
  );
}

function ProcessCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl">
      <h4 className="text-xs font-bold text-slate-900 tracking-wide mb-1 flex items-center gap-1.5">
        <IconTarget size={12} className="text-emerald-500" />
        {title}
      </h4>
      <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{desc}</p>
    </div>
  );
}