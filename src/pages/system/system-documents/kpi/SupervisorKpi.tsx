import React from "react";
import { 
  IconActivity, 
  IconTarget 
} from "@tabler/icons-react";

export default function SupervisorKpi() {
  const effectiveDate = "22nd July, 2026";

  const kpiData = [
    { responsibility: "Coordinate preparation and submission of quarterly and annual reports and corporate disclosures", kpi: "Timely submission of reports", target: "100% of reports submitted within approved deadlines" },
    { responsibility: "Coordinate preparation and submission of quarterly and annual reports and corporate disclosures", kpi: "Accuracy and completeness of reports", target: "Less revisions required after submission" },
    { responsibility: "Support management in preparing governance and compliance reports", kpi: "Compliance reporting completion rate", target: "100% completion of required compliance reports" },
    { responsibility: "Maintain company performance reports and official records", kpi: "Record management accuracy", target: "100% of records properly filed and retrievable within 24 hours" },
    { responsibility: "Maintain company performance reports and official records", kpi: "Document update compliance", target: "All corporate records updated within 3 working days of receipt or approval" },
    { responsibility: "Maintain positive communications with stakeholders", kpi: "Stakeholder satisfaction rating", target: "Minimum 85% satisfaction rating from stakeholder feedback" },
    { responsibility: "Maintain positive communications with stakeholders", kpi: "Response time to inquiries", target: "Respond to all inquiries within 12 hours" },
    { responsibility: "Manage relationships with bidders, procuring entities, and business partners", kpi: "Client retention rate", target: "Maintain at least 90% client retention annually" },
    { responsibility: "Manage relationships with bidders, procuring entities, and business partners", kpi: "Client issue resolution rate", target: "Resolve 95% of client concerns within agreed timelines" },
    { responsibility: "Market and promote tender opportunities to bidders", kpi: "Tender promotion activities", target: "Minimum 20 targeted tender opportunity notifications per month" },
    { responsibility: "Market and promote tender opportunities to bidders", kpi: "Bidder engagement growth", target: "Increase active bidder participation by at least 15% annually" },
    { responsibility: "Market and promote tender opportunities to bidders", kpi: "Conversion rate", target: "At least 25% of contacted bidders express interest or participate in opportunities" },
    { responsibility: "Customer acquisition and retention", kpi: "New client acquisition", target: "Secure a minimum of 5 new clients per quarter" },
    { responsibility: "Customer acquisition and retention", kpi: "Customer retention rate", target: "Maintain at least 90% annual customer retention" },
    { responsibility: "Provide legal advice on partnerships, joint ventures, and business relationships", kpi: "Review of agreements", target: "100% of partnership and JV agreements reviewed before execution" },
    { responsibility: "Provide legal advice on partnerships, joint ventures, and business relationships", kpi: "Risk mitigation effectiveness", target: "No significant legal disputes arising from unreviewed agreements" },
    { responsibility: "Provide legal advice on partnerships, joint ventures, and business relationships", kpi: "Business value creation", target: "At least 80% of partnerships achieve intended commercial objectives" },
    { responsibility: "General performance", kpi: "Task completion rate", target: "Complete at least 95% of assigned tasks within agreed timelines" },
    { responsibility: "General performance", kpi: "Management satisfaction", target: "Achieve minimum 85% performance rating from management evaluation" },
    { responsibility: "General performance", kpi: "Professional conduct and confidentiality", target: "Zero incidents of confidentiality breaches or professional misconduct" }
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
          Key Performance Indicators (KPI) — SUPERVISOR
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
            The Supervisor is responsible for corporate disclosures and reporting compliance, stakeholder relationship management, legal/partnership risk mitigation, customer retention, and driving overarching team task completion standards.
          </p>
        </section>

        {/* 1. EXECUTIVE TARGET SUMMARY */}
        <Section title="1. Supervisory Governance Highlights">
          <p className="mb-3">High-level targets driving management oversight and legal governance:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProcessCard title="Reporting & Audit" desc="100% timely submission of all corporate & compliance reports." />
            <ProcessCard title="Client Retention" desc="Maintain ≥90% annual retention across key accounts." />
            <ProcessCard title="Legal Oversight" desc="100% agreement reviews before execution with zero disputes." />
            <ProcessCard title="Task Execution" desc="≥95% task completion rate within agreed timelines." />
          </div>
        </Section>

        {/* 2. KEY PERFORMANCE INDICATORS MATRIX */}
        <Section title="2. Key Performance Indicators (KPI) Matrix">
          <p className="mb-4">
            Structured matrix detailing key supervisory responsibilities, specific indicators, and measurement targets:
          </p>

          <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Key Responsibility</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">KPI</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider text-right">Measurement Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[13px]">
                  {kpiData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 leading-snug max-w-xs">
                        {row.responsibility}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium leading-snug max-w-xs">
                        {row.kpi}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded text-xs inline-block">
                          {row.target}
                        </span>
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