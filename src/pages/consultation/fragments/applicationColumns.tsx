import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
    {
        name: "reference",
        label: "reference",
        sortable: false,
        plainObject: false,
    },
    {
        name: "bidderName",
        label: "Bider",
        sortable: false,
        plainObject: false,
    },
    {
        name: "title",
        label: "consultation",
        sortable: false,
        plainObject: false,
    },
    {
        name: "bidderCompanyName",
        label: "company",
        sortable: false,
        plainObject: false,
    },
    {
        name: "bidderCompanyPrimaryNumber",
        label: "Number",
        sortable: false,
        plainObject: false,
    },
    {
        name: "bidderCompanyEmail",
        label: "email",
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
                case "SUCCESSFUL":
                    theme = "success";
                    break;
                case "APPROVED":
                    theme = "approved";
                    break;
                case "PENDING":
                    theme = "secondary";
                    break;
                case "FAILED":
                case "REJECTED":
                    theme = "danger";
                    break;
                default:
                    theme = "warning"; // Fallback for unknown statuses
            }

            return <Chip label={value} size="sm" theme={theme} variant="outline" />;
        }
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