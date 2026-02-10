// components/dashboard/AdminStats.tsx
import {
  IconFileText,
} from "@tabler/icons-react";
import StatGroupCard from "../fragments/StatGroupCard";
import { ISummaryReport } from "@/types";
import { useTranslation } from "react-i18next";

interface IProps {
  summary: ISummaryReport;
}

export default function PEStats({ summary }: IProps) {
  const {t} = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* TENDERS */}
      <StatGroupCard
        title={t("dashboard-my-tenders-title")}
        icon={<IconFileText size={20} />}
        items={[
          { label: t("dashboard-my-tenders-total-published"), value: summary?.tenders?.total ?? 0 },
          { label: t("dashboard-my-tender-box"), value:  summary?.applications ?? 0 },
        ]}
      />
      
    </div>
  );
}
