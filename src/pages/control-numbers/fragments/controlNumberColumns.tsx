import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [

  {
    name: "type",
    label: "type",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.doForMeApplication?.tender?.tenderGroup;
    },
  }, 
  {
    name: "bidder",
    label: "bidder",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.doForMeApplication?.user?.company?.name;
    },
  },
  {
    name: "reference",
    label: "Reference",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.doForMeApplication?.reference;
    },
  },
  {
    name: "tender",
    label: "tender",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.doForMeApplication?.tender?.tenderNumber;
    },
  },
  {
    name: "controlNumber",
    label: "Control Number",
    sortable: false,
    plainObject: true,
  },
  {
      name: "Fees Payable",
      label: "Fees Payable",
      sortable: false,
      plainObject: true,
      element: (row: any) => {
          const amount = row.principleAmount;
          const formattedAmount = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'TZS',
          }).format(amount);
          return formattedAmount;
      }
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: false,
    element: (value: string) => {
      let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending";

      switch (value) {
        case "SUCCESS":
          theme = "success";
          break;
        case "REQUESTED":
          theme = "secondary";
          break;
        case "ON_PROGRESS":
          theme = "pending";
          break;
        case "REJECTED":
          theme = "danger";
          break;
        default:
          theme = "primary"; // Fallback for unknown statuses
      }
  
      return <Chip label={value} size="sm" theme={theme} variant="outline" />;
    }
  },
  
  {
    name: "updatedAt",
    label: "Updated At",
    sortable: true,
    plainObject: false,
    element: (value: number) =>
      new Date(value).toLocaleString(),
  },
];

export default columns;
