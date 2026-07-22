import React from "react";
import { 
  IconShieldCheck, 
  IconTarget, 
  IconMapPin, 
  IconMail, 
  IconPhone 
} from "@tabler/icons-react";

export default function BusinessLeadKpi() {
  const effectiveDate = "22nd July, 2026";

  const businessLeadKPIs = [
    { responsibility: "Business Strategy", duty: "Develop and implement Wintender's business growth strategy aligned with company objectives.", kpi: "Annual business plan approved and executed.", target: "100%" },
    { responsibility: "Revenue Growth", duty: "Drive subscription, consultancy, and service revenue.", kpi: "Revenue growth against annual target.", target: "≥120% of annual target" },
    { responsibility: "Customer Acquisition", duty: "Lead initiatives to acquire new suppliers, contractors, service providers, manufacturers, financial institutions, and procuring entities.", kpi: "New registered organizations.", target: "≥300 per month" },
    { responsibility: "Subscription Growth", duty: "Increase the number of paying subscribers.", kpi: "New paid subscriptions.", target: "≥150 per month" },
    { responsibility: "Customer Retention", duty: "Develop retention strategies to minimize customer churn.", kpi: "Customer retention rate.", target: "≥90%" },
    { responsibility: "Strategic Partnerships", duty: "Establish partnerships with banks, manufacturers, business associations, chambers of commerce, and development partners.", kpi: "New strategic partnerships signed.", target: "≥3 annually" },
    { responsibility: "Business Development", duty: "Identify and pursue new business opportunities and market segments.", kpi: "Qualified opportunities generated.", target: "≥20 per month" },
    { responsibility: "Sales Performance", duty: "Manage and supervise the sales pipeline from lead generation to closing.", kpi: "Sales conversion rate.", target: "≥35%" },
    { responsibility: "Market Expansion", duty: "Expand Wintender into new industries and geographical markets.", kpi: "New market segments entered.", target: "≥4 annually" },
    { responsibility: "Client Relationship Management", duty: "Build and maintain relationships with key clients and stakeholders.", kpi: "Key account satisfaction score.", target: "≥90%" },
    { responsibility: "Marketing Collaboration", duty: "Work with the marketing team to execute campaigns that generate qualified leads.", kpi: "Marketing-qualified leads converted.", target: "≥30%" },
    { responsibility: "Tender Ecosystem Development", duty: "Recruit private procuring entities and organizations to publish tenders through Wintender.", kpi: "New procuring entities onboarded.", target: "≥10 per month" },
    { responsibility: "Product Improvement", duty: "Collect customer feedback and recommend platform enhancements.", kpi: "Improvement recommendations implemented.", target: "≥10 annually" },
    { responsibility: "Proposal Development", duty: "Lead preparation of business proposals, partnership proposals, and corporate presentations.", kpi: "Successful proposal win rate.", target: "≥50%" },
    { responsibility: "Customer Success", duty: "Ensure enterprise customers receive continuous support and maximize platform utilization.", kpi: "Active customer engagement rate.", target: "≥95%" },
    { responsibility: "Business Analytics", duty: "Monitor business performance and prepare management reports.", kpi: "Monthly business performance reports submitted.", target: "By 5th working day" },
    { responsibility: "Competitive Intelligence", duty: "Monitor competitors, procurement trends, and market opportunities.", kpi: "Market intelligence reports.", target: "Quarterly" },
    { responsibility: "Team Leadership", duty: "Supervise and mentor the business development team.", kpi: "Team KPI achievement.", target: "≥90%" },
    { responsibility: "Brand Representation", duty: "Represent Wintender at exhibitions, conferences, and networking events.", kpi: "Business events attended.", target: "≥2 per month" },
    { responsibility: "Contract Negotiation", duty: "Lead commercial negotiations with strategic clients and partners.", kpi: "Contracts successfully concluded.", target: "≥90% of targeted deals" },
    { responsibility: "Trade Finance Promotion", duty: "Promote trade finance and tender guarantee solutions through financial institution partnerships.", kpi: "Trade finance transactions facilitated.", target: "≥20 per quarter" },
    { responsibility: "CRM Management", duty: "Ensure all sales activities and customer interactions are updated in the CRM.", kpi: "CRM data completeness.", target: "100%" },
    { responsibility: "Risk Management", duty: "Identify commercial risks and implement mitigation strategies.", kpi: "Business risks mitigated.", target: "100% of high-risk issues" },
    { responsibility: "Innovation", duty: "Identify and implement innovative revenue-generating initiatives.", kpi: "New business initiatives launched.", target: "≥3 annually" },
    { responsibility: "Management Reporting", duty: "Present business performance to senior management.", kpi: "Executive reports delivered on schedule.", target: "Monthly" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconShieldCheck size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Commercial Standards</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Key Performance Indicators (KPI) — BUSINESS LEAD
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
            The Business Lead is responsible for driving Wintender's commercial growth, expanding market presence, developing strategic partnerships, increasing subscriptions, and ensuring customer success. The role focuses on achieving revenue growth while positioning Wintender as Tanzania's leading digital procurement and trade finance platform.
          </p>
        </section>

        {/* 1. EXECUTIVE TARGET SUMMARY */}
        <Section title="1. Commercial Growth Baselines">
          <p className="mb-3">High-priority revenue and conversion metrics required for platform growth:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProcessCard title="Revenue Growth" desc="≥120% achievement against annual target." />
            <ProcessCard title="New Organizations" desc="≥300 new registered organizations per month." />
            <ProcessCard title="Paid Subscriptions" desc="≥150 new paid subscribers per month." />
            <ProcessCard title="Customer Retention" desc="Maintain ≥90% customer retention rate." />
          </div>
        </Section>

        {/* 2. KEY RESPONSIBILITIES & PERFORMANCE MATRIX (TABLE VIEW) */}
        <Section title="2. Key Responsibilities & Performance Matrix">
          <p className="mb-4">
            Structured matrix detailing business development duties, performance metrics, and growth targets:
          </p>

          <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Key Responsibility</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Duties</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Key Performance Indicators (KPIs)</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider text-right">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[13px]">
                  {businessLeadKPIs.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {row.responsibility}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-normal leading-snug max-w-xs sm:max-w-sm">
                        {row.duty}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium leading-snug">
                        {row.kpi}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded text-xs">
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

        {/* 3. COMPLIANCE & AUDIT ASSURANCE */}
        <Section title="3. Growth & Execution Integrity">
          <p className="mb-2">The Business Lead executes strategy strictly within corporate and commercial guidelines:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
            <li><span className="text-slate-900">Pipeline Integrity:</span> Maintaining 100% complete and accurate CRM data across all deals.</li>
            <li><span className="text-slate-900">Monthly Performance Cadence:</span> Performance reports delivered by the 5th working day of each month.</li>
            <li><span className="text-slate-900">Ecosystem Development:</span> Onboarding at least 10 private procuring entities per month to publish tenders.</li>
            <li><span className="text-slate-900">High-Risk Mitigation:</span> 100% resolution of identified commercial risks.</li>
          </ul>
        </Section>

        {/* 4. CONTACT & ESCALATION DIRECTORY */}
        <Section title="4. Business & Commercial Office Directory">
          <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 max-w-xl space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Commercial & Growth Office
              </h4>
              <p className="text-sm font-semibold text-slate-800">Wintender Corporate Office</p>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <IconMapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <span>Mbezi Beach, along New Bagamoyo Road, Samaki Wabichi House, Room A21, Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMail size={16} className="text-slate-400 shrink-0" />
                <a href="mailto:info@wintender.co.tz" className="text-emerald-600 hover:underline font-medium">
                  info@wintender.co.tz
                </a>
              </div>
              <div className="flex items-center gap-2">
                <IconPhone size={16} className="text-slate-400 shrink-0" />
                <span>+255 (0) 747 098 447 / +255 (0) 766 028 558</span>
              </div>
            </div>
          </div>
        </Section>

        {/* POLICY FOOTER ACKNOWLEDGEMENT */}
        <section className="pt-6 border-t border-slate-200/60">
          <p className="text-xs text-slate-400 font-normal">
            By operating within the Wintender E-Procurement Portal as Business Lead, commercial team actors commit to maintaining the acquisition, retention, revenue, and partnership targets defined in this document.
          </p>
        </section>

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