

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

export interface IProductModelForm {
    id?:                string
    modelNumber:        string
    productGroup: string
    handshakeVersion: string
    generation: string
    minVoltage:number
    maxVoltage:number
    lowerFrequency:string
    higherFrequency:string
    power:string
    netWeight:string
    grossWeight:string
    height:number
    width:number
    length:number
    communicationType:string
}

export interface IModelInfoForm{
    kwhPrice: number;
    language:string;
    warrantPeriod: number;
    sellingPrice: number;
    certifications:string[];
    userManual:any
  }

export interface IProductGroupForm {
    id?:        string
    name:       string
}

export interface IFirmwareForm {
    version:        string
    deviceModel:    string
    description:    string
    firmwareFile:   any
}

export interface IBatchSerialForm {
    productName:        string
    ProductModelId:     string
}

export interface ITrackerSerialForm {
    orderSerial:   string
}

export interface IPackagesForm {
    productModel: string
    paymentScheme: string
    productCondition:string
    depositAmount: number;
    maximumMinutes: number;
    paymentPeriod: number;
    lateFee: number;
    unitPrice:number
}

export interface IOrderForm {
    quantity:       number
    productModelId: string
}

export interface IMessage {
    phoneNumber:       string
    message: string
}

export interface IPlan {
    companyId:       string
    plan: string
    maxTenders: number
    numberOfMonths: number
    amount: number
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

export interface IVendorForm {
    name:                       string
    primaryNumber:              string
    secondaryNumber:            string
    email:                      string
    address:                    string
    latitude:                   string
    longitude:                  string
    taxIdentificationNumber:    number
    licenceNumber:              number
    licenceExpireDate:          Date
    licenceFile:                any
    tinFile:                    any
    otherFile:                    any
    resellerType:               string
    assignedModels:             string[]
    type:string
    code?:string
    currency?:string
    sellingPricePercantage?:string
    paymentPercantage?:string
}