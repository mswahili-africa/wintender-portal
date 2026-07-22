import React from "react";
import { 
  IconActivity, 
  IconTarget 
} from "@tabler/icons-react";

export default function CustomerAcquisitionRetentionOfficerKpi() {
  const effectiveDate = "22nd July, 2026";

  const kpiData = [
    { responsibility: "Sales Prospecting", duty: "Identify and engage potential customers, including suppliers, contractors, service providers, manufacturers, financial institutions, and procuring entities.", kpi: "New qualified leads generated.", target: "≥150 per month" },
    { responsibility: "Customer Acquisition", duty: "Convert prospects into registered Wintender users.", kpi: "New organizations registered.", target: "≥100 per month" },
    { responsibility: "Subscription Sales", duty: "Sell Wintender subscription packages to registered users.", kpi: "New paid subscriptions.", target: "≥50 per month" },
    { responsibility: "Revenue Generation", duty: "Achieve monthly and annual sales targets.", kpi: "Monthly sales revenue achieved.", target: "≥100% of target" },
    { responsibility: "Customer Retention", duty: "Maintain relationships with existing customers and encourage subscription renewals.", kpi: "Customer renewal rate.", target: "≥90%" },
    { responsibility: "Lead Follow-up", duty: "Follow up with prospective customers through calls, emails, and visits.", kpi: "Lead follow-up completion rate.", target: "100% within 48 hours" },
    { responsibility: "Product Demonstrations", duty: "Conduct platform demonstrations and presentations to prospective clients.", kpi: "Product demonstrations conducted.", target: "≥20 per month" },
    { responsibility: "Market Research", duty: "Monitor market trends, competitors, and customer needs.", kpi: "Market intelligence reports submitted.", target: "Monthly" },
    { responsibility: "Digital Marketing", duty: "Support digital campaigns across social media, email, and online advertising.", kpi: "Marketing campaigns executed.", target: "≥4 per month" },
    { responsibility: "Social Media Engagement", duty: "Create and publish engaging content across digital platforms.", kpi: "Social media posts published.", target: "≥20 per month" },
    { responsibility: "Brand Promotion", duty: "Represent Wintender at exhibitions, trade fairs, seminars, and networking events.", kpi: "Promotional events attended.", target: "≥2 per month" },
    { responsibility: "Client Visits", duty: "Conduct face-to-face meetings with prospective and existing clients.", kpi: "Client visits completed.", target: "≥40 per month" },
    { responsibility: "Partnership Development", duty: "Identify opportunities for collaboration with business associations and strategic partners.", kpi: "Partnership opportunities generated.", target: "≥5 per quarter" },
    { responsibility: "Tender Promotion", duty: "Promote newly published tenders and encourage user participation.", kpi: "Tender promotion campaigns completed.", target: "100% of priority tenders" },
    { responsibility: "CRM Management", duty: "Update customer interactions, opportunities, and sales activities in the CRM.", kpi: "CRM records updated.", target: "100%" },
    { responsibility: "Customer Support", duty: "Respond to sales and product inquiries promptly.", kpi: "Customer inquiries responded to.", target: "Within 24 hours" },
    { responsibility: "Proposal Preparation", duty: "Prepare quotations, proposals, and subscription offers.", kpi: "Proposals submitted.", target: "Within 2 business days" },
    { responsibility: "Marketing Materials", duty: "Assist in developing brochures, presentations, videos, and promotional materials.", kpi: "Marketing materials produced.", target: "≥2 per month" },
    { responsibility: "Customer Feedback", duty: "Collect customer feedback and recommend product improvements.", kpi: "Feedback reports submitted.", target: "Monthly" },
    { responsibility: "Campaign Performance", duty: "Measure the effectiveness of marketing campaigns and recommend improvements.", kpi: "Campaign performance reports.", target: "Monthly" },
    { responsibility: "Cross-selling", duty: "Promote additional Wintender services such as consultancy, tender preparation, tender guarantees, and trade finance solutions.", kpi: "Cross-selling conversion rate.", target: "≥25%" },
    { responsibility: "Team Collaboration", duty: "Work closely with Business Development, Customer Support, and Technical teams.", kpi: "Joint initiatives completed.", target: "≥2 per month" },
    { responsibility: "Reporting", duty: "Prepare weekly and monthly sales and marketing performance reports.", kpi: "Reports submitted on time.", target: "100%" },
    { responsibility: "Compliance", duty: "Ensure all sales and marketing activities comply with company policies and ethical standards.", kpi: "Compliance violations.", target: "Zero" },
    { responsibility: "Continuous Improvement", duty: "Identify opportunities to improve sales processes and marketing effectiveness.", kpi: "Improvement initiatives implemented.", target: "≥4 annually" }
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
          Key Performance Indicators (KPI) — CUSTOMER ACQUISITION & RETENTION OFFICER
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
            The Customer Acquisition & Retention Officer is responsible for identifying leads, onboarding new registered entities, driving paid subscription sales, maintaining high customer retention rates, and promoting Wintender's full suite of procurement solutions.
          </p>
        </section>

        {/* 1. EXECUTIVE TARGET SUMMARY */}
        <Section title="1. Primary Growth Targets">
          <p className="mb-3">Core acquisition, retention, and outreach benchmarks:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProcessCard title="Lead Generation" desc="≥150 qualified sales prospects identified per month." />
            <ProcessCard title="New Registrations" desc="≥100 organizations converted & registered monthly." />
            <ProcessCard title="Subscription Sales" desc="≥50 new paid subscription packages sold monthly." />
            <ProcessCard title="Renewal Rate" desc="Maintain ≥90% customer retention and renewal rate." />
          </div>
        </Section>

        {/* 2. KEY PERFORMANCE INDICATORS MATRIX */}
        <Section title="2. Key Performance Indicators (KPI) Matrix">
          <p className="mb-4">
            Structured table detailing key responsibilities, operational duties, performance metrics, and target standards:
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
                  {kpiData.map((row, idx) => (
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