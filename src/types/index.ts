export interface IGenericResponse {
  statusCodeValue: number;
  message: string;
  statusCode: string;
}

export interface IQueryParams {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  filter?: Record<string, any>;
}

export interface IlistResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  number: number;
  sort: Sort2;
  numberOfElements: number;
  size: number;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Sort2 {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export type IAuthErrorResponse = {
  metadata: {
    status: string;
  };
  errors: Array<{
    message: string;
    code: string;
    detail: string;
  }>;
};

export interface IUserRole {
  id: string;
  role: string;
  description: string;
  archive: number;
  permission: IPermission[];
}

export interface IPermission {
  id: string;
  name: string;
}

export interface IAuthUser {
  role: IUserRole;
  displayName: string;
  id: string;
  avatar: string;
  email: string;
  username: string;
  status: string;
}

export interface ILoginResponse {
  userInfo: IAuthUser;
  AccessToken: string;
  success: boolean;
  message: string;
  status: string;
}

export interface ICountry {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
}

export interface IRole {
  id: string;
  role: string;
  description: string;
  allowedCreatorRole: string;
  archive: string;
}

// export interface IAuthUser {
//     firstName: string;
//     lastName: string;
//     country: string;
//     role: string;
//     vendor: string;
//     userName: string;
//     email: string;
//     status: string;
// }

export interface IDash {
  vendorInformation: IVendorInformation | null;
  vendorStatistics: IStatistics;
}

export interface IVendorInformation {
  id: string;
  countryId: string;
  vendorId: any;
  vendorType: string;
  name: string;
  address: string;
  tin: string;
  businessLicence: string;
  longitude: string;
  latitude: string;
  primaryNumber: string;
  secondaryNumber: string;
  email: string;
  tinPathFile: string;
  licencePathFile: string;
  licenceExpireDate: number;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface IStatistics {
  totalCustomers: number;
  totalEnergyUsedKwh: number;
  nonPerformingCustomers: number;
  totalElapsedHours: number;
  totalAvailableDevices: number;
  totalPayments: number;
  totalAmountUsed: number;
  totalOrders: number;
}

export interface IUser {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  idType: string;
  idImagePath: string;
  passportImagePath: string;
  status: string;
  displayName: string;
  lastLogin: number;
  role: string;
  updatedBy: string;
  updatedAt: number;
  countryId: string;
  vendorId: string;
  resellerId: null;
  salesOfficerId: null;
  nationalId: string;
}

export interface ICustomer {
  unitsPaid:number;
  id: string;
  tenant: string;
  cookingId: string;
  firstName: string;
  email: string;
  fullName: string;
  primaryNumber: number;
  secondaryNumber: string[];
  address: string;
  nationalId: number;
  longitude: string;
  latitude: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  maxUnits: number;
  lastPaymentDate: number;
  status: string;
  nationalIdPath: string;
  contractPath: string;
  deviceReference: IDevice;
  packageReference:IPackages;
  dueDate:string
}

export interface IDevice {
  id: string;
  serial: string;
  imei: string;
  deviceType: string;
  macAddress: string;
  deviceStatus: string;
  customerId: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  details: string[];
  deviceName: string;
  deviceVersion:string;
  factoryStatus:string;
  deviceRemarks:string;
  productReference:IProduct;
}

export interface ICredit {
  createdBy?: string,
  updatedBy?: string,
  createdAt?: string,
  updatedAt?: string,
  id: string,
  code?: string,
  account?: string,
  status?: string,
  description:string,
  principleAmount:number
  appliedAmount:number 
}

export interface IProduct {
  id: string;
  name: string;
  tenant: string;
  serial: string;
  location: string;
  status: string;
  condition: string;
  archive: number;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  productModelId: null;
  owner:string;
}

export interface IOrder {
  id: string;
  orderSerial: string;
  tenant: string;
  quantity: number;
  archive: number;
  status: string;
  assignedTo: string[] | null;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  productModelId: IProductModel;
  productId: any;
  orderType: string;
  controlNumber:IControlNumber;
  reseller:IUser;
  tracker:ITrackerSerial;
}

export interface IControlNumber{

  id:string;
  controlNumber:number;
  source:string;
  paidAmount:number;
}


export interface IProductModel {
  id: string;
  verificationId:string;
  modelNumber: string;
  minVoltage: number;
  maxVoltage: number;
  netWeight: number;
  grossWeight: number;
  height: number;
  width: number;
  length: number;
  communicationType: string;
  archive: number;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  productGroup: IProductGroup;
  lowerFrequency:string;
  higherFrequency:string;
  size:number;
  modelInfo:IModelInfo;
}

export interface IModelInfo{
  kwhPrice: number;
  language:string;
  warrantPeriod: number;

}

export interface IProductGroup {
  id: string;
  name: string;
  archive: number;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface IBatchSerial {
  id: string;
  name: string;
  countryId: string;
  type: string;
  archive: number;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  vendorId: string;
}

export interface ITrackerSerial {
  id: string;
  name: string;
  countryId: string;
  type: string;
  archive: number;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  vendorId: string;
}

export interface ProductModelId {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  productGroupId: ProductGroupId;
}

export interface ProductGroupId {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface IFirmware {
  id: string;
  version: string;
  deviceModel: string;
  description: string;
  pathToFile: string;
  releaseStatus: string;
  status: string;
  archive: number;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ILog {
  id: string;
  tenant: string;
  serialNumber: string;
  logType: string;
  identifier: string;
  firmwareId: string;
  sessionStart: number;
  sessionEnd: number;
  cumulativeSessionHours: number;
  tamperingStatus: string;
  deviceStatus: string;
  healthStatus: string;
  dateTime: number;
  remarks: string;
  createdAt: number;
  updatedAt: number;
}

export interface ICustomerReport {
  id: string;
  customerId: string;
  serialNumber: string;
  menuBalance: number;
  cumulativeUsageCount: number;
  cumulativeSessionHours: number;
  cumulativePowerConsumed: number;
  tamperingStatus: string;
  healthStatus: string;
  bleStatus: string;
  mcuStatus: string;
  updatedAt: number;
}

export interface ICommand {
  id: string;
  tenant: string;
  commandType: string;
  serialNumber: string;
  affirmation: string;
  nextLock: number;
  identifier: string;
  createdBy: string;
  updatedBy: null;
  createdAt: number;
  updatedAt: number;
  dateTime: null;
  commandMessage: string;
  status: string;
}

export interface IPackages {
  id: string;
  name?: string;
  productModel: IProductModel;
  purchaseType: string;
  packageId?: null;
  unitPrice: number;
  maximumMinutes: number;
  paymentPeriod: number;
  entranceAmount: number;
  depositAmount:number;
  paymentScheme:number;


}

export interface IProductModel{
  modelNumber:string
}

export interface ISummaryReport{
  statistics:IStatisticSummary
}

export interface IStatisticSummary{
  payments:number
  orders: number
  customers: number
  products: number
}

export interface IVendor {
  id: string;
  role: string;
  name: string;
  taxIdentificationNumber: string;
  licenceNumber: string;
  location: ILocation;
  longitude: string;
  latitude: string;
  primaryNumber: string;
  secondaryNumber: string;
  email: string;
  address:string;
  tinPathFile: string;
  licencePathFile: string;
  licenceExpireDate: number;
  type: string;
  code?:number
  currency?:string
  unitPricePercentage?:string
  paymentPercentage?:string
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ILocation {
  x: string;
  y: string;
}

export interface IVendorGroup {
  id: string;
  resellerType: string;
}

export interface IPayment {
  id: string;
  tenant: string;
  customerId: string;
  phoneNumber: string;
  transactionReference: string;
  mnoReceiptReference: string;
  amount: number;
  requestOrigin: string;
  mno: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}
