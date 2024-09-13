import Chip from "../../../components/chip/Chip";
import { IColumn } from "../../../components/widgets/table/Table";

const columns: IColumn[] = [
    {
        name: "serial",
        label: "Serial #",
        sortable: false,
        plainObject: false,
    },
    {
        name: "deviceType",
        label: "Device Type",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
            return `${row.productModelReference.productGroup.name} -${row.productModelReference.modelNumber}`
        }
    },
    {
        name: "condition",
        label: "Condition",
        sortable: false,
        plainObject: false,
        element: (value: string) => <Chip label={value} size="sm" theme={value === 'New' ? 'success' : 'warning'} variant="outline" />
    },
    {
        name: "status",
        label: "Status",
        sortable: false,
        plainObject: false,
        element: (value: string) => <Chip label={value} size="sm" theme={value === 'Available' ? 'primary' : 'warning'} variant="outline" />
    },
    {
        name: "owner",
        label: "Location",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
            const displayValue = row.status === 'ON_LEASE' ? 'Customer' : row.owner;

            return <Chip label={displayValue} size="sm" theme={'primary'} variant="outline" />;
        }
    },
    {
        name: "updatedAt",
        label: "Updated At",
        sortable: true,
        plainObject: false,
        element: (value) => new Date(parseInt(value)).toLocaleString(),
    },
];

export default columns;
