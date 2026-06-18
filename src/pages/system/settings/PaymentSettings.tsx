
import { Control, Controller } from "react-hook-form";
import { SettingItem } from "./fragments/SettingItem";
import { CurrencyTypes, PaymentAggregators } from "@/types/settings";
import { keyBy } from "lodash";
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
              {Object.entries(PaymentAggregators).map(([key, value]) =>(
                <button
                  type="button"
                  key={key}
                  onClick={() => field.onChange(key)}
                  className={`px-4 text-sm py-1 rounded border transition 
                ${field.value === key ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300"}`}
                >
                  {field.value === key ? <strong>{value}</strong> : value}
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
              {Object.entries(CurrencyTypes).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => field.onChange(key)}
                  className={`px-4 text-sm py-1 rounded border transition 
                    ${field.value === key ? "bg-green-500 text-white border-green-500" : "bg-white border-gray-300"}`}
                >
                  {field.value === key ? <strong>{value}</strong> : value}
                </button>
              ))}
            </div>
          )}
        />

      </SettingItem>
    </div>
  );
};
