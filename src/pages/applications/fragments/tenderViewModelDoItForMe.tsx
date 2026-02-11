import Button from '@/components/button/Button';
import Chip from '@/components/chip/Chip';
import { useUserDataContext } from '@/providers/userDataProvider';
import { IApplicationGroup, IApplications } from '@/types';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    selectedApplication: IApplications;
    applicationGroup?: IApplicationGroup;
}

const TenderViewModelDoItForMe = ({ open, onClose, selectedApplication, applicationGroup }: ModalProps) => {
    const theme: "primary" | "warning" = selectedApplication?.tenderGroup === "PRIVATE" ? "warning" : "primary";
    const {t} = useTranslation();

    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";

    const currentDate = new Date().getTime();
    const closeDate = selectedApplication?.closeDate;
    const remainingTime = closeDate! - currentDate;
    const remainingDays = remainingTime / (1000 * 60 * 60 * 24);
    return (
        <>
            {
                open &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Modal Container */}
                    <div className="bg-green-100 rounded-lg shadow-lg w-[800px] p-4"> {/* Set width to 800px */}
                        <div className="flex justify-between items-center mb-4">
                            {/* Tender Group and Chip */}
                            <div className="flex items-center space-x-2">
                                <Chip label={selectedApplication.tenderGroup} size="sm" theme={theme} variant="outline" />
                            </div>
                            {/* Close Button */}
                            <button onClick={onClose} className="text-red-500 text-xl font-bold">
                                X
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="mt-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                            {
                                applicationGroup &&
                                <div className="space-y-4">
                                    <div className="flex items-center mb-4">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-bidder")}:</strong>
                                        <h3 className="text-l font-semi-bold text-gray-800"><strong className="w-32 text-gray-600">{applicationGroup.bidderAccount}</strong> : {applicationGroup.bidderAccount}</h3>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-phone")}:</strong>
                                        <a href={`tel:${applicationGroup.bidderCompanyPrimaryNumber}`} className="text-l font-semi-bold text-gray-800">
                                            {applicationGroup.bidderCompanyPrimaryNumber}
                                        </a>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-email")}:</strong>
                                        <a href={`mailto:${applicationGroup.bidderCompanyEmail}`} className="text-l font-semi-bold text-gray-800">
                                            {applicationGroup.bidderCompanyEmail}
                                        </a>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-assignor-name")}:</strong>
                                        <a href={`mailto:${applicationGroup.assignorName}`} className="text-l font-semi-bold text-gray-800">
                                            {applicationGroup.assignorName}
                                        </a>
                                    </div>

                                </div>
                            }

                            <hr></hr>
                            <br></br>

                            <div className="space-y-4">
                                {/* Tender Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <strong className="w-32 text-gray-600">{t("difm-application-modal-title")}:</strong>
                                    <h3 className="flex-1 font-bold text-gray-800">{selectedApplication.tenderNumber} : {selectedApplication.title}</h3>
                                </div>

                                {/* Tender Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">PE:</strong>
                                        <p className="flex-1 font-bold text-gray-800">{selectedApplication.entityName.toUpperCase()}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-category")}:</strong>
                                        <p className="flex-1">{selectedApplication.categoryName}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-summary")}:</strong>
                                        <p className="flex-1" dangerouslySetInnerHTML={{ __html: selectedApplication.summary }}></p>
                                    </div>

                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-status")}:</strong>
                                        <Chip
                                            label={(() => {


                                                // Determine the label based on the remaining days
                                                if (remainingDays < 0) {
                                                    return 'CLOSED';
                                                } else if (remainingDays <= 2) {
                                                    return 'CLOSING';
                                                } else {
                                                    return selectedApplication.status;
                                                }
                                            })()}
                                            size="sm"
                                            // theme="danger"
                                            theme={
                                                remainingDays < 0 ? 'danger' : remainingDays <= 2 ? 'warning' : "success"
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <strong className="w-32 text-gray-600">{t("difm-application-modal-close-date")}:</strong>
                                        <p className="flex-1">{new Date(selectedApplication.closeDate).toLocaleString()}</p>
                                    </div>

                                    <br></br>
                                    {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") && (
                                        <><hr></hr><div className="flex items-center">
                                            <strong className="w-50 text-gray-600">{t("difm-application-modal-consultation-fee")}:</strong>
                                            <p className="flex-1">
                                                <strong className="w-40 text-gray-600">
                                                    TZS {new Intl.NumberFormat().format(selectedApplication.principleAmount)}
                                                </strong>
                                            </p>
                                        </div></>

                                    )}
                                </div>

                                <hr></hr>


                                {/* PDF Viewer */}
                                <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <iframe
                                        src={selectedApplication.filePath}
                                        width="100%"
                                        height="500px"
                                        title="Tender Document"
                                    ></iframe>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-end space-x-2 mt-6">
                                    <Button label="Close" size="sm" theme="danger" onClick={onClose} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    );
};

export default TenderViewModelDoItForMe;
