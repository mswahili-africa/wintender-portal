import React from "react";
import { 
  IconActivity, 
  IconTarget 
} from "@tabler/icons-react";

export default function BusinessAdministratorProcurementOfficerKpi() {
  const effectiveDate = "22nd July, 2026";

  const kpiData = [
    { area: "Tender Submission Volume", kpi: "Number of tenders submitted", target: "≥ 55 tenders per month", frequency: "Monthly" },
    { area: "Tender Submission Volume", kpi: "Submission consistency", target: "100% of assigned tender opportunities addressed", frequency: "Monthly" },
    { area: "Timeliness & Delivery Discipline", kpi: "On-time submission of tenders", target: "100% submitted within deadlines", frequency: "Per Tender / Monthly" },
    { area: "Timeliness & Delivery Discipline", kpi: "Meeting attendance compliance", target: "100% attendance of all 4 quarterly meetings", frequency: "Quarterly" },
    { area: "Quality & Accuracy of Tenders", kpi: "Error-free submissions", target: "100% tenders free from mistakes, omissions, or negligence", frequency: "Per Tender / Monthly" },
    { area: "Quality & Accuracy of Tenders", kpi: "Compliance adherence rate", target: "100% compliance with procurement requirements and guidelines", frequency: "Per Tender" },
    { area: "Bidders Advisory & Support Services", kpi: "Consultation support delivery", target: "100% of bidder requests handled within agreed turnaround time", frequency: "Monthly" },
    { area: "Bidders Advisory & Support Services", kpi: "Compliance success rate of supported tenders", target: "≥ 95% of supported tenders pass compliance checks", frequency: "Monthly" },
    { area: "Bidders Advisory & Support Services", kpi: "Responsiveness to bidder inquiries", target: "Response within ≤ 1 business day", frequency: "Daily" }
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
          Key Performance Indicators (KPI) — BUSINESS ADMINISTRATOR / PROCUREMENT OFFICER
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
            The Business Administrator – Procurement Officer is responsible for leading tender submission workflows, maintaining 100% delivery discipline, guaranteeing high-quality compliance adherence, and offering responsive advisory support to bidders.
          </p>
        </section>

        {/* 1. EXECUTIVE TARGET SUMMARY */}
        <Section title="1. Operational Execution Baselines">
          <p className="mb-3">Core volume, timeliness, accuracy, and advisory standards:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProcessCard title="Submission Volume" desc="≥ 55 tender submissions completed monthly." />
            <ProcessCard title="Delivery Discipline" desc="100% on-time submission rate across all deadlines." />
            <ProcessCard title="Quality & Accuracy" desc="100% error-free submissions with zero omissions." />
            <ProcessCard title="Bidder Support" desc="≤ 1 business day response time for all bidder inquiries." />
          </div>
        </Section>

        {/* 2. KEY PERFORMANCE INDICATORS MATRIX */}
        <Section title="2. Key Performance Indicators (KPI) Matrix">
          <p className="mb-4">
            Structured table detailing operational areas, performance standards, and measurement frequencies:
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
                  {kpiData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {row.area}
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