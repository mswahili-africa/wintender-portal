import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [

  // {
  //   name: "",
  //   label: "type",
  //   sortable: false,
  //   plainObject: true,
  //   element: (row: any) => {
  //     const tenderGroup = row?.tenderGroup;

  //     const theme: "primary" | "warning" =
  //       tenderGroup === "PRIVATE" ? "primary" : "warning";

  //     return 
  //     <>
  //       <div className="uppercase">{row.entityName}</div>
  //     </>;
  //   },
  // },  
  {
    name: "",
    label: "Name",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row?.bidderCompanyName;
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
      let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending"| "approved";

      switch (row.status) {
        case "REQUESTED":
          theme = "secondary";
          break;
        case "APPLIED":
          theme = "success";
          break;
        case "ON_PROGRESS":
          theme = "warning";
          break;
        case "WON":
          theme = "success";
          break;
        case "NOT_WON":
          theme = "danger";
          break;
        case "EXECUTED":
          theme = "approved";
          break;
        case "RETURNED":
          theme = "warning";
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
    label: "Updated date",
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
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      const remaining = daysLeft > 0 ? `${daysLeft} days` : "CLOSED";

      return (
        <Chip
          label={remaining}
          size="sm"
          theme={daysLeft > 0 ? "success" : "danger"}
          variant="outline"
        />
      );
    }
  }
];

export default columns;
