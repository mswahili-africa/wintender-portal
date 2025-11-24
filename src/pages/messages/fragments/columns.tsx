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
        name: "phoneNumber",
        label: "Phone number",
        sortable: false,
        plainObject: false,
    },
    {
        name: "status",
        label: "Status",
        sortable: false,
        plainObject: false,
        element: (value: string) => {
            let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending" | "approved";

            switch (value) {
                case "READ":
                    theme = "success";
                    break;
                case "UNREAD":
                    theme = "approved";
                    break;
                default:
                    theme = "warning"; // Fallback for unknown statuses
            }

            return <Chip label={value} size="sm" theme={theme} variant="outline" />;
        }
    },
    {
        name: "createdAt",
        label: "Date time",
        sortable: false,
        plainObject: true,
        element(content) {
            return new Date(content.updatedAt).toLocaleString();
        },
    },
];

export default columns;
