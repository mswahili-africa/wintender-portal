export default function DataProcessingAgreement() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-slate-800">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-green-700">
          WINTENDER E-PROCUREMENT PORTAL
        </h1>
        <h2 className="text-xl font-semibold text-green-700">
          Data Processing Agreement (DPA)
        </h2>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          This Data Processing Agreement (“Agreement” or “DPA”) forms part of the
          contractual relationship between <strong>Wintender</strong> (“Platform
          Owner” or “Data Processor,” where applicable) and the registered
          Supplier (“Data Controller” or “Supplier,” where applicable),
          collectively referred to as the “Parties”.
        </p>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          This DPA governs the processing of Personal Data in connection with the
          Supplier’s registration and use of the{" "}
          <strong>
            {/* :contentReference[oaicite:0]{index=0} */}
            E-Procurement Portal
          </strong>{" "}
          (“Portal”).
        </p>
      </header>

      {/* CONTENT */}
      <div className="space-y-8 text-sm leading-relaxed">
        <Section title="1. Purpose and Scope">
          <p>
            This DPA sets out the rights and obligations of the Parties regarding
            the processing of Personal Data transmitted, accessed, or generated
            through the Portal.
          </p>
          <p className="mt-2">This Agreement applies to processing related to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Supplier registration</li>
            <li>Tender participation</li>
            <li>Bid evaluation</li>
            <li>Contract award management</li>
            <li>Compliance verification</li>
            <li>Digital communication and notifications</li>
          </ul>
          <p className="mt-2">
            This DPA applies irrespective of whether processing occurs within or
            outside the Supplier’s jurisdiction.
          </p>
        </Section>

        <Section title="2. Definitions">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Personal Data</strong> – Any information relating to an
              identified or identifiable natural person
            </li>
            <li>
              <strong>Processing</strong> – Any operation performed on Personal
              Data, including collection, storage, use, disclosure, or deletion
            </li>
            <li>
              <strong>Data Subject</strong> – The individual to whom Personal Data
              relates
            </li>
            <li>
              <strong>Applicable Data Protection Laws</strong> – All laws
              governing the protection of Personal Data in relevant jurisdictions
            </li>
            <li>
              <strong>Sub-Processor</strong> – Any third party engaged by
              Wintender to process Personal Data on its behalf
            </li>
          </ul>
        </Section>

        <Section title="3. Roles of the Parties">
          <p>
            Depending on context:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              The Supplier acts as a <strong>Data Controller</strong> when
              submitting Personal Data of its employees or representatives.
            </li>
            <li>
              Wintender acts as a <strong>Data Processor</strong> when processing
              such data solely to provide Portal functionality.
            </li>
            <li>
              Where Wintender determines the purposes and means of processing
              (e.g., security monitoring or compliance analytics), it may act as
              an independent Data Controller.
            </li>
          </ul>
        </Section>

        <Section title="4. Nature and Purpose of Processing">
          <p>Processing activities include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hosting and storage of supplier registration data</li>
            <li>Bid submission and digital timestamping</li>
            <li>Secure document exchange</li>
            <li>Audit logging and compliance monitoring</li>
            <li>Communication and notification services</li>
          </ul>

          <p className="mt-3">Categories of Personal Data may include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Names and contact details</li>
            <li>Identification numbers</li>
            <li>Professional credentials and job titles</li>
            <li>Login credentials and IP addresses</li>
            <li>Digital signatures</li>
            <li>Financial and tax information</li>
          </ul>
        </Section>

        <Section title="5. Processor Obligations">
          <p>Where acting as a Data Processor, Wintender shall:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process Personal Data only on documented instructions</li>
            <li>Ensure confidentiality of authorized personnel</li>
            <li>
              Implement appropriate technical and organizational safeguards,
              including encryption, role-based access control, and audit logging
            </li>
            <li>Not sell, rent, or commercially exploit Personal Data</li>
            <li>Assist the Supplier in fulfilling Data Subject rights</li>
          </ul>
        </Section>

        <Section title="6. Supplier (Controller) Obligations">
          <ul className="list-disc pl-5 space-y-1">
            <li>Ensure lawful basis for processing uploaded Personal Data</li>
            <li>Inform Data Subjects of third-party processing</li>
            <li>Ensure accuracy and data minimization</li>
            <li>Avoid uploading sensitive Personal Data unless required</li>
            <li>
              Indemnify Wintender against claims arising from unlawful submissions
            </li>
          </ul>
        </Section>

        <Section title="7. Sub-Processors">
          <p>
            Wintender may engage Sub-Processors for hosting, cybersecurity, cloud
            infrastructure, or analytics services, subject to equivalent data
            protection obligations.
          </p>
        </Section>

        <Section title="8. International Data Transfers">
          <p>
            Where cross-border transfers occur, Wintender shall implement
            safeguards consistent with Applicable Data Protection Laws, including
            standard contractual clauses or encrypted transmission mechanisms.
          </p>
        </Section>

        <Section title="9. Data Security">
          <ul className="list-disc pl-5 space-y-1">
            <li>SSL/TLS encryption</li>
            <li>Firewalls and intrusion detection systems</li>
            <li>Access control and authentication</li>
            <li>Data backup and disaster recovery</li>
            <li>Vulnerability assessments and penetration testing</li>
          </ul>
        </Section>

        <Section title="10. Data Breach Notification">
          <p>
            Wintender shall notify the Supplier without undue delay upon becoming
            aware of a Personal Data breach and take prompt remedial action.
          </p>
        </Section>

        <Section title="11. Data Retention and Deletion">
          <p>
            Personal Data shall be retained only as necessary for procurement,
            compliance, audit, and legal purposes. Upon termination, data shall
            be returned or securely deleted subject to legal obligations.
          </p>
        </Section>

        <Section title="12. Data Subject Rights">
          <p>
            Data Subjects may exercise rights including access, rectification,
            erasure, restriction, objection, and portability where applicable.
          </p>
        </Section>

        <Section title="13. Audit and Compliance">
          <p>
            The Supplier may request reasonable evidence of compliance. Audit
            activities shall not compromise security or confidentiality of other
            users’ data.
          </p>
        </Section>

        <Section title="14. Liability and Indemnity">
          <p>
            Each Party is responsible for its own compliance with Applicable Data
            Protection Laws. Indirect damages are excluded where permitted by
            law.
          </p>
        </Section>

        <Section title="15. Termination">
          <p>
            This DPA remains effective for the duration of the Supplier’s use of
            the Portal. Data protection and confidentiality obligations survive
            termination.
          </p>
        </Section>

        <Section title="16. Governing Law">
          <p>
            This Agreement is governed by the laws specified in the primary
            Supplier Terms and Conditions.
          </p>
        </Section>

        <Section title="17. Entire Agreement">
          <p>
            This DPA forms an integral part of the Supplier’s contractual
            relationship with Wintender and prevails in the event of conflict
            concerning data protection matters.
          </p>
        </Section>

        <Section title="Acceptance">
          <p>
            By registering and continuing to use the Wintender E-Procurement
            Portal, the Supplier acknowledges and agrees to the terms of this Data
            Processing Agreement.
          </p>
        </Section>
      </div>
    </div>
  );
}

/* ---------------- HELPER COMPONENT ---------------- */

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