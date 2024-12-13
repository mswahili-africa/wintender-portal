import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IRole, IUser } from "@/types";

const columns: IColumn[] = [

  {
    name: "companyName",
    label: "Company",
    sortable: false,
    plainObject: false,
  },
  {

    name: "companyPrimaryNumber",
    label: "Phone",
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
    label: "amount",
    sortable: false,
    plainObject: false,
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
        const currentDate = new Date().getTime();
        const expiryDate = row.expiryDate;
        const remainingTime = expiryDate - currentDate;
        const remainingDays = remainingTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

        const displayStatus = remainingDays <= 0 ? 'EXPIRED' : row.status;

        return (
            <Chip 
                label={displayStatus} 
                size="sm" 
                theme={displayStatus === 'EXPIRED' ? 'danger' : 'success'} 
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
