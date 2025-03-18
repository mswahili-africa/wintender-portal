import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
  {
    name: "companyName",
    label: "name",
    sortable: false,
    plainObject: true,
    element: (row: { company: string; userName: string; }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{row?.company ? row.company.toUpperCase() : row?.userName.toUpperCase()}</span>
      </div>
    ),
  },
  {
    name: "transactionReference",
    label: "Reference",
    sortable: false,
    plainObject: false,
  },
  {
    name: "amount",
    label: "Amount",
    sortable: false,
    plainObject: false,
    element: (value: number) => {
      const formattedAmount = value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

      return <span>{formattedAmount}</span>;
    },
  },
  {
    name: "paymentReason",
    label: "Reason",
    sortable: false,
    plainObject: false,
    element: (value: string) => {
      let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending";

      switch (value) {
        case "SUBSCRIPTION":
          theme = "warning";
          break;
        case "DO_IT_FOR_ME":
          theme = "pending";
          break;
        case "PLAN":
          theme = "secondary";
          break;
        default:
          theme = "warning"; // Fallback for unknown statuses
      }

      return <Chip label={value} size="sm" theme={theme} variant="outline" />;
    }
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: false,
    element: (value: string) => {
      let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending" | "approved";

      switch (value) {
        case "SUCCESSFUL":
          theme = "success";
          break;
        case "APPROVED":
          theme = "approved";
          break;
        case "PENDING":
          theme = "secondary";
          break;
        case "FAILED":
        case "REJECTED":
          theme = "danger";
          break;
        default:
          theme = "warning"; // Fallback for unknown statuses
      }

      return <Chip label={value} size="sm" theme={theme} variant="outline" />;
    }
  },

  {
    name: "createdAt",
    label: "Date",
    sortable: true,
    plainObject: false,
    element: (value: number) =>
      new Date(value).toLocaleString(),
  },
];

export default columns;
