

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
    tin: string;
    categoryIds: string[];
}

export interface IConfirmPasswordResetForm {
    email: string
    password: string
    confirmPassword: string
    confirmationCode: string
}

export interface IUserData {
    userId: string;
    email: string;
    username: string;
    name: string;
    phoneNumber: string;
    avatar: string;
    status: string;
    subscription: number;
    walletAmount: number;
    account: string;
    role: string;
    company: string;
}

export interface IMessage {
    phoneNumber: string
    message: string
}

export interface IConsultation {
    id: string
    title: string
    message: string
    reference: string
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
    paymentReason: string
}

export interface IUSSDPushWalletRequest {
    amount: number
    phoneNumber: string
    paymentReason: string
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
}

export interface ICreditForm {
    account: string
    amount: number
    description: string
}