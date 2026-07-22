import React from "react";
import { 
  IconLeaf, 
  IconCloudLock, 
  IconShieldCheck, 
  IconUsers, 
  IconRefresh, 
  IconFileOff
} from "@tabler/icons-react";

export default function EnvironmentalSustainabilityPolicy() {
  const lastUpdated = "12th February, 2026";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-slate-800 antialiased selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <header className="mb-10 pb-8 border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <IconLeaf size={24} className="stroke-[2]" />
          <span className="text-xs font-bold uppercase tracking-widest">Corporate Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          WINTENDER ENVIRONMENTAL SUSTAINABILITY & PAPERLESS OPERATIONS POLICY
        </h1>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 flex items-center gap-1.5">
          <span>Latest Updated:</span>
          <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono font-medium">
            {lastUpdated}
          </span>
        </p>
      </header>

      {/* BODY CONTENT CONFIGURATION */}
      <div className="space-y-10 text-[14px] leading-relaxed text-slate-600">
        
        <PolicySection title="1. Policy Statement">
          <p>
            Wintender is committed to conducting its operations in an environmentally responsible and 
            sustainable manner by integrating digital technologies that minimize environmental impacts and 
            promote efficient use of natural resources. As a technology-driven procurement platform, 
            Wintender is dedicated to advancing paperless procurement practices, reducing waste, 
            conserving resources, and supporting sustainable procurement across both public and private sectors.
          </p>
          <p className="mt-3">
            We recognize that environmental stewardship is a shared responsibility and are committed to embedding 
            sustainability principles into our products, services, internal operations, and stakeholder engagement.
          </p>
        </PolicySection>

        <PolicySection title="2. Purpose">
          <p className="mb-3">The purpose of this Policy is to establish clear operational guidelines that:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-medium text-slate-700">
            <ListItem>Promote environmentally sustainable business practices across all operations.</ListItem>
            <ListItem>Minimize environmental impacts associated with administrative workflows.</ListItem>
            <ListItem>Drive complete adoption of paperless digital procurement ecosystems.</ListItem>
            <ListItem>Encourage highly efficient use of energy, raw materials, and resources.</ListItem>
            <ListItem>Support clients in achieving green objectives through digital transformation.</ListItem>
            <ListItem>Foster an organizational culture centered on active environmental responsibility.</ListItem>
          </ul>
        </PolicySection>

        <PolicySection title="3. Scope">
          <p className="mb-2">This Policy applies comprehensively without exception to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700 font-medium">
            <li>All Wintender employees, consultants, operational teams, and executive management.</li>
            <li>All cross-functional business units and associated operational activities.</li>
            <li>The Wintender e-Procurement Platform architecture and related auxiliary digital services.</li>
            <li>Contractors, technology partners, corporate suppliers, and service providers engaged by Wintender.</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Policy Commitments">
          <p className="text-slate-500 italic mb-6">Wintender binds its technological roadmaps to the following explicit pillars:</p>
          
          <div className="space-y-6">
            <CommitmentCard 
              icon={<IconFileOff className="text-emerald-600" />}
              subtitle="4.1 Promote Paperless Operations"
              description="Prioritize digital processes by publishing tender opportunities electronically, supporting online supplier registration/prequalification, facilitating electronic bid evaluation/submission, automating internal approvals, and strictly minimizing physical printing unless legally required."
            />

            <CommitmentCard 
              icon={<IconLeaf className="text-emerald-600" />}
              subtitle="4.2 Reduce Environmental Impact"
              description="Continuously seek channels to minimize paper consumption, lower greenhouse gas emissions associated with document logistics, favor remote collaboration/virtual meetings, and cultivate clean resource conservation within physical offices."
            />

            <CommitmentCard 
              icon={<IconUsers className="text-emerald-600" />}
              subtitle="4.3 Promote Sustainable Procurement"
              description="Encourage methodologies that favor environmentally responsible suppliers, champion ethical sourcing tracks, promote active participation of local enterprises/SMEs, and deeply blend macro-sustainability metrics directly into core evaluation logic."
            />

            <CommitmentCard 
              icon={<IconCloudLock className="text-emerald-600" />}
              subtitle="4.4 Responsible Digital Operations"
              description="Maintain clean, highly secure cloud-based document management infrastructure, protect structural datasets through rigid modern cybersecurity controls, and endlessly iterate server/computing efficiency metrics to cut ambient carbon footprints."
            />

            <CommitmentCard 
              icon={<IconShieldCheck className="text-emerald-600" />}
              subtitle="4.5 Compliance Frameworks"
              description="Align all software and operations alongside applicable environmental regulations, regional electronic procurement statutes, rigid data protection mandates, and foundational green-compliance benchmarks."
            />
          </div>
        </PolicySection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PolicySection title="5. Employee Responsibilities">
            <p className="mb-2">Every team member is expected to actively support these practices by:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Avoiding unnecessary printing and hard-copy generation.</li>
              <li>Properly managing digital records inside secure directories.</li>
              <li>Conserving energy across all workspaces responsibly.</li>
              <li>Reporting systemic opportunities for green performance metrics.</li>
            </ul>
          </PolicySection>

          <PolicySection title="6. Management Responsibilities">
            <p className="mb-2">Executive leadership and management teams shall maintain ownership to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Allocate critical financial/technical capital toward digital initiatives.</li>
              <li>Consistently monitor key environmental performance indices.</li>
              <li>Drive internal awareness campaigns and strategic green training models.</li>
              <li>Audit this policy systematically to reinforce long-term optimization.</li>
            </ul>
          </PolicySection>
        </div>

        <PolicySection title="7. Continuous Improvement">
          <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-950 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="p-3 bg-white/10 rounded-lg text-emerald-400 shrink-0">
              <IconRefresh size={24} className="animate-spin-slow" />
            </div>
            <div>
              <p className="font-medium text-white text-base">Iterative Evolution Commitment</p>
              <p className="text-slate-400 text-xs mt-1">
                Wintender iterates operational structures continuously by scaling state-of-the-art software systems, 
                monitoring feedback vectors from market participants, and locking targets against aggressive environmental metrics.
              </p>
            </div>
          </div>
        </PolicySection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60">
          <PolicySection title="8. Monitoring & Review">
            <p className="text-slate-600">
              Adherence is validated through automated software logs, continuous management oversight, and periodic functional reviews. 
              This framework is adjusted at minimum once annually or immediately following sweeping structural or legislative adjustments.
            </p>
          </PolicySection>

          <PolicySection title="9. Policy Approval">
            <p className="text-slate-600">
              This Environmental Sustainability and Paperless Operations Policy stands formally approved by Wintender Executive Management. 
              Every employee, technology contractor, and commercial vendor is expected to uphold these foundational guidelines across all business horizons.
            </p>
          </PolicySection>
        </div>

      </div>
    </div>
  );
}

/* -------------------- INTERNAL CLEAN DESIGN COMPONENTS -------------------- */

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}

function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <section className="space-y-2.5">
      <h2 className="text-lg font-bold text-slate-900 tracking-tight border-l-4 border-emerald-500 pl-3">
        {title}
      </h2>
      <div className="space-y-3 text-slate-600 font-normal leading-relaxed pl-4">
        {children}
      </div>
    </section>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 text-slate-700">
      <span className="text-emerald-500 font-bold select-none mt-0.5">✓</span>
      <span>{children}</span>
    </li>
  );
}

interface CommitmentCardProps {
  icon: React.ReactElement;
  subtitle: string;
  description: string;
}

function CommitmentCard({ icon, subtitle, description }: CommitmentCardProps) {
  return (
    <div className="flex gap-4 p-4 rounded-xl border border-zinc-200/60 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-2 bg-emerald-50 rounded-lg h-fit shrink-0">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          {subtitle}
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
}