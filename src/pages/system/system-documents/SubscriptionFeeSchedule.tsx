export default function SubscriptionFeeSchedule() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-slate-800">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-green-700">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-semibold text-green-700">
          Subscription & Fee Schedule Annex
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Effective Date: <strong>18th February, 2026</strong>
        </p>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          This Subscription & Fee Schedule Annex (“Annex”) forms part of the
          Supplier Terms & Conditions governing use of the{" "}
          {/* <strong>
            :contentReference[oaicite:0]{index=0}
          </strong>{" "} */}
          <strong>
            E-Procurement Portal
          </strong>{" "}
          (“Portal”). This Annex sets out the applicable subscription models,
          transaction fees, and payment obligations for Suppliers registered
          on the Portal.
        </p>
      </header>

      {/* CONTENT */}
      <div className="space-y-8 text-sm leading-relaxed">
        <Section title="1. Purpose">
          <p>This Annex establishes a transparent, tier-based commercial framework to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Sustain platform operations and digital infrastructure</li>
            <li>Enhance system security and innovation</li>
            <li>Provide scalable access aligned with supplier business capacity</li>
            <li>Ensure equitable cost allocation across the procurement ecosystem</li>
          </ul>
        </Section>

        <Section title="2. Subscription Tiers">
          <p>
            Wintender may offer multiple subscription categories to align with
            supplier size, activity level, and procurement strategy.
          </p>
        </Section>

        <Section title="2.1 Basic Registration (Entry Tier)">
          <Info label="Target Users" value="Occasional bidders and SMEs" />
          <Info label="Annual Fee" value="TZS 10,000 /=" />

          <h4 className="font-medium mt-3">Includes:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Company profile registration</li>
            <li>Access to publicly listed tenders</li>
            <li>Ability to submit bids</li>
            <li>Email notifications</li>
            <li>Basic technical support</li>
          </ul>

          <h4 className="font-medium mt-3">Limitations:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Limited document storage</li>
            <li>No analytics dashboard</li>
            <li>Standard support response times</li>
          </ul>
        </Section>

        <Section title="2.2 Professional Subscription">
          <Info label="Target Users" value="Active suppliers and mid-sized enterprises" />
          <Info label="Annual Fee" value="Upon Consultation" />

          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Unlimited bid submissions</li>
            <li>Extended document storage</li>
            <li>Tender alert customization</li>
            <li>Bid tracking dashboard</li>
            <li>Downloadable submission confirmations</li>
            <li>Priority email support</li>
          </ul>
        </Section>

        <Section title="2.3 Enterprise Subscription">
          <Info label="Target Users" value="High-volume suppliers and corporate bidders" />
          <Info label="Annual Fee" value="Upon Consultation" />

          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Dedicated account management</li>
            <li>Advanced analytics and performance reports</li>
            <li>API integration (where applicable)</li>
            <li>Multi-user role management</li>
            <li>Priority technical support</li>
            <li>Early-access procurement notifications (where permitted)</li>
          </ul>
        </Section>

        <Section title="3. Transaction-Based Fees">
          <h4 className="font-medium">3.1 Bid Submission Fee</h4>
          <p>
            Applicable per tender submission where not included in the
            subscription tier.
          </p>
          <p className="font-medium">Fee: Upon Consultation per submission.</p>
        </Section>

        <Section title="4. Feature Add-Ons">
          <p>Suppliers may optionally subscribe to premium features:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Advanced analytics reports – TZS (To be determined)</li>
            <li>Supplier promotional listing – TZS (To be determined)</li>
            <li>Compliance document vault expansion – TZS (To be determined)</li>
            <li>Digital certificate verification – TZS (To be determined)</li>
          </ul>
          <p className="mt-2">Add-on services shall be billed separately.</p>
        </Section>

        <Section title="5. Payment Terms">
          <ul className="list-disc pl-5 space-y-1">
            <li>All subscription fees are payable in advance</li>
            <li>Payments shall be made through approved Portal payment channels</li>
            <li>Premium access is activated upon payment confirmation</li>
            <li>Invoices shall be issued electronically</li>
          </ul>
        </Section>

        <Section title="6. Renewal and Expiry">
          <ul className="list-disc pl-5 space-y-1">
            <li>Subscriptions are valid for twelve (12) months</li>
            <li>Renewal reminders shall be issued prior to expiry</li>
            <li>Failure to renew may result in downgrade or suspension</li>
          </ul>
        </Section>

        <Section title="7. Non-Payment">
          <ul className="list-disc pl-5 space-y-1">
            <li>Wintender may suspend Portal access for overdue payments</li>
            <li>Outstanding balances may attract recovery charges where lawful</li>
            <li>Suspension does not waive payment obligations</li>
          </ul>
        </Section>

        <Section title="8. Refund Policy">
          <p>Subscription fees are non-refundable except in cases of:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Duplicate payments</li>
            <li>Proven billing errors</li>
            <li>Service unavailability attributable solely to Wintender</li>
          </ul>
        </Section>

        <Section title="9. Taxes">
          <ul className="list-disc pl-5 space-y-1">
            <li>All fees are exclusive of applicable taxes unless stated otherwise</li>
            <li>Suppliers are responsible for statutory deductions where required</li>
          </ul>
        </Section>

        <Section title="10. Fee Adjustments">
          <p>
            Wintender reserves the right to revise fees to reflect system
            enhancements, regulatory changes, infrastructure costs, or inflation.
          </p>
          <p>
            Any changes shall be communicated in advance and apply at the next
            renewal cycle.
          </p>
        </Section>

        <Section title="11. Suspension or Termination">
          <p>
            Subscription fees remain payable for the active period regardless
            of bid activity. Termination does not entitle the Supplier to a
            prorated refund unless expressly agreed.
          </p>
        </Section>

        <Section title="12. Enterprise Custom Agreements">
          <p>
            Large-volume suppliers may negotiate bespoke subscription packages
            subject to separate written agreement. Such agreements shall
            supersede this Annex where expressly stated.
          </p>
        </Section>

        <Section title="13. Acceptance">
          <p>
            By registering for any paid subscription tier, the Supplier
            acknowledges and agrees to the applicable fee structure, payment
            terms, non-refundable policy, and commercial governance framework
            established in this Annex.
          </p>
        </Section>
      </div>
    </div>
  );
}

/* -------------------- HELPER COMPONENTS -------------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-base font-semibold mb-2 text-green-700">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <p>
      <span className="font-medium">{label}:</span> {value}
    </p>
  );
}