import Button from "@/components/button/Button";
import Modal from "@/components/Modal";
import { reviewApplication } from "@/services/tenders";
import { IRequirement } from "@/types";
import { ITenderApplication } from "@/types/tenderWizard";
import {
  IconArrowUp,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

/* ----------------------------- TYPES ----------------------------- */
interface ModalProps {
  application: ITenderApplication;
  documentScore: { type: string, score: number, maxScore: number }[]
  open: boolean;
  decision?: { id: string; status: "ACCEPTED" | "REJECTED"; comment?: string; marks?: number } | null;
  setDecision: (decision: { id: string; status: "ACCEPTED" | "REJECTED"; comment?: string; marks?: number }) => void;
  onClose: () => void;
  refetch?: () => void;
}


/* ----------------------------- COMPONENT ----------------------------- */
export default function ApplicationConfirmationModal({
  application,
  open,
  documentScore,
  onClose,
  decision,
  setDecision,
  refetch
}: ModalProps) {


  /* ----------------------------- MUTATION ----------------------------- */
  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      status,
      comment,
      marks
    }: {
      id: string;
      status: string;
      comment?: string;
      marks?: number
    }) => reviewApplication(id, status, comment, marks),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Application reviewed");
      onClose();
      refetch && refetch();
      onClose();
    },
    onError: () => toast.error("Failed to review application"),
  });

  const submitApplicationReview = () => {
    decision &&
      reviewMutation.mutate({
        id: decision.id,
        status: decision.status,
        comment: decision.comment,
        marks: documentScore.reduce((acc, file) => acc + file.score, 0),
      });
  }

  // total stage marks and total score from review
  const totalStageMarks = application.tender.requirements.filter((r) => r.stage === application.reviewStage).filter((r) => r.required === true).reduce((acc, file) => acc + file.percentage, 0);
  const totalReviewScore = documentScore.reduce((acc, file) => acc + file.score, 0);

  // check if there is requirement item not present in documentScore type
  const requiredItems = application.tender.requirements
    .filter((r) => r.stage === application.reviewStage && r.required);

    console.log(requiredItems);

  const areAllRequiredReviewed = requiredItems.every((r) =>
    documentScore.some((file) => file.type === r.fieldName)
  );


  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      closeIcon
      size="lg"
      zIndex={50}
    >
      <div className="p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Finalize Application Review for stage: <span className="text-blue-500">{application?.reviewStage} </span>
            </h2>
            <p className="text-sm text-slate-500">
              Confirm the evaluation decision for this application stage
            </p>
          </div>

          <div
            className={`px-3 py-1 text-xs rounded-full font-medium
        ${decision?.status === "ACCEPTED"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"}`}
          >
            {decision?.status}
          </div>
        </div>

        {/* APPLICANT SUMMARY */}
        <div className="bg-slate-50 border rounded-lg p-4 mb-5">

          <p className="text-xs text-slate-500 mb-3">Applicant Information</p>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-slate-500 text-xs">Company</p>
              <p className="font-medium">{application?.bidder.companyName}</p>
            </div>

            <div>
              <p className="text-slate-500 text-xs">Applicant</p>
              <p className="font-medium">{application?.tender.title}</p>
            </div>

            <div>
              <p className="text-slate-500 text-xs">Bid Amount</p>
              <p className="font-medium">
                {"100,000,000"}
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-xs">Submission Date</p>
              <p className="font-medium">
                {new Date(application?.files[0]?.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>
        </div>

        {/* EVALUATION SUMMARY */}
        <div className="border rounded-lg p-4 mb-5">

          <p className="text-xs text-slate-500 mb-3">Evaluation Summary</p>

          <div className="grid grid-cols-3 gap-4 text-center">

            <div>
              <p className="text-xs text-slate-500">Score</p>
              <p className="text-xl font-semibold text-green-600">
                {totalReviewScore ?? 0}%
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Maximum</p>
              <p className="text-lg font-medium">
                {totalStageMarks}%
              </p>
            </div>

            <div className="flex items-center flex-col">
              <p className="text-xs text-slate-500">Threshold</p>
              <p className="text-lg text-green-600 font-medium flex items-center">{(totalStageMarks * 0.7).toFixed()}% <IconArrowUp className="font-extralight" size={17} /></p>
            </div>

          </div>

          {/* SCORE BAR */}
          <div className="mt-4 h-2 bg-slate-200 rounded-full">
            <div
              className={`h-2 rounded-full ${decision?.status === "ACCEPTED"
                ? "bg-green-500"
                : "bg-red-500"
                }`}
              style={{ width: `${totalReviewScore}%` }}
            />
          </div>

          {/* PASS FAIL MESSAGE */}
          <div className="mt-3 text-sm">

            {decision?.status === "ACCEPTED" ? (
              <span className="text-green-600 font-medium">
                ✔ Applicant meets the stage requirements
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                ✖ Applicant did not meet the evaluation criteria
              </span>
            )}

          </div>

        </div>

        {/* SCORE BREAKDOWN (Optional if you have criteria) */}
        <div className="border rounded-lg p-4 mb-5">

          <p className="text-xs text-slate-500 mb-3">
            Criteria Evaluation
          </p>

          <div className="space-y-2">

            {documentScore.map((item: { type: string; score: number; maxScore: number; }) => (
              <div
                key={item.type}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.type}</span>

                <span className="font-medium">
                  {item.score} / {item.maxScore}
                </span>
              </div>
            ))}

          </div>

        </div>
        {/* )} */}

        {/* REJECTION COMMENT */}
        {decision?.status === "REJECTED" && (
          <div className="mb-5">

            <label className="label mb-2">
              Rejection Comment
            </label>

            <textarea
              className="w-full p-3 border rounded-lg input-danger"
              rows={4}
              placeholder="Provide the reason for rejecting this application..."
              onChange={(e) =>
                setDecision({ ...decision, comment: e.target.value })
              }
            />

            <p className="text-xs text-slate-500 mt-1">
              This comment will be recorded in the audit trail.
            </p>

          </div>
        )}

        {/* WARNING */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700 mb-6">
          Once confirmed, this evaluation decision will be recorded and cannot be changed without administrative approval.
        </div>

        {/* ACTIONS */}
        {
          areAllRequiredReviewed && (
            <div className="flex justify-end gap-3">
              <Button
                label="Cancel"
                theme="secondary"
                onClick={() => onClose()}
              />
              <Button
                label="Confirm Decision"
                theme={decision?.status === "ACCEPTED" ? "primary" : "danger"}
                loading={reviewMutation.isPending}
                onClick={submitApplicationReview}
              />
            </div>
          )
        }

      </div>
    </Modal>
  );
}
