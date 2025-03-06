import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
    {
        name: "entity",
        label: "Procurement Entity",
        sortable: true,
        plainObject: false
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
        plainObject: false
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
