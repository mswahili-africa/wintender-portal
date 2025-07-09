import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

// Helper function to convert text to sentence case
const toSentenceCase = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const ApplicantsColumns: IColumn[] = [
  {
    name: "companyName",
    label: "Bidder",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row?.companyName ? row.companyName.toUpperCase() : row?.companyName.toUpperCase();
    },
  },
  {
    name: "reference",
    label: "Reference No",
    sortable: false,
    plainObject: false
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      let theme: "primary" | "danger";

      switch (row.readStatus) {
        case "IN_REVIEW":
        case "SUBMITTED":
          theme = "primary";
          break;
        case "COMPLETED":
          theme = "primary";
          break;
        default:
          theme = "danger";
      }

      return <Chip label={row.status} size="sm" theme={theme} variant="outline" />;
    },
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

export default ApplicantsColumns;