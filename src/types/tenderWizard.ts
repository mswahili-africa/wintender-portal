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