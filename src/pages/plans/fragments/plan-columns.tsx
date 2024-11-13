import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IRole, IUser } from "@/types";

const columns: IColumn[] = [

  {
    name: "name",
    label: "Company",
    sortable: false,
    plainObject: true,
    element: (value: IUser) => {
      const companyName = value.name;
      return companyName ? companyName.toUpperCase() : "";
    }
  },
  {

    name: "primaryNumber",
    label: "Phone",
    sortable: false,
    plainObject: false,
  },
  {
    name: "plan",
    label: "plan",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row?.plan?.plan;
    },
  },
  {
    name: "maxTenders",
    label: "Tenders",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row?.plan?.maxTenders;
    },
  },
  {
    name: "numberOfMonths",
    label: "months",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row?.plan?.numberOfMonths;
    },
  },
  {
    name: "amount",
    label: "amount",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return row?.plan?.numberOfMonths;
    },
  },
  {
    name: "status",
    label: "status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      const planStatus = row?.plan?.status || 'PENDING';
      const displayValue = planStatus === "PENDING" ? "PENDING" : planStatus;

      const chipTheme =
        displayValue === "SUCCESS" ? "success" :
          displayValue === "PENDING" ? "warning" : 
            "danger"; 

      return (
        <Chip
          label={displayValue}
          size="sm"
          theme={chipTheme}
          variant="outline"
        />
      );
    },
  },
  {
    name: "expiryDate",
    label: "expiry",
    sortable: true,
    plainObject: true,
    element: (row: any) => {
      const expiryTimestamp = row?.plan?.expiryDate;
      if (!expiryTimestamp) return 'No Expiry'; // Handle case where expiryDate is missing
      return new Date(expiryTimestamp).toLocaleString();
    },
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
