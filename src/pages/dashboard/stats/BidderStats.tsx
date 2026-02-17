// components/dashboard/AdminStats.tsx
import {
  IconFileText,
  IconGitPullRequest,
} from "@tabler/icons-react";
import StatGroupCard from "../fragments/StatGroupCard";
import { ISummaryReport } from "@/types";
import { useTranslation } from "react-i18next";

interface IProps {
  summary: ISummaryReport;
}

export default function BidderStats({ summary }: IProps) {
  const {t} = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* TENDERS */}
      <StatGroupCard
        title={t("dashboard-tenders-title")}
        icon={<IconFileText size={20} />}
        items={[
          { label: t("dashboard-total-published"), value: summary?.tenders?.total ?? 0 },
          { label: t("dashboard-open"), value: summary?.tenders?.open ?? 0 },
          { label: t("dashboard-this-month"), value: summary?.tenders?.thisMonth ?? 0 },
          { label: t("dashboard-categories"), value: summary?.tenders?.categories ?? 0 },
        ]}
      />
      <StatGroupCard
        title={t("dashboard-difm-title")}
        icon={<IconGitPullRequest size={20} />}
        items={[
          { label: t("dashboard-total-difm"), value: summary?.requests?.total ?? 0 },
          { label: t("dashboard-difm-requests"), value: summary?.requests?.request ?? 0 },
          { label: t("dashboard-difm-on-progress"), value: summary?.requests?.open ?? 0 },
          { label: t("dashboard-difm-submitted"), value: summary?.requests?.applied ?? 0 },
          { label: t("dashboard-difm-won"), value: summary?.requests?.awarded ?? 0 },
          { label: t("dashboard-difm-not-won"), value: summary?.requests?.failed ?? 0 },
          { label: t("dashboard-difm-executed"), value: summary?.requests?.executed ?? 0 },
          { label: t("dashboard-difm-canceled"), value: summary?.requests?.canceled ?? 0 },
        ]}
      />

    </div>
  );
}
