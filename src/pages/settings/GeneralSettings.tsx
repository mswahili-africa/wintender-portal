import { Control, Controller } from "react-hook-form";
import { SettingItem } from "./fragments/SettingItem";

type TProps = {
  control: Control<any>;
}
export const GeneralSettings = ({ control }: TProps) => {
  return (
    <div className="space-y-6">
      <SettingItem
        title="Language"
        description="Select the language for the application interface."
      >
        <Controller
          name="general.language"
          control={control}
          render={({ field }) => {
            return <div className="flex gap-y-4">
              {["ENGLISH", "SWAHILI"].map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => field.onChange(option)}
                  className={`px-4 text-sm py-1 rounded border transition 
                ${field.value === option ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300"}`}
                >
                  {field.value === option ? <strong>{option}</strong> : option}
                </button>
              ))}
              <div>
              </div>
            </div>
          }}
        />
      </SettingItem>
    </div>
  )
}
