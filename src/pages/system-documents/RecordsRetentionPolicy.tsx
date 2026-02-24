export default function RecordsRetentionPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-slate-800">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-green-700">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-semibold text-green-700">
          Records Retention Policy
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Latest Updated: <strong>07th November, 2025</strong>
        </p>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          This Records Retention Policy (“Policy”) establishes the framework
          governing the identification, classification, retention, storage,
          protection, and disposal of records generated or maintained through
          the{" "}
          <strong>
            {/* :contentReference[oaicite:0]{index=0} */}
            E-Procurement Portal
          </strong>{" "}
          (“Portal”). This Policy forms part of Wintender’s compliance, risk
          management, and corporate governance architecture.
        </p>
      </header>

      {/* CONTENT */}
      <div className="space-y-8 text-sm leading-relaxed">
        <Section title="1. Purpose">
          <ul className="list-disc pl-5 space-y-1">
            <li>Ensure compliance with applicable legal and regulatory requirements</li>
            <li>Promote transparency and accountability in procurement processes</li>
            <li>Support audit and investigative functions</li>
            <li>Safeguard confidential and sensitive information</li>
            <li>Reduce operational and legal risk</li>
            <li>Enable systematic and secure record lifecycle management</li>
          </ul>
        </Section>

        <Section title="2. Scope">
          <p>This Policy applies to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>All electronic and physical records connected to the Portal</li>
            <li>All Wintender employees, management, consultants, and contractors</li>
            <li>Records submitted or stored by registered Suppliers</li>
            <li>System-generated logs and audit trails</li>
          </ul>
          <p className="mt-2">
            This Policy applies regardless of storage medium, including cloud
            infrastructure, servers, backup systems, and portable storage devices.
          </p>
        </Section>

        <Section title="3. Definitions">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Record</strong> – Any document, data entry, log, or
              information asset evidencing a business activity or transaction
            </li>
            <li>
              <strong>Retention Period</strong> – The minimum time a record must
              be preserved
            </li>
            <li>
              <strong>Disposition</strong> – Secure destruction or permanent
              deletion of a record
            </li>
            <li>
              <strong>Litigation Hold</strong> – Suspension of deletion due to
              legal or investigative requirements
            </li>
          </ul>
        </Section>

        <Section title="4. Record Classification">
          <List
            title="4.1 Corporate Governance Records"
            items={[
              "Incorporation documents",
              "Board resolutions",
              "Policies and compliance manuals",
            ]}
          />
          <List
            title="4.2 Supplier Records"
            items={[
              "Registration documentation",
              "Compliance certificates",
              "Due diligence reports",
              "Blacklisting and disciplinary records",
            ]}
          />
          <List
            title="4.3 Procurement Records"
            items={[
              "Tender advertisements",
              "Bid submissions",
              "Evaluation reports",
              "Award notifications",
              "Contract documents",
            ]}
          />
          <List
            title="4.4 Financial Records"
            items={[
              "Invoices",
              "Subscription payments",
              "Transaction logs",
              "Audit reports",
            ]}
          />
          <List
            title="4.5 System and Technical Records"
            items={[
              "Access logs",
              "IP tracking logs",
              "System activity logs",
              "Security incident reports",
            ]}
          />
          <List
            title="4.6 Communication Records"
            items={[
              "Official correspondence",
              "Notifications",
              "Appeals and dispute documentation",
            ]}
          />
        </Section>

        <Section title="5. Retention Schedule">
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Record Category</th>
                  <th className="border px-3 py-2 text-left">
                    Minimum Retention Period
                  </th>
                </tr>
              </thead>
              <tbody>
                <Row label="Corporate Governance Records" value="Permanent" />
                <Row label="Supplier Registration Files" value="7 years after account termination" />
                <Row label="Procurement Files" value="7 years after contract closure" />
                <Row label="Financial Records" value="7 years from financial year-end" />
                <Row label="Audit & Compliance Records" value="7–10 years" />
                <Row label="System Logs & Security Records" value="3–5 years" />
                <Row label="Blacklisting & Investigation Files" value="10 years from closure" />
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            Retention periods may be extended where required by law, regulators,
            or ongoing investigations.
          </p>
        </Section>

        <Section title="6. Legal and Regulatory Compliance">
          <p>
            Where multiple legal or regulatory retention requirements apply, the
            longer period shall prevail.
          </p>
        </Section>

        <Section title="7. Storage and Security">
          <ul className="list-disc pl-5 space-y-1">
            <li>Encryption and role-based access control</li>
            <li>Multi-factor authentication</li>
            <li>Regular backups and disaster recovery systems</li>
            <li>Secure, access-controlled physical storage (where applicable)</li>
          </ul>
        </Section>

        <Section title="8. Litigation Hold Procedure">
          <p>
            Upon awareness of litigation, regulatory investigation, audit review,
            or formal dispute, a Litigation Hold shall be issued suspending
            routine deletion of relevant records.
          </p>
        </Section>

        <Section title="9. Record Disposal and Destruction">
          <p>
            Upon expiry of the retention period, records shall be securely
            destroyed using industry-compliant methods ensuring
            irrecoverability.
          </p>
        </Section>

        <Section title="10. Data Minimization Principle">
          <ul className="list-disc pl-5 space-y-1">
            <li>Retention limited to legitimate business needs</li>
            <li>Periodic review of stored records</li>
            <li>Elimination of redundant or obsolete data</li>
          </ul>
        </Section>

        <Section title="11. Responsibilities">
          <p><strong>Management:</strong> Policy enforcement and resourcing</p>
          <p><strong>Compliance Function:</strong> Monitoring, reviews, litigation holds</p>
          <p><strong>IT Department:</strong> Technical safeguards and secure deletion</p>
          <p><strong>Employees & Contractors:</strong> Proper record handling and reporting</p>
        </Section>

        <Section title="12. Audit and Monitoring">
          <p>
            Wintender may conduct periodic audits and compliance reviews. Findings
            may be escalated to senior management or board-level oversight.
          </p>
        </Section>

        <Section title="13. Policy Violations">
          <p>
            Unauthorized destruction, alteration, or misuse of records may
            result in disciplinary action, termination, or legal reporting.
          </p>
        </Section>

        <Section title="14. Policy Review">
          <p>
            This Policy shall be reviewed periodically to reflect regulatory,
            technological, cybersecurity, and governance developments.
          </p>
        </Section>

        <Section title="15. Acceptance">
          <p>
            Compliance with this Records Retention Policy is a condition of
            employment, engagement, or Portal access.
          </p>
        </Section>
      </div>
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

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

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-3">
      <p className="font-medium">{title}</p>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="border px-3 py-2">{label}</td>
      <td className="border px-3 py-2">{value}</td>
    </tr>
  );
}