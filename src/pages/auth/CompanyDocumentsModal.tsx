import Modal from "@/components/widgets/Modal";
import { TermsAndConditions } from "../system-documents/TermsAndConditions";
import PrivacyPolicy from "../system-documents/PrivacyPolicy";
import SubscriptionFeeSchedule from "../system-documents/SubscriptionFeeSchedule";
import Tabs from "@/components/widgets/Tabs";
import SupplierCodeOfConduct from "../system-documents/SupplierCodeOfConduct";
import RecordsRetentionPolicy from "../system-documents/RecordsRetentionPolicy";
import DataProcessingAgreement from "../system-documents/DataProcessingAgreement";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CompanyDocumentsModal({ isOpen, onClose }: IProps) {


    return (
        <Modal
            size="3xl"
            title={"Company Documents"}
            isOpen={isOpen}
            zIndex={20}
            onClose={onClose}
        >
            <div>
                <Tabs panels={["Terms and Conditions", "Privacy Policy", "Data Processing Agreement", "Records Retention Policy", "Subscription Fee", "Supplier Code of Conduct"]}>
                    <TermsAndConditions />
                    <PrivacyPolicy />
                    <DataProcessingAgreement />
                    <RecordsRetentionPolicy />
                    <SubscriptionFeeSchedule />
                    <SupplierCodeOfConduct />
                </Tabs>
            </div>
        </Modal>
    );
}
