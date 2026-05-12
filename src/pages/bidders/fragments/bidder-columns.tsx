import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import dummyLogo from "@/assets/images/bidder-dummy-logo.png"

const columns: IColumn[] = [

    {
        name: "companyName",
        label: "name",
        sortable: false,
        plainObject: true,
        element: (row: { name: string; companyName: string; companyLogoFilePath: string, createdAt: Date }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={row.companyLogoFilePath ? row.companyLogoFilePath : dummyLogo}
                    alt="Entity Logo"
                    style={{
                        width: '40px', // Adjust size as needed
                        height: '40px',
                        borderRadius: '50%', // Makes the image round
                        objectFit: 'cover', // Ensures the image covers the area
                        marginRight: '8px', // Space between logo and name
                    }}
                />
                <div className="flex flex-col">
                    <span>{row?.companyName ? row.companyName.toUpperCase() : row?.name.toUpperCase()}</span> {/* Display the name next to the logo */}
                    <span className="text-slate-400 text-xs">{new Date(row.createdAt).toLocaleDateString()}</span> {/* Display the name next to the logo */}
                </div>
            </div>
        ),
    },
    {
        name: "companyPrimaryNumber",
        label: "Phone",
        sortable: false,
        plainObject: false,
    },
    {
        name: "planExpiryDate",
        label: "Subscription",
        sortable: false,
        plainObject: false,
        element: (value: number) => {
            const now = Date.now();
            const diff = value - now;
            const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

            if (daysLeft <= 0) {
                return (
                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                        Expired
                    </span>
                );
            }

            return (
                <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                    {daysLeft} day{daysLeft > 1 ? "s" : ""} left
                </span>
            );
        },
    },
    {
        name: "companyStatus",
        label: "account",
        sortable: false,
        plainObject: false,
        element: (value: string) => {
            // Replace NEEDPASSWORDCHANGE with PENDING
            const displayValue = value === "NEEDPASSWORDCHANGE" ? "PENDING" : value;

            // Set theme based on status value
            const chipTheme =
                displayValue === "ACTIVE" ? "success" :
                    displayValue === "PENDING" ? "warning" : // Color for PENDING status
                        "danger"; // Default color for other statuses

            return (
                <Chip
                    label={displayValue}
                    size="sm"
                    theme={chipTheme}
                    variant="outline"
                />
            );
        },
    }
];

export default columns;
