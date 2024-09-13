import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { IUser } from "@/types";

const columns: IColumn[] = [

    {
        name: "role",
        label: "Role",
        sortable: false,
        plainObject: false,
    },
    // {
    //     name: "description",
    //     label: "Description",
    //     sortable: false,
    //     plainObject: false,
    // },
    // {
    //     name: "allowedCreatorRole",
    //     label: "Allowed Role",
    //     sortable: false,
    //     plainObject: false,
    // },
    {
        name: "archive",
        label: "Status",
        sortable: false,
        plainObject: false,
        element: (value: number) => (
            <Chip
                label={value === 0 ? "Active": "Inactive"}
                size="sm"
                theme={value === 0 ? "primary" : "primary"}
                variant="outline"
            />
        ),
    },
];

export default columns;
