import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IUser } from "@/types";

const columns: IColumn[] = [

    {
        name: "firstName",
        label: "Company",
        sortable: false,
        plainObject: true,
        element: (value: IUser) => {
            const companyName = value.company?.name;
            return companyName ? companyName.toUpperCase() : "";
        }
    },    
    {
        name: "firstName",
        label: "Contact Person",
        sortable: false,
        plainObject: true,
        element: (value: IUser) => `${value.name}`
    },
    {
        name: "email",
        label: "Email",
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
        name: "status",
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
