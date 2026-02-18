import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";
import { IconMessage } from "@tabler/icons-react";

// Helper function to convert text to sentence case
const toSentenceCase = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const columns: IColumn[] = [
    {
        name: "entityName",
        label: "entity",
        sortable: false,
        plainObject: true,
        element: (row: { entityName: string; entityLogoFilePath: string, selfApply: boolean, clarificationCount: number }) => (
            <div className="flex items-center">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={row.entityLogoFilePath}
                        alt="Entity Logo"
                        style={{
                            width: '40px', // Adjust size as needed
                            height: '40px',
                            borderRadius: '50%', // Makes the image round
                            objectFit: 'cover', // Ensures the image covers the area
                            marginRight: '8px', // Space between logo and name
                        }}
                    />
                    <div className="flex flex-col">
                        {
                            row?.selfApply &&
                            <div className="text-xs flex flex-row items-center gap-x-2">
                                <div className="text-gray-500 flex flex-row items-center"><IconMessage className="w-4 me-1" /> <div className="flex items-center flex-row h-full">: {row.clarificationCount || 0}</div> </div>
                                <div className="h-2 w-2 rounded-full bg-green-600"></div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        ),
    },
     {
    name: "Tender",
    label: "Tender",
    sortable: false,
    plainObject: true,
    element: (row?: any) => (
      <div className="flex flex-col">
        <span className="text-xs text-gray-500"><strong>{row?.entityName?.toUpperCase()}</strong></span>
        <span className="text-xs text-black-500"><strong>{row?.categoryName?.toUpperCase()}</strong></span>
        <span className="text-md text-black-500">{row?.title}</span>
      </div>
    ),
  },
    {
        name: "status",
        label: "Deadline",
        sortable: false,
        plainObject: true,
        element: (value: any) => {
            if (!value) return <span>-</span>;

            const closingDate = new Date(value.closeDate);
            const deadlineDate = new Date(closingDate.getTime());

            const diffMs = deadlineDate.getTime() - Date.now();

            if (diffMs <= 0) {
                return (
                    <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                        CLOSED
                    </span>
                );
            }

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

            const remaining =
                days > 0
                    ? `${days} day${days > 1 ? "s" : ""}`
                    : `${hours}h ${minutes}m`;

            return (
                <span className={`${days > 3 ? "text-green-700 bg-green-100" : "text-yellow-700 bg-yellow-100"} px-2 py-1 flex text-center items-center whitespace-nowrap rounded-full text-xs font-medium`}>
                    {remaining}
                </span>
            );
        }

    },
];

export default columns;