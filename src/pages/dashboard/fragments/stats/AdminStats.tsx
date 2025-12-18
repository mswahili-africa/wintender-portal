import {
  IconFileText,
  IconGitPullRequest,
  IconBuilding,
  IconUsersGroup,
} from "@tabler/icons-react";
import StatGroupCard from "../StatGroupCard";
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
          { label: "Total Published", value: summary?.tenders?.total ?? 0 },
          { label: "Open", value: summary?.tenders?.open ?? 0 },
          { label: "This Month", value: summary?.tenders?.thisMonth ?? 0 },
          { label: "Categories", value:  summary?.tenders?.categories ?? 0 },
        ]}
      />

      {/* REQUESTS */}
      <StatGroupCard
        title="Do it for me"
        icon={<IconGitPullRequest size={20} />}
        items={[
          { label: "Total Do it for Me", value: summary?.requests?.total ?? 0 },
          { label: "Requests", value: summary?.requests?.request ?? 0 },
          { label: "On progress", value: summary?.requests?.open ?? 0 },
          { label: "Submitted", value: summary?.requests?.submitted ?? 0 },
          { label: "Awarded", value: summary?.requests?.awarded ?? 0 },
          { label: "Cancelled", value: summary?.requests?.canceled ?? 0 },
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
          { label: "Total Bidders", value: summary?.bidders?.total ?? 0 },
          { label: "Active Bidders", value: summary?.bidders?.active ?? 0 },
        ]}
      />
    </div>
  );
}
