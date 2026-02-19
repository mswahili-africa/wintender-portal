
export const TermsAndConditions = () => {
    return (
        <div className="bg-white text-black min-h-screen py-12 px-8 md:px-24">
            {/* Header Section */}
            <header className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-3">
                    SUPPLIER TERMS AND CONDITIONS
                </h1>
                <h2 className="text-xl font-semibold text-green-500">
                    WINTENDER E-PROCUREMENT PORTAL
                </h2>
            </header>
            {/* Intro */}
            <p className="text-gray-800 mb-6">
                These Supplier Terms and Conditions (“Terms”) govern the registration, access, and use of the
                Wintender E-Procurement Portal (“Portal”) operated by Wintender (“Platform Owner”). By
                registering, accessing, or using the Portal, the Supplier agrees to be legally bound by these Terms.
            </p>
            {/* Terms Sections */}
            <div className="space-y-8 leading-relaxed text-gray-900">
                {/* Section 1 */}
                <section>
                    <h3 className="font-bold text-green-600 text-lg mb-2">1. DEFINITIONS</h3>
                    <ul className="list-disc ml-6 space-y-1">
                        <li><b>“Supplier / Service Provider Contractor”</b> means any individual, partnership, company, or legal entity registering to participate in procurement opportunities through the Portal.</li>
                        <li><b>“Client / Procuring Entity (P.E)”</b> means any organization utilizing the Portal to advertise, evaluate, and award tenders.</li>
                        <li><b>“Portal”</b> means the Wintender electronic procurement system, including all modules, interfaces, databases, and digital services.</li>
                        <li><b>“Bid/Tender”</b> means any proposal, quotation, expression of interest, or tender submission uploaded through the Portal.</li>
                        <li><b>“User Account”</b> means the digital credentials assigned to the Supplier for Portal access.</li>
                    </ul>
                </section>
                {/* Example for another section */}
                <section>
                    <h3 className="font-bold text-green-600 text-lg mb-2">2. ELIGIBILITY AND REGISTRATION</h3>
                    <p>The Supplier warrants that it is a legally registered entity with full authority to enter into binding agreements.</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Certificate of Incorporation/Registration</li>
                        <li>Tax Identification Number (TIN)</li>
                        <li>Business License</li>
                        <li>Regulatory certifications where applicable</li>
                        <li>Authorized signatory details</li>
                    </ul>
                    <p className="mt-2">
                        Wintender reserves the right to verify documentation and approve or reject any registration at its discretion.
                    </p>
                </section>
                {/* Repeat same card structure for sections 3–19 */}
                <section>
                    <h3 className="font-bold text-green-600 text-lg mb-2">
                        3. ACCOUNT SECURITY AND ACCESS CONTROL
                    </h3>
                    <p>
                        The Supplier is solely responsible for the security and confidentiality of account credentials.
                        Any suspected security breach must be reported immediately.
                    </p>
                </section>
                {/* ...add remaining sections similarly structured... */}
                {/* Acceptance Section */}
                <section>
                    <h3 className="font-bold text-green-700 text-lg mb-3">19. ACCEPTANCE</h3>
                    <p>By completing online registration and clicking “I Agree,” the Supplier confirms that:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>It has read and understood these Terms.</li>
                        <li>It agrees to be legally bound by them.</li>
                        <li>All submitted information is true and accurate.</li>
                    </ul>
                </section>
            </div>
            {/* Footer */}
            <footer className="text-center mt-12 border-t border-green-200 pt-6 text-gray-700 text-sm">
                © {new Date().getFullYear()} Wintender. All rights reserved.
            </footer>
        </div>
    );
}
