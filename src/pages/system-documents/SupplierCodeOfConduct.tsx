export default function SupplierCodeOfConduct() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-slate-800">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-green-700">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-semibold text-green-700">
          Supplier Code of Conduct
        </h2>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          This Supplier Code of Conduct (“Code”) establishes the ethical,
          legal, environmental, and professional standards required of all
          suppliers registered on the{" "}
          <strong>E-Procurement Portal</strong>.
          Compliance with this Code is mandatory and constitutes a condition
          of registration and continued participation in procurement
          opportunities facilitated through the Portal.
        </p>
      </div>

      {/* CONTENT */}
      <div className="space-y-8 text-sm leading-relaxed">
        <Section title="1. Purpose and Scope">
          <p>
            This Code defines minimum standards of conduct applicable to all
            registered suppliers, including their directors, employees,
            agents, subcontractors, and affiliates engaged in activities
            connected to tenders published through the Portal.
          </p>
          <p>
            Suppliers shall ensure that this Code is cascaded internally and
            contractually to subcontractors and supply chain partners where
            applicable.
          </p>
        </Section>

        <Section title="2. Legal and Regulatory Compliance">
          <ul className="list-disc pl-5 space-y-1">
            <li>Operate in full compliance with all applicable laws and regulations.</li>
            <li>Maintain valid business registration, licenses, and tax compliance.</li>
            <li>
              Promptly notify Wintender of any suspension, investigation,
              insolvency, or material regulatory action.
            </li>
          </ul>
          <p className="mt-2 font-medium text-red-600">
            Zero tolerance applies to deliberate regulatory non-compliance.
          </p>
        </Section>

        <Section title="3. Anti-Bribery and Anti-Corruption">
          <p>Suppliers must uphold the highest standards of integrity.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Offering or accepting bribes, kickbacks, or facilitation payments</li>
            <li>Influence peddling or improper lobbying</li>
            <li>Improper gifts or hospitality intended to influence decisions</li>
          </ul>
          <p className="mt-2">
            Any attempt to manipulate evaluation outcomes shall result in
            immediate disqualification and possible blacklisting.
          </p>
        </Section>

        <Section title="4. Fair Competition and Procurement Integrity">
          <ul className="list-disc pl-5 space-y-1">
            <li>Submit independent and genuine bids</li>
            <li>Avoid collusion, bid-rigging, and price-fixing</li>
            <li>Disclose any actual or potential conflicts of interest</li>
          </ul>
        </Section>

        <Section title="5. Human Rights and Labour Standards">
          <ul className="list-disc pl-5 space-y-1">
            <li>Prohibition of forced labor and human trafficking</li>
            <li>Prohibition of child labor</li>
            <li>Non-discrimination and equal opportunity</li>
            <li>Safe and healthy working conditions</li>
            <li>Payment of lawful wages and benefits</li>
          </ul>
        </Section>

        <Section title="6. Environmental Responsibility">
          <ul className="list-disc pl-5 space-y-1">
            <li>Compliance with environmental laws</li>
            <li>Minimization of waste and pollution</li>
            <li>Responsible resource and energy use</li>
            <li>Safe handling of hazardous materials</li>
          </ul>
        </Section>

        <Section title="7. Data Protection and Information Security">
          <ul className="list-disc pl-5 space-y-1">
            <li>Protect confidential procurement information</li>
            <li>Use data solely for legitimate tender purposes</li>
            <li>Implement safeguards against data breaches</li>
            <li>Comply with applicable data protection laws</li>
          </ul>
        </Section>

        <Section title="8. Intellectual Property Rights">
          <ul className="list-disc pl-5 space-y-1">
            <li>Respect intellectual property rights</li>
            <li>Avoid unauthorized use or disclosure</li>
            <li>Ensure submitted documents do not infringe third-party rights</li>
          </ul>
        </Section>

        <Section title="9. Financial Transparency">
          <p>
            Suppliers must maintain accurate and truthful records. Any
            falsification, misrepresentation, or fraudulent certification
            is strictly prohibited.
          </p>
        </Section>

        <Section title="10. Conflict of Interest">
          <p>
            Suppliers must disclose any situation that could compromise
            impartial participation, including relationships with
            procurement decision-makers or competing bidders.
          </p>
        </Section>

        <Section title="11. Subcontracting and Supply Chain Responsibility">
          <p>
            Suppliers remain fully accountable for the conduct of
            subcontractors and must ensure equivalent ethical standards
            are applied.
          </p>
        </Section>

        <Section title="12. Whistleblowing and Reporting Misconduct">
          <p>
            Suppliers are encouraged to report unethical conduct. Reports
            may be submitted confidentially. Retaliation against
            whistleblowers is strictly prohibited.
          </p>
        </Section>

        <Section title="13. Monitoring, Audit, and Verification">
          <p>
            Wintender reserves the right to conduct due diligence,
            compliance assessments, and investigations. Suppliers must
            cooperate fully.
          </p>
        </Section>

        <Section title="14. Breach and Enforcement">
          <ul className="list-disc pl-5 space-y-1">
            <li>Bid disqualification</li>
            <li>Suspension or termination of Portal access</li>
            <li>Blacklisting or debarment</li>
            <li>Referral to regulatory or law enforcement authorities</li>
          </ul>
        </Section>

        <Section title="15. Continuous Improvement">
          <p>
            Suppliers are encouraged to strengthen governance,
            sustainability practices, and internal compliance frameworks.
          </p>
        </Section>

        <Section title="16. Acceptance and Acknowledgment">
          <p>
            By registering on the Portal, the Supplier confirms that it has
            read, understood, and agrees to comply fully with this Code.
            Acceptance of this Code is a mandatory precondition for
            participation in tenders.
          </p>
        </Section>
      </div>
    </div>
  );
}

/* ------------------------- HELPER COMPONENT ------------------------- */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-base text-green-700 font-semibold mb-2">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}