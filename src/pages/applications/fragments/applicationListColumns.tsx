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
    name: "Entity",
    label: "Entity",
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
      const formattedAmount = new Intl.NumberFormat('en-TZ', {
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
  {
    name: "closeDate",
    label: "Deadline",
    sortable: true,
    plainObject: false,
    element: (value: number | null) => {
      if (!value) return <span>-</span>;

      const creationDate = new Date(value);
      const deadlineDate = new Date(creationDate.getTime());

      const diffMs = deadlineDate.getTime() - Date.now();

      if (diffMs <= 0) {
        return (
          <Chip
            label="Expired"
            size="sm"
            theme="danger"
            variant="outline"
          />
        );
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

      const remaining =
        days > 0
          ? `${days} day${days > 1 ? "s" : ""}`
          : `${hours}h ${minutes}m`;

      return (
        <Chip
          label={remaining}
          size="sm"
          theme={days > 0 ? "success" : "warning"}
          variant="outline"
        />
      );
    }

  }
];

export default columns;
