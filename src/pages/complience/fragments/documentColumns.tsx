import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
  {
    name: "documentType",
    label: "Type",
    sortable: false,
    plainObject: false,
  },
  {
    name: "documentNumber",
    label: "Reference",
    sortable: false,
    plainObject: false,
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
