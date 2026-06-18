import { Control, Controller } from "react-hook-form";
import { SettingItem } from "./fragments/SettingItem";
import { SMSAggregators } from "@/types/settings";
type TProps = {
  control: Control<any>;
};

export const SMSSettings = ({ control }: TProps) => {

  return (
    <div>
      <SettingItem
        title="SMS Provider"
        description="Configure your SMS provider service"
      >
        <Controller
          name="sms.aggregator"
          control={control}
          render={({ field }) => {
            return (
              <div className="flex gap-y-4">
                {Object.entries(SMSAggregators).map(([key, value]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => field.onChange(key)}
                    className={`px-4 text-sm py-1 rounded border transition 
                      ${field.value === key ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            );
          }}

        />
      </SettingItem>
    </div>
  );
};
