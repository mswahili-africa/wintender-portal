import React from "react";
import { 
  IconScale, 
  IconShieldLock, 
  IconBriefcase, 
  IconEyeOff, 
  IconDatabase,
  IconFingerprint,
  IconAlertCircle,
  IconHelpCircle
} from "@tabler/icons-react";

export const TermsAndConditions = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 mb-2">
          <IconScale size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Legal Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          SUPPLIER TERMS AND CONDITIONS
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Wintender E-Procurement Portal
        </h2>

        <p className="text-[14px] text-slate-600 mt-4 leading-relaxed max-w-4xl text-left">
          These Supplier Terms and Conditions (“Terms”) definitively govern the registration framework, structural access, 
          and ongoing utilization of the Wintender E-Procurement Portal (“Portal”) operated by Wintender (“Platform Owner”). 
          By completing registration loops, accessing technical services, or using Portal databases, the Supplier explicitly 
          consents to be legally bound by this regulatory framework.
        </p>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <div className="space-y-10 text-[14px] leading-relaxed text-slate-600">
        
        {/* 1. DEFINITIONS */}
        <Section title="1. Definitions">
          <div className="space-y-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5">
            <DefinitionRow term="Supplier / Contractor" definition="Any independent individual, commercial partnership, registered company, or legal corporate entity establishing portal profiles to bid on marketplace procurement openings." />
            <DefinitionRow term="Client / Procuring Entity (P.E)" definition="Any public or private purchasing organization leveraging portal infrastructures to advertise specifications, process evaluation workflows, and finalize awards." />
            <DefinitionRow term="Portal Infrastructure" definition="The holistic Wintender electronic e-procurement network, containing technical UI modules, database sets, application middleware, and data interfaces." />
            <DefinitionRow term="Bid / Tender Submission" definition="Any formal proposal, binding commercial quotation, certified expression of interest, or digital application file compiled and uploaded by vendors." />
            <DefinitionRow term="User Account" definition="The unique set of administrative access keys and verified credentials allocated to a Supplier to establish secure platform sessions." />
          </div>
        </Section>

        {/* 2. ELIGIBILITY & REGISTRATION */}
        <Section title="2. Eligibility and Registration Requirements">
          <p className="mb-3">
            The Supplier explicitly warrants that it holds proper operational standing as a legally recognized business entity with unrestricted authority to enter into binding mutual agreements. Completion of profile verification mandates the submission of:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <RequirementTag>Certificate of Incorporation</RequirementTag>
            <RequirementTag>Tax Identification Number (TIN)</RequirementTag>
            <RequirementTag>Valid Local Business License</RequirementTag>
            <RequirementTag>Governing Sector Certifications</RequirementTag>
            <RequirementTag>Authorized Signatory Frameworks</RequirementTag>
          </div>
          <p className="mt-2 text-xs text-slate-400 italic">
            Wintender reserves the absolute authority to independently audit submitted documentation arrays and grant or reject registration clearances at its corporate discretion.
          </p>
        </Section>

        {/* 3. SECURITY & 4. PORTAL USE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <Section title="3. Account Security & Access Control">
            <div className="p-4 bg-white border border-zinc-200 rounded-xl flex gap-3 shadow-sm">
              <div className="p-1.5 bg-zinc-50 rounded-lg text-slate-700 shrink-0 h-fit">
                <IconShieldLock size={18} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Supplier maintains total personal accountability for safeguarding the confidentiality of their active system tokens. 
                Any detected unauthorized usage, perimeter penetration, or leaked account details must be reported to technical support teams instantaneously.
              </p>
            </div>
          </Section>

          <Section title="4. Prohibited Use of the Portal">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System Prohibitions:</p>
            <ul className="space-y-1 text-xs text-slate-700 font-medium">
              <li className="flex gap-2"><span className="text-rose-500">✕</span> Uploading misleading or fraudulent credential packages</li>
              <li className="flex gap-2"><span className="text-rose-500">✕</span> Injecting malicious software scripts or vulnerability scanners</li>
              <li className="flex gap-2"><span className="text-rose-500">✕</span> Initiating collusive bid schemes or anti-competitive actions</li>
              <li className="flex gap-2"><span className="text-rose-500">✕</span> Launching infrastructure denial-of-service queries</li>
            </ul>
          </Section>
        </div>

        {/* 5. BID VALIDITY & 6. FEES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="5. Bid Submission and Legal Validity">
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Digital platform submittals translate directly into binding contractual offers.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Vendors bear absolute liability for precision checking uploaded pricing rows.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Proposals stand firm for the total baseline duration declared in the tender document.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Submission rollbacks must match explicit withdrawal operational paths.</li>
            </ul>
          </Section>

          <Section title="6. Platform Fees and Payments">
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Dynamic processing tariffs are calculated and shown prior to system checkout steps.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> System transactions are non-refundable unless distinct conditions explicitly apply.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Wintender updates subscription and access tables following adequate vendor warning periods.</li>
            </ul>
          </Section>
        </div>

        {/* 7, 8, 9 CONFIDENTIALITY & IP */}
        <Section title="7. Data Privacy & Proprietary System Integrity">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <GridFeatureBlock 
              icon={<IconEyeOff />} 
              title="7. Confidentiality" 
              desc="All specific tender specifications, pricing models, and direct internal buyer discussions are confidential assets barred from third-party distribution." 
            />
            <GridFeatureBlock 
              icon={<IconDatabase />} 
              title="8. Data Protection" 
              desc="Suppliers approve the programmatic processing of corporate metric blocks for general evaluation steps, technical alignment compliance checks, and ecosystem analytics loops." 
            />
            <GridFeatureBlock 
              icon={<IconBriefcase />} 
              title="9. Intellectual Property" 
              desc="Portal base architecture, codebases, and brand marks remain the exclusive property of Wintender. Reverse engineering steps are completely blocked." 
            />
          </div>
        </Section>

        {/* 10, 11, 12 STATUTORY OBLIGATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="10. Compliance and Ethics">
            <p className="text-xs">
              Operating teams must conform explicitly to regional anti-corruption laws, institutional competition laws, 
              local taxation rules, and labor laws during all transaction steps.
            </p>
          </Section>

          <Section title="11. Audit and Verification">
            <p className="text-xs">
              Wintender retains the right to demand fresh validation document uploads or deploy compliance inspectors. 
              Refusal to cooperate immediately blocks server access permissions.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p className="text-xs">
              Wintender assumes zero financial liability for actual tendering outcomes, final evaluation board rejections, 
              unplanned system offline windows, or indirect commercial performance losses.
            </p>
          </Section>
        </div>

        {/* 13, 14, 15 SERVICE DEVIATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="13. System Availability">
            <p className="text-xs">
              While engineering structures target continuous operational server availability, uninterrupted portal access 
              remains free from absolute warranties due to maintenance windows.
            </p>
          </Section>

          <Section title="14. Account Termination">
            <p className="text-xs">
              Either operational group can formally deactivate active account structures. Completed deactivations do not 
              erase accrued commercial payment obligations or existing tender commitments.
            </p>
          </Section>

          <Section title="15. Indemnification Clause">
            <p className="text-xs">
              The Supplier agrees to indemnify and hold harmless Wintender from damages resulting from platform policy violations, 
              misleading profile records, or statutory compliance infringements.
            </p>
          </Section>
        </div>

        {/* 16. FORCE MAJEURE & 17. GOVERNING LAW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="16. Force Majeure Exceptions">
            <p className="text-xs">
              Neither operational side stands liable for baseline service processing stalls driven directly by conditions 
              stretching beyond realistic systemic control, including national infrastructural failures, labor crises, 
              or sudden environmental disruptions.
            </p>
          </Section>

          <Section title="17. Governing Law & Dispute Pipelines">
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-start gap-2.5">
              <IconAlertCircle size={16} className="text-slate-800 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700">
                These framework conditions are interpreted under the exclusive laws of the **United Republic of Tanzania**. 
                Unresolved transaction friction must be submitted to friendly mutual settlement tracks or structured arbitration.
              </p>
            </div>
          </Section>
        </div>

        {/* 18. POLICY AMENDMENTS */}
        <Section title="18. Structural Amendments">
          <p className="text-xs flex items-center gap-1.5 text-slate-600">
            <IconHelpCircle size={14} className="text-slate-400 shrink-0" />
            Wintender maintains authorization to adjust system policies. Ongoing use of server environments following updates 
            denotes definitive acceptance of updated legal items.
          </p>
        </Section>

        {/* 19. FORMAL ACCEPTANCE BLOCK */}
        <section className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-950 flex gap-4 items-start shadow-md">
          <div className="p-2 bg-white/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
            <IconFingerprint size={22} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">19. Acceptance and Legal Agreement Execution</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              By fulfilling online onboarding setups and confirming profile tracking prompts via the portal validation system, 
              the registering entity explicitly signs that it has digested these terms entirely, pledges to execute all 
              governing rules, and guarantees all submitted corporate files reflect absolute accuracy.
            </p>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="text-center mt-12 border-t border-zinc-200 pt-6 text-slate-400 text-xs font-medium">
        © {currentYear} Wintender. All structural rights reserved.
      </footer>
    </div>
  );
};

