import React from "react";

interface SettingItemProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({ title, description, children }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 gap-4 px-6 pt-2 pb-4">
      <div className="max-w-lg">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
};
