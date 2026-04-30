import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";

const columns: IColumn[] = [

  {
    name: "companyName",
    label: "Company",
    sortable: false,
    plainObject: false,
  },
  {
    name: "plan",
    label: "plan",
    sortable: false,
    plainObject: false,
  },
  {
    name: "maxTenders",
    label: "Tenders",
    sortable: false,
    plainObject: false,
  },
  {
    name: "controlNumber",
    label: "Control Number",
    sortable: false,
    plainObject: false,
  },
  {
    name: "principleAmount",
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
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      const currentDate = Date.now();
      const expiryDate = row.expiryDate;
      const remainingDays = (expiryDate - currentDate) / (1000 * 60 * 60 * 24);

      let displayStatus = row.status;
      let theme: "success" | "warning" | "secondary" | "danger" = "danger";

      if (remainingDays <= 0) {
        displayStatus = "EXPIRED";
      } else if (remainingDays <= 3) {
        theme = "warning";
      } else if (row.status === "ACTIVE") {
        theme = "success";
      }else{
        theme = "secondary";
      }

      return (
        <Chip
          label={displayStatus}
          size="sm"
          theme={theme}
          variant="outline"
        />
      );
    }
  },
  {
    name: "createdAt",
    label: "createdAt",
    sortable: true,
    plainObject: false,
    element: (value: number) =>
      new Date(value).toLocaleString(),
  },

];

export default columns;
