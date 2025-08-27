import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Button from "@/components/button/Button";
import { ITenderDetails } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IconFileText, IconAlertTriangle } from "@tabler/icons-react";
import { reviewApplication, uploadApplicationDocument } from "@/services/tenders";
import Chip from "@/components/chip/Chip";

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

   const stages = ["DETAILS",
    ...(tender.applicationFee === 0 ? ["PAYMENT"] : []),
    "PRELIMINARY", "TECHNICAL", "COMMERCIAL", "CONSENT"
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
    formData.append("documentType", fieldName.toUpperCase());
    formData.append("requirementStage", stage);
    formData.append("file", file);

    try {
      const result = await uploadTenderMutation.mutateAsync(formData);

      if (result?.applicationId) {
        setApplicationId(result.applicationId);
      }

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const uploadTenderMutation = useMutation({
    mutationFn: (data: FormData) => uploadApplicationDocument(data),
  });

  const handleFileUpload = (stage: string, fieldName: string, file: File) => {
    const key = `${stage}-${fieldName}`;
    setUploadedDocs((prev) => ({
      ...prev,
      [key]: file
    }));
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

  const FileUploadField = ({ stage, fieldName, required }: { stage: string; fieldName: string; required?: boolean }) => {
    const fileKey = `${stage}-${fieldName}`;
    const file = uploadedDocs[fileKey];
    const isUploading = uploading[fileKey];
    const previewURL = previewURLs[fileKey];

    return (
      <div className="mb-6 relative">
        <label className="block font-medium mb-2">{fieldName}</label>
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
                <p>PDF preview is not available. <a href={previewURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Click to open</a></p>
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
              if (selectedFile) handleFileUpload(stage, fieldName, selectedFile);
            }}
          />
        </label>

        {file && (
          <button
            type="button"
            className="absolute top-2 right-2 text-xs text-red-600 underline"
            onClick={() => handleRemoveFile(stage, fieldName)}
          >
            Remove
          </button>
        )}

        {required && !file && <p className="text-xs text-red-500 mt-1">This document is required.</p>}
        {isUploading && (
          <div className="text-xs text-blue-500 mt-1 italic flex items-center gap-1">
            <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
            Uploading...
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
          You have already submitted an application for this tender.
        </p>
      </div>
    );
  }

  const renderStepContent = () => {
    const step = stages[currentStep];

    const allRequirements = tender.requirements || [];
    const grouped = stages.reduce((acc, stage) => {
      const docs = allRequirements.filter(r => r.stage === stage);
      if (docs.length > 0) acc[stage] = docs.map(d => d.fieldName);
      return acc;
    }, {} as Record<string, string[]>);

    if (step === "DETAILS") {
      return (
        <div>
          <h3 className="text-lg font-bold py-2">{tender.title}</h3>
          <p><strong>Summary:</strong> {tender.summary}</p>

          <div className="flex items-center py-2">
            <strong className="w-32 text-gray-600">Close Date:</strong>
            <p className="flex-1">{new Date(tender.closeDate).toLocaleString()}</p>
          </div>
          <div className="flex items-center py-2">
            <strong className="w-50 text-gray-600">PE Application Fee:</strong>
            <p className="flex-1">TZS {new Intl.NumberFormat().format(tender.consultationFee)}</p>
          </div>

          <div className="flex items-center py-2">
            <strong className="w-32 text-gray-600">Status:</strong>
            <Chip label={(() => {
              const currentDate = new Date().getTime();
              const closeDate = tender.closeDate;
              const remainingTime = closeDate - currentDate;
              const remainingDays = remainingTime / (1000 * 60 * 60 * 24);
              if (remainingDays < 0) return 'CLOSED';
              if (remainingDays <= 2) return 'CLOSING';
              return tender.status;
            })()} size="sm" theme="success" />
          </div>

          <div className="text-xs text-red-500 mt-4 italic">
            Please prepare all required documents for each stage:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>PAYMENT:</strong> PROOF OF PAYMENT</li>
              {Object.entries(grouped).map(([stage, fields]) => (
                <li key={stage}><strong>{stage}</strong>: {fields.join(", ")}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (step === "PAYMENT") {
      return <FileUploadField stage="PAYMENT" fieldName="PROOF_OF_PAYMENT" required={true} />;
    }

    if (["PRELIMINARY", "TECHNICAL", "COMMERCIAL"].includes(step)) {
      const stageRequirements = tender.requirements.filter((r) => r.stage === step);
      return stageRequirements.length === 0 ? (
        <p>No requirements for this stage.</p>
      ) : (
        <div className="space-y-4">
          {stageRequirements.map((req) => (
            <FileUploadField
              key={`${step}-${req.fieldName}`}
              stage={step}
              fieldName={req.fieldName}
              required={req.required}
            />
          ))}
        </div>
      );
    }

    if (step === "CONSENT") {
      return (
        <div>
          <p className="mb-2">I agree that the documents submitted are true and correct to the best of my knowledge.</p>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mr-2"
            />
            I agree to the terms and conditions
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

    if (["PRELIMINARY", "TECHNICAL", "COMMERCIAL"].includes(step)) {
      const requiredFields = tender.requirements.filter((r) => r.stage === step && r.required);
      return requiredFields.every((r) => {
        const key = `${step}-${r.fieldName}`;
        return uploadedDocs[key] && !uploading[key];
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

  const progressPercentage = ((currentStep + 1) / stages.length) * 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Step {currentStep + 1} of {stages.length}: <strong>{stages[currentStep]}</strong></div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercentage}%`, transition: "width 0.3s ease" }}
          />
        </div>
      </div>

      <div className="mb-6">{renderStepContent()}</div>

      <div className="flex justify-between">
        {currentStep > 0 && (
          <Button label="Back" type="button" onClick={handleBack} />
        )}
        {currentStep < stages.length - 1 ? (
          <Button label="Next" type="button" onClick={handleNext} disabled={!canProceed()} />
        ) : (
          <Button loading={uploadTenderMutation.isPending || isLoading} label="Submit Application" type="submit" />
        )}
      </div>
    </form>
  );
}
