import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
    {
        name: "code",
        label: "Code",
        sortable: false,
        plainObject: false,
    },
    {
        name: "categoryGroup",
        label: "GROUP",
        sortable: false,
        plainObject: false, // Set to false to allow custom JSX rendering
        element: (value: string) => {
            let theme: 'success' | 'warning' | 'primary';

            switch (value) {
                case 'SERVICE':
                    theme = 'success';
                    break;
                case 'WORK':
                    theme = 'warning';
                    break;
                case 'GOODS':
                    theme = 'primary';
                    break;
                default:
                    theme = 'warning';
            }

            return (
                <Chip 
                    label={value} 
                    size="sm" 
                    theme={theme} 
                    variant="outline" 
                />
            );
        }
    },
    {
        name: "name",
        label: "Name",
        sortable: false,
        plainObject: false,
    },
];

export default columns;
