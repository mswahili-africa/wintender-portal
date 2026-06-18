import { PaymentAggregators, SMSAggregators } from "@/types/settings";
import * as yup from "yup";

export const generalSchema = yup.object({
  language: yup
    .string()
    .oneOf(["ENGLISH", "SWAHILI"], "Invalid language selected")
    .required("Language is required"),
});

export const paymentSchema = yup.object({
  aggregator: yup
    .string()
    .oneOf(Object.entries(PaymentAggregators).map(([key, value]) => key), "Invalid payment aggregator")
    .required("Payment aggregator is required"),
  currency: yup
    .string()
    .oneOf(Object.entries(PaymentAggregators).map(([key, value]) => key), "Invalid currency")
    .required("Currency is required"),
});

export const smsSchema = yup.object({
  aggregator: yup
    .string()
    .oneOf(Object.entries(SMSAggregators).map(([key, value]) => key), "Invalid SMS aggregator")
    .required("SMS aggregator is required"),
});
