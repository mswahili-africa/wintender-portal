// components/dashboard/AdminStats.tsx
import {
  IconFileText,
  IconGitPullRequest,
  IconBuilding,
  IconUsersGroup,
} from "@tabler/icons-react";
import StatGroupCard from "./StatGroupCard";
import { ISummaryReport } from "@/types";

interface IProps {
  summary: ISummaryReport;
}

export default function AdminStats({ summary }: IProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* TENDERS */}
      <StatGroupCard
        title="Tenders"
        icon={<IconFileText size={20} />}
        items={[
          { label: "Total Tenders", value: summary?.statistics?.tenders ?? 0 },
          { label: "Categories", value:  813 },
        ]}
      />

      {/* REQUESTS */}
      <StatGroupCard
        title="Do it for me"
        icon={<IconGitPullRequest size={20} />}
        items={[
          { label: "Total Requests", value: summary?.statistics?.requests ?? 0 },
        //   { label: "Pending", value: summary?.statistics?.pendingRequests ?? 0 },
        //   { label: "Completed", value: summary?.statistics?.completedRequests ?? 0 },
        ]}
      />

      {/* ENTITIES */}
      <StatGroupCard
        title="Entities"
        icon={<IconBuilding size={20} />}
        items={[
          {
            label: "Government",
            value: summary?.statistics?.procurementEntities?.GOVERNMENT ?? 0,
          },
          {
            label: "Private",
            value: summary?.statistics?.procurementEntities?.PRIVATE ?? 0,
          },
          {
            label: "Manufacturers",
            value: summary?.statistics?.procurementEntities?.MANUFACTURER ?? 0,
          },
        ]}
      />

      {/* BIDDERS */}
      <StatGroupCard
        title="Bidders"
        icon={<IconUsersGroup size={20} />}
        items={[
          { label: "Total Bidders", value: summary?.statistics?.bidders ?? 0 },
        //   { label: "Subscribed", value: summary?.statistics?.subscribedBidders ?? 0 },
        //   { label: "Unsubscribed", value: summary?.statistics?.unsubscribedBidders ?? 0 },
        //   { label: "Retainers", value: summary?.statistics?.retainers ?? 0 },
        ]}
      />
    </div>
  );
}
