import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import dummyLogo from "@/assets/images/bidder-dummy-logo.png"

const columns: IColumn[] = [

    {
        name: "companyName",
        label: "name",
        sortable: false,
        plainObject: true,
        element: (row: { name: string; companyName: string; companyLogoFilePath: string }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={row.companyLogoFilePath ? row.companyLogoFilePath : dummyLogo }
                    alt="Entity Logo"
                    style={{
                        width: '40px', // Adjust size as needed
                        height: '40px',
                        borderRadius: '50%', // Makes the image round
                        objectFit: 'cover', // Ensures the image covers the area
                        marginRight: '8px', // Space between logo and name
                    }}
                />
                <span>{ row?.companyName ? row.companyName.toUpperCase() : row?.name.toUpperCase()}</span> {/* Display the name next to the logo */}
            </div>
        ),
    },
     {
        name: "name",
        label: "name",
        sortable: false,
        plainObject: false,
    },
     {
        name: "phoneNumber",
        label: "Phone",
        sortable: false,
        plainObject: false,
    },
    {
        name: "email",
        label: "Phone",
        sortable: false,
        plainObject: false,
    },
    {
        name: "companyStatus",
        label: "Status",
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
