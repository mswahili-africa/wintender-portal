// components/dashboard/StatGroupCard.tsx
import { ReactNode } from "react";

interface StatItem {
  label: string;
  value: string | number;
}

interface Props {
  title: string;
  icon: ReactNode;
  items: StatItem[];
}

export default function StatGroupCard({ title, icon, items }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg text-green-600">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
