

// JCM Settings Interface
export interface ISettings {
  general: any;
  payment: any;
  sms: any;
}

export enum SMSAggregators {
    ONFONMEDIA = "ONFONMEDIA",
    NEXT_SMS = "NEXT SMS",
    ON_SMS = "ON SMS"
}

export enum PaymentAggregators {
    AZAM_PAY = "AZAM PAY",
    FLUTTERWAVE = "FLUTTERWAVE"
}

export enum CurrencyTypes {
    TZS = "TZS",
    KES = "KES",
    UGS = "UGS"
}

export enum LanguageOptions {
    ENGLISH = "ENGLISH",
    SWAHILI = "SWAHILI"
}