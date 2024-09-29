import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [

    {
        name: "name",
        label: "Publisher",
        sortable: false,
        plainObject: false,
    },
    {
        name: "numberOfTenders",
        label: "Posts",
        sortable: false,
        plainObject: false,
    },
    {
        name: "commission",
        label: "Commission",
        sortable: false,
        plainObject: true,
        element: (row: any) => {
            const commissionAmount = row.numberOfTenders * 300;
            return new Intl.NumberFormat('en-US', { 
                style: 'currency',
                currency: 'TZS',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(commissionAmount);
        },
    },
];

export default columns;
