import React from "react";

interface SettingItemProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-row justify-between border-b border-gray-200 pb-4">
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};
