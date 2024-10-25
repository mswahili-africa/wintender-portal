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
  role: string;
  company: ICompany;
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

export interface ICompany {
  name: string;
  primaryNumber: string;
  address: string;
  tin: string;
  email: string;
  website: string;
  categories: string[];
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
  tenderNumber: string;
  region: string;
  title: string;
  summary: string;
  filePath: string;
  openDate: string;
  closeDate: number;
  tenderType: string;
  consultationFee: number;
  category: ITenderCategory;
  tenderGroup: string;
  entity: IEntity;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}


export interface ISummaryReport{
  statistics:IStatisticSummary
}

export interface IStatisticSummary{
  payments:number
  requests: number
  tenders: number
  bidders: number
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

export interface IDoItForMe {
  id: string;
  user: IUser;
  reference: string;
  tender: ITenders;
  comments: string;
  status: string;
  company: ICompany;
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
  user: IUser;
  application: Array<IApplications>;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface IApplications {
  id: string;
  reference: string;
  tender: ITenders;
  comments: string;
  controlNumber: IControlNumber;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}
