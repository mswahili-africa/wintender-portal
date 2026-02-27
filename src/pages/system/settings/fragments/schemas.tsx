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
    .oneOf(["AZAM_PAY", "FLUTTERWAVE"], "Invalid payment aggregator")
    .required("Payment aggregator is required"),
  currency: yup
    .string()
    .oneOf(["TZS", "KES", "UGS"], "Invalid currency")
    .required("Currency is required"),
});

export const smsSchema = yup.object({
  aggregator: yup
    .string()
    .oneOf(["NEXT_SMS", "ONFONMEDIA"], "Invalid SMS aggregator")
    .required("SMS aggregator is required"),
});
