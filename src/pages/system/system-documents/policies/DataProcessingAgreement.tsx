import React from "react";
import { 
  IconDatabase, 
  IconShieldLock, 
  IconTerminal2, 
  IconUserCheck,
  IconServer,
  IconAlertTriangle,
  IconInfoCircle 
} from "@tabler/icons-react";

export default function DataProcessingAgreement() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconShieldLock size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Privacy & Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Data Processing Agreement (DPA)
        </h2>

        <p className="text-[14px] text-slate-600 mt-4 leading-relaxed max-w-4xl">
          This Data Processing Agreement (“Agreement” or “DPA”) forms part of the contractual 
          relationship between <strong className="text-slate-900 font-semibold">Wintender</strong> (“Platform Owner” 
          or “Data Processor,” where applicable) and the registered Supplier (“Data Controller” or “Supplier,” 
          where applicable), collectively referred to as the “Parties”.
        </p>

        <p className="text-[14px] text-slate-600 mt-2 leading-relaxed max-w-4xl">
          This DPA governs the processing of Personal Data in connection with the Supplier’s registration 
          and structural use of the <strong className="text-slate-900 font-semibold">E-Procurement Portal</strong> (“Portal”).
        </p>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <div className="space-y-10 text-[14px] leading-relaxed text-slate-600">
        
        {/* PURPOSE AND SCOPE */}
        <Section title="1. Purpose and Scope">
          <p>
            This DPA sets out the fundamental rights and operational obligations of the Parties regarding 
            the processing of Personal Data transmitted, accessed, or generated through the Portal ecosystem.
          </p>
          <p className="mt-2 text-slate-900 font-medium">This Agreement applies comprehensively to processing related to:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            <ScopeItem>Supplier registration profiles</ScopeItem>
            <ScopeItem>Tender participation arrays</ScopeItem>
            <ScopeItem>Bid evaluation protocols</ScopeItem>
            <ScopeItem>Contract award management</ScopeItem>
            <ScopeItem>Compliance verification tracking</ScopeItem>
            <ScopeItem>Digital notifications & alerts</ScopeItem>
          </div>
          <p className="mt-3 text-xs text-slate-400 italic">
            This DPA applies uniformly irrespective of whether processing operations occur inside or outside the Supplier’s localized jurisdiction.
          </p>
        </Section>

        {/* DEFINITIONS */}
        <Section title="2. Definitions">
          <div className="space-y-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5">
            <DefinitionRow term="Personal Data" definition="Any information relating to an identified or identifiable natural person." />
            <DefinitionRow term="Processing" definition="Any operation or set of operations performed on Personal Data, including collection, compilation, storage, disclosure, or secure deletion." />
            <DefinitionRow term="Data Subject" definition="The specific individual to whom the underlying Personal Data relates." />
            <DefinitionRow term="Applicable Laws" definition="All statutory frameworks governing the protection of Personal Data within relevant operating jurisdictions." />
            <DefinitionRow term="Sub-Processor" definition="Any third-party node or infrastructure operator engaged by Wintender to process data structural values." />
          </div>
        </Section>

        {/* ROLES OF THE PARTIES */}
        <Section title="3. Roles of the Parties">
          <p className="mb-3">Roles scale and shift transparently depending on the specific operational context:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 bg-white p-4 rounded-xl shadow-sm">
              <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-800 rounded mb-2">Supplier Role</span>
              <p className="text-xs font-semibold text-slate-900 mb-1">Data Controller</p>
              <p className="text-xs text-slate-500">
                Acts as a Controller when submitting explicit Personal Data belonging to its employees, internal signatories, or operational representatives.
              </p>
            </div>
            <div className="border border-zinc-200 bg-white p-4 rounded-xl shadow-sm">
              <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-900 text-slate-100 rounded mb-2">Wintender Role</span>
              <p className="text-xs font-semibold text-slate-900 mb-1">Data Processor / Independent Controller</p>
              <p className="text-xs text-slate-500">
                Acts as a Processor when facilitating pure Portal features. Where determining operational tracking, security parameters, or system-wide analytics, Wintender acts as an independent Controller.
              </p>
            </div>
          </div>
        </Section>

        {/* NATURE AND PURPOSE */}
        <Section title="4. Nature and Purpose of Processing">
          <p className="mb-2">Processing protocols broadly encompass the following pipelines:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
            <li>Hosting and maintenance of operational supplier registration metadata.</li>
            <li>Bid submittal pipeline tracking and immutable cryptographic timestamping.</li>
            <li>Secure corporate document exchange vaults.</li>
            <li>System-wide audit logging and infrastructure compliance tracking.</li>
          </ul>

          <div className="mt-4 p-4 rounded-xl bg-zinc-100 border border-zinc-200/60">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <IconDatabase size={14} className="text-emerald-600" />
              Regulated Categories of Personal Data
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-600">
              <div>• Corporate Names</div>
              <div>• Contact Identifiers</div>
              <div>• Identification Numbers</div>
              <div>• Professional Credentials</div>
              <div>• Login Tokens & IPs</div>
              <div>• Cryptographic Signatures</div>
            </div>
          </div>
        </Section>

        {/* OBLIGATIONS BLOCKS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="5. Processor Obligations">
            <p className="text-xs text-slate-400 mb-2 italic">Where processing variables run under Wintender architectures, the platform shall:</p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Process data strictly inside validated, documented instructions.</li>
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Ensure confidentiality configurations bind all authorized engineers.</li>
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Deploy role-based encryption access keys and rigid tracking logs.</li>
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Maintain zero commercial data exploitation models (no selling/renting).</li>
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Cooperate fully to execute dynamic Data Subject verification requests.</li>
            </ul>
          </Section>

          <Section title="6. Supplier (Controller) Obligations">
            <p className="text-xs text-slate-400 mb-2 italic">Suppliers transferring credential arrays into platform zones remain bound to:</p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Guarantee clear, lawful legal baselines for all uploaded elements.</li>
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Notify operational Data Subjects regarding third-party service links.</li>
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Execute strict data minimization strategies prior to sync operations.</li>
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Restrict uploading sensitive datasets unless explicitly requested.</li>
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Indemnify the platform against non-compliant upstream transmissions.</li>
            </ul>
          </Section>
        </div>

        {/* SUB-PROCESSORS & TRANSFERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="7. Sub-Processors">
            <p className="text-xs">
              Wintender retains processing authorization to coordinate with vetted Sub-Processors specialized 
              in cloud tier hosting, active system firewalls, and data storage solutions, enforcing data safety 
              clauses that match or exceed these platform benchmarks.
            </p>
          </Section>

          <Section title="8. International Data Transfers">
            <p className="text-xs">
              Where cross-border pipeline transfers trigger, Wintender implements strict transfer safeguards 
              aligned perfectly with regional statutes, deploying standard contractual clauses and end-to-end 
              encrypted packet channels.
            </p>
          </Section>
        </div>

        {/* DATA SECURITY PROTOCOLS */}
        <Section title="9. Data Security Frameworks">
          <p className="mb-3 text-slate-500">Platform defensive infrastructure layers are optimized across multiple vectors:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SecurityCard icon={<IconTerminal2 />} title="SSL/TLS Encryption" desc="Transit states are fully wrapped inside strong cryptographic protocols." />
            <SecurityCard icon={<IconShieldLock />} title="Intrusive Firewalls" desc="Proactive threat mitigation loops screen traffic continuously." />
            <SecurityCard icon={<IconUserCheck />} title="Granular Access Control" desc="Strict identity access tokens secure server configurations." />
            <SecurityCard icon={<IconServer />} title="Redundant Backups" desc="Encrypted disaster nodes preserve dataset integrity seamlessly." />
            <SecurityCard icon={<IconAlertTriangle />} title="Penetration Scans" desc="System maps run regular vulnerability testing schedules." />
          </div>
        </Section>

        {/* LEGAL & SURVIVABILITY BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="10. Breach Notification">
            <p className="text-xs">
              Upon verifying an anomalous platform exploit or unauthorized system breach, Wintender will notify 
              affected Suppliers without undue delay, outlining specific diagnostic variables and initiating instantaneous mitigation protocols.
            </p>
          </Section>

          <Section title="11. Retention and Deletion">
            <p className="text-xs">
              Personal datasets endure only throughout the active procurement lifecycle or mandatory compliance windows. 
              Following account termination, profiles undergo automated, irreversible purging loops unless legal mandates compel preservation.
            </p>
          </Section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Section title="12. Data Subject Rights">
            <p className="text-xs">
              Platform features inherently support core consumer rights, including localized validation requests for profile rectification, erasure requests, processing objections, and clean portability export actions.
            </p>
          </Section>

          <Section title="13. Audit Rights">
            <p className="text-xs">
              Suppliers can request reasonable verification compliance reports. Administrative audits must navigate pre-approved timelines and must never compromise neighboring multi-tenant database partitions.
            </p>
          </Section>

          <Section title="14. Liability Allocation">
            <p className="text-xs">
              Each Party answers fully for its distinct architectural compliance loops. Indirect, tangential, or speculative operational damages remain systematically excluded from liability calculations where lawful.
            </p>
          </Section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="15. Agreement Termination">
            <p className="text-xs">
              This DPA maps dynamically to active platform use cycles. Confidentiality configurations and general structural protection boundaries indefinitely survive the cancellation of core marketplace interactions.
            </p>
          </Section>

          <Section title="16. Governing Law">
            <p className="text-xs">
              The statutory interpretation of this document flows alongside the foundational legal terms declared inside the primary Wintender Master Terms and Conditions.
            </p>
          </Section>
        </div>

        <Section title="17. Entire Agreement">
          <p className="text-xs">
            This DPA serves as the authoritative agreement concerning platform privacy parameters. Its clauses instantly supersede competing statements or parallel transactional documents relative to localized data protection logic.
          </p>
        </Section>

        {/* FINAL SYSTEM ACCEPTANCE BOX */}
        <section className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-950 flex gap-4 items-start">
          <div className="p-2 bg-white/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
            <IconInfoCircle size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Acceptance and Execution Acknowledgment</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              By finalizing registration and maintaining active operational workflows inside the Wintender E-Procurement Portal, 
              the Supplier declares absolute consensus and signs off on the full processing terms, security structures, 
              and global governance matrices detailed inside this Agreement.
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
      <h2 className="text-md font-bold text-slate-900 tracking-tight border-l-4 border-emerald-500 pl-3">
        {title}
      </h2>
      <div className="space-y-3 text-slate-600 font-normal leading-relaxed pl-4">
        {children}
      </div>
    </section>
  );
}

function ScopeItem({ children }: { children: React.ReactNode }) {
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

interface SecurityCardProps {
  icon: React.ReactElement;
  title: string;
  desc: string;
}

function SecurityCard({ icon, title, desc }: SecurityCardProps) {
  return (
    <div className="flex flex-col p-4 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-emerald-600 mb-2 shrink-0">
        {React.cloneElement(icon, { size: 20, className: "stroke-[2]" })}
      </div>
      <h4 className="text-xs font-bold text-slate-900 mb-1 tracking-wide uppercase">{title}</h4>
      <p className="text-slate-500 text-[11px] leading-relaxed font-normal">{desc}</p>
    </div>
  );
}