// components/dashboard/AdminStats.tsx
import {
  IconFileText,
  IconBuilding,
  IconUsersGroup,
  IconPigMoney,
} from "@tabler/icons-react";
import StatGroupCard from "./StatGroupCard";
import { ISummaryReport } from "@/types";

interface IProps {
  summary: ISummaryReport;
}

export default function PublisherStats({ summary }: IProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* TENDERS */}
      <StatGroupCard
        title="Tenders"
        icon={<IconFileText size={20} />}
        items={[
          { label: "Total Published", value: summary?.tenders?.total ?? 0 },
          { label: "Categories", value:  summary?.tenders?.categories ?? 0},
        ]}
      />

      {/* REQUESTS */}
      <StatGroupCard
        title="Commission"
        icon={<IconPigMoney size={20} />}
        items={[
          { 
            label: "Total Earned: TZS", 
            value: new Intl.NumberFormat('en-TZ', {
                    style: 'decimal',
                    currency: 'TZS',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(summary?.payments ?? 0)
          },
        ]}
      />

      {/* ENTITIES */}
      <StatGroupCard
        title="Entities"
        icon={<IconBuilding size={20} />}
        items={[
          {
            label: "Government",
            value: summary?.procurementEntities?.GOVERNMENT ?? 0,
          },
          {
            label: "Private",
            value: summary?.procurementEntities?.PRIVATE ?? 0,
          },
          {
            label: "Manufacturers",
            value: summary?.procurementEntities?.MANUFACTURER ?? 0,
          },
        ]}
      />

      {/* BIDDERS */}
      <StatGroupCard
        title="Bidders"
        icon={<IconUsersGroup size={20} />}
        items={[
          { label: "Total Bidders", value: summary?.bidders ?? 0 },
        //   { label: "Retainers", value: summary?.statistics?.retainers ?? 0 },
        ]}
      />
    </div>
  );
}
