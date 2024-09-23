import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IRole, IUser } from "@/types";

const columns: IColumn[] = [

    {
        name: "firstName",
        label: "Full name",
        sortable: false,
        plainObject: true,
        element: (value: IUser) => `${value.name}`
    },
    {

        name: "account",
        label: "Account",
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

        name: "phoneNumber",
        label: "Phone",
        sortable: false,
        plainObject: false,
    },
    {

        name: "address",
        label: "Address",
        sortable: false,
        plainObject: false,
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
