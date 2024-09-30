import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
    {
        name: "entity",
        label: "Name",
        sortable: false,
        plainObject: true,
        element: (row: { name: string; filePath: string }) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={row.filePath}
                    alt="Entity Logo"
                    style={{
                        width: '40px', // Adjust size as needed
                        height: '40px',
                        borderRadius: '50%', // Makes the image round
                        objectFit: 'cover', // Ensures the image covers the area
                        marginRight: '8px', // Space between logo and name
                    }}
                />
                <span>{row.name.toUpperCase()}</span> {/* Display the name next to the logo */}
            </div>
        ),
    },
    {
        name: "entityType",
        label: "Type",
        sortable: false,
        plainObject: false,
        element: (value: string) => (
            <Chip
                label={value}
                size="sm"
                theme={value === 'GOVERNMENT' ? 'warning' : 'primary'}
                variant="lighter"
            />
        ),
    },
    {
        name: "primaryNumber",
        label: "Number",
        sortable: false,
        plainObject: false,
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
    },
];

export default columns;