/* -------------------- INTERNAL CLEAN DESIGN COMPONENTS -------------------- */

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="space-y-2.5">
      <h3 className="text-md font-bold text-slate-900 tracking-tight border-l-4 border-emerald-500 pl-3 uppercase text-[13px]">
        {title}
      </h3>
      <div className="space-y-3 text-slate-600 font-normal leading-relaxed pl-4">
        {children}
      </div>
    </section>
  );
}

interface DefinitionRowProps {
  term: string;
  definition: string;
}

function DefinitionRow({ term, definition }: DefinitionRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 pb-2.5 border-b border-zinc-200/60 last:pb-0 last:border-b-0">
      <span className="text-xs font-bold text-slate-900 tracking-wider sm:w-56 shrink-0">
        {term}
      </span>
      <span className="text-xs text-slate-600">
        {definition}
      </span>
    </div>
  );
}

function RequirementTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-center px-3 py-2 border border-zinc-200/60 bg-zinc-50 rounded-xl text-xs font-medium text-slate-700">
      <span className="text-emerald-500 font-bold select-none">✓</span>
      <span>{children}</span>
    </div>
  );
}

interface GridFeatureBlockProps {
  icon: React.ReactElement;
  title: string;
  desc: string;
}

function GridFeatureBlock({ icon, title, desc }: GridFeatureBlockProps) {
  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase mb-2 pb-1.5 border-b border-zinc-100 flex items-center gap-1.5">
          {React.cloneElement(icon, { size: 14, className: "text-slate-500" })}
          {title.split(" ").slice(1).join(" ")}
        </h4>
        <p className="text-slate-500 text-[11px] leading-relaxed font-normal">
          {desc}
        </p>
      </div>
      <span className="text-[9px] font-mono font-semibold text-slate-400 mt-3 block">
        SEC-{title.split(" ")[0].replace(".", "_")}
      </span>
    </div>
  );
}