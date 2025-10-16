import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [

  {
    name: "tenderGroup",
    label: "type",
    sortable: false,
    plainObject: true, 
    element: (row: any) => {
      const tenderGroup = row?.tenderGroup;
      
      const theme: "primary" | "warning" =
        tenderGroup === "PRIVATE" ? "primary" : "warning";
  
      return <Chip label={tenderGroup} size="sm" theme={theme} variant="outline" />;
    },
  },  
  {
    name: "entity",
    label: "entity",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.entityName;
    },
  },
  {
    name: "tender",
    label: "tender",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.title;
    },
  },
  {
    name: "Fees",
    label: "Fees",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      const amount = row.principleAmount;
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'TZS',
      }).format(amount);

      return formattedAmount
    },
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending";

      switch (row.status) {
        case "SUCCESS":
        case "COMPLETED":
          theme = "success";
          break;
        case "REQUESTED":
          theme = "secondary";
          break;
        case "ON_PROGRESS":
          theme = "warning";
          break;
          case "RETURNED":
          theme = "danger";
          break;
        case "CANCELED":
          theme = "danger";
          break;
        default:
          theme = "danger"; // Fallback for unknown statuses
      }
  
      return <Chip label={row.status} size="sm" theme={theme} variant="outline" />;
    },
  },
  
  {
    name: "updatedAt",
    label: "Updated At",
    sortable: true,
    plainObject: false,
    element: (value: number | null) => 
      value ? new Date(value).toLocaleString() : "-", // Show "-" or "Loading..." when value is undefined
  },
];

export default columns;
