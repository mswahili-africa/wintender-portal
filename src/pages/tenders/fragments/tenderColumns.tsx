import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

// Helper function to convert text to sentence case
const toSentenceCase = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const columns: IColumn[] = [
    {
        name: "entityName",
        label: "Procurement entity",
        sortable: false,
        plainObject: true,
        element: (row: { entityName: string; entityLogoFilePath: string }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={row.entityLogoFilePath}
                    alt="Entity Logo"
                    style={{
                        width: '40px', // Adjust size as needed
                        height: '40px',
                        borderRadius: '50%', // Makes the image round
                        objectFit: 'cover', // Ensures the image covers the area
                        marginRight: '8px', // Space between logo and name
                    }}
                />
                <span>{row.entityName.toUpperCase()}</span> {/* Display the name next to the logo */}
            </div>
        ),
    },
    { 
        name: "title",
        label: "Title",
        sortable: false,
        plainObject: true,
        element: (row: any) => toSentenceCase(row.title) // Convert title to sentence case
    },
    {
        name: "categoryName",
        label: "Category",
        sortable: false,
        plainObject: true,
        element: (row: any) => toSentenceCase(row.categoryName) // Convert category to sentence case
    },
    {
        name: "status",
        label: "Status",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
            const currentDate = new Date().getTime();
            const closeDate = row.closeDate;
            const remainingTime = closeDate - currentDate;
            const remainingDays = remainingTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

            const displayStatus = remainingDays <= 2 ? 'CLOSING' : row.status;

            return (
                <Chip
                    label={displayStatus}
                    size="sm"
                    theme={displayStatus === 'CLOSING' ? 'warning' : 'success'}
                    variant="outline"
                />
            );
        }
    },
];

export default columns;