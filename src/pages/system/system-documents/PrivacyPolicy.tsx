const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-green-700">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-green-600">
            Effective Date: <span className="font-medium">[2026]</span>
          </p>
        </header>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-8 text-gray-800 leading-relaxed">

          <section>
            <p>
              Wintender (“we”, “us”, “our”) is committed to protecting the privacy
              and security of personal data processed through the Wintender
              E-Procurement Portal (“Portal”). This Privacy Policy explains how
              we collect, use, store, and protect personal information.
            </p>
          </section>

          <Section title="1. Who We Are">
            <p>
              Wintender operates a secure electronic procurement platform that
              enables organizations to publish tenders and suppliers to submit
              bids electronically.
            </p>
            <p className="mt-2">
              Depending on the context, Wintender may act as a Data Controller or
              a Data Processor in accordance with applicable data protection
              laws.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name, job title, company name</li>
              <li>Email address and phone number</li>
              <li>Identification and compliance documents</li>
              <li>IP address, device data, login timestamps</li>
              <li>Bid documents, digital signatures, communications</li>
            </ul>
          </Section>

          <Section title="3. Purposes of Processing">
            <ul className="list-disc pl-6 space-y-1">
              <li>Supplier registration and verification</li>
              <li>Tender publication and bid management</li>
              <li>Evaluation and contract award processes</li>
              <li>Compliance, audit, and legal obligations</li>
              <li>System security and fraud prevention</li>
            </ul>
          </Section>

          <Section title="4. Legal Basis for Processing">
            <ul className="list-disc pl-6 space-y-1">
              <li>Performance of a contract</li>
              <li>Compliance with legal obligations</li>
              <li>Legitimate business interests</li>
              <li>Consent, where required by law</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing">
            <p>
              Personal data may be shared with procuring entities, authorized
              evaluators, technology service providers, and regulatory
              authorities where legally required.
            </p>
            <p className="mt-2 font-medium">
              Wintender does not sell personal data.
            </p>
          </Section>

          <Section title="6. Data Security">
            <ul className="list-disc pl-6 space-y-1">
              <li>SSL/TLS encryption</li>
              <li>Role-based access control</li>
              <li>Multi-factor authentication</li>
              <li>Audit logs and activity monitoring</li>
              <li>Secure backups and disaster recovery</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <p>
              Personal data is retained only for as long as necessary to fulfill
              procurement, legal, audit, and compliance requirements. Data is
              securely deleted or anonymized when no longer required.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <ul className="list-disc pl-6 space-y-1">
              <li>Right to access personal data</li>
              <li>Right to rectification</li>
              <li>Right to erasure (where applicable)</li>
              <li>Right to object or restrict processing</li>
              <li>Right to data portability</li>
            </ul>
          </Section>

          <Section title="9. Cookies and Tracking">
            <p>
              The Portal uses cookies to maintain secure sessions, improve user
              experience, and prevent fraud. Disabling cookies may affect
              functionality.
            </p>
          </Section>

          <Section title="10. Contact Information">
            <p className="font-medium">Data Protection Officer (DPO)</p>
            <p>Wintender</p>
            <p>Mbezi Beach, along New Bagamoyo Road</p>
            <p>Samaki Wabichi House, A21</p>
            <p>Email: info@wintender.co.tz</p>
            <p>Phone: +255 (0) 747 098 447 / 766 028 558</p>
          </Section>

          <section className="pt-6 border-t">
            <p className="text-sm text-gray-600">
              By using the Wintender E-Procurement Portal, you acknowledge that
              your personal data will be processed in accordance with this
              Privacy Policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

/* Reusable Section Component */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h3 className="text-xl font-semibold text-green-700 mb-2">
      {title}
    </h3>
    {children}
  </section>
);

export default PrivacyPolicy;