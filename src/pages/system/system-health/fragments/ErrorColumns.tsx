import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [

    {
        name: "timestamp",
        label: "Time",
        sortable: false,
        plainObject: false,
        element: (value: number) => new Date(value).toLocaleString()
    },
    {
        name: "message",
        label: "Message",
        sortable: false,
        plainObject: false,
    },
    {
        name: "exceptionType",
        label: "Type",
        sortable: false,
        plainObject: false,
    },
    {
        name: "path",
        label: "Path",
        sortable: false,
        plainObject: false,
    },
    
];

export default columns;
