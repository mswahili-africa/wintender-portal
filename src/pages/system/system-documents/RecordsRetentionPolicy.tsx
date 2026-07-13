import React from "react";
import { 
  IconArchive, 
  IconClipboardList, 
  IconScale, 
  IconShieldLock, 
  IconAlertOctagon, 
  IconChecklist,
  IconClockHour4,
  IconAlertTriangle
} from "@tabler/icons-react";

export default function RecordsRetentionPolicy() {
  const lastUpdated = "07th November, 2025";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconArchive size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Corporate Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Records Retention Policy
        </h2>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 flex items-center gap-1.5">
          <span>Latest Updated:</span>
          <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono font-medium">
            {lastUpdated}
          </span>
        </p>

        <p className="text-[14px] text-slate-600 mt-4 leading-relaxed max-w-4xl">
          This Records Retention Policy (“Policy”) establishes the foundational framework 
          governing the identification, classification, retention, storage, protection, and disposal 
          of information assets generated or maintained through the <strong className="text-slate-900 font-semibold">E-Procurement Portal</strong> (“Portal”). 
          This Policy forms an integral part of Wintender’s structural compliance, risk management, and overarching corporate governance architecture.
        </p>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <div className="space-y-10 text-[14px] leading-relaxed text-slate-600">
        
        {/* 1. PURPOSE */}
        <Section title="1. Purpose">
          <p className="mb-2">This policy framework is operationalized to satisfy the following parameters:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <FeatureItem>Ensure statutory legal & regulatory compliance</FeatureItem>
            <FeatureItem>Promote portal transparency & audit accountability</FeatureItem>
            <FeatureItem>Support verification & investigative functions</FeatureItem>
            <FeatureItem>Safeguard confidential business documents</FeatureItem>
            <FeatureItem>Reduce platform operational & legal liabilities</FeatureItem>
            <FeatureItem>Enable secure, systemic records lifecycle paths</FeatureItem>
          </div>
        </Section>

        {/* 2. SCOPE */}
        <Section title="2. Scope">
          <p>This Policy applies uniformly to the following operational modules:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
            <li>All electronic and physical record instances anchored to the Portal infrastructure.</li>
            <li>All Wintender corporate employees, executive management, consultants, and contractors.</li>
            <li>All proposal records or document tracks submitted or preserved by registered Suppliers.</li>
            <li>All system-generated infrastructure access logs and immutable transaction audit trails.</li>
          </ul>
          <p className="mt-2 text-xs text-slate-400 italic">
            This Policy remains binding regardless of the underlying storage medium, extending across cloud ecosystems, distributed servers, localized redundant backup networks, and portable hardware components.
          </p>
        </Section>

        {/* 3. DEFINITIONS */}
        <Section title="3. Definitions">
          <div className="space-y-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5">
            <DefinitionRow term="Record" definition="Any document, structural data input, log entry, or information element serving as immutable evidence of a business activity or portal transaction." />
            <DefinitionRow term="Retention Period" definition="The mandatory minimum time horizon across which a specific categorized record asset must be preserved securely." />
            <DefinitionRow term="Disposition" definition="The deployment of irreversible, secure destruction methodologies or permanent deletion passes applied to a record lifecycle." />
            <DefinitionRow term="Litigation Hold" definition="The instantaneous suspension of routine record deletion loops triggered by active legal dependencies, structural audits, or investigative parameters." />
          </div>
        </Section>

        {/* 4. RECORD CLASSIFICATION */}
        <Section title="4. Record Classification Categories">
          <p className="mb-4">Platform records are segregated into distinct tracking categories to isolate governance lines:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClassificationBlock title="4.1 Corporate Governance Records" items={["Incorporation documents", "Board resolutions", "Policies & compliance manuals"]} />
            <ClassificationBlock title="4.2 Supplier Records" items={["Registration documentation", "Compliance certificates", "Due diligence reports", "Disciplinary records"]} />
            <ClassificationBlock title="4.3 Procurement Records" items={["Tender advertisements", "Bid submissions", "Evaluation reports", "Contract award documents"]} />
            <ClassificationBlock title="4.4 Financial Records" items={["Invoices & receipts", "Subscription payments", "Transaction ledgers", "System audit reports"]} />
            <ClassificationBlock title="4.5 System & Technical Records" items={["User access logs", "IP tracking databases", "System activity streams", "Security incident files"]} />
            <ClassificationBlock title="4.6 Communication Records" items={["Official correspondence", "Portal notifications", "Appeals & dispute filings"]} />
          </div>
        </Section>

        {/* 5. RETENTION SCHEDULE */}
        <Section title="5. Retention Schedule Matrix">
          <div className="overflow-x-auto border border-zinc-200 rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Record Classification Category</th>
                  <th className="px-4 py-3 flex items-center gap-1.5"><IconClockHour4 size={14} className="text-emerald-500" /> Minimum Mandatory Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 text-xs font-medium text-slate-700">
                <TableRow category="Corporate Governance Records" period="Permanent Asset Preservation" isHighlighted />
                <TableRow category="Supplier Registration Files" period="7 Years following formal account termination" />
                <TableRow category="Procurement & Tendering Files" period="7 Years following definitive contract closure" />
                <TableRow category="Financial Records & Ledgers" period="7 Years counted from the corresponding financial year-end" />
                <TableRow category="Audit & Compliance Records" period="7 to 10 Years based on risk classification" />
                <TableRow category="System Logs & Security Traces" period="3 to 5 Years depending on volume metrics" />
                <TableRow category="Blacklisting & Investigation Files" period="10 Years calculated from case closure timestamp" />
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500 pl-2 border-l-2 border-zinc-200">
            <strong>Extension Note:</strong> Mandated retention horizons may automatically scale higher where explicitly compelled by regional statutes, independent oversight regulators, or open active forensic investigations.
          </p>
        </Section>

        {/* 6. COMPLIANCE & 7. STORAGE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="6. Legal and Regulatory Compliance">
            <p className="text-xs">
              Where overlapping statutory frameworks, public procurement regulations, or regional data laws impose 
              competing retention windows for an identical data node, the **longest retention criteria** shall take legal precedence and dictate system architecture actions.
            </p>
          </Section>

          <Section title="7. Storage and System Security">
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> High-grade data encryption in transit and at rest</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Rigid role-based internal access configurations</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Compulsory multi-factor authentication steps</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Redundant encrypted automated disaster recovery paths</li>
            </ul>
          </Section>
        </div>

        {/* 8. LITIGATION HOLD & 9. DISPOSAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="8. Litigation Hold Procedure">
            <div className="p-4 bg-white border border-zinc-200 rounded-xl flex gap-3 shadow-sm">
              <div className="p-1.5 bg-zinc-50 rounded-lg text-amber-600 shrink-0 h-fit">
                <IconScale size={18} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Immediately upon formal notification or reasonable awareness of imminent litigation, official regulatory investigations, 
                corporate audit lookups, or system disputes, a mandatory <strong className="text-slate-900 font-semibold">Litigation Hold</strong> will lock down relevant servers. 
                This action temporarily bypasses all standard, automated document destruction loops until the constraint is explicitly lifted.
              </p>
            </div>
          </Section>

          <Section title="9. Record Disposal and Destruction">
            <p className="text-xs">
              Following the verified lapse of an assigned retention horizon, protected elements undergo strict, 
              industry-standard cryptographic deletion paths or certified high-security shredding mechanisms. 
              Disposition protocols guarantee that processed files are rendered completely, irreversibly irrecoverable.
            </p>
          </Section>
        </div>

        {/* 10. DATA MINIMIZATION */}
        <Section title="10. Data Minimization Principle">
          <p className="mb-2">Platform storage frameworks enforce systemic structural limitation parameters:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Limiting persistent record collections to verified, active business needs.</li>
            <li>Executing automated system validation sweeps to scan long-standing databases.</li>
            <li>Systematically identifying and purging redundant, outdated, or duplicate document arrays.</li>
          </ul>
        </Section>

        {/* 11. RESPONSIBILITIES */}
        <Section title="11. System Responsibilities Framework">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ResponsibilityCard role="Corporate Management" scope="Enforces high-level structural policy compliance and ensures adequate organizational resource allocation." />
            <ResponsibilityCard role="Compliance Function" scope="Coordinates systematic monitoring passes, audits, and executes manual Litigation Hold constraints." />
            <ResponsibilityCard role="IT & Security" scope="Maintains technical architectural defensive walls, secure server arrays, and executes verified deletion cycles." />
            <ResponsibilityCard role="Staff & Contractors" scope="Ensures meticulous compliance during day-to-day record organization, logging, and threat reporting." />
          </div>
        </Section>

        {/* 12, 13, 14 LEGAL CONTEXT BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="12. Audit and Monitoring">
            <p className="text-xs">
              Wintender retains structural clearance to run unannounced technical data reviews. 
              Anomalous audit results or non-compliance trends are immediately flagged and escalated 
              to senior executive teams or board-level risk structures.
            </p>
          </Section>

          <Section title="13. Policy Violations">
            <p className="text-xs flex flex-col gap-2">
              <span>
                Unauthorized modification, premature file shredding, or malicious tampering with portal assets is treated 
                as a severe security breach.
              </span>
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <IconAlertTriangle size={12} /> Results in disciplinary review or legal reporting.
              </span>
            </p>
          </Section>

          <Section title="14. Policy Review">
            <p className="text-xs">
              This governance layout undergoes periodic testing and updates to dynamically respond to shifting 
              regulatory compliance landscapes, adjustments in cloud architectures, and new cybersecurity paradigms.
            </p>
          </Section>
        </div>

        {/* 15. ACCEPTANCE POLICY FOOTER */}
        <section className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-950 flex gap-4 items-start">
          <div className="p-2 bg-white/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
            <IconChecklist size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Acceptance and Enforcement Acknowledgement</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              Continuous operational collaboration, corporate employment engagement, or structural administrative access 
              to the Wintender E-Procurement Portal explicitly signals complete alignment and binding adherence 
              to the entire governance array outlined within this Records Retention Policy.
            </p>
          </div>
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

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-center px-3 py-2 border border-zinc-200/60 bg-zinc-50 rounded-xl text-xs font-medium text-slate-700">
      <span className="text-emerald-500 font-bold select-none">✓</span>
      <span>{children}</span>
    </div>
  );
}

