import React from "react";
import { 
  IconLock, 
  IconId, 
  IconTarget, 
  IconScale, 
  IconShare, 
  IconCookie, 
  IconMapPin, 
  IconMail, 
  IconPhone 
} from "@tabler/icons-react";

export default function PrivacyPolicy() {
  const effectiveDate = "12th February, 2026";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconLock size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Compliance Standards</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Privacy Policy
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
        
        {/* INITIAL STATEMENTS */}
        <section className="text-slate-700 leading-relaxed max-w-4xl">
          <p>
            Wintender (“we”, “us”, Our”) is completely committed to protecting the privacy 
            and digital security of personal datasets processed through the Wintender 
            E-Procurement Portal (“Portal”). This Privacy Policy outlines exactly how 
            we aggregate, process, store, and secure personal information profiles.
          </p>
        </section>

        {/* 1. WHO WE ARE */}
        <Section title="1. Who We Are">
          <p>
            Wintender runs a secure, multi-tenant digital electronic procurement platform engineered 
            to enable buying entities to publish tenders and dynamic commercial suppliers to submit 
            bids electronically.
          </p>
          <p className="mt-2 text-xs text-slate-400 italic">
            Depending on contextual logic, Wintender balances operations as either a Data Controller or 
            a Data Processor under governing regional data protection frameworks.
          </p>
        </Section>

        {/* 2. INFORMATION WE COLLECT */}
        <Section title="2. Information We Collect">
          <p className="mb-3">We collect clear, minimized structural datasets necessary for operational workflows:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CollectionCard icon={<IconId />} label="Identity Metadata" value="Full user name, technical job title, and registered company name." />
            <CollectionCard icon={<IconMail />} label="Contact Channels" value="Corporate email addresses and localized business phone numbers." />
            <CollectionCard icon={<IconLock />} label="Compliance Vaulting" value="Verification credentials, certifications, and identification profiles." />
            <CollectionCard icon={<IconScale />} label="System Footprints" value="IP addresses, system device telemetry, and precise login timestamps." />
          </div>
          <p className="mt-3 text-xs text-slate-500 pl-2 border-l-2 border-zinc-200">
            • <span className="font-semibold text-slate-700">Project Files:</span> Submitted bid documents, structural digital signatures, and direct support communication arrays.
          </p>
        </Section>

        {/* 3. PURPOSES OF PROCESSING */}
        <Section title="3. Purposes of Processing">
          <p className="mb-3">Personal data is managed intentionally to drive core system functionality:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <ProcessCard title="Supplier Registry" desc="Managing secure partner verification and profile activation loops." />
            <ProcessCard title="Tender Pipelines" desc="Publishing tender files and organizing structural bid submittals." />
            <ProcessCard title="Evaluation Paths" desc="Facilitating authorized vendor score tracking and award allocations." />
            <ProcessCard title="Audit Readiness" desc="Maintaining legal compliance, ledger lookups, and reporting paths." />
            <ProcessCard title="Fraud Prevention" desc="Sustaining portal firewall parameters and platform transaction integrity." />
          </div>
        </Section>

        {/* 4. LEGAL BASIS FOR PROCESSING */}
        <Section title="4. Legal Basis for Processing">
          <p className="mb-2">We process information tracks exclusively under valid legal pillars:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
            <li><span className="text-slate-900">Performance of a Contract:</span> Managing services requested directly by platform users.</li>
            <li><span className="text-slate-900">Legal Mandates:</span> Meeting statutory rules or governmental reporting configurations.</li>
            <li><span className="text-slate-900">Legitimate Interests:</span> Hardening security layers and optimizing portal features.</li>
            <li><span className="text-slate-900">Direct Consent:</span> Granted voluntarily where required by local compliance structures.</li>
          </ul>
        </Section>

        {/* 5. DATA SHARING */}
        <Section title="5. Data Sharing">
          <p>
            Personal data arrays may flow to buying entities, authorized proposal evaluators, secure technology 
            infrastructure partners, and legal regulatory frameworks where statutory mandates require transmission.
          </p>
          <div className="mt-3 bg-zinc-100 border border-zinc-200/60 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wide inline-block">
            Wintender maintains a strict policy: We do not sell personal data.
          </div>
        </Section>

        {/* 6. DATA SECURITY */}
        <Section title="6. Data Security">
          <p className="mb-3">Security baselines use multi-layered defensive frameworks:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
            <div className="p-3 border border-zinc-200 bg-white rounded-xl text-xs font-semibold text-slate-800 shadow-sm">SSL/TLS Crypto</div>
            <div className="p-3 border border-zinc-200 bg-white rounded-xl text-xs font-semibold text-slate-800 shadow-sm">Role Access Keys</div>
            <div className="p-3 border border-zinc-200 bg-white rounded-xl text-xs font-semibold text-slate-800 shadow-sm">Multi-Factor Auth</div>
            <div className="p-3 border border-zinc-200 bg-white rounded-xl text-xs font-semibold text-slate-800 shadow-sm">Continuous Audits</div>
            <div className="p-3 border border-zinc-200 bg-white rounded-xl text-xs font-semibold text-slate-800 shadow-sm">Disaster Backups</div>
          </div>
        </Section>

        {/* 7. DATA RETENTION & 8. YOUR RIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="7. Data Retention">
            <p className="text-xs">
              Personal entries remain active exclusively throughout active procurement lifecycles, legal verification bounds, 
              or compliance review windows. Data profiles undergo complete, secure purging or absolute anonymization once 
              structural retention schedules lapse.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <ul className="space-y-1 text-xs text-slate-700 font-medium">
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Right to access specific personal records</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Right to correct inaccurate information fields</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Right to request complete profile deletion</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Right to object or restrict processing tasks</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Right to export data via clean portability rails</li>
            </ul>
          </Section>
        </div>

        {/* 9. COOKIES & TRACKING */}
        <Section title="9. Cookies and Tracking">
          <div className="flex gap-4 p-4 rounded-xl border border-zinc-200 bg-white shadow-sm max-w-2xl">
            <div className="p-2 bg-zinc-100 rounded-lg h-fit text-slate-700 shrink-0">
              <IconCookie size={20} />
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              The Portal runs essential cookies solely to secure active authentication sessions, optimize page performance, 
              and prevent automated fraud vectors. Deactivating cookie layers inside web browsers may restrict certain 
              interactive dashboard workflows.
            </p>
          </div>
        </Section>

        {/* 10. CONTACT INFORMATION */}
        <Section title="10. Contact Information">
          <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-5 max-w-xl space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Data Protection Officer (DPO)</h4>
              <p className="text-sm font-semibold text-slate-800">Wintender Corporate Office</p>
            </div>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <IconMapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <span>Mbezi Beach, along New Bagamoyo Road, Samaki Wabichi House, Room A21, Dar es Salaam, Tanzania</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMail size={16} className="text-slate-400 shrink-0" />
                <a href="mailto:info@wintender.co.tz" className="text-emerald-600 hover:underline font-medium">info@wintender.co.tz</a>
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
            By interacting with and utilizing the Wintender E-Procurement Portal, users formalize consensus 
            and acknowledge that personal data channels will be managed accurately alongside the parameters 
            established inside this Privacy Policy.
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

interface CollectionCardProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

function CollectionCard({ icon, label, value }: CollectionCardProps) {
  return (
    <div className="flex gap-3 p-3 rounded-xl border border-zinc-200/60 bg-white shadow-sm">
      <div className="p-1.5 bg-zinc-50 border border-zinc-100 rounded-lg h-fit text-emerald-600 shrink-0">
        {React.cloneElement(icon, { size: 16, className: "stroke-[2]" })}
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">{label}</h4>
        <p className="text-slate-500 text-[11px] mt-0.5 font-normal leading-relaxed">{value}</p>
      </div>
    </div>
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