import { Control, Controller } from "react-hook-form";
import { SettingItem } from "./fragments/SettingItem";
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
              <div className="flex gap-4">
                {["NEXT_SMS", "ONFONMEDIA"].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => field.onChange(option)}
                    className={`px-4 text-sm py-1 rounded border transition 
                      ${field.value === option ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300"}`}
                  >
                    {option}
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
