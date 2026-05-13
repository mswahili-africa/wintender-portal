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
    name: "paymentReason",
    label: "Payment Reason",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.paymentReason;
    },
  },
  {
    name: "controlNumber",
    label: "Control no.",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.controlNumber;
    },
  },
  {
    name: "referenceNumber",
    label: "Reference",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row.referenceNumber;
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
  }
];

export default columns;
