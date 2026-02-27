import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IUser } from "@/types";

const columns: IColumn[] = [

    {
        name: "username",
        label: "username",
        sortable: false,
        plainObject: false,
    },
    {
        name: "ip",
        label: "ip",
        sortable: false,
        plainObject: false,
    },
    {
        name: "failureReason",
        label: "Failure",
        sortable: false,
        plainObject: false,
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
