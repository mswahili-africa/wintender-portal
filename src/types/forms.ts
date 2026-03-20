

export interface ICustomerForm {
    firstName: string
    lastName: string
    nationalId: number
    nationalIdPath: string
    primaryNumber: number
    secondaryNumber: string[]
    address: string
    longitude: string
    latitude: string
}

export interface ILoginForm {
    username: string
    password: string
}

export interface IRegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    nationalId: string;
    procurementEntityId: string;
}

export interface IBidderRegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    confirmPhoneNumber: string;
    companyName: string;
    companyPhoneNumber: string;
    companyAddress: string;
    companyBusinessType: string;
    tin: string;
    categoryIds: string[];
}

export interface IConfirmPasswordResetForm {
    email: string
    password: string
    confirmPassword: string
    confirmationCode: string
}

export type UserRole =
    | "ADMINISTRATOR"
    | "BIDDER"
    | "PUBLISHER"
    | "ACCOUNTANT"
    | "MANAGER"
    | "SUPERVISOR"
    | "PROCUREMENT_ENTITY"
    | "PROCUREMENT_ENTITY_REVIEWER"
    | "PROCUREMENT_ENTITY_CHAIRMAN"
    | "LEGAL";

export interface IUserData {
    userId: string;
    email: string;
    username: string;
    companyName:string;
    name: string;
    phoneNumber: string;
    avatar: string;
    status: string;
    subscription: number;
    walletAmount: number;
    account: string;
    role: UserRole;
    company: string;
    paymentMode: string;
}

export interface IMessage {
    phoneNumber: string
    message: string
    mediaType?: string
    media?: string
    messageMode?: string
    name?: string
}

export interface IConsultation {
    id: string
    title: string
    message: string
    reference: string
}

export interface IApplicationPDFReport {
    groupId: string
    month: number
}

export interface IConsultationApplication {
    id: string
    reference: string
    consultationId: string
    controlNumber: string
    principleAmount: number
    paymentStatus: string
    comment: string
    status: string
    title: string
    bidderUserName: string
    bidderCompanyName: string
    bidderAccount: string
    bidderCompanyPhoneNumber: string
    bidderCompanyEmail: string
}

export interface IUSSDPushRequest {
    planId: string
    phoneNumber: string
    period: number
    reason: string
    mno: string
    source: string
}

export interface IUSSDPushWalletRequest {
    amount: number
    phoneNumber: string
    reason: string
}

export interface IPlan {
    companyId: string
    plan: string
    maxTenders: number
    numberOfMonths: number
    amount: number
}

export interface IAssignBidder {
    bidderId: string
    tenderId: string
}

export interface IPublisherReport {
    id: string
    email: string
    name: string
    phoneNumber: string
    numberOfTenders: number
}

export interface IPaymentForm {
    controlNumber: string
    account: string
    phoneNumber: string
    amount: number
    mno: string
    description: string
    paymentReason: string
    referenceId: string
    bidderId: string
    source: string
}

export interface ICreditForm {
    account: string
    amount: number
    description: string
}

export interface IServiceForm {
    id?: string
    title: string
    bidderId: string
    description: string
    consultationFee: number
}

export enum BusinessType {
  PRIVATE_LIMITED_COMPANY_BY_SHARES = "Private Limited Company By Shares",
  PUBLIC_UNLIMITED_COMPANY_BY_SHARES = "Public Unlimited Company By Shares",
  COMPANY_LIMITED_BY_GUARANTEE = "Company Limited by Guarantee",
  SOLE_PROPRIETORSHIP = "Sole Proprietorship",
  SPECIAL_GROUP = "Special Group",
  PARTNERSHIP = "Partnership",
  BRANCH_OF_FOREIGN_COMPANY = "Branch of a Foreign Company"
}