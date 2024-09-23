import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
  {
    name: "bidder",
    label: "Account",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.doForMeApplication.user?.account;
    },
  },
  {
    name: "reference",
    label: "Reference",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.doForMeApplication.user?.account;
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
    name: "reference",
    label: "Reference",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.doForMeApplication?.reference;
    },
  },
  {
      name: "Outstanding",
      label: "Outstanding",
      sortable: false,
      plainObject: true,
      element: (row: any) => {
          const amount = row.principleAmount - row.paidAmount;
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
