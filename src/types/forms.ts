

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
    firstName:  string;
    lastName:   string;
    email:  string;
    phoneNumber:    string;
    role:   string;
    nationalId:   string;
}

export interface IBidderRegisterForm {
    firstName:  string;
    lastName:   string;
    email:  string;
    phoneNumber:    string;
    confirmPhoneNumber:    string;
    companyName:    string;
    tin:    string;
}

export interface IConfirmPasswordResetForm {
    email:           string
    password:           string
    confirmPassword:    string
    confirmationCode:   string
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
    account: string;
    role: string;
}

export interface IMessage {
    phoneNumber:       string
    message: string
}

export interface IBillboard {
    id: string
    title:       string
    message: string
}

export interface IUSSDPushRequest {
    planId: string
    phoneNumber:       string
    period: number
    paymentReason: string
}

export interface IPlan {
    companyId:       string
    plan: string
    maxTenders: number
    numberOfMonths: number
    amount: number
}

export interface IAssignBidder {
    bidderId:       string
    tenderId: string
}

export interface IPublisherReport {
    id:       string
    email: string
    name:       string
    phoneNumber: string
    numberOfTenders: number
}

export interface IPaymentForm {
    controlNumber:        string
    account: string
    phoneNumber:         string
    amount:       number
    mno:     string
    description: string
}

export interface ICreditForm {
    account:        string
    amount:       number
    description: string
}