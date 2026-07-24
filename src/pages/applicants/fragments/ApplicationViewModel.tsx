import Button from "@/components/button/Button";
import useTenderApplicationDetails from "@/hooks/useTenderApplicationDetails";
import { useUserDataContext } from "@/providers/userDataProvider";
import { ITenderApplication, IFile, IStageMarks } from "@/types/tenderWizard";
import {
  IconArrowRight,
  IconEye,
  IconFile,
  IconFileDownload,
  IconFileText,
  IconHeartHandshake,
  IconRecycle,
  IconSparkles,
  IconTrash,
  IconTrophy,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import ApplicationConfirmationModal from "./ApplicationConfirmationModal";
import documentsList from "@/pages/complience/data/documents.json";
import { IconCheck } from "@tabler/icons-react";
import MediaDropzone from "@/components/inputs/MediaDropzone";
import toast from "react-hot-toast";
import { uploadApplicationDocument } from "@/services/tenders";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/spinners/Loader";

/* ----------------------------- TYPES ----------------------------- */
interface ModalProps {
  applicant: { id: string };
  title?: string;
  onClose: () => void;
  refetch?: () => void;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex space-x-2 justify-between text-sm">
    <span className="text-slate-500 win-w- sm:min-w-">{label}:</span>
    <span className="font-medium text-slate-800">
      {value ?? "-"}
    </span>
  </div>
);

/* ----------------------------- COMPONENT ----------------------------- */
export default function ApplicationViewModal({
  applicant,
  title,
  onClose,
  refetch
}: ModalProps) {
  const { userData } = useUserDataContext();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [decision, setDecision] = useState<{
    id: string;
    status: "ACCEPTED" | "REJECTED";
    comment?: string;
    marks?: number;
  } | null>(null);

  const [documentScore, setDocumentScore] = useState<{ type: string, score: number, maxScore: number }[]>([]);

  const [negotiationFile, setNegotiationFile] = useState<File | null>(null)
  const [awardFile, setAwardFile] = useState<File | null>(null)

  const handleNegotiationUpload = (file: File) => {
    file && setNegotiationFile(file)

    uploadDocument("NEGOTIATION", file!)

  }

  const handleAwardUpload = (file: File) => {
    if (file) setAwardFile(file)

    uploadDocument("AWARD", file!)
  }

  /* ----------------------------- DATA FETCH ----------------------------- */
  const {
    applicationDetails,
    isLoading,
    refetch: refetchApplicationDetails,
    isError,
  } = useTenderApplicationDetails({ id: applicant?.id });


  // Negotiation and awarded files upload

  const uploadConfirmationDocumentMutation = useMutation({
    mutationFn: (data: FormData) => uploadApplicationDocument(data),
    onSuccess: () => {
      toast.success("File uploaded successfully");
      refetchApplicationDetails();
    },
    onError: (error) => {
      console.error("Upload failed", error);
      toast.error("Failed to upload file");
    },
  });
  const uploadDocument = async (stage: string, file: File, documentType?: string) => {

    const formData = new FormData();
    formData.append("tenderId", applicationDetails?.tender?.tenderId!);
    formData.append("applicationId", applicant.id);
    formData.append("documentType", documentType || "ANY_RELEVANT_DOCUMENTS");
    formData.append("requirementStage", stage);
    formData.append("file", file);

    uploadConfirmationDocumentMutation.mutate(formData);
  };


  /* ----------------------------- SAFETY ----------------------------- */
  if (isLoading) return <SkeletonLoader />;

  if (isError || !applicationDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white px-6 rounded-lg text-red-500 w-full max-w-6xl h-[65vh]">
          {/* HEADER */}
          <div className=" bg-white flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {title || "Application Review"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <IconX />
            </button>
          </div>
          <div className="flex flex-col items-center text-xl gap-y-5 mt-28 justify-center">
            Failed to load application
            <Button
              type="button"
              label="Retry"
              icon={<IconRecycle />}
              size="sm"
              theme="primary"
              onClick={() => refetchApplicationDetails()}
            />
          </div>
        </div>
      </div>
    );
  }

  const application = applicationDetails as ITenderApplication;



  const openConfirm = (status: "ACCEPTED" | "REJECTED") => {
    setDecision({ id: applicant.id, status });
    setConfirmOpen(true);
  };

  // function to check if requied from requirements and return true or false and total marks
  const checkRequiredAndTotalMarks = (documentType: string) => {
    // const requirement = application.tender.requirements.find((req) => req.fieldName === fieldName);
    const requirement = application.tender.requirements.map((item => item.requiredDocuments)).flat().find((req) => req.documentType === documentType);
    return requirement ? { required: requirement.required, totalMarks: requirement.percentage } : { required: false, totalMarks: 0 };
  }

  //stage marks
  const stageMark: IStageMarks | undefined = application?.stageMarks?.find(stg => stg.stage === application.reviewStage);


  const overallMarksToCurrentStage = documentScore.reduce((acc, file) => acc + file.score, 0) + application.totalMarks;



  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-xl flex flex-col">

        {/* HEADER */}
        <div className=" bg-white flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {title || "Application Review"}
            </h2>
            <p className="text-xs text-slate-500">
              Ref: {application.reference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <IconX />
          </button>
        </div>

        {/* STATUS + MARKS + ACTIONS */}
        <div className="px-6 py-1 border-b bg-slate-50 flex items-center justify-between">

          {/* STATUS */}
          <div className="flex items-center gap-4">

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
      ${application.status === "AWARDED"
                  ? "bg-green-100 text-green-700"
                  : application.status === "CLOSED"
                    ? "bg-orange-100 text-orange-700"
                    : application.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                }`}
            >
              {application.status}
            </span>

            {/* BIDDER MESSAGE */}
            {userData?.role === "BIDDER" && (
              <p className={`text-xs font-medium
        ${application.status === "AWARDED"
                  ? "text-green-600"
                  : application.status === "REJECTED"
                    ? "text-red-500"
                    : "text-slate-500"}
      `}>

                {application.status === "AWARDED" &&
                  "Congratulations! Your bid has been awarded."}

                {application.status === "REJECTED" &&
                  "Thank you for participating in this tender."}

              </p>
            )}

          </div>


          {/* SCORE SUMMARY */}
          {(
            userData?.role !== "BIDDER") && (

              <div className="flex items-center gap-4 bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm">

                {/* Circular Score */}
                <div className="relative flex items-center justify-center">

                  <svg className="w-12 h-12 -rotate-90">

                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-slate-100"
                    />

                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={125.6}
                      strokeDashoffset={
                        125.6 - (125.6 * (overallMarksToCurrentStage || 0)) / 100
                      }
                      className={`transition-all duration-700 ${(overallMarksToCurrentStage || 0) >= (stageMark?.passMark ?? 0)
                        ? "text-emerald-500"
                        : "text-amber-500"
                        }`}
                    />

                  </svg>

                  <span className="absolute text-xs font-bold text-slate-700">
                    {overallMarksToCurrentStage || 0}%
                  </span>

                </div>


                {/* Score Details */}
                <div className="flex flex-col">

                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Evaluation Score
                  </span>

                  <div className="flex items-center gap-2">

                    <span className="text-lg font-bold text-slate-800">
                      {overallMarksToCurrentStage || 0}
                    </span>

                    <span className="text-xs text-slate-500">
                      / 100
                    </span>

                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${(overallMarksToCurrentStage || 0) >= (stageMark?.passMark ?? 0)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      Pass Mark {stageMark?.passMark ?? 0}%
                    </span>

                  </div>

                </div>

              </div>
            )}


          {/* ACTIONS */}
          {["PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(
            userData?.role || ""
          ) &&
            application.status === "SUBMITTED" && (

              <div className="flex gap-2">

                {
                  overallMarksToCurrentStage >= (stageMark?.passMark ?? 0) &&
                  <Button
                    icon={<IconCheck />}
                    label={
                      userData?.role === "PROCUREMENT_ENTITY_REVIEWER"
                        ? "ACCEPT"
                        : "CONFIRM"
                    }
                    size="sm"
                    theme="primary"
                    onClick={() => openConfirm("ACCEPTED")}
                  />
                }
                <Button
                  icon={<IconX />}
                  label="REJECT"
                  size="sm"
                  theme="danger"
                  onClick={() => openConfirm("REJECTED")}
                />

              </div>

            )}

        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BIDDER */}
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">
              Bidder Information
            </h3>
            <InfoRow label="Company" value={application.bidder.companyName} />
            <InfoRow label="Address" value={application.bidder.companyAddress} />
            <InfoRow label="Contact Person" value={application.bidder.contactPerson} />
            <InfoRow label="Phone" value={application.bidder.contactPhoneNumber} />
          </div>

          {/* TENDER */}
          <div className="border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">
              Tender Information
            </h3>
            <InfoRow label="Title" value={application.tender.title} />
            <InfoRow label="Tender No." value={application.tender.tenderNumber} />
            <InfoRow
              label="Closing Date"
              value={new Date(application.tender.closeDate).toLocaleString()}
            />

            <a
              href={application.tender.filePath}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mt-2"
            >
              <IconFileDownload size={18} />
              View Tender Document
            </a>
          </div>

          {
            ["PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userData?.role || "") &&
            <div className="flex w-full col-span-full sm:px-10 gap-4">

              {/* NEGOTIATION DOCUMENT */}
              {
                application.reviewStage === "NEGOTIATION" &&
                <div className="w-full border rounded-xl p-4 bg-white">

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-sm">Negotiation Document</p>
                      <p className="text-xs text-slate-500">
                        Uploaded during negotiation stage
                      </p>
                    </div>

                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Negotiation
                    </span>
                  </div>

                  {!negotiationFile ? (
                    <MediaDropzone
                      mediaType={"DOCUMENT"}
                      onFileSelect={(file: File | null, previewUrl: string) => {
                        handleNegotiationUpload(file!);
                      }}
                      selectedFile={negotiationFile}
                    />
                  ) : (
                    <div className="flex items-center justify-between border rounded-lg p-3 bg-slate-50">
                      <div className="flex items-center gap-2 text-sm">
                        <IconFile size={18} />
                        <div className="flex flex-col">
                          {negotiationFile.name}
                          {
                            uploadConfirmationDocumentMutation.isPending &&
                            <div className="text-xs text-blue-500 mt-1 italic flex items-center gap-1">
                              <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                              Uploading...
                            </div>
                          }
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(URL.createObjectURL(negotiationFile))}
                          theme="info"
                          variant="pastel"
                          icon={<IconEye size={20} />}
                        />
                        <Button
                          size="sm"
                          onClick={() => setNegotiationFile(null)}
                          theme="danger"
                          variant="pastel"
                          // label="Remove"
                          icon={<IconTrash size={20} />}
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-2 mt-4 w-full flex justify-center">
                    {
                      awardFile &&
                      <Button
                        size="sm"
                        // onClick={() => setAwardFile(null)}
                        theme="success"
                        variant="filled"
                        label="UPLOAD"
                        icon={<IconUpload size={20} />}
                      />
                    }
                  </div>
                </div>
              }

              {/* AWARD DOCUMENT */}
              {
                application.reviewStage === "AWARDED" &&
                <div className="w-full border rounded-xl p-4 bg-white">

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-sm">Award Document</p>
                      <p className="text-xs text-slate-500">
                        Final award document for bidder
                      </p>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Award
                    </span>
                  </div>

                  {!awardFile ? (
                    <MediaDropzone
                      mediaType={"DOCUMENT"}
                      onFileSelect={(file: File | null, previewUrl: string) => {
                        handleNegotiationUpload(file!);
                      }}
                      selectedFile={awardFile}
                    />
                  ) : (
                    <div className="flex items-center justify-between border rounded-lg p-3 bg-slate-50">
                      <div className="flex items-center gap-2 text-sm">
                        <IconFile size={18} />
                        {awardFile.name}
                        {
                          uploadConfirmationDocumentMutation.isPending &&
                          <div className="text-xs text-blue-500 mt-1 italic flex items-center gap-1">
                            <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                            Uploading...
                          </div>
                        }
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(URL.createObjectURL(awardFile))}
                          theme="info"
                          variant="pastel"
                          icon={<IconEye size={20} />}
                        />
                        <Button
                          size="sm"
                          onClick={() => setAwardFile(null)}
                          theme="danger"
                          variant="pastel"
                          // label="Remove"
                          icon={<IconTrash size={20} />}
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-2 mt-4 w-full flex justify-center">
                    {
                      awardFile &&
                      <Button
                        size="sm"
                        // onClick={() => setAwardFile(null)}
                        theme="success"
                        variant="filled"
                        label="UPLOAD"
                        icon={<IconUpload size={20} />}
                      />
                    }
                  </div>
                </div>
              }

            </div>
          }


          {/* BIDDER PREVIEW */}
          {/* <div className="mt-6 border rounded-xl p-4 bg-slate-50">

            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-sm">
                Bidder Document View
              </p>

              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Bidder Visible
              </span>
            </div>

            <div className="space-y-2">

              {negotiationFile && (
                <div className="flex items-center justify-between text-sm border p-2 rounded">
                  <span>Negotiation Document</span>

                  <button
                    onClick={() => window.open(URL.createObjectURL(negotiationFile))}
                    className="text-blue-600"
                  >
                    View
                  </button>
                </div>
              )}

              {awardFile && (
                <div className="flex items-center justify-between text-sm border p-2 rounded">
                  <span>Award Letter</span>

                  <button
                    onClick={() => window.open(URL.createObjectURL(awardFile))}
                    className="text-blue-600"
                  >
                    View
                  </button>
                </div>
              )}

              {!negotiationFile && !awardFile && (
                <p className="text-xs text-slate-500">
                  No documents available yet.
                </p>
              )}

            </div>

          </div> */}


          {/* NEGOTIATION && AWARDED DOCUMENTS */}
          {(application.reviewStage === "NEGOTIATION" || application.reviewStage === "AWARDED") && userData?.role === "BIDDER" && (
            <div className="md:col-span-2 my-4">

              {/* Main Container */}
              <div className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm ${application.reviewStage === "AWARDED"
                  ? "bg-emerald-50/40 border-emerald-300/80"
                  : "bg-blue-50/40 border-blue-200/80"
                }`}>

                {/* 1. Header Banner & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${application.reviewStage === "AWARDED"
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 text-white"
                      }`}>
                      {application.reviewStage === "AWARDED" ? (
                        <IconTrophy size={24} />
                      ) : (
                        <IconHeartHandshake size={24} />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${application.reviewStage === "AWARDED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                          }`}>
                          {application.reviewStage === "AWARDED" ? "Tender Awarded" : "In Negotiation"}
                        </span>
                        {application.reviewStage === "AWARDED" && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <IconSparkles size={14} /> Official
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {application.reviewStage === "AWARDED"
                          ? "Congratulations! Your Bid Has Been Awarded"
                          : "Your Application Has Reached Negotiation"}
                      </h3>
                    </div>
                  </div>

                  {/* Milestone Indicator */}
                  <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-700">Notice Ready</span>
                  </div>
                </div>

                {/* 2. File & Score Cards */}
                <div className="mt-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Official Documents 
                  </h4>

                  {application.files.length > 0 ? (
                    application.files
                      .filter((file) => ["NEGOTIATION", "AWARDED"].includes(file.stage) && file.stage)
                      .map((file: IFile) => (
                        <div
                          key={file.stage}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all"
                        >
                          {/* File Details */}
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                              <IconFileText size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">
                                  {file.stage} Notice Document
                                </p>
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                  <IconCheck size={12} /> Verified
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Issued for stage: <span className="font-semibold text-slate-700">{file.stage}</span>
                              </p>
                            </div>
                          </div>

                          {/* Score & Action Button */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {/* Evaluation Score Badge */}
                            {file.documents.map((doc, idx) => {
                              const { required, totalMarks } = checkRequiredAndTotalMarks(doc.documentType);
                              return (
                                required && (
                                  <div key={idx} className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Score</span>
                                    <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                                      {totalMarks}%
                                    </span>
                                  </div>
                                )
                              );
                            })}

                            {/* Primary Action Button */}
                            {file.documents[0]?.filePath ? (
                              <a
                                href={file.documents[0].filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow-sm"
                              >
                                <IconFileDownload size={16} />
                                <span>Download Document</span>
                              </a>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                                Pending Download
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    /* Simplified Clear Empty State */
                    <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                      <span>Official documentation is currently being prepared for this stage.</span>
                      <IconArrowRight size={16} className="text-slate-400" />
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}


          {/* DOCUMENTS */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              {application.reviewStage} Documents ({application.files.length})
            </h3>


            <div className="space-y-4">
              {
                application.files.length > 0 ?
                  application.files.map((requirement) => (
                    requirement.documents.length > 0 &&
                    requirement.documents.map((document) => (
                      <details
                        key={document.documentType}
                        className="border rounded-lg overflow-hidden"
                      >
                        <summary className="cursor-pointer flex justify-between px-4 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-medium">
                          <div>
                            {documentsList.find((doc) => doc.value === document.documentType)?.label || document.documentType} ({requirement.stage})
                          </div>

                          {["PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userData?.role || "") &&
                            (() => {
                              const { required, totalMarks } = checkRequiredAndTotalMarks(document.documentType);
                              return (
                                (required || totalMarks > 0) && userData?.role === "PROCUREMENT_ENTITY_REVIEWER" ? (
                                  <div className="flex flex-row items-center gap-x-1">
                                    {
                                      required &&
                                      <div className="text-green-500 text-xs">REQUIRED</div>
                                    }
                                    {
                                      totalMarks > 0 &&
                                      <>
                                        <div className="text-slate-500 text-xs">{totalMarks}%</div>
                                        <input
                                          type="number"
                                          min={0}
                                          max={totalMarks}
                                          onChange={(e) => {
                                            const providedValue = Number(e.target.value);

                                            // Clamp between 0 and totalMarks
                                            const maxMarks = totalMarks;
                                            const value = Math.max(0, Math.min(providedValue, maxMarks));

                                            // setDecision({ ...decision, marks: value });
                                            setDocumentScore((prevScores) => {
                                              const existingIndex = prevScores.findIndex(
                                                (doc) => doc.type === document.documentType
                                              );

                                              if (existingIndex !== -1) {
                                                const updatedScores = [...prevScores];
                                                updatedScores[existingIndex] = {
                                                  type: document.documentType,
                                                  score: value,
                                                  maxScore: maxMarks,
                                                };
                                                return updatedScores;
                                              } else {
                                                // Add new entry
                                                return [
                                                  ...prevScores,
                                                  { type: document.documentType, score: value, maxScore: maxMarks },
                                                ];
                                              }
                                            });

                                          }}
                                          onInput={(e) => {
                                            // Prevent typing beyond top max or below 0
                                            const input = e.target as HTMLInputElement;
                                            const maxMarks = totalMarks;

                                            if (Number(input.value) > maxMarks) {
                                              input.value = String(maxMarks);
                                            }

                                            if (Number(input.value) < 0) {
                                              input.value = "0";
                                            }
                                          }}
                                          className="input-normal h-8 w-full"
                                        />
                                      </>
                                    }
                                  </div>
                                )
                                  : userData?.role === "PROCUREMENT_ENTITY_CHAIRMAN" &&
                                  (
                                    <div className="text-green-500 text-xs">REVIEWED</div>
                                  )
                              )
                            })()
                          }

                        </summary>

                        {document.filePath ? (
                          <iframe
                            src={document.filePath}
                            className="w-full h-[500px]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="p-6 text-sm text-slate-500 text-center">
                            Document not available
                          </div>
                        )}
                      </details>
                    ))
                  ))
                  : (
                    <div className="p-6 text-xs text-slate-500 text-center">
                      No documents submitted
                    </div>
                  )
              }
            </div>
          </div>

        </div>

      </div>

      {/* CONFIRM MODAL */}
      <ApplicationConfirmationModal
        open={confirmOpen}
        onSuccess={
          () => {
            setConfirmOpen(false)
            onClose()
          }
        }
        onClose={() => setConfirmOpen(false)}
        refetch={refetch}
        documentScore={documentScore}
        application={application}
        decision={decision}
        setDecision={setDecision}
      />
    </div>
  );
}

const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-slate-200 rounded ${className}`}
  />
);

const InfoSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

const SkeletonLoader = () => (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-6xl h-[75vh] overflow-hidden shadow-xl flex flex-col">

      {/* Sticky Header Skeleton */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 space-y-4">
          <Skeleton className="h-4 w-40" />
          <InfoSkeleton />
          <InfoSkeleton />
          <InfoSkeleton />
        </div>

        <div className="border rounded-xl p-4 space-y-4">
          <Skeleton className="h-4 w-40" />
          <InfoSkeleton />
          <InfoSkeleton />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="md:col-span-2 border rounded-xl p-4 space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  </div>
);
