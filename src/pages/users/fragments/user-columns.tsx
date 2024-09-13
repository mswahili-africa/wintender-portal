import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IRole, IUser } from "@/types";

const columns: IColumn[] = [
    {
        name: "username",
        label: "Username",
        sortable: false,
        plainObject: false,
    },
    {
        name: "firstName",
        label: "Full name",
        sortable: false,
        plainObject: true,
        element: (value: IUser) => `${value.name}`
    },
    {
        name: "role",
        label: "Role",
        sortable: true,
        plainObject: false,
        element: (value: IRole) => `${value.role}`
    },
    {
        name: "status",
        label: "Status",
        sortable: false,
        plainObject: false,
        element: (value: string) => (
            <Chip
                label={value}
                size="sm"
                theme={value === "Active" ? "primary" : "warning"}
                variant="outline"
            />
        ),
    }
];

export default columns;
