import { IColumn } from "@/components/widgets/table/Table";
import Chip from "@/components/chip/Chip";
import { SubscriptionPlanDuration } from "@/types/statuses";
import { 
  IconCalendarEvent, 
  IconCash, 
  IconCircleCheck, 
  IconCircleX,
  IconTrendingDown
} from "@tabler/icons-react";
import { ISubscriptionPlan } from "@/types";

// Derived row type matching your plan schema minus id, benefitsId, and benefits
type SubscriptionRowData = Omit<ISubscriptionPlan, "id" | "benefitsId" | "benefits">;

const subscriptionColumns: IColumn[] = [
  {
    name: "name",
    label: "Subscription Plan",
    sortable: true,
    plainObject: true,
    element: ( row: SubscriptionRowData) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900 tracking-tight block">
          {row.name}
        </span>
        {row.popular && (
          <span className="bg-amber-50 text-purple-700 border border-purple-200/60 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-95">
            Popular
          </span>
        )}
      </div>
    )
  },
  {
    name: "duration",
    label: "Duration",
    sortable: false,
    plainObject: false,
    element: (value: string) => {
      const displayValue = SubscriptionPlanDuration[value as keyof typeof SubscriptionPlanDuration] || value;
      return (
        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
          <IconCalendarEvent size={16} className="text-gray-400 shrink-0" />
          <span className="capitalize">{displayValue.toLowerCase()}</span>
        </div>
      );
    }
  },
  {
    name: "amount",
    label: "Price Rate",
    sortable: true,
    plainObject: true,
    element: (row: SubscriptionRowData) => {
      if (row.amount === undefined || row.amount === null) {
        return <span className="text-gray-400 font-mono">-</span>;
      }

      // Dynamic localization using the row's specific fallback currency key
      const currentCurrency = row.currency || "TZS";
      const formattedAmount = new Intl.NumberFormat(currentCurrency === "TZS" ? "en-TZ" : "en-US", {
        style: "currency",
        currency: currentCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(row.amount);

      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 font-mono text-sm font-semibold text-gray-800">
            <IconCash size={16} className="text-emerald-500 shrink-0" />
            <span>{formattedAmount}</span>
          </div>
          {row.discount > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium pl-5">
              <IconTrendingDown size={12} />
              <span>{row.discount}% Off Included</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    name: "status",
    label: "Status",
    sortable: false,
    plainObject: true,
    element: (row: SubscriptionRowData) => {
      const displayStatus = row.status || "INACTIVE";
      
      const statusMap: Record<string, { theme: "success" | "warning" | "secondary" | "danger" }> = {
        ACTIVE: { theme: "success" },
        INACTIVE: { theme: "secondary" },
        EXPIRED: { theme: "danger" }
      };

      const match = statusMap[displayStatus.toUpperCase()] || { theme: "secondary" };

      return (
        <Chip
          label={displayStatus.toUpperCase()}
          size="sm"
          theme={match.theme}
          variant="outline"
        />
      );
    }
  }
];

export default subscriptionColumns;