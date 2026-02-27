
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

                <section title="4. Use of the Portal">
                    <h3 className="font-bold text-green-700 text-lg mb-3">4. USE OF THE PORTAL</h3>
                    <p>The Supplier shall use the Portal strictly for lawful procurement purposes.</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>No false, misleading, or fraudulent information</li>
                        <li>No system interference or unauthorized access</li>
                        <li>No malicious software uploads</li>
                        <li>No collusive or anti-competitive conduct</li>
                    </ul>
                </section>

                <section title="5. Bid Submission and Validity">
                    <h3 className="font-bold text-green-700 text-lg mb-3">5. BID SUBMISSION AND VALIDITY</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Electronic submissions are legally binding.</li>
                        <li>The Supplier is responsible for document accuracy.</li>
                        <li>Bids remain valid for the stated tender period.</li>
                        <li>Withdrawals must follow tender instructions.</li>
                    </ul>
                </section>

                <section title="6. Fees and Payments">
                    <h3 className="font-bold text-green-700 text-lg mb-3">6. FEES AND PAYMENTS</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Applicable fees shall be communicated before payment.</li>
                        <li>Fees are non-refundable unless expressly stated.</li>
                        <li>Wintender may revise fees with prior notice.</li>
                    </ul>
                </section>

                <section title="7. Confidentiality">
                    <h3 className="font-bold text-green-700 text-lg mb-3">7. CONFIDENTIALITY</h3>
                    <p>
                        Tender documents and communications may contain confidential
                        information and shall not be disclosed without authorization.
                    </p>
                </section>

                <section title="8. Data Protection and Privacy">
                    <h3 className="font-bold text-green-700 text-lg mb-3">8. DATA PROTECTION AND PRIVACY</h3>
                    <p>
                        The Supplier consents to processing of corporate data for
                        procurement, compliance, and system analytics purposes.
                    </p>
                </section>

                <section title="9. Intellectual Property">
                    <h3 className="font-bold text-green-700 text-lg mb-3">9. INTELLECTUAL PROPERTY</h3>
                    <p>
                        All Portal intellectual property remains the exclusive property of
                        Wintender. Reverse engineering or commercial exploitation is
                        prohibited.
                    </p>
                </section>

                <section title="10. Compliance and Ethics">
                    <h3 className="font-bold text-green-700 text-lg mb-3">10. COMPLIANCE AND ETHICS</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Anti-corruption and anti-bribery laws</li>
                        <li>Fair competition regulations</li>
                        <li>Tax, labor, and sector-specific laws</li>
                    </ul>
                </section>

                <section title="11. Audit and Verification">
                    <h3 className="font-bold text-green-700 text-lg mb-3">11. AUDIT AND VERIFICATION</h3>
                    <p>
                        Wintender may request updated documentation or conduct compliance
                        audits. Non-cooperation may result in suspension.
                    </p>
                </section>

                <section title="12. Limitation of Liability">
                    <h3 className="font-bold text-green-700 text-lg mb-3">12. LIMITATION OF LIABILITY</h3>
                    <p>
                        Wintender is not liable for tender outcomes, client decisions,
                        technical disruptions, or indirect damages.
                    </p>
                </section>

                <section title="13. System Availability">
                    <h3 className="font-bold text-green-700 text-lg mb-3">13. SYSTEM AVAILABILITY</h3>
                    <p>
                        High system uptime is intended but uninterrupted access is not
                        guaranteed.
                    </p>
                </section>

                <section>
                    <h3 className="font-bold text-green-700 text-lg mb-3">14. TERMINATION</h3>
                    <p>
                        Either party may terminate registration. Termination does not
                        affect accrued obligations.
                    </p>
                </section>

                <section>
                    <h3 className="font-bold text-green-700 text-lg mb-3">15. INDEMNIFICATION</h3>
                    <p>
                        The Supplier shall indemnify Wintender against claims arising from
                        breaches, misrepresentation, or regulatory violations.
                    </p>
                </section>

                <section>
                    <h3 className="font-bold text-green-700 text-lg mb-3">16. FORCE MAJEURE</h3>
                    <p>
                        Neither party shall be liable for failures caused by events beyond
                        reasonable control.
                    </p>
                </section>

                <section>
                    <h3 className="font-bold text-green-700 text-lg mb-3">17. GOVERNING LAW AND DISPUTE RESOLUTION</h3>
                    <p>
                        These Terms are governed by the laws of the United Republic of
                        Tanzania. Disputes shall be resolved amicably or through
                        arbitration.
                    </p>
                </section>

                <section>
                    <h3 className="font-bold text-green-700 text-lg mb-3">18. AMENDMENTS</h3>
                    <p>
                        Continued use of the Portal constitutes acceptance of amended
                        Terms.
                    </p>
                </section>



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
