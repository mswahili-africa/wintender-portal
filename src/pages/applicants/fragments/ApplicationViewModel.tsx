import Button from "@/components/button/Button";
import useTenderApplicationDetails from "@/hooks/useTenderApplicationDetails";
import { useUserDataContext } from "@/providers/userDataProvider";
import { ITenderApplication, IFile, IStageMarks } from "@/types/tenderWizard";
import {
  IconEye,
  IconFile,
  IconFileDownload,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import ApplicationConfirmationModal from "./ApplicationConfirmationModal";

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

  const negotiationRef = useRef<HTMLInputElement>(null)
  const awardRef = useRef<HTMLInputElement>(null)

  const handleNegotiationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setNegotiationFile(file)
  }

  const handleAwardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAwardFile(file)
  }

  /* ----------------------------- DATA FETCH ----------------------------- */
  const {
    applicationDetails,
    isLoading,
    isError,
  } = useTenderApplicationDetails({ id: applicant?.id });

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
          <div className="flex items-center text-xl mt-28 justify-center">
            Failed to load application
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
  const checkRequiredAndTotalMarks = (fieldName: string) => {
    const requirement = application.tender.requirements.find((req) => req.fieldName === fieldName);
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
                  overallMarksToCurrentStage  >= (stageMark?.passMark ?? 0) &&
                  <Button
                    label={
                      userData?.role === "PROCUREMENT_ENTITY_REVIEWER"
                        ? "Accept"
                        : "Confirm"
                    }
                    size="sm"
                    theme="primary"
                    onClick={() => openConfirm("ACCEPTED")}
                  />
                }
                <Button
                  label="Reject"
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

                  <input
                    type="file"
                    accept="application/pdf"
                    ref={negotiationRef}
                    onChange={handleNegotiationUpload}
                    className="hidden"
                  />

                  {!negotiationFile ? (
                    <button
                      onClick={() => negotiationRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-300 rounded-lg py-6 flex flex-col items-center gap-2 hover:bg-slate-50"
                    >
                      <IconUpload size={20} />
                      <span className="text-sm">Upload negotiation document</span>
                      <span className="text-xs text-slate-400">PDF only</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between border rounded-lg p-3 bg-slate-50">
                      <div className="flex items-center gap-2 text-sm">
                        <IconFile size={18} />
                        {negotiationFile.name}
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

                  <input
                    type="file"
                    accept="application/pdf"
                    ref={awardRef}
                    onChange={handleAwardUpload}
                    className="hidden"
                  />

                  {!awardFile ? (
                    <button
                      onClick={() => awardRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-300 rounded-lg py-6 flex flex-col items-center gap-2 hover:bg-slate-50"
                    >
                      <IconUpload size={20} />
                      <span className="text-sm">Upload award document</span>
                      <span className="text-xs text-slate-400">PDF only</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between border rounded-lg p-3 bg-slate-50">
                      <div className="flex items-center gap-2 text-sm">
                        <IconFile size={18} />
                        {awardFile.name}
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
          {
            (application.reviewStage === "NEGOTIATION" || application.reviewStage === "AWARDED") &&
            <div className="md:col-span-2 my-3">
              <h3 className={`text-sm ${application.reviewStage === "AWARDED" ? "text-green-700" : "text-blue-700"} font-semibold underline mb-3`}>
                {application.reviewStage} NOTICE
              </h3>

              <div className="space-y-4">
                {application.files.length < 0 ? (
                  application.files.map((file: IFile) => (
                    <details
                      key={file.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <summary className="cursor-pointer flex justify-between px-4 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-medium">
                        <div>
                          {file.documentType} ({file.stage})
                        </div>

                        {
                          (() => {
                            const { required, totalMarks } = checkRequiredAndTotalMarks(file.documentType);
                            return (
                              required &&
                              <div className="flex flex-row items-center gap-x-1">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {totalMarks}%
                                </span>
                              </div>
                            )
                          })()}

                      </summary>
                    </details>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center">
                    No document available yet.
                  </p>
                )}
              </div>
            </div>
          }


          {/* DOCUMENTS */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              {application.reviewStage} Documents ({application.files.length})
            </h3>


            <div className="space-y-4">
              {application.files.length > 0 ? (
                application.files.map((file: IFile) => (
                  <details
                    key={file.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <summary className="cursor-pointer flex justify-between px-4 py-2 bg-slate-50 hover:bg-slate-100 text-sm font-medium">
                      <div>
                        {file.documentType} ({file.stage})
                      </div>

                      {["PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRMAN"].includes(userData?.role || "") &&
                        (() => {
                          const { required, totalMarks } = checkRequiredAndTotalMarks(file.documentType);
                          return (
                            required &&  userData?.role === "PROCUREMENT_ENTITY_REVIEWER" ?(
                              <div className="flex flex-row items-center gap-x-1">
                                <div className="text-green-500 text-xs">REQUIRED</div>
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
                                        (doc) => doc.type === file.documentType
                                      );

                                      if (existingIndex !== -1) {
                                        const updatedScores = [...prevScores];
                                        updatedScores[existingIndex] = {
                                          type: file.documentType,
                                          score: value,
                                          maxScore: maxMarks,
                                        };
                                        return updatedScores;
                                      } else {
                                        // Add new entry
                                        return [
                                          ...prevScores,
                                          { type: file.documentType, score: value, maxScore: maxMarks },
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

                    {file.filePath ? (
                      <iframe
                        src={file.filePath}
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
              ) : (
                <div className="p-6 text-xs text-slate-500 text-center">
                  No documents submitted
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRM MODAL */}
      <ApplicationConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
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
