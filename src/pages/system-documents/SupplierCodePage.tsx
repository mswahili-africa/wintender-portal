
export const SupplierCodePage = () => {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="bg-green-700 text-white py-6 px-8 shadow-md">
                <h1 className="text-2xl font-bold">Wintender E-Procurement Portal</h1>
                <p className="text-sm">Supplier Code of Conduct</p>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                <section>
                    <h2 className="text-green-600 font-semibold text-xl mb-3">
                        1. Purpose and Scope
                    </h2>
                    <p>
                        This Code defines minimum standards of conduct applicable to all
                        registered suppliers, including their directors, employees, agents,
                        subcontractors, and affiliates engaged in activities connected to
                        tenders published through the Portal.
                    </p>
                </section>

                <section>
                    <h2 className="text-green-600 font-semibold text-xl mb-3">
                        2. Legal and Regulatory Compliance
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Operate in full compliance with applicable laws and regulations.</li>
                        <li>Maintain valid registration, licenses, and tax compliance.</li>
                        <li>Notify Wintender of suspensions, investigations, or insolvency.</li>
                        <li>Zero tolerance for deliberate regulatory non-compliance.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-green-600 font-semibold text-xl mb-3">
                        3. Anti-Bribery and Anti-Corruption
                    </h2>
                    <p>
                        Suppliers must uphold the highest standards of integrity and shall
                        not offer, solicit, or accept bribes, kickbacks, or improper
                        inducements. Any attempt to manipulate evaluation outcomes results
                        in disqualification and possible blacklisting.
                    </p>
                </section>

                <section>
                    <h2 className="text-green-600 font-semibold text-xl mb-3">
                        5. Human Rights and Labour Standards
                    </h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>No forced or child labor</li>
                        <li>Non-discrimination and respect for freedom of association</li>
                        <li>Lawful wages and safe working conditions</li>
                    </ul>
                </section>

                {/* Continue with sections 6–16 following same pattern */}
            </main>

            {/* Footer */}
            <footer className="bg-green-600 text-white py-6 px-8 mt-10">
                <p className="text-sm">
                    Address: Mbezi Beach, New Bagamoyo Road, Samaki Wabichi House, A21
                </p>
                <p className="text-sm">
                    Mobile / WhatsApp: +255 (0) 747 098 447 / 766 028 558
                </p>
                <p className="text-sm">
                    Email: info@wintender.co.tz | Website: www.wintender.tz
                </p>
            </footer>
        </div>
    );

}
