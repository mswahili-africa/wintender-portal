
import { Control, Controller, ControllerFieldState, ControllerRenderProps, FieldValues, UseFormStateReturn } from "react-hook-form";
import { SettingItem } from "./fragments/SettingItem";
type TProps = {
  control: Control<any>;
}
export const PaymentSettings = ({ control }: TProps) => {

  return (
    <div className="space-y-6">
      <SettingItem
        title="Payment Aggregator"
        description="Choose the aggregator you want to process your payments."
      >
        <Controller
          name="payment.aggregator"
          control={control}
          render={({ field }) => {
            return <div className="flex gap-y-4">
              {["AZAM_PAY", "FLUTTERWAVE"].map((option) => (
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

      {/* Example future payment setting */}
      <SettingItem
        title="Currency"
        description="Select the currency for your transactions."
      >
        <Controller
          name="payment.currency"
          control={control}
          render={({ field }) => (
            <div className="flex gap-y-4">
              {["TZS", "KES", "UGS"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => field.onChange(option)}
                  className={`px-4 text-sm py-1 rounded border transition 
                    ${field.value === option ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300"}`}
                >
                  {field.value === option ? <strong>{option}</strong> : option}
                </button>
              ))}
            </div>
          )}
        />

      </SettingItem>
    </div>
  );
};
