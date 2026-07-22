import React from "react";
import { 
  IconShieldCheck, 
  IconTarget, 
  IconChecklist, 
  IconMapPin, 
  IconMail, 
  IconPhone 
} from "@tabler/icons-react";

export default function AdministratorKpi() {
  const effectiveDate = "22nd July, 2026";

  const administratorKPIs = [
    { responsibility: "Portal Administration", duty: "Manage the overall operation and administration of the Wintender portal.", kpi: "System availability (uptime).", target: "≥99.9%" },
    { responsibility: "User Account Management", duty: "Create, modify, suspend, and manage user accounts, roles, and permissions.", kpi: "User account requests completed within SLA.", target: "≥98% within 4 hours" },
    { responsibility: "User Access Control", duty: "Ensure users have appropriate system access based on assigned roles.", kpi: "Unauthorized access incidents.", target: "Zero" },
    { responsibility: "Tender Management", duty: "Review, approve, publish, update, archive, and close tender advertisements.", kpi: "Tenders published within SLA after approval.", target: "Within 2 hours" },
    { responsibility: "Content Management", duty: "Maintain portal content including notices, banners, announcements, and user guides.", kpi: "Portal content updated as scheduled.", target: "100%" },
    { responsibility: "Data Quality Management", duty: "Verify completeness and accuracy of tender information before publication.", kpi: "Tender publication accuracy.", target: "≥99.5%" },
    { responsibility: "System Monitoring", duty: "Monitor portal performance, availability, and service health.", kpi: "Critical incidents detected proactively.", target: "100%" },
    { responsibility: "Incident Management", duty: "Respond to and coordinate resolution of portal issues.", kpi: "Critical incidents resolved within SLA.", target: "≥95%" },
    { responsibility: "Helpdesk Support", duty: "Provide first-line support to users experiencing portal issues.", kpi: "Support tickets resolved within SLA.", target: "≥95%" },
    { responsibility: "System Configuration", duty: "Configure workflows, categories, evaluation settings, notifications, and portal parameters.", kpi: "Configuration requests completed.", target: "≥98%" },
    { responsibility: "Notification Management", duty: "Ensure automated emails, SMS, and system notifications function correctly.", kpi: "Notification delivery success rate.", target: "≥99%" },
    { responsibility: "Security Administration", duty: "Monitor user activities, password policies, and security events.", kpi: "Security breaches attributable to administration.", target: "Zero" },
    { responsibility: "Audit Trail Monitoring", duty: "Review system logs and audit trails for suspicious activities.", kpi: "Audit reviews conducted.", target: "Weekly" },
    { responsibility: "Backup Verification", duty: "Verify successful execution of scheduled backups.", kpi: "Backup success rate.", target: "100%" },
    { responsibility: "Data Recovery Support", duty: "Coordinate restoration of portal data when required.", kpi: "Recovery success rate.", target: "100%" },
    { responsibility: "Performance Optimization", duty: "Identify system bottlenecks and recommend improvements.", kpi: "Performance improvement recommendations implemented.", target: "≥4 annually" },
    { responsibility: "Integration Monitoring", duty: "Monitor integrations with payment gateways, email services, SMS, and external systems.", kpi: "Integration uptime.", target: "≥99%" },
    { responsibility: "Documentation", duty: "Maintain user manuals, administrator guides, SOPs, and configuration documentation.", kpi: "Documentation updated.", target: "Quarterly" },
    { responsibility: "Compliance Management", duty: "Ensure portal operations comply with internal policies and applicable regulations.", kpi: "Compliance violations.", target: "Zero" },
    { responsibility: "Vendor Coordination", duty: "Coordinate with software developers and IT vendors during maintenance and upgrades.", kpi: "Scheduled maintenance completed successfully.", target: "100%" },
    { responsibility: "User Training", duty: "Conduct onboarding and refresher training for portal users and administrators.", kpi: "Training sessions conducted.", target: "≥2 per month" },
    { responsibility: "Change Management", duty: "Implement approved system changes with minimal disruption.", kpi: "Successful change implementation rate.", target: "≥98%" },
    { responsibility: "Release Management", duty: "Coordinate deployment of new portal features and updates.", kpi: "Releases deployed without major rollback.", target: "≥95%" },
    { responsibility: "Reporting", duty: "Prepare portal performance, usage, and incident reports for management.", kpi: "Reports submitted on schedule.", target: "Monthly" },
    { responsibility: "Continuous Improvement", duty: "Recommend enhancements to improve usability, efficiency, and customer experience.", kpi: "Improvement initiatives implemented.", target: "≥6 annually" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconShieldCheck size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Operational Standards</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Key Performance Indicators (KPI) — ADMINISTRATOR
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
            The Portal Administrator is responsible for the day-to-day administration, configuration, monitoring, and support of the Wintender platform. The role ensures that the portal remains secure, reliable, up-to-date, and provides an excellent user experience for Suppliers, Service Providers, Contractors, Procuring Entities, Financial Institutions, and System Administrators.
          </p>
        </section>

        {/* 1. EXECUTIVE TARGET SUMMARY */}
        <Section title="1. Operational Governance Metrics">
          <p className="mb-3">High-priority operational baselines required for portal governance:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProcessCard title="Portal Availability" desc="Target uptime ≥99.9% for operational continuity." />
            <ProcessCard title="Zero Breaches" desc="Zero unauthorized access & zero security breaches attributable to admin." />
            <ProcessCard title="Account SLA" desc="≥98% of user account requests completed within 4 hours." />
            <ProcessCard title="Tender SLA" desc="Approved tenders published to the portal within 2 hours." />
          </div>
        </Section>

        {/* 2. KEY RESPONSIBILITIES & PERFORMANCE MATRIX (TABLE VIEW) */}
        <Section title="2. Key Responsibilities & Performance Matrix">
          <p className="mb-4">
            Structured matrix detailing administrative duties, metrics, and compliance targets:
          </p>

          <div className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Key Responsibility</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Duties</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider">Key Performance Indicator (KPI)</th>
                    <th className="py-3 px-4 text-xs font-extrabold uppercase text-slate-500 tracking-wider text-right">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[13px]">
                  {administratorKPIs.map((row, idx) => (
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
        <Section title="3. Compliance & Audit Obligations">
          <p className="mb-2">Administrators perform duties strictly under platform security protocols:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
            <li><span className="text-slate-900">Weekly Audit Trail Reviews:</span> Systematic review of system access logs for anomalous behavior.</li>
            <li><span className="text-slate-900">Mandatory SLA Integrity:</span> Consistent compliance with ticket and account fulfillment SLAs.</li>
            <li><span className="text-slate-900">100% Data Verification:</span> Quality validation for every published tender advertisement.</li>
            <li><span className="text-slate-900">Zero Tolerance:</span> Zero compliance violations or unauthorized role elevation incidents.</li>
          </ul>
        </Section>

        {/* 4. CONTACT & ESCALATION DIRECTORY */}
        <Section title="4. Administration Contact Directory">
          <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 max-w-xl space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Portal Operations & Administration Office
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
            By operating within the Wintender E-Procurement Portal as a Portal Administrator, system actors commit to maintaining the SLA parameters, performance indicators, and legal compliance guidelines defined in this document.
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