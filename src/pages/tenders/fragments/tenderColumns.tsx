import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";
import { IconMessage } from "@tabler/icons-react";

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
        element: (row: { entityName: string; entityLogoFilePath: string, selfApply: boolean }) => (
            <div className="flex flex-col">
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
                    <div className="flex flex-col">
                        <span>{row.entityName ? row.entityName.toUpperCase() : row.entityName}</span>
                        {
                            row?.selfApply &&
                            <div className="text-xs flex flex-row items-center gap-x-2">
                                <div className="text-gray-500 flex flex-row items-center"><IconMessage className="w-4 me-1" /> <div className="flex items-center flex-row h-full">: {row.clarifications || 0}</div> </div>
                                <div className="h-2 w-2 rounded-full bg-green-600"></div>
                            </div>
                        }
                    </div>
                </div>
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

            const displayStatus = remainingDays <= 2 && remainingDays > 0 ? 'CLOSING' : remainingDays <= 0 ? 'CLOSED' : row.status;

            return (
                <Chip
                    label={displayStatus}
                    size="sm"
                    theme={displayStatus === 'CLOSING' ? 'warning' : displayStatus === 'CLOSED' ? 'danger' : 'success'}
                    variant="outline"
                />
            );
        }
    },
];

export default columns;