// components/dashboard/AdminStats.tsx
import {
  IconFileText,
} from "@tabler/icons-react";
import StatGroupCard from "../StatGroupCard";
import { ISummaryReport } from "@/types";

interface IProps {
  summary: ISummaryReport;
}

export default function PEStats({ summary }: IProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* TENDERS */}
      <StatGroupCard
        title="My Tenders"
        icon={<IconFileText size={20} />}
        items={[
          { label: "Total Published", value: summary?.tenders?.total ?? 0 },
          { label: "Tender Box", value:  summary?.applications ?? 0 },
        ]}
      />

      
    </div>
  );
}
