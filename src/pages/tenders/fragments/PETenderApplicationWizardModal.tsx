import { useEffect, useState } from "react";
import { getTenderDetails } from "@/services/tenders";
import Spinner from "@/components/spinners/Spinner";
import Modal from "@/components/widgets/Modal";
import { ITenderDetails } from "@/types";
import PETenderApplicationWizard from "./PETenderApplicationWizard";
import PETenderApplicationPayment from "./PETenderApplicationPayment";
import { Countdown } from "@/components/countdown/Countdown";
import { useQuery } from "@tanstack/react-query";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenderId: string;
  onSuccess: () => void;
}

export default function PETenderApplicationWizardModal({
  isOpen,
  onClose,
  tenderId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [tender, setTender] = useState<ITenderDetails | null>(null);
  const [closedate, setClosedate] = useState<number | null>(null);

  useEffect(() => {
    if (!tenderId) return;
    setLoading(true);
    getTenderDetails(tenderId)
      .then((data) => {
        if (data.closeDate) {
          setClosedate(Date.parse(data.closeDate));
        }
        setTender(data);
      })
      .catch((err) => {
        console.error("Failed to load tender", err);
        setTender(null);
      })
      .finally(() => setLoading(false));
  }, [tenderId]);


  if (!isOpen) return null;

  return (
    <Modal size="xl" zIndex={50} isOpen={isOpen} onClose={onClose} title="Tender Application">
      <div className="w-full flex justify-end">
        {closedate && <Countdown expirationTime={closedate} />}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : !tender ? (
        <div className="text-center py-12 text-red-600 font-semibold">Failed to load tender details.</div>
      ) : tender.applicationStatus === "NOT_FOUND" ? (
        <PETenderApplicationPayment tender={tender} onClose={onClose} onSuccess={onSuccess} />
      ) : (
        <PETenderApplicationWizard tender={tender} onSuccess={onSuccess} onClose={onClose} />
      )}
    </Modal>
  );
}
