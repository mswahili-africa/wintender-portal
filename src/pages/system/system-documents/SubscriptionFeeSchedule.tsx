import React from "react";
import { 
  IconShieldCheck, 
  IconCreditCard, 
  IconBriefcase, 
  IconBuilding, 
  IconInfoCircle 
} from "@tabler/icons-react";

export default function SubscriptionFeeSchedule() {
  const effectiveDate = "18th February, 2026";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconShieldCheck size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Commercial Annex</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1">
          Subscription & Fee Schedule Annex
        </h2>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 flex items-center gap-1.5">
          <span>Effective Date:</span>
          <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono font-medium">
            {effectiveDate}
          </span>
        </p>
        <p className="text-[14px] text-slate-600 mt-4 leading-relaxed max-w-4xl">
          This Subscription & Fee Schedule Annex (“Annex”) forms part of the Supplier Terms & Conditions 
          governing the use of the <strong className="text-slate-900 font-semibold">E-Procurement Portal</strong> (“Portal”). 
          This Annex sets out the applicable subscription models, transaction fees, and payment obligations 
          for Suppliers registered on the Portal.
        </p>
      </header>

      {/* CORE CONTENT */}
      <div className="space-y-10 text-[14px] leading-relaxed text-slate-600">
        
        {/* PURPOSE SECTION */}
        <Section title="1. Purpose">
          <p className="mb-3">This Annex establishes a transparent, tier-based commercial framework to:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 flex gap-2.5 items-start">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>Sustain platform operations and digital infrastructure</span>
            </div>
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 flex gap-2.5 items-start">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>Enhance system security frameworks and innovation cycles</span>
            </div>
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 flex gap-2.5 items-start">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>Provide scalable tier access aligned with supplier capacity</span>
            </div>
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 flex gap-2.5 items-start">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>Ensure equitable cost allocation across the ecosystem</span>
            </div>
          </div>
        </Section>

        {/* SUBSCRIPTION TIERS BLOCK */}
        <Section title="2. Subscription Tiers">
          <p className="mb-6 text-slate-500">
            Wintender offers distinct subscription tiers designed to strategically align with 
            corporate sizing, aggregate activity volumes, and structural procurement milestones.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* TIER 1: BASIC */}
            <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Entry Tier</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">Basic Registration</h3>
                  </div>
                  <IconBriefcase className="text-slate-400 w-5 h-5" />
                </div>
                <div className="my-4 pb-4 border-b border-zinc-100">
                  <span className="text-2xl font-black text-slate-900">TZS 20,000</span>
                  <span className="text-slate-400 text-xs font-medium"> / year</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-medium">Ideal for occasional bidders and small micro-enterprises.</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5">Includes:</h4>
                    <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                      <li>Profile registry configuration</li>
                      <li>Publicly listed tender entries</li>
                      <li>Standard bid submissions</li>
                      <li>Basic technical support loops</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1.5">Limitations:</h4>
                    <ul className="space-y-1 text-xs text-slate-500 list-disc pl-4">
                      <li>Restricted vault space allocation</li>
                      <li>No performance analytics panels</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* TIER 2: PROFESSIONAL */}
            <div className="bg-zinc-50 border border-zinc-200/80 shadow-sm rounded-2xl p-6 flex flex-col justify-between relative">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600">Most Popular</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">Professional Tier</h3>
                  </div>
                  <IconCreditCard className="text-emerald-600 w-5 h-5" />
                </div>
                <div className="my-4 pb-4 border-b border-zinc-200/60">
                  <span className="text-xl font-bold text-slate-800">Upon Consultation</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 font-medium">Engineered for active suppliers and growing mid-sized operations.</p>
                
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-1.5">Includes:</h4>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                    <li>Unlimited scale bid submissions</li>
                    <li>Extended document storage architecture</li>
                    <li>Custom structural tender alerts</li>
                    <li>Bid metrics monitoring dashboard</li>
                    <li>Downloadable submission verifications</li>
                    <li>Priority channel support access</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TIER 3: ENTERPRISE */}
            <div className="bg-slate-900 text-white shadow-md rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">High Volume</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Enterprise Model</h3>
                  </div>
                  <IconBuilding className="text-slate-300 w-5 h-5" />
                </div>
                <div className="my-4 pb-4 border-b border-white/10">
                  <span className="text-xl font-bold text-slate-100">Upon Consultation</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 font-normal">Custom workflows tailored for corporate scale bidders.</p>
                
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Includes:</h4>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc pl-4">
                    <li>Dedicated operational account manager</li>
                    <li>Advanced analytic metrics profiles</li>
                    <li>Core platform API infrastructure integrations</li>
                    <li>Multi-user dynamic permission structures</li>
                    <li>First-priority priority technical SLAs</li>
                    <li>Early-access tender notices</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* FEES & ADD-ONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="3. Transaction-Based Fees">
            <h4 className="font-semibold text-slate-900 mb-1">3.1 Bid Submission Fee</h4>
            <p className="text-slate-600 mb-2">
              Applicable per individualized project filing unless natively incorporated into your current subscription tier.
            </p>
            <div className="bg-zinc-100 border border-zinc-200/60 rounded-xl p-3 text-slate-800 font-medium inline-block text-xs">
              Fee Structure: Upon Consultation per submission.
            </div>
          </Section>

          <Section title="4. Feature Add-Ons">
            <p className="mb-2">Suppliers can configure tailored system modifications on demand:</p>
            <ul className="space-y-1 text-slate-700 list-disc pl-4 text-xs font-medium">
              <li>Advanced analytics reports – <span className="text-slate-500 font-normal">TZS (TBD)</span></li>
              <li>Supplier promotional listings – <span className="text-slate-500 font-normal">TZS (TBD)</span></li>
              <li>Compliance vault file expansions – <span className="text-slate-500 font-normal">TZS (TBD)</span></li>
              <li>Digital matrix certificate validation – <span className="text-slate-500 font-normal">TZS (TBD)</span></li>
            </ul>
            <p className="text-xs text-slate-400 mt-2 italic">Add-on solutions are compiled and processed via individual statements.</p>
          </Section>
        </div>

        {/* REGULATORY LEGAL BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="5. Payment Terms">
            <ul className="space-y-1 text-slate-600 list-disc pl-4 text-xs">
              <li>Fees are collected fully in advance.</li>
              <li>All allocations flow via formal system rails.</li>
              <li>Tier tools unlock following settlement.</li>
              <li>Statements compile and distribute digitally.</li>
            </ul>
          </Section>

          <Section title="6. Renewal & Expiry">
            <ul className="space-y-1 text-slate-600 list-disc pl-4 text-xs">
              <li>Tiers cover twelve (12) month horizons.</li>
              <li>Alert windows trigger before termination dates.</li>
              <li>Grace failures yield down-grades or locks.</li>
            </ul>
          </Section>

          <Section title="7. Non-Payment Actions">
            <ul className="space-y-1 text-slate-600 list-disc pl-4 text-xs">
              <li>Wintender maintains the right to block usage profiles.</li>
              <li>Arrears trigger lawful penalty structures.</li>
              <li>Isolation does not dissolve historical debts.</li>
            </ul>
          </Section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Section title="8. Refund Policy">
            <p className="text-xs text-slate-600">
              Balances are fixed and non-refundable unless resulting from documented duplicate ledger postings, verified software computing errors, or total platform runtime failures directly caused by Wintender nodes.
            </p>
          </Section>

          <Section title="9. Tax Obligations">
            <p className="text-xs text-slate-600">
              All listed fee tiers exist exclusive of regional statutory values and related direct levies. Suppliers remain strictly responsible for any local withholding or statutory deductions required by domestic frameworks.
            </p>
          </Section>

          <Section title="10. Adjustments Framework">
            <p className="text-xs text-slate-600">
              Wintender retains structural rights to adjust pricing indices against micro-economic realities, operational innovations, or systemic inflationary variables. Adjustments are declared early and apply upon upcoming renewal intervals.
            </p>
          </Section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <Section title="11. System Suspension">
            <p className="text-xs text-slate-600">
              Subscription structures guarantee availability rather than individual bid frequency. Voluntary closure or mid-cycle platform restrictions do not mandate dynamic prorated reversals unless formal adjustments are approved.
            </p>
          </Section>

          <Section title="12. Bespoke Corporate Frameworks">
            <p className="text-xs text-slate-600">
              Enterprise clusters with extreme data needs can execute bespoke agreements. Customized provisions outpace this text if formally specified in signed operational addendums.
            </p>
          </Section>
        </div>

        {/* SYSTEM FINAL ACCEPTANCE BOX */}
        <section className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-950 flex gap-4 items-start">
          <div className="p-2 bg-white/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
            <IconInfoCircle size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">13. Structural Execution Acknowledgement</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              By confirming deployment inside a premium service tier, suppliers declare comprehensive consensus with the fee mechanics, billing cycles, liability limitations, and systemic governance rules embedded directly within this Annex framework.
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