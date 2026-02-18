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