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
        sortable: true,
        plainObject: true,
        element: (row: any) => row.entityName.toUpperCase()
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