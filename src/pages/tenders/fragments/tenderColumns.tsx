import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
    {
        name: "entity",
        label: "Procurement Entity",
        sortable: true,
        plainObject: true,
        element: (row: { entity: any }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={row.entity.filePath}
                    alt="Entity Logo"
                    style={{
                        width: '40px', // Adjust size as needed
                        height: '40px',
                        borderRadius: '50%', // Makes the image round
                        objectFit: 'cover', // Ensures the image covers the area
                        marginRight: '8px', // Space between logo and name
                    }}
                />
                <span>{row.entity.name.toUpperCase()}</span>
            </div>
        ),
    },
    {
        name: "title",
        label: "Title",
        sortable: false,
        plainObject: false,
    },
    {
        name: "category",
        label: "Category",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
            return `${row.category?.name}`
        }
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
