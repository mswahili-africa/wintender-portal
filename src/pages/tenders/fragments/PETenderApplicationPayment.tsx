import { useState } from "react";
import { ITenderDetails } from "@/types";
import { IconAlertTriangle, IconPlayerPlay, IconX } from "@tabler/icons-react";
import { useUserDataContext } from "@/providers/userDataProvider";
import Spinner from "@/components/spinners/Spinner";
import { IPaymentForm } from "@/types/forms";
import { createPayment } from "@/services/payments";
import Button from "@/components/button/Button";

interface Props {
  tender: ITenderDetails;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PETenderApplicationPayment({ tender, onClose, onSuccess }: Props) {
  const user = useUserDataContext();
  const walletBalance: number = user?.userData?.walletAmount ?? 0;

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState<Partial<IPaymentForm>>({
    phoneNumber: user?.userData?.phoneNumber,
    account: user?.userData?.account,
    amount: 30000,
    description: `Payment for Tender ${tender.tenderNumber}`,
    paymentReason: "APPLICATION",
    controlNumber: "", // can be generated after payment request, or input by user if needed
    mno: "WALLET",
    referenceId: tender.tenderId
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof IPaymentForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      await createPayment(formData as IPaymentForm);

      // Close payment form/modal
      onClose();

      // Trigger application wizard modal
      onSuccess();
    } catch (err: any) {
      setError("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (tender.applicationStatus === "SUBMITTED") {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <IconAlertTriangle size={64} className="text-yellow-500 mb-4" />
        <p className="text-lg font-semibold text-yellow-700">
          You have already submitted an application.
        </p>
      </div>
    );
  }

  if (tender.applicationStatus === "NOT_FOUND") {
    if (walletBalance < 30000) {
      return (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <IconAlertTriangle size={64} className="text-red-500 mb-4" />
          <p className="text-lg font-semibold text-red-700">
            Insufficient wallet balance. You need at least TZS 30,000 to start this application.<br/> Please recharge your wallet.
          </p>
        </div>
      );
    }

    if (!showPaymentForm) {
      return (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <IconPlayerPlay size={64} className="text-blue-500 mb-4" />
          <p className="text-lg font-semibold text-blue-700 mb-4">
            You have not started this application yet.
          </p>
          <Button
            size="md"
            onClick={() => setShowPaymentForm(true)}
            label="Proceed to Payment"
          />

        </div>
      );
    }

    // Payment form
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <p className="text-sm text-gray-600 mb-6">
          <strong>TZS 30,000</strong> will be deducted from your wallet once you
          confirm this payment.
        </p>
        {error && <p className="text-red-600 mt-4">{error}</p>}

        <div className="flex justify-end mt-6 gap-4">
          <Button
            size="md"
            variant="outline"
            onClick={() => setShowPaymentForm(false)}
            label="Cancel"
          />

          <Button
            theme="primary"
            size="md"
            onClick={handlePayment}
            disabled={loading}
            label={loading ? undefined : "Pay Now"}
            icon={loading ? <Spinner size="sm" /> : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <IconX size={64} className="text-red-500 mb-4" />
      <p className="text-lg font-semibold text-red-700">Unknown application status.</p>
    </div>
  );
}