interface DefinitionRowProps {
  term: string;
  definition: string;
}

function DefinitionRow({ term, definition }: DefinitionRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 pb-2.5 border-b border-zinc-200/60 last:pb-0 last:border-b-0">
      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider sm:w-48 shrink-0">
        {term}
      </span>
      <span className="text-xs text-slate-600">
        {definition}
      </span>
    </div>
  );
}

interface ClassificationBlockProps {
  title: string;
  items: string[];
}

function ClassificationBlock({ title, items }: ClassificationBlockProps) {
  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase mb-2 pb-1.5 border-b border-zinc-100 flex items-center gap-1.5">
          <IconClipboardList size={14} className="text-slate-500" />
          {title.split(" ").slice(1).join(" ")}
        </h4>
        <ul className="space-y-1 text-xs text-slate-600 font-normal">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-slate-300 select-none">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className="text-[10px] font-mono font-semibold text-slate-400 mt-3 block">
        CAT-{title.split(" ")[0].replace(".", "_")}
      </span>
    </div>
  );
}

interface TableRowProps {
  category: string;
  period: string;
  isHighlighted?: boolean;
}

function TableRow({ category, period, isHighlighted = false }: TableRowProps) {
  return (
    <tr className={`border-b border-zinc-200/60 transition-colors ${isHighlighted ? "bg-amber-50/40" : "hover:bg-zinc-50/50"}`}>
      <td className="px-4 py-3 font-semibold text-slate-900">{category}</td>
      <td className={`px-4 py-3 ${isHighlighted ? "text-amber-800 font-bold" : "text-slate-600 font-normal"}`}>{period}</td>
    </tr>
  );
}

interface ResponsibilityCardProps {
  role: string;
  scope: string;
}

function ResponsibilityCard({ role, scope }: ResponsibilityCardProps) {
  return (
    <div className="flex flex-col p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl shadow-sm">
      <div className="text-emerald-600 mb-1.5 shrink-0">
        <IconShieldLock size={18} className="stroke-[2]" />
      </div>
      <h4 className="text-xs font-bold text-slate-900 mb-1 tracking-wide uppercase">{role}</h4>
      <p className="text-slate-500 text-[11px] leading-relaxed font-normal">{scope}</p>
    </div>
  );
}