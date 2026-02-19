
export const DataProcessingAgreement = () => {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Header */}
            <header className="bg-green-700 text-white py-6 px-8 shadow-md">
                <h1 className="text-2xl font-bold">Wintender E-Procurement Portal</h1>
                <p className="text-sm">Data Processing Agreement (DPA)</p>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                <section>
                    <h2 className="text-green-600 font-semibold text-xl mb-3">
                        1. Purpose and Scope
                    </h2>
                    <p>
                        This DPA sets out the rights and obligations of the Parties regarding
                        the processing of Personal Data transmitted, accessed, or generated
                        through the Portal.
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Supplier registration</li>
                        <li>Tender participation</li>
                        <li>Bid evaluation</li>
                        <li>Contract award management</li>
                        <li>Compliance verification</li>
                        <li>Digital communication and notifications</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-green-600 font-semibold text-xl mb-3">
                        2. Definitions
                    </h2>
                    <p>
                        “Personal Data” means any information relating to an identified or
                        identifiable natural person. “Processing” means any operation
                        performed on Personal Data, including collection, recording, storage,
                        retrieval, disclosure, transmission, or deletion.
                    </p>
                </section>

                {/* Example of repeated structure */}
                <section>
                    <h2 className="text-green-600 font-semibold text-xl mb-3">
                        3. Roles of the Parties
                    </h2>
                    <p>
                        The Supplier may act as a Data Controller when submitting Personal
                        Data of its employees or representatives. Wintender acts as a Data
                        Processor when processing such data solely for Portal functionality
                        and procurement facilitation.
                    </p>
                </section>

                {/* Add more sections following the same pattern */}
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
