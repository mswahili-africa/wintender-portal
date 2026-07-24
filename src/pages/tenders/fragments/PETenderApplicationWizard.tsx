import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Button from "@/components/button/Button";
import { ITenderDetails } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IconFileText, IconAlertTriangle } from "@tabler/icons-react";
import { reviewApplication, uploadApplicationDocument } from "@/services/tenders";
import Chip from "@/components/chip/Chip";
import { useUserDataContext } from "@/providers/userDataProvider";
import { Trans, useTranslation } from "react-i18next";

interface Props {
  tender: ITenderDetails;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PETenderApplicationWizard({ tender, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [previewURLs, setPreviewURLs] = useState<Record<string, string>>({});
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const { userData } = useUserDataContext();
  const { t } = useTranslation();

  const uploadTenderMutation = useMutation({
    mutationFn: (data: FormData) => uploadApplicationDocument(data),
  });

  const stages = ["DETAILS",
    ...(tender.applicationFee === 0 ? ["PAYMENT"] : []),
    "PRELIMINARY", "TECHNICAL", "COMMERCIAL", "FINANCIAL", "CONSENT"
  ];

  useEffect(() => {
    return () => {
      Object.values(previewURLs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const {
    handleSubmit,
    formState: { errors },

  } = useForm();

  const uploadDocument = async (stage: string, fieldName: string, file: File) => {
    const key = `${stage}-${fieldName}`;
    setUploading((prev) => ({ ...prev, [key]: true }));

    const formData = new FormData();
    formData.append("tenderId", tender.tenderId);
    formData.append("applicationId", tender.applicationId);
    formData.append("documentType", fieldName.toUpperCase());
    formData.append("requirementStage", stage);
    formData.append("file", file);

    try {
      const result = await uploadTenderMutation.mutateAsync(formData);

      if (result?.applicationId) {
        setApplicationId(result.applicationId);
      }

      // mark as uploaded ONLY after success
      setUploadedDocs((prev) => ({
        ...prev,
        [key]: file,
      }));

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };


  const handleFileUpload = (stage: string, fieldName: string, file: File) => {
    const key = `${stage}-${fieldName}`;

    setPreviewURLs((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file)
    }));
    uploadDocument(stage, fieldName, file);
  };

  const handleRemoveFile = (stage: string, fieldName: string) => {
    const key = `${stage}-${fieldName}`;
    setUploadedDocs((prev) => ({ ...prev, [key]: null }));
    setPreviewURLs((prev) => {
      const newPreviews = { ...prev };
      URL.revokeObjectURL(newPreviews[key]);
      delete newPreviews[key];
      return newPreviews;
    });
    setUploading((prev) => ({ ...prev, [key]: false }));
  };

  const getUploadedPercentage = () => {
    // 1. Guard clause for empty requirements
    if (!tender.requirements?.length) return 0;

    let totalPercentage = 0;

    // 2. Loop through each requirement item
    tender.requirements.forEach(requirementItem => {
      if (!requirementItem.requiredDocuments) return;

      // 3. Loop through the documents inside this requirement
      requirementItem.requiredDocuments.forEach(req => {
        const key = `${requirementItem.stage}-${req.documentType}`;
        console.log("percentage key",key)
        const isUploaded = uploadedDocs[key];

        console.log("is key uploaded",isUploaded)
        
        // 4. Add percentage if the document exists in uploadedDocs
        if (isUploaded) {
          totalPercentage += (req.percentage || 0);
          console.log("accumilated percentage",totalPercentage)
        }
      });
    });

    // 5. Cap the final total at 100
    return Math.min(100, totalPercentage);
  };


  const FileUploadField = ({
    stage,
    documentType,
    required,
    description,
    percentage,
  }: {
    stage: string;
    documentType: string;
    required?: boolean;
    description?: string;
    percentage?: number;
  }) => {
    const fileKey = `${stage}-${documentType}`;
    const file = uploadedDocs[fileKey];
    const isUploading = uploading[fileKey];
    const previewURL = previewURLs[fileKey];

    return (
      <div className="mb-6 relative">
        <label className="block font-medium mb-1">{documentType.replace("_", " ")}</label>

        {description && (
          <p className="text-xs text-slate-500 mb-2">
            {description}
            {percentage !== undefined && (
              <span className="ml-2 text-slate-400">({percentage}%)</span>
            )}
          </p>
        )}

        <label
          htmlFor={fileKey}
          className="label block py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-md cursor-pointer transition hover:bg-slate-100"
        >
          <div className="text-slate-500 text-xs text-center font-light">
            {file && file.type === "application/pdf" && previewURL ? (
              <object
                data={previewURL}
                type="application/pdf"
                className="w-full h-64 border rounded"
                aria-label="PDF Preview"
              >
                {/* <p>PDF preview is not available. <a href={previewURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Click to open</a></p> */}
                <p>
                  <Trans i18nKey="application-wizard-pdf-previewNotAvailable">
                    PDF preview is not available..
                    <a
                      href={previewURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Click to open
                    </a>
                  </Trans>

                </p>
              </object>
            ) : (
              <IconFileText size={32} strokeWidth={1.5} className="mx-auto mb-4" />
            )}
          </div>
          <input
            type="file"
            id={fileKey}
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileUpload(stage, documentType, selectedFile);
            }}
          />
        </label>

        {file && (
          <button
            type="button"
            className="absolute top-2 right-2 text-xs text-red-600 underline"
            onClick={() => handleRemoveFile(stage, documentType)}
          >
            {t("application-wizard-remove")}
          </button>
        )}

        {required && !file && <p className="text-xs text-red-500 mt-1">This document is required.</p>}
        {isUploading && (
          <div className="text-xs text-blue-500 mt-1 italic flex items-center gap-1">
            <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
            {t("application-wizard-uploading")}
          </div>
        )}
      </div>
    );
  };

  if (tender.applicationStatus === "SUBMITTED") {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <IconAlertTriangle size={64} className="text-yellow-500 mb-4" />
        <p className="text-lg font-semibold text-yellow-700">
          {t("application-wizard-already-submitted")}
        </p>
      </div>
    );
  }

  const renderStepContent = () => {
    const step = stages[currentStep];

    const allRequirements = tender.requirements || [];
    const grouped = stages.reduce((acc, stage) => {
      const docs = allRequirements.filter(r => r.stage === stage);
      if (docs.length > 0) acc[stage] = docs.map(d => d.requiredDocuments.map(d => d.documentType)).flat();
      return acc;
    }, {} as Record<string, string[]>);

    if (step === "DETAILS") {
      return (
        <div>
          <h3 className="text-lg font-bold py-2">{tender.title}</h3>
          <p><strong>{t("application-wizard-summary")}:</strong> <span dangerouslySetInnerHTML={{ __html: tender.summary }}></span></p>

          <div className="flex items-center py-2">
            <strong className="w-32 text-gray-600">{t("application-wizard-close-date")}:</strong>
            <p className="flex-1">{new Date(tender.closeDate).toLocaleString()}</p>
          </div>
          <div className="flex items-center py-2">
            <strong className="w-50 text-gray-600">{t("application-wizard-consultation-fee")}</strong>
            <p className="flex-1">TZS {new Intl.NumberFormat().format(tender.consultationFee)}</p>
          </div>

          <div className="flex items-center py-2">
            <strong className="w-32 text-gray-600">{t("application-wizard-status")}:</strong>
            <Chip label={(() => {
              const currentDate = new Date().getTime();
              const closeDate = tender?.closeDate;
              const remainingTime = closeDate as number - currentDate;
              const remainingDays = remainingTime / (1000 * 60 * 60 * 24);
              if (remainingDays < 0) return 'CLOSED';
              if (remainingDays <= 2) return 'CLOSING';
              return tender.status;
            })()} size="sm" theme="success" />
          </div>

          <div className="text-xs text-red-500 mt-4 italic">
            {t("application-wizard-instructions")}:

            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>PAYMENT:</strong> PROOF OF PAYMENT</li>
              {Object.entries(grouped).map(([stage, fields]) => (
                <li key={stage}><strong>{stage}</strong>: {fields.map(f => f.replace("_", " ")).join(", ")}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (step === "PAYMENT") {
      return <FileUploadField stage="PAYMENT" documentType="PROOF_OF_PAYMENT" required={true} />;
    }

    if (["PRELIMINARY", "TECHNICAL", "COMMERCIAL", "FINANCIAL"].includes(step)) {
      const stageRequirements = tender.requirements.filter((r) => r.stage === step);

      if (stageRequirements.length === 0) {
        return <p>{t("application-wizard-no-requirements")}</p>;
      }

      return (
        <div className="space-y-4">
          {stageRequirements.map((requirementItem) =>
            requirementItem.requiredDocuments?.map((doc) => (
              <FileUploadField
                key={`${step}-${doc.documentType}`} // Crucial for React lists
                stage={step}
                documentType={doc.documentType}
                required={doc.required}
                description={doc.description}
                percentage={doc.percentage}
              />
            ))
          )}
        </div>
      );
    }


    if (step === "CONSENT") {
      return (
        <div>
          {/* optional files */}
          {/* <p>More Information(optional)</p> */}

          {/* <FileUploadField stage={"Optional"} fieldName={""}      */}
          {/* // stage={step}
          // fieldName={req.fieldName}
          // required={req.required} */}
          {/* /> */}
          <p className="mb-2">{userData?.role === "BIDDER" ? t("tender-wizard-bidder-consent") : t("tender-wizard-pe-consent")}</p>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mr-2"
            />
            {t("tender-wizard-bidder-consent")}
          </label>
        </div>
      );
    }

    return null;
  };

  const canProceed = () => {
    const step = stages[currentStep];

    if (step === "PAYMENT") {
      const key = "PAYMENT-PROOF_OF_PAYMENT";
      return !!uploadedDocs[key] && !uploading[key];
    }

    if (["PRELIMINARY", "TECHNICAL", "COMMERCIAL", "FINANCIAL"].includes(step)) {

      // 1. Filter to requirements matching the current stage
      const stageRequirements = tender.requirements.filter((r) => r.stage === step);

      // 2. Ensure EVERY single required document in this stage is uploaded
      return stageRequirements.every((requirementItem) => {
        if (!requirementItem.requiredDocuments) return true; // Skip if no documents array

        return requirementItem.requiredDocuments.every((doc) => {
          // If the document is not strictly required, skip validation for it
          if (!doc.required) return true;

          // Check if it is uploaded and not currently uploading
          const key = `${step}-${doc.documentType}`;
          return uploadedDocs[key] && !uploading[key];
        });
      });
    }


    if (step === "CONSENT") {
      return consentGiven;
    }

    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < stages.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    if (!consentGiven) {
      setIsLoading(false);
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    const uploadedPercent = getUploadedPercentage();
    if (uploadedPercent < 100) {
      setIsLoading(false);
      toast.error("You cannot submit until all documents are uploaded (100%).");
      return;
    }

    if (!applicationId || applicationId === null) {
      setIsLoading(false);
      toast.error("Application ID not found. Please upload documents first.");
      return;
    }

    try {
      await reviewApplication(applicationId, "SUBMITTED");
      toast.success("Application submitted successfully!");
      setIsLoading(false);
      onClose();
    } catch (error: any) {
      setIsLoading(false);
      const serverMessage = error?.response?.data?.message || "Failed to submit application.";
      toast.error(serverMessage);
    }
  };

  const progressPercentage = getUploadedPercentage();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Step {currentStep + 1} of {stages.length}: <strong>{stages[currentStep]}</strong></div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 p-1 text-center min-w-fit rounded-full"
            style={{ width: `${progressPercentage}%`, transition: "width 0.3s ease" }}
          >
            {progressPercentage.toFixed(0)}%
          </div>
        </div>

      </div>

      <div className="mb-6">{renderStepContent()}</div>

      <div className="flex justify-between">
        {currentStep > 0 && (
          <Button theme="warning" size="sm" label="Back" type="button" onClick={handleBack} />
        )}
        {currentStep < stages.length - 1 ? (
          <Button theme="success" size="sm" label="Next" type="button" onClick={handleNext} disabled={!canProceed()} />
        ) : (
          <Button theme="primary" size="sm" loading={uploadTenderMutation.isPending || isLoading} label="Submit" type="submit" />
        )}
      </div>
    </form>
  );
}
