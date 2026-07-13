import React from "react";
import { 
  IconUsers, 
  IconGavel,  
  IconScale, 
  IconLeaf, 
  IconFingerprint, 
  IconReportMedical, 
  IconEyeCheck,
  IconAlertOctagon,
  IconBulb,
  IconShieldPlus
} from "@tabler/icons-react";
import { IconShield } from "@tabler/icons-react";

export default function SupplierCodeOfConduct() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconGavel size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Ethical Framework</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Supplier Code of Conduct
        </h2>

        <p className="text-[14px] text-slate-600 mt-4 leading-relaxed max-w-4xl">
          This Supplier Code of Conduct (“Code”) establishes the definitive ethical, legal, environmental, 
          and professional standards required of all vendors registered on the <strong className="text-slate-900 font-semibold">E-Procurement Portal</strong>. 
          Compliance with this Code is mandatory and constitutes a strict condition of platform registration and continued participation 
          in procurement opportunities.
        </p>
      </header>

      {/* CORE CONTENT LAYOUT */}
      <div className="space-y-10 text-[14px] leading-relaxed text-slate-600">
        
        {/* 1. PURPOSE AND SCOPE */}
        <Section title="1. Purpose and Scope">
          <p>
            This Code defines minimum standards of conduct applicable to all registered suppliers, including their board directors, 
            corporate employees, operational agents, subcontractors, and organizational affiliates engaged in activities 
            connected to marketplace tenders.
          </p>
          <p className="text-xs text-slate-500 pl-2 border-l-2 border-zinc-200">
            Suppliers hold full responsibility for cascading these expectations internally and ensuring equivalent contractual 
            compliance across their active subcontractors and supply chain nodes.
          </p>
        </Section>

        {/* 2. LEGAL & 3. ANTI-CORRUPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="2. Legal and Regulatory Compliance">
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Operate in full compliance with localized and national statutes.</li>
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Maintain valid business registrations, operating licenses, and tax statuses.</li>
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Promptly notify Wintender of suspensions, insolvencies, or investigations.</li>
            </ul>
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <IconAlertOctagon size={16} className="shrink-0 text-rose-600" />
              <span>Zero tolerance applies to deliberate regulatory non-compliance.</span>
            </div>
          </Section>

          <Section title="3. Anti-Bribery and Anti-Corruption">
            <p className="text-xs text-slate-500 mb-2 italic">Suppliers must absolutely prohibit the following practices:</p>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex gap-2"><span className="text-rose-500 font-bold">•</span> Offering or accepting bribes, kickbacks, or facilitation tokens.</li>
              <li className="flex gap-2"><span className="text-rose-500 font-bold">•</span> Influence peddling, collusion, or improper backchannel lobbying.</li>
              <li className="flex gap-2"><span className="text-rose-500 font-bold">•</span> Giving improper gifts or hospitality intended to skew award decisions.</li>
            </ul>
            <p className="mt-2 text-xs text-slate-400">
              Attempts to manipulate evaluation logic result in immediate disqualification and platform blacklisting.
            </p>
          </Section>
        </div>

        {/* 4. FAIR COMPETITION & 5. HUMAN RIGHTS */}
        <Section title="4. Fair Competition and Procurement Integrity">
          <p className="mb-3">Marketplace participants are strictly mandated to maintain authentic competition structures:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StandardCard icon={<IconScale />} label="Independent Bidding" desc="Formulate and submit unique, genuine bids entirely isolated from competitor insight." />
            <StandardCard icon={<IconShield />} label="Zero Collusion" desc="Avoid bid-rigging schemes, artificial price-fixing configurations, or market allocation pacts." />
            <StandardCard icon={<IconEyeCheck />} label="Conflict Disclosure" desc="Immediately declare potential or active conflicts of interest with procurement decision-makers." />
          </div>
        </Section>

        {/* 5. HUMAN RIGHTS & 6. ENVIRONMENTAL RESPONSIBILITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="5. Human Rights and Labour Standards">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <ComplianceBullet label="Forced Labor Ban" desc="Absolute prohibition of human trafficking or indentured labor." />
              <ComplianceBullet label="Child Labor Protection" desc="Strict compliance with international minimum age parameters." />
              <ComplianceBullet label="Equal Opportunity" desc="Zero tolerance for workplace discrimination or systemic harassment." />
              <ComplianceBullet label="Safe Working Environments" desc="Maintaining secure, health-compliant operational spaces." />
              <ComplianceBullet label="Statutory Wages" desc="Guaranteed payment of lawful localized wages and benefit items." />
            </div>
          </Section>

          <Section title="6. Environmental Responsibility">
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-4 space-y-3">
              <div className="flex gap-3 items-start">
                <IconLeftBorder color="text-emerald-600"><IconLeaf size={16} /></IconLeftBorder>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Ecological Accountability</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                    Suppliers must ensure absolute alignment with all applicable regional environmental laws, implement active 
                    waste minimization pipelines, prioritize responsible energy and resource usage, and enforce 
                    secure handling controls over hazardous compounds.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* 7. DATA PROTECTION & 8. INTELLECTUAL PROPERTY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="7. Data Protection & Security">
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Securely isolate and protect confidential tender materials.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Utilize shared data packages strictly for authorized bidding pipelines.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Maintain strict system firewalls against potential data breach events.</li>
              <li className="flex gap-2"><span className="text-emerald-500">✓</span> Adhere completely to governing statutory data protection rules.</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property Rights">
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Respect proprietary system methodologies and third-party property arrays.</li>
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Prevent unauthorized duplication or distribution of portal document assets.</li>
              <li className="flex gap-2"><span className="text-slate-400 font-bold">•</span> Ensure submitted proposal graphics or data packages cause zero infringement.</li>
            </ul>
          </Section>
        </div>

        {/* 9, 10, 11 CORPORATE EXPECTATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="9. Financial Transparency">
            <p className="text-xs">
              Registered organizations must maintain truthful financial records. 
              Falsifying record log values, submitting misrepresentations, or displaying fraudulent certifications 
              triggers direct platform exclusion.
            </p>
          </Section>

          <Section title="10. Conflict of Interest">
            <p className="text-xs">
              Suppliers must proactively flag situations that could impact objective participation, including 
              familial or financial links to buyers, technical consultants, or evaluating panel members.
            </p>
          </Section>

          <Section title="11. Supply Chain Responsibility">
            <p className="text-xs">
              Prime vendors remain fully accountable for downstream behaviors. Supplier firms must audit, 
              verify, and guarantee that their respective subcontracted nodes maintain equivalent ethical and operational benchmarks.
            </p>
          </Section>
        </div>

        {/* 12, 13, 14 MONITORING & BREACH STATUSES */}
        <Section title="12. Whistleblowing and Reporting Misconduct">
          <div className="flex gap-4 p-4 rounded-xl border border-zinc-200 bg-white shadow-sm max-w-3xl">
            <div className="p-2 bg-zinc-100 rounded-lg h-fit text-slate-700 shrink-0">
              <IconReportMedical size={20} />
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Suppliers are expected to report any identified unethical conduct or systemic manipulation attempts. 
              The portal provides secure channels to transmit reports confidentially. Wintender enforces strict protective bans 
              against any retaliation targets or whistleblower penalties.
            </p>
          </div>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="13. Monitoring, Audit, and Verification">
            <p className="text-xs">
              Wintender retains absolute authority to perform independent due diligence assessments, integrity checks, 
              and forensic system audits. Registered entities are required to cooperate fully with platform 
              compliance inspectors.
            </p>
          </Section>

          <Section title="14. Breach and Enforcement Parameters">
            <p className="text-xs text-slate-500 mb-2 font-medium">Verified system violations prompt progressive disciplinary enforcement:</p>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="critical">Bid Disqualification</StatusBadge>
              <StatusBadge type="critical">Portal Access Revocation</StatusBadge>
              <StatusBadge type="critical">Corporate Blacklisting</StatusBadge>
              <StatusBadge type="warning">Law Enforcement Referral</StatusBadge>
            </div>
          </Section>
        </div>

        {/* 15. CONTINUOUS IMPROVEMENT */}
        <Section title="15. Continuous Improvement">
          <p className="text-xs flex items-center gap-1.5 text-slate-600">
            <IconBulb size={14} className="text-emerald-500 shrink-0" />
            Suppliers are continuously urged to refine corporate governance matrices, optimize sustainability benchmarks, 
            and implement proactive compliance tracking systems within their organizational units.
          </p>
        </Section>

        {/* 16. ACCEPTANCE BOX */}
        <section className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-950 flex gap-4 items-start">
          <div className="p-2 bg-white/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
            <IconFingerprint size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Acceptance and Acknowledgment Execution</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              By finalizing registration and maintaining active user accounts within the Wintender E-Procurement Portal, 
              the Supplier officially confirms they have thoroughly read, understood, and consented to achieve total ongoing 
              compliance with all operational terms and ethical demands set forth in this Code.
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

