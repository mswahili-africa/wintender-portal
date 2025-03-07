import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
  {
    name: "bidderCompanyName",
    label: "Bidder",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row?.bidderCompanyName ? row.bidderCompanyName.toUpperCase() : "NO COMPANY";
    },
  },
  {
    name: "applicationsCount",
    label: "Applications",
    sortable: false,
    plainObject: false
  }, {
    name: "readStatus",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      let theme: "primary" | "danger";

      switch (row.readStatus) {
        case "READ":
          theme = "primary";
          break;
        default:
          theme = "danger"; // Fallback for unknown statuses
      }

      return <Chip label={row.readStatus} size="sm" theme={theme} variant="outline" />;
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
