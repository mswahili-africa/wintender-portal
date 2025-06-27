import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IRole, IUser } from "@/types";

const columns: IColumn[] = [
    {
        name: "firstName",
        label: "Full name",
        sortable: false,
        plainObject: true,
        element: (value: IUser) => `${value.name.toUpperCase()}`
    },
    {
        name: "email",
        label: "Email",
        sortable: false,
        plainObject: false,
    },
    {
        name: "phoneNumber",
        label: "Phone",
        sortable: false,
        plainObject: false,
    },
    {
        name: "role",
        label: "Role",
        sortable: false,
        plainObject: true,
        element: (value: IUser) => (
            <Chip
                label={value.roleDetails?.role || "N/A"}
                size="sm"
                theme={value.roleDetails?.role === "MANAGER" ? "primary" : "secondary"}
                variant="outline"
            />
        )
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
