import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IRole, IUser } from "@/types";

const columns: IColumn[] = [

    {
        name: "name",
        label: "Company",
        sortable: false,
        plainObject: true,
        element: (value: IUser) => {
            const companyName = value.company?.name;
            return companyName ? companyName.toUpperCase() : "";
        }
    }, 
    {

        name: "phoneNumber",
        label: "Phone",
        sortable: false,
        plainObject: false,
    },   
    {
        name: "plan",
        label: "plan",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
          return row?.plan?.plan;
        },
      },   
      {
          name: "maxTenders",
          label: "Tenders",
          sortable: false,
          plainObject: true,
          element: (row: any) => {
            return row?.plan?.maxTenders;
          },
        },
    {
        name: "numberOfMonths",
        label: "months",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
          return row?.plan?.numberOfMonths;
        },
      },
    {
        name: "status",
        label: "Max Tenders",
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
    },
  {
    name: "date",
    label: "date",
    sortable: true,
    plainObject: false,
    element: (value: number) =>
      new Date(value).toLocaleString(),
  },
  {
    name: "date",
    label: "date",
    sortable: true,
    plainObject: false,
    element: (value: number) =>
      new Date(value).toLocaleString(),
  },
    
];

export default columns;
