import Button from "@/components/button/Button";
import Modal from "@/components/Modal";
import useTenderApplicationDetails from "@/hooks/useTenderApplicationDetails";
import { useUserDataContext } from "@/providers/userDataProvider";
import { reviewApplication } from "@/services/tenders";
import { ITenderApplication, IFile } from "@/types/tenderWizard";
import {
  IconAlertTriangle,
  IconFileDownload,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

/* ----------------------------- TYPES ----------------------------- */
interface ModalProps {
  applicant: { id: string };
  title?: string;
  onClose: () => void;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800">
      {value ?? "-"}
    </span>
  </div>
);

/* ----------------------------- COMPONENT ----------------------------- */
export default function ApplicantViewModal({
  applicant,
  title,
  onClose,
}: ModalProps) {
  const { userData } = useUserDataContext();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [decision, setDecision] = useState<{
    id: string;
    status: "ACCEPTED" | "REJECTED";
    comment?: string;
  } | null>(null);

  /* ----------------------------- DATA FETCH ----------------------------- */
  const {
    applicationDetails,
    isLoading,
    isError,
  } = useTenderApplicationDetails({ id: applicant.id });

  /* ----------------------------- MUTATION ----------------------------- */
  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: string;
      comment?: string;
    }) => reviewApplication(id, status, comment),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Application reviewed");
      setConfirmOpen(false);
      onClose();
    },
    onError: () => toast.error("Failed to review application"),
  });

  const openConfirm = (status: "ACCEPTED" | "REJECTED") => {
    setDecision({ id: applicant.id, status });
    setConfirmOpen(true);
  };

  /* ----------------------------- SAFETY ----------------------------- */
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded-lg">
          Loading application…
        </div>
      </div>
    );
  }

  if (isError || !applicationDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded-lg text-red-500">
          Failed to load application
        </div>
      </div>
    );
  }

  const application = applicationDetails as ITenderApplication;

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
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

        {/* STATUS + ACTIONS */}
        <div className="px-6 py-3 border-b bg-slate-50 flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
              ${application.status === "ACCEPTED"
                ? "bg-green-100 text-green-700"
                : application.status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
              }`}
          >
            {application.status}
          </span>

          {["PROCUREMENT_ENTITY_REVIEWER", "PROCUREMENT_ENTITY_CHAIRPERSON"].includes(
            userData?.role || ""
          ) &&
            application.status === "SUBMITTED" && (
              <div className="flex gap-2">
                <Button
                  label="Accept"
                  size="sm"
                  theme="primary"
                  onClick={() => openConfirm("ACCEPTED")}
                />
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
                    <summary className="cursor-pointer px-4 py-2 bg-slate-50 text-sm font-medium">
                      {file.documentType} ({file.stage})
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
                <div className="p-6 text-sm text-slate-500 text-center">
                  No documents submitted
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="sm"
        zIndex={50}
      >
        <div className="p-6 text-center">
          <IconAlertTriangle
            size={42}
            className={`mx-auto mb-3 ${
              decision?.status === "ACCEPTED"
                ? "text-green-500"
                : "text-red-500"
            }`}
          />
          <h3 className="text-lg font-semibold">
            Confirm {decision?.status}
          </h3>

          {decision?.status === "REJECTED" && (
            <textarea
              className="w-full mt-4 p-2 border rounded"
              placeholder="Rejection comment"
              onChange={(e) =>
                setDecision({ ...decision, comment: e.target.value })
              }
            />
          )}

          <div className="mt-6 flex justify-center gap-3">
            <Button
              label="Cancel"
              theme="secondary"
              onClick={() => setConfirmOpen(false)}
            />
            <Button
              label="Confirm"
              theme={decision?.status === "ACCEPTED" ? "primary" : "danger"}
              loading={reviewMutation.isPending}
              onClick={() =>
                decision &&
                reviewMutation.mutate({
                  id: decision.id,
                  status: decision.status,
                  comment: decision.comment,
                })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
