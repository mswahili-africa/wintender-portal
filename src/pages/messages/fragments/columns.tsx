import Chip from "@/components/chip/Chip";
import { IColumn } from "@/components/widgets/table/Table";
import { IconBuilding, IconPhone, IconCalendar } from "@tabler/icons-react";

const columns: IColumn[] = [
  // COLUMN 1: Combined Name & Company
  {
    name: "name",
    label: "Contact & Company",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      return (
        <div className="flex flex-col py-0.5">
          {/* Primary Name */}
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            {row.name || "N/A"}
          </span>
          {/* Subtext: Company Name */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
            <IconBuilding size={13} className="text-slate-400 shrink-0" />
            <span className="truncate max-w-[200px]">{row.companyName || "No Company"}</span>
          </div>
        </div>
      );
    },
  },

  // COLUMN 2: Combined Phone Number & Date/Time
  {
    name: "phoneNumber",
    label: "Contact Info & Date",
    sortable: false,
    plainObject: true,
    element: (row: any) => {
      const formattedDate = row.createdAt || row.updatedAt 
        ? new Date(row.createdAt || row.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        : "N/A";

      return (
        <div className="flex flex-col py-0.5">
          {/* Phone Number */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-mono">
            <IconPhone size={13} className="text-slate-400 shrink-0" />
            <span>{row.phoneNumber || "N/A"}</span>
          </div>
          {/* Subtext: Timestamp */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mt-1">
            <IconCalendar size={13} className="shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      );
    },
  },

  // COLUMN 3: Status Badge
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: false,
    element: (value: string) => {
      let theme: "primary" | "secondary" | "success" | "warning" | "danger" | "pending" | "approved";
      let statusLabel = value;

      switch (value?.toUpperCase()) {
        case "READ":
          theme = "success";
          statusLabel = "Read";
          break;
        case "UNREAD":
          theme = "approved"; // Or "primary" / "warning" depending on your chip system
          statusLabel = "Unread";
          break;
        default:
          theme = "warning";
          statusLabel = value || "Pending";
      }

      return (
        <div className="flex items-center">
          <Chip 
            label={statusLabel} 
            size="sm" 
            theme={theme} 
            variant="outline" 
          />
        </div>
      );
    },
  },
];

export default columns;