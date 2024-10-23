import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [

  {
    name: "group",
    label: "type",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      const tenderGroup = row.doForMeApplication?.tender?.tenderGroup;
      
      const theme: "primary" | "warning" =
        tenderGroup === "PRIVATE" ? "primary" : "warning";
  
      return <Chip label={tenderGroup} size="sm" theme={theme} variant="outline" />;
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

      const status = row.doForMeApplication?.status;
      const theme = status === "SUCCESS" ? "primary" : "warning"; // Default to warning

      return (
        <Chip
          label={formattedAmount}
          size="sm"
          theme={theme}
          variant="outline"
        />
      );
    },
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending";

      switch (row.doForMeApplication?.status) {
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
  
      return <Chip label={row.doForMeApplication?.status} size="sm" theme={theme} variant="outline" />;
    },
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
