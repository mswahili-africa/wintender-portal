import { List } from "lodash";

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
  categories?: string[];
  address?: string;
  userId?: string;
  searchKey?: string
  searchValue?: string
  filter?: Record<string, any>;
  logType?: string;
  eligibility?: boolean
  bidderId?: string
  phoneNumber?: string
}

export interface IQueryParamsUserFilter {
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
  role: string;
  displayName: string;
  id: string;
  avatar: string;
  email: string;
  username: string;
  account: string;
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

export interface IToken {
  userId: string;
  email: string;
  name: string;
  phoneNumber: string;
  avatar: number;
  status: string;
  subscription: number;
  role: string;
}

export interface IRole {
  id: string;
  role: string;
  description: string;
  allowedCreatorRole: string;
  archive: string;
}

export interface ICategory {
  id: string;
  name: string;
  categoryGroup: string;
  code: string;
}

export interface IUser {
  [x: string]: any;
  id: string;
  name: string;
  account: string;
  address: string;
  phoneNumber: string;
  email: string;
  idType: string;
  idImagePath: string;
  passportImagePath: string;
  status: string;
  displayName: string;
  lastLogin: number;
  avatar: string;
  roleId: string;
  company: string;
  planExpiryDate: number;
  updatedBy: string;
  updatedAt: number;
  nationalId: string;
}

export interface IEntity {
  id: string;
  entityType: string;
  name: string;
  account: string;
  primaryNumber: string;
  address: string;
  email: string;
  summary: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  status: string;
}

export interface ILoginAttempt {
  id: string;
  username: string;
  ip: string;
  failureReason: string;
  createdAt: number;
  updatedAt: number;
}

export interface ICompany {
  id: string;
  account: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
  planExpiryDate: number;
  walletAmount: number;
  currentPlanId: string;
  companyName: string;
  companyStatus: string;
  companyPrimaryNumber: string;
  companyAddress: string;
  companyEmail: string;
  companyWebsite: string;
  companyTin: string;
  companyVrn: string;
  companyTinFilePath: string;
  companyLogoFilePath: string;
  companyCategories: string[];
  categoryIds: string[];
}

export interface ICompanyDocuments {
  id: string;
  documentNumber: string;
  documentType: string;
  filePath: string;
}


export interface ITenderCategory {
  id: string;
  categoryGroup: string;
  code: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ITenders {
  id: string;
  referenceNumber: string;
  selfApply: boolean;
  tenderNumber: string;
  region: string;
  title: string;
  summary: string;
  filePath: string;
  openDate: number;
  closeDate: number;
  tenderType: string;
  applicationFee: number;
  consultationFee: number;
  categoryName: string;
  categoryId: string
  tenderGroup: string;
  entityName: string;
  entityLogoFilePath: string;
  entityId: string
  requirements: IRequirement[];
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}


// SUMMARY REPORT INTERFACES
export interface IRequests {
  total: number;
  open: number;
  awarded: number;
  submitted: number;
}

export interface ITendersSummary {
  total: number;
  categories: number;
  open: number;
}

export interface IProcurementEntities {
  MANUFACTURER: number;
  GOVERNMENT: number;
  PRIVATE: number;
}

export interface IMessageBalance {
  nextSMS: string;
  onfonMedia: string;
}

interface IBiddersSummary {
  total: number;
  active: number;
}

export interface ISummaryReport {
  bidders: IBiddersSummary;
  tenders: ITendersSummary;
  payments: number;
  procurementEntities: IProcurementEntities;
  requests: IRequests;
  messageBalance: IMessageBalance;
  applications: number;
}

export interface IStatisticsResponse {
  code: string;
  statistics: ISummaryReport;
}
// end

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
  company: string;  // JCM
  paymentReason: string;  // JCM
  userName: string;  // JCM
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

// JCM WALLET TOPUP
export interface IWalletTopUp {
  amount: number;
  phoneNumber: string;
  paymentReason: string;
  mno?: string;
  source?: string;
}

export interface IDoItForMe {
  id: string;
  user: IUser;
  reference: string;
  tender: ITenders;
  comments: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface IControlNumber {
  id: string;
  principleAmount: number;
  paidAmount: string;
  controlNumber: ITenders;
  comment: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface IApplicationGroup {
  id: string;
  bidderId: string;
  applicationsCount: number;
  companyId: string;
  bidderCompanyName: string;
  bidderAccount: string;
  bidderCompanyPrimaryNumber: string;
  bidderCompanyEmail: string;
  readStatus: string;
  bidderName: string;
  assignorName?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface IApplications {
  id: string;
  groupId: string;
  referenceNumber: string;
  tenderId: string;
  tenderNumber: string;
  title: string;
  summary: string;
  file: string;
  openDate: number;
  closeDate: number;
  tenderType: string;
  tenderGroup: string;
  consultationFee: string;
  categoryName: string;
  filePath: string;
  entityName: string;
  region: string;
  comments: string;
  controlNumber: string;
  paymentReason: string;
  principleAmount: number;
  paidAmount: number;
  paymentStatus: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  bidderAccount: string;
  bidderUserName: string;
  bidderCompanyEmail: string;
  bidderCompanyPhoneNumber: string;
  bidderCompanyName: string;
  bidderCompanyTin: string;
  bidderCompanyVrn: string;
  assignorName?: string;
}

export interface IBidderApplication {
  id: string;
  userId: string;
  tenderId: string;
  currentStage: string;
  consentGiven: boolean;
  submitted: boolean;
  uploadedDocuments: List<IBidderUploadedDocument>;
}

export interface IBidderUploadedDocument {
  id: string;
  stage: string;
  fieldName: string;
  filePath: string;
}

export interface ITenderDetails {
  applicationStatus: string;
  tenderId: string;
  title: string;
  tenderNumber: string;
  region: string;
  summary: string;
  filePath: string;
  openDate: string;
  closeDate: number | string;
  status: string;
  consultationFee: number;
  applicationFee: number;
  entityName: string;
  requirements: IRequirement[];
}

export interface IRequirement {
  stage: "PRELIMINARY" | "TECHNICAL" | "COMMERCIAL" | "CONSENT";
  fieldName: string;
  required: boolean;
}


/**
 * Represents a submitted application by a bidder for a tender.
 */
export interface ISubmittedApplication {
  id: string;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: number;
  updatedAt: number;
  reference: string;
  tenderId: string;
  bidderId: string;
  stage: string;
  filePath: string;
  status: string;
  tenderIdTitle: string;
  tenderSummary: string;
  tenderFilePath: string;
  tenderOpenDate: number;
  tenderCloseDate: number;
  tenderNumber: string;
  companyName: string;
  companyAddress?: string;
  companyEmail: string;
  companyWebsite?: string | null;
  companyPrimaryNumber: string;
}


// JCM Settings Interface
export interface ISettings {
  general: any;
  payment: any;
  sms: any;
}

export interface IReply {
  repliedMessageId: string;
  createdAt?: number;
  createdBy?: string;
  name?: string;
  id?: string;
  message: string;
}

export interface IClarification {
  id?: string;
  message: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: number;
  updatedAt?: number;
  replies?: IReply[];
}

export interface IContacts {
  name: string;
  phoneNumber: string;
  status: string;
  updatedAt: number;
}

export interface IMessages {
  id: string;
  createdAt: number;
  serviceType: string;
  name: string;
  phoneNumber: string;
  message: string;
  messageResponse: string;
  status: string;
  action: string;
  smsFallback: boolean;
}

export interface IAIChatMessage {
  role: "USER" | "ASSISTANT";
  content: string;
  timestamp: string;
}
