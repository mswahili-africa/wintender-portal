// components/dashboard/AdminStats.tsx
import {
  IconFileText,
  IconGitPullRequest,
} from "@tabler/icons-react";
import StatGroupCard from "../StatGroupCard";
import { ISummaryReport } from "@/types";

interface IProps {
  summary: ISummaryReport;
}

export default function BidderStats({ summary }: IProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* TENDERS */}
      <StatGroupCard
        title="Tenders"
        icon={<IconFileText size={20} />}
        items={[
          { label: "Open Tenders", value: summary?.tenders?.open ?? 0 },
          { label: "Categories", value: summary?.tenders?.categories ?? 0 },
          { label: "Total Published", value: summary?.tenders?.total ?? 0 },
        ]}
      />
      <StatGroupCard
        title="Do it for me"
        icon={<IconGitPullRequest size={20} />}
        items={[
          { label: "Total Requests", value: summary?.requests?.total ?? 0 },
          { label: "Total Opened", value: summary?.requests?.open ?? 0 },
          { label: "Total Awarded", value: summary?.requests?.awarded ?? 0 },
          { label: "Total Submitted", value: summary?.requests?.submitted ?? 0 },
        ]}
      />

    </div>
  );
}
