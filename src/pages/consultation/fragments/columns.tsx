import { IColumn } from "@/components/widgets/table/Table";

const columns: IColumn[] = [
    {
        name: "title",
        label: "title",
        sortable: false,
        plainObject: false,
    },
    {
        name: "message",
        label: "message",
        sortable: false,
        plainObject: false,
        element: (value: string) =>  <div dangerouslySetInnerHTML={{__html: value}}></div>
        
    },
];

export default columns;
