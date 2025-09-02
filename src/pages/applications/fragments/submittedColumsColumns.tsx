import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
  {
    name: "reference",
    label: "reference",
    sortable: false,
    plainObject: false
  },
  {
    name: "tenderIdTitle",
    label: "title",
    sortable: false,
    plainObject: false
  },
  {
    name: "tenderNumber",
    label: "number",
    sortable: false,
    plainObject: false
  },
  {
    name: "stage",
    label: "stage",
    sortable: false,
    plainObject: false,
    element: (value: string) => {
      let theme: 'success' | 'warning' | 'primary';

      switch (value) {
        case 'COMPLETED':
          theme = 'success';
          break;
        case 'PAYMENT':
          theme = 'warning';
          break;
        default:
          theme = 'primary';
      }

      return (
        <Chip
          label={value}
          size="sm"
          theme={theme}
          variant="outline"
        />
      );
    }
  },
  {
    name: "status",
    label: "status",
    sortable: false,
    plainObject: false,
    element: (value: string) => {
      let theme: 'success' | 'warning' | 'primary' | 'danger';

      switch (value) {
        case 'COMPLETED':
          theme = 'success';
          break;
        case 'PENDING':
          theme = 'warning';
          break;
        case 'SUBMITTED':
          theme = 'primary';
          break;
        case 'DELETED':
          theme = 'danger';
          break;
        default:
          theme = 'warning';
      }

      return (
        <Chip
          label={value}
          size="sm"
          theme={theme}
          variant="outline"
        />
      );
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
