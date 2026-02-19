export enum RequirementStage {
    PRELIMINARY = "PRELIMINARY",
    TECHNICAL = "TECHNICAL",
    COMMERCIAL = "COMMERCIAL",
    CONSENT = "CONSENT",
    FINANCIAL = "FINANCIAL",
}

export interface RequirementItem {
    fieldName: string;
    required: boolean;
    percentage: number;
    description?: string;
}

export interface IFiles{
    documentType: string;
    filePath: string;
}

export interface IApplicationInterface {
    createdBy: string;
    updatedBy: string | null;
    createdAt: number;
    updatedAt: number;
    id: string;
    reference: string;
    tenderId: string;
    bidderId: string;
    stage: string;
    files?: IFiles[]| null;
    comment?: string;
    status: string;
    tenderIdTitle: string;
    tenderFilePath: string;
    tenderOpenDate: string;
    tenderCloseDate: string;
    tenderNumber: string;
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    companyWebsite: string;
    companyPrimaryNumber: string;
    reviewStage?: string;
    reviewStatus?: boolean; 
}




export interface IRequirement {
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  tenderId: string;
  stage: "PRELIMINARY" | "TECHNICAL" | "COMMERCIAL" | "FINANCIAL";
  fieldName: string;
  description: string;
  percentage: number;
  required: boolean;
}

export interface ITender {
  selfApply: boolean;
  tenderId: string;
  tenderNumber: string;
  region: string;
  title: string;
  summary: string;
  filePath: string;
  openDate: string;
  closeDate: string;
  tenderType: string;
  tenderGroup: string;
  consultationFee: number;
  applicationFee: number;
  status: string;
  categoryName: string;
  entityName: string;
  entityLogoFilePath: string;
  applicationStatus: string;
  requirements: IRequirement[];
}

export interface IBidder {
  companyName: string;
  companyAddress: string;
  contactPerson: string;
  contactPhoneNumber: string;
  companyPhoneNumber: string;
}

export interface IFile {
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  id: string;
  applicationId: string;
  stage: string;
  documentType: string;
  filePath: string;
}

export interface ITenderApplication {
  reference: string;
  tender: ITender;
  reviewStage: string;
  stage: string;
  bidder: IBidder;
  files: IFile[];
  reviewStatus: boolean;
  status: string;
}