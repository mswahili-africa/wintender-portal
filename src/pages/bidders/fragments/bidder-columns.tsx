import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IUser } from "@/types";

const columns: IColumn[] = [

    {
        name: "companyName",
        label: "name",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
            return row?.companyName ? row.companyName.toUpperCase() : row?.name.toUpperCase();
        },
    },
    {
        name: "companyPrimaryNumber",
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
