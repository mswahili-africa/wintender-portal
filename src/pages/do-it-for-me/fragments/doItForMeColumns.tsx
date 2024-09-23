import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
  {
    name: "bidder",
    label: "Account",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.user?.account;
    },
  },
  {
    name: "reference",
    label: "Reference",
    sortable: false,
    plainObject: false,
  },
  {
    name: "tender",
    label: "tender",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.tender?.tenderNumber;
    },
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
        case "PENDING":
          theme = "secondary";
          break;
        case "FAILED":
          theme = "warning";
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
