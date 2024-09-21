import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [

    {
        name: "name",
        label: "Name",
        sortable: false,
        plainObject: false,
    },
    {
        name: "entityType",
        label: "Type",
        sortable: false,
        plainObject: false,
        element: (value: string) => <Chip label={value} size="sm" theme={value === 'GOVERNMENT' ? 'warning' : 'primary'} variant="lighter" />
    },
    {
        name: "email",
        label: "Email",
        sortable: false,
        plainObject: false,
    },
    {
        name: "address",
        label: "Address",
        sortable: false,
        plainObject: false,
    }
];

export default columns;
