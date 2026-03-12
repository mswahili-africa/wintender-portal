import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";
import { IApplicationInterface } from "@/types/tenderWizard";

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
    name: "",
    label: "Score",
    sortable: false,
    plainObject: true,
    element: (row: IApplicationInterface) => {

      return <span>{row.totalMarks}/100</span>;
    },
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      let theme: "success" | "danger" | "warning" | "approved";

      switch (row.status) {
        case "SUBMITTED":
          theme = "warning";
          break;
        case "AWARDED":
          theme = "success";
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