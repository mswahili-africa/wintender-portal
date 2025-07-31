import { IconFileTypeXls } from '@tabler/icons-react';
import * as XLSX from 'xlsx';

export type TExcelColumn = {
    label: string;
    value: any;
    isDate?:boolean;
};

type TExcelDocument = {
    name: string;
    data: any[];
    columns: TExcelColumn[];
};

export const ExportXLSX = ({ name, data, columns }: TExcelDocument) => {

    const onExport = () => {
        const dataList = data?.map((dataItem: any) => {
            const row: Record<string, any> = {};

            columns.forEach((column) => {
                let value = dataItem[column.value];

                // JCM check if column is a date
                if (column.isDate) {
                    value = new Date(value).toLocaleString();
                }

                row[column.label] = value ?? "";
            });

            return row;
        });

        const workbook = XLSX.utils.book_new(); // creating workbook
        const worksheet = XLSX.utils.json_to_sheet(dataList); // creating worksheet
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // adding worksheet to workbook
        XLSX.writeFile(workbook, `${name}.xlsx`); // downloading the xlsx file
    };


    return (
        <button
            type="button"
            className="bg-gray-600 text-sm text-white hover:bg-gray-500 py-2 px-3 rounded flex items-center"
            onClick={onExport}
        >
            <IconFileTypeXls size={20} className="mr-2" />
            Export {name} XLSX
        </button>
    );
};
