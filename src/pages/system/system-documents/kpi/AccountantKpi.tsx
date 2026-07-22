import React from "react";
import { 
  IconShieldCheck, 
  IconTarget, 
  IconMapPin, 
  IconMail, 
  IconPhone 
} from "@tabler/icons-react";

export default function AccountantKpi() {
  const effectiveDate = "22nd July, 2026";

  const accountantKPIs = [
    { responsibility: "Financial Management", duty: "Maintain accurate financial records and ensure compliance with accounting standards.", kpi: "Monthly financial statements prepared and submitted on time.", target: "By 5th working day" },
    { responsibility: "Revenue Management", duty: "Record and reconcile subscription fees, consultancy income, commissions, and other revenues.", kpi: "Revenue reconciliation accuracy.", target: "100% accuracy" },
    { responsibility: "Accounts Receivable", duty: "Monitor customer invoices, follow up outstanding payments, and maintain debtor records.", kpi: "Outstanding receivables collected within credit terms.", target: "≥95% collection rate" },
    { responsibility: "Accounts Payable", duty: "Verify supplier invoices, process payments, and maintain creditor records.", kpi: "Supplier payments processed on time.", target: "≥98% on-time" },
    { responsibility: "Bank Reconciliation", duty: "Perform reconciliation of all company bank accounts and mobile payment platforms.", kpi: "Bank reconciliations completed.", target: "Weekly & Month-end (100%)" },
    { responsibility: "Budget Management", duty: "Prepare annual budgets and monitor expenditure against approved budgets.", kpi: "Budget variance maintained.", target: "Within ±5%" },
    { responsibility: "Cash Flow Management", duty: "Monitor daily cash position and forecast future cash requirements.", kpi: "Cash flow forecast accuracy.", target: "≥95% accuracy" },
    { responsibility: "Tax Compliance", duty: "Prepare and submit VAT, PAYE, SDL, WHT, Corporate Tax, and other statutory returns.", kpi: "Statutory returns submitted before deadlines.", target: "100% compliance" },
    { responsibility: "Payroll Administration", duty: "Process staff payroll, statutory deductions, and employee reimbursements.", kpi: "Payroll processed accurately and on time.", target: "100% before salary date" },
    { responsibility: "Financial Reporting", duty: "Prepare monthly, quarterly, and annual management reports.", kpi: "Reports submitted within schedule.", target: "100% on time" },
    { responsibility: "Internal Controls", duty: "Implement and monitor financial controls to safeguard company assets.", kpi: "Financial control incidents reported.", target: "Zero major failures" },
    { responsibility: "Audit Coordination", duty: "Coordinate internal and external audits and provide supporting documents.", kpi: "Audit findings resolved.", target: "100% within timelines" },
    { responsibility: "Expense Management", duty: "Review staff claims and operational expenses for compliance.", kpi: "Unauthorized expenses identified.", target: "Zero unauthorized" },
    { responsibility: "Procurement Finance Support", duty: "Verify procurement payments, contract values, and supplier invoices.", kpi: "Payment verification turnaround time.", target: "Within 24 hours" },
    { responsibility: "Subscription Monitoring", duty: "Monitor active subscriptions and revenue generated through Wintender.", kpi: "Active subscriber payment reconciliation.", target: "100% monthly" },
    { responsibility: "Tender Transaction Monitoring", duty: "Monitor all tender application payments processed through the platform.", kpi: "Tender payment reconciliation accuracy.", target: "100%" },
    { responsibility: "Financial Analysis", duty: "Analyze revenue trends, profitability, and operational costs.", kpi: "Monthly financial performance reports.", target: "1 report per month" },
    { responsibility: "Financial Forecasting", duty: "Prepare quarterly and annual financial forecasts.", kpi: "Forecast accuracy.", target: "≥90%" },
    { responsibility: "Compliance & Risk Management", duty: "Ensure compliance with financial regulations and company policies.", kpi: "Compliance issues identified during audits.", target: "Zero material non-compliance" },
    { responsibility: "Asset Management", duty: "Maintain fixed asset register and conduct periodic asset verification.", kpi: "Asset register accuracy.", target: "100%" },
    { responsibility: "Record Keeping", duty: "Maintain organized accounting records for audit and reporting purposes.", kpi: "Financial documents retrieval time.", target: "Within 10 minutes" },
    { responsibility: "Customer Financial Support", duty: "Resolve finance-related customer inquiries regarding payments and subscriptions.", kpi: "Customer finance queries resolved.", target: "Within 24 hours" },
    { responsibility: "Financial System Management", duty: "Maintain accounting software and financial databases.", kpi: "System data accuracy.", target: "100%" },
    { responsibility: "Management Support", duty: "Provide financial advice to management for strategic decisions.", kpi: "Financial recommendations implemented.", target: "Quarterly reports" },
    { responsibility: "Continuous Improvement", duty: "Identify opportunities to improve financial processes and automation.", kpi: "Process improvement initiatives implemented.", target: "≥2 initiatives/year" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconShieldCheck size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Financial Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Key Performance Indicators (KPI) — ACCOUNTANT
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
            The Accountant is responsible for ensuring financial integrity, statutory compliance, accurate revenue reconciliation, and rigorous fiscal controls across Wintender's business model. The role directly supports subscription management, consultancy services, trade finance facilitation, and digital procurement transactions.
          </p>
        </section>

        {/* 1. EXECUTIVE TARGET SUMMARY */}
        <Section title="1. Fiscal Governance Baselines">
          <p className="mb-3">High-priority compliance and control targets required for financial operations:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProcessCard title="Tax & Statutory" desc="100% compliance with VAT, PAYE, SDL, and WHT deadlines." />
            <ProcessCard title="Revenue Reconciliation" desc="100% accuracy on subscriptions & tender transactions." />
            <ProcessCard title="Budget Control" desc="Maintain operational budget variance within ±5%." />
            <ProcessCard title="Internal Controls" desc="Zero major financial control failures or unauthorized payments." />
          </div>
        </Section>

        {/* 2. KEY RESPONSIBILITIES & PERFORMANCE MATRIX (TABLE VIEW) */}
        <Section title="2. Key Responsibilities & Performance Matrix">
          <p className="mb-4">
            Structured matrix detailing accounting duties, audit metrics, and compliance targets:
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
                  {accountantKPIs.map((row, idx) => (
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
        <Section title="3. Financial Integrity & Audit Obligations">
          <p className="mb-2">The Accountant operates under strict fiscal guidelines and statutory frameworks:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
            <li><span className="text-slate-900">Monthly Close:</span> Financial statements completed by the 5th working day of each month.</li>
            <li><span className="text-slate-900">Reconciliation Discipline:</span> Weekly and month-end 100% reconciliation for all bank and mobile money platforms.</li>
            <li><span className="text-slate-900">Procurement Support:</span> Rapid 24-hour turnaround on procurement payment verification and supplier invoices.</li>
            <li><span className="text-slate-900">Zero Material Non-Compliance:</span> Complete adherence to statutory tax laws and internal financial controls.</li>
          </ul>
        </Section>

        {/* 4. CONTACT & ESCALATION DIRECTORY */}
        <Section title="4. Finance & Accounting Office Directory">
          <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 max-w-xl space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Finance & Accounting Office
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
            By operating within the Wintender E-Procurement Portal as Accountant, financial team actors commit to maintaining the reporting timelines, reconciliation accuracy, and statutory compliance targets defined in this document.
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