interface StandardCardProps {
  icon: React.ReactElement;
  label: string;
  desc: string;
}

function StandardCard({ icon, label, desc }: StandardCardProps) {
  return (
    <div className="flex flex-col p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
      <div className="text-emerald-600 mb-2 shrink-0">
        {React.cloneElement(icon, { size: 18, className: "stroke-[2]" })}
      </div>
      <h4 className="text-xs font-bold text-slate-900 mb-1 tracking-wide uppercase">{label}</h4>
      <p className="text-slate-500 text-[11px] leading-relaxed font-normal">{desc}</p>
    </div>
  );
}

function ComplianceBullet({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="p-2.5 border border-zinc-200/60 bg-white rounded-xl">
      <div className="flex items-center gap-1 text-slate-900 font-bold text-xs uppercase tracking-wide">
        <IconUsers size={12} className="text-emerald-500" />
        {label}
      </div>
      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-normal">{desc}</p>
    </div>
  );
}

function IconLeftBorder({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className={`p-1.5 bg-zinc-100 border border-zinc-200 rounded-lg h-fit ${color} shrink-0`}>
      {children}
    </div>
  );
}

function StatusBadge({ type, children }: { type: "critical" | "warning"; children: React.ReactNode }) {
  const baseStyle = "px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border";
  const styles = {
    critical: "bg-slate-900 text-slate-100 border-slate-950",
    warning: "bg-zinc-100 text-slate-800 border-zinc-300"
  };

  return (
    <span className={`${baseStyle} ${styles[type]}`}>
      {children}
    </span>
  );
}