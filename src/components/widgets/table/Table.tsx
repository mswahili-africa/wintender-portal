import { Fragment, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

export enum ColumnAlignment {
    LEFT = "text-left",
    RIGHT = "text-right",
    CENTER = "text-center"
};

export enum SortDirection { DESC = "DESC", ASC = "ASC" };

export interface IColumn {
    name: string
    label: string
    sortable: boolean
    align?: ColumnAlignment,
    element?: (content: any) => any
    plainObject: boolean
};

interface ISort {
    field: string,
    direction: SortDirection
};

interface IProps {
    columns: IColumn[]
    data: ReadonlyArray<Object> | Array<Object>
    isLoading?: boolean 
    hasSelection: boolean
    hasActions?: boolean
    hasExpandableRow?: boolean
    actionSlot?: (context: any) => React.ReactElement
    expandableSlot?: (context: any) => React.ReactElement
    onExpanding?: (context: any) => void
    onSelection?: (items: Array<any>) => void
    onSorting?: (field: string, direction: SortDirection) => void
};

export const Table: React.FC<any> = ({actionSlot, expandableSlot, columns, data=[], isLoading=false,  hasActions, hasExpandableRow=false, hasSelection=false, onExpanding, onSelection, onSorting}: IProps) => {
    const [sortField, setSortField] = useState<ISort | null> (null);
    const [selectedRows, setSelectedRows] = useState<Array<any>> ([]);
    const [expandableRow, setExpandableRow] = useState<number> (0);

    const expandebleSpanLength = (): number => {
        if(hasActions) {
            return columns.length + 1
        }
        return columns.length
    }

    const handleSort = (field: string, direction: SortDirection) => {
        setSortField({field, direction});
        
        if(onSorting) {
            onSorting(field, direction);
        }
    }

    const handleSelection = (event: any, content: any) => {
        let temp = selectedRows;

        if(content !== null) {
            event.target.checked ? temp.push(content) : deleteSelectedItem(content);
        } else {
            event.target.checked ? temp = data as Array<Object> : temp = [];
        }

        setSelectedRows(temp);

        if(onSelection) {
            onSelection(temp);
        }
    }

    const deleteSelectedItem = (content: any) => {
        let temp = selectedRows;

        temp.splice(temp.findIndex(el => JSON.stringify(el) === JSON.stringify(content)), 1);
        setSelectedRows(temp);

        if(onSelection) { 
            onSelection(temp);
        }
    }

    const getDataValue = (header: string[], headerContext: {[key: string]: any}, plainObject: boolean): any => {
        // header is key for data and context is the object a certain index
        // spit the header by . to get sub keys eg node.username
        // will be ['node', 'username'] but if plainObject is true return context

        if(plainObject) {
            return headerContext
        }

        let keyList: string[] = header;
        let context = headerContext;
        let loop = true;
        
        while (loop) {
            if(context) {
                if(keyList.length > 0) {
                    // check if key list has single key
                    if(keyList.length === 1) {
                        loop = false;
                        return context[keyList[0]]
                    }   else {
                            // Check each key value if not object else return value
                            if(
                                typeof context[keyList[0]] === "object" && 
                                !Array.isArray(context[keyList[0]]) && 
                                context[keyList[0]] !== null) {
    
                                context = context[keyList[0]];
                                keyList = keyList.slice(1);
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        if(expandableRow >= 0 && onExpanding) {
            onExpanding(data[expandableRow]);
        }
    }, [expandableRow])

    useEffect(() => {
        if (sortField === null) {
            let defaultSorted = columns.find(element => element.sortable === true);

            if (defaultSorted !== undefined) {
                setSortField({field: defaultSorted.name, direction: SortDirection.ASC});
            }
        }
    }, [columns, sortField])

    return (
        <div className="overflow-x-auto overflow-y-hidden w-full">
            
            <table className="table-auto min-w-full">
                <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 divide-x divide-slate-200">
                        {
                            columns && hasSelection && 
                            <th className="text-xs 2xl:text-sm">
                                <input 
                                    type="checkbox" onChange={(event) => handleSelection(event, null)}
                                    className="bg-white border border-slate-200 ring-0 focus:border-slate-200 focus:outline-none focus:ring-0 rounded" />
                            </th>
                        }
                        {
                            columns &&

                            columns.map((column, headerColumnIndex) =>
                                <th
                                    scope="col"
                                    className="text-xs text-slate-600 whitespace-nowrap font-semibold uppercase p-4 pl-6"
                                    key={column.label + headerColumnIndex}>

                                    <div className="flex items-center space-x-2.5">
                                        <span>{column.label}</span>
                                        {   
                                            column.sortable && 
                                            <div className="flex flex-col justify-center space-y-1">
                                                {/* Up Arrow */}
                                                <i 
                                                    className={`fa-solid fa-sort-up fa-sm cursor-pointer ${column.name === sortField?.field && sortField.direction === SortDirection.ASC ? 'text-slate-800' : 'text-slate-400'}`}
                                                    onClick={() => handleSort(column.name, SortDirection.ASC)}></i>

                                                {/* Down Arrow */}
                                                <i 
                                                    className={`fa-solid fa-sort-down fa-sm cursor-pointer
                                                    ${column.name === sortField?.field && sortField.direction === SortDirection.DESC ? ' text-slate-800' : 'text-slate-400'}`}
                                                    onClick={() => handleSort(column.name, SortDirection.DESC)}></i> 
                                            </div>
                                        }
                                    </div>
                                </th>
                            )
                        }

                        {
                            columns && hasActions && 

                            <th
                                scope="col"
                                className="text-xs text-slate-600 font-semibold uppercase py-2 px-4">
                                Actions
                            </th>
                        }
                    </tr>
                </thead>
                {
                    isLoading ?
                    <tbody>
                        {
                            [...Array(10)].map(() => 
                                <tr className="bg-white border-b border-slate-200 animate-pulse" key={uuidv4()}>
                                    {
                                        [...Array(columns.length + 2)].map(() =>
                                            <td key={uuidv4()} className="p-4">
                                                <div className="w-full h-5 bg-slate-100 rounded"></div>
                                            </td>
                                        )
                                    }
                                </tr>
                            )
                        }
                    </tbody>:

                    <Fragment>
                    {
                        data.length > 0 ? 
                        <tbody className="text-nile-green">
                            {
                                data.map((content: Record<string, any>, rowIndex) =>
                                    <Fragment key={uuidv4()}>
                                        <tr 
                                            className="bg-white border-b border-slate-200" 
                                            key={uuidv4()}>
                                        
                                            {
                                                hasSelection &&

                                                <td className="p-2 text-xs md:text-sm text-center whitespace-pre-line">
                                                    <input 
                                                        type="checkbox" 
                                                        onChange={(event) => handleSelection(event, content)}
                                                        checked={selectedRows.some(element => element.id === content.id)}
                                                        className="bg-white border border-slate-200 ring-0 focus:border-slate-200 focus:outline-none focus:ring-0 rounded" />
                                                </td>
                                            }
                                            
                                            {
                                                columns.map((header,) => 
                                                    <td 
                                                        className={`px-6 py-4 text-xs md:text-sm text-left whitespace-pre-line ${header.align}`}
                                                        key={uuidv4()}>
                                                        { 
                                                            header.element ?
                                                            header.element(getDataValue(header.name.split("."), content, header.plainObject)):
                                                            content[header.name]
                                                        }
                                                    </td>
                                                )
                                            }
                                            {
                                                hasActions &&

                                                <td className="py-2 px-4 text-xs md:text-sm text-left whitespace-nowrap">
                                                    <div className="flex justify-center space-x-2 items-center">
                                                        {actionSlot?.(content)}

                                                        {/* Expandables Rows Buttons */}
                                                        {
                                                            hasExpandableRow &&
                                                        
                                                            <button onClick={() => {
                                                                    expandableRow === rowIndex ?  setExpandableRow(-1) : setExpandableRow(rowIndex);
                                                                }}
                                                                className="flex justify-center items-center w-5 h-5 mr-2 bg-slate-100 rounded cursor-pointer">
                                                                
                                                                {/* plus icon */}
                                                                <svg 
                                                                    className={`h-4 w-4 ${expandableRow === rowIndex? '' : 'hidden'}`} 
                                                                    fill="none" viewBox="0 0 24 24" 
                                                                    stroke="currentColor" 
                                                                    strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                                
                                                                {/* minus icon */}
                                                                <svg 
                                                                    className={`h-4 w-4 ${expandableRow === rowIndex? 'hidden' : ''}`} 
                                                                    fill="none" viewBox="0 0 24 24" 
                                                                    stroke="currentColor" 
                                                                    strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                                                </svg>
                                                            </button>
                                                        }
                                                    </div>
                                                </td>
                                            }  
                                        </tr>

                                        {
                                            expandableRow === rowIndex && hasExpandableRow &&

                                            <tr className="bg-white">
                                                <td colSpan={expandebleSpanLength()}>
                                                    <div className="overflow-x-auto min-w-full">
                                                        {expandableSlot?.(content)}
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                    </Fragment>
                                )
                            }
                            
                        </tbody>:

                        <tbody className="bg-white border-none">
                            <tr className="text-center">
                                <td className="px-4 py-8 whitespace-pre-line" colSpan={100}>
                                    <span className="text-slate-300">There is no data available.</span>
                                </td>
                            </tr>
                        </tbody>
                    }
                    </Fragment>
                }
            </table>
        </div>
    )
}
