import Button from "@/components/button/Button";
import Spinner from "@/components/spinners/Spinner";
import { useUserDataContext } from "@/providers/userDataProvider";
import { Suspense, useState } from "react";
import DIFMAssignModel from "./difmAssignModel";
import PETenderApplicationWizardModal from "./PETenderApplicationWizardModal";
import { IconAlertCircle, IconBuildingStore, IconCalendarEvent, IconCategory, IconClock, IconCreditCardPay, IconExternalLink, IconFileDescription, IconFileText, IconGitPullRequest, IconInfoCircle, IconMapPin, IconMessageCircle, IconShieldCheck, IconUserDown, IconUsers, IconX } from "@tabler/icons-react";
import { ITenders } from "@/types";
import Chip from "@/components/chip/Chip";
import { Countdown } from "@/components/countdown/Countdown";
import { EligibleBidders } from "./eligibleBiddersList";
import { Clarifications } from "./Clarifications";
import { Dialog } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";

interface ModalProps {
    isOpen: boolean;
    tender: ITenders | null;
    onClose: () => void;
    isLoading: boolean;
    onDoItForMeClick: () => void;
}

const TenderViewModal = ({ onClose, tender, isLoading, onDoItForMeClick, isOpen }: ModalProps) => {
    const { userData } = useUserDataContext();
    const userRole = userData?.role || "BIDDER";
    const [assignBidderModalOpen, setAssignBidderModalOpen] = useState(false);
    const { t } = useTranslation();

    // JCM Tender Tabs
    const [activeTab, setActiveTab] = useState<"DETAILS" | "CLARIFICATION" | "ELIGIBLE">("DETAILS");



    // JCM Tender Apply Modal State
    const [isTenderApplyModalOpen, setIsTenderApplyModalOpen] = useState(false);

    // JCM handle Tender Apply Modal open/Close
    const handleTenderApplyModal = async () => {
        setAssignBidderModalOpen(false);
        new Promise((resolve) => setTimeout(resolve, 500));
        setIsTenderApplyModalOpen(true);
    };


    const handleSuccess = () => {
        console.log("Bidder assignment was successful!");
        // You can handle any additional logic you want when the assignment is successful
        setAssignBidderModalOpen(false); // Close the modal, for example
    };

    // date
    const currentDate = new Date().getTime();
    const closeDate = tender?.closeDate;
    const remainingTime = closeDate! - currentDate;
    const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));



    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onClose}
                className="relative z-20"
            >
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
                    aria-hidden="true"
                />

                <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-5">
                    <div className="w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">

                        {/* =====================================================
                        HEADER
                    ====================================================== */}
                        <div className="relative border-b border-slate-200 bg-white">

                            {/* Accent */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500" />

                            <div className="px-5 sm:px-7 pt-6 pb-5">

                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                                    {/* Tender identity */}
                                    <div className="min-w-0">

                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-50 text-green-600">
                                                <IconFileDescription size={18} />
                                            </div>

                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Tender
                                            </span>

                                            <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                                                {tender?.tenderNumber}
                                            </span>
                                        </div>

                                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                                            {tender?.title}
                                        </h2>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">

                                            <div className="flex items-center gap-1.5">
                                                <IconBuildingStore size={16} />
                                                <span>{tender?.entityName}</span>
                                            </div>

                                            {tender?.categoryName && (
                                                <div className="flex items-center gap-1.5">
                                                    <IconCategory size={16} />
                                                    <span>{tender.categoryName}</span>
                                                </div>
                                            )}

                                            {tender?.region && (
                                                <div className="flex items-center gap-1.5">
                                                    <IconMapPin size={16} />
                                                    <span>{tender.region}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Header actions */}
                                    <div className="flex items-center gap-2 shrink-0">

                                        {/* Government source */}
                                        {tender?.region === "GOVERNMENT" &&
                                            remainingTime > 0 && (
                                                <Tooltip
                                                    content={t("tender-view-modal-go-nest-tooltip")}
                                                    placement="top"
                                                >
                                                    <Button
                                                        label="Go NEST"
                                                        size="sm"
                                                        icon={<IconExternalLink size={16} />}
                                                        theme="info"
                                                        variant="outline"
                                                        onClick={() =>
                                                            window.open(
                                                                "https://nest.go.tz/"
                                                            )
                                                        }
                                                    />
                                                </Tooltip>
                                            )}

                                        {/* Assign bidder */}
                                        {!["PROCUREMENT_ENTITY", "BIDDER"].includes(userRole) &&
                                            remainingTime > 0 && (
                                                <Tooltip
                                                    content={t(
                                                        "tender-view-modal-assign-bidder-tooltip"
                                                    )}
                                                >
                                                    <Button
                                                        label={t(
                                                            "tender-view-modal-assign-bidder-button"
                                                        )}
                                                        size="sm"
                                                        icon={<IconUserDown size={16}/>}
                                                        theme="secondary"
                                                        onClick={() =>
                                                            setAssignBidderModalOpen(true)
                                                        }
                                                    />
                                                </Tooltip>
                                            )}

                                        {/* Bidder actions */}
                                        {userRole === "BIDDER" &&
                                            remainingTime > 0 &&
                                            (isLoading ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                <div className="flex items-center gap-2">

                                                    {tender?.selfApply && (
                                                        <Tooltip
                                                            content={t(
                                                                "tender-view-modal-apply-tooltip"
                                                            )}
                                                        >
                                                            <Button
                                                                label={t(
                                                                    "tender-view-modal-apply-button"
                                                                )}
                                                                size="sm"
                                                                icon={<IconCreditCardPay size={16}/>}
                                                                theme="primary"
                                                                onClick={
                                                                    handleTenderApplyModal
                                                                }
                                                            />
                                                        </Tooltip>
                                                    )}

                                                    <Tooltip
                                                        content={t(
                                                            "tender-view-modal-difm-tooltip"
                                                        )}
                                                    >
                                                        <Button
                                                            label={t(
                                                                "tender-view-modal-difm-button"
                                                            )}
                                                            size="sm"
                                                            icon={<IconGitPullRequest size={16}/>}
                                                            theme="primary"
                                                            onClick={
                                                                onDoItForMeClick
                                                            }
                                                        />
                                                    </Tooltip>
                                                </div>
                                            ))}

                                        <button
                                            onClick={onClose}
                                            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                            aria-label="Close"
                                        >
                                            <IconX size={21} />
                                        </button>
                                    </div>
                                </div>

                                {/* =================================================
                                STATUS / DEADLINE BAR
                            ================================================== */}
                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">

                                    {/* Status */}
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${remainingDays < 0
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                                }`}
                                        >
                                            {remainingDays < 0 ? (
                                                <IconAlertCircle size={19} />
                                            ) : (
                                                <IconShieldCheck size={19} />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                Status
                                            </p>

                                            <Chip
                                                label={
                                                    remainingDays < 0
                                                        ? "CLOSED"
                                                        : tender?.status!
                                                }
                                                size="sm"
                                                theme={
                                                    remainingDays < 0
                                                        ? "danger"
                                                        : "success"
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Closing date */}
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <IconCalendarEvent size={19} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                Closing date
                                            </p>

                                            <p className="text-sm font-semibold text-slate-700 truncate">
                                                {new Date(
                                                    tender?.closeDate!
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Countdown */}
                                    <div
                                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${remainingDays < 0
                                            ? "border-red-100 bg-red-50"
                                            : "border-amber-100 bg-amber-50"
                                            }`}
                                    >
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${remainingDays < 0
                                                ? "bg-red-100 text-red-600"
                                                : "bg-amber-100 text-amber-600"
                                                }`}
                                        >
                                            <IconClock size={19} />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                Time remaining
                                            </p>

                                            <div className="text-sm font-bold text-slate-800">
                                                <Countdown
                                                    expirationTime={
                                                        tender?.closeDate!
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =====================================================
                            TABS
                        ====================================================== */}
                            {new Date(tender?.closeDate!) > new Date() && (
                                <div className="px-5 sm:px-7">
                                    <div className="flex items-center gap-1 overflow-x-auto">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveTab("DETAILS")
                                            }
                                            className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${activeTab === "DETAILS"
                                                ? "text-green-700"
                                                : "text-slate-500 hover:text-slate-800"
                                                }`}
                                        >
                                            <IconInfoCircle size={17} />
                                            Details

                                            {activeTab === "DETAILS" && (
                                                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-green-600" />
                                            )}
                                        </button>

                                        {tender?.selfApply && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveTab("CLARIFICATION")
                                                }
                                                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${activeTab === "CLARIFICATION"
                                                    ? "text-green-700"
                                                    : "text-slate-500 hover:text-slate-800"
                                                    }`}
                                            >
                                                <IconMessageCircle size={17} />
                                                Clarifications

                                                <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                                                    {tender?.clarificationCount ??
                                                        0}
                                                </span>

                                                {activeTab === "CLARIFICATION" && (
                                                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-green-600" />
                                                )}
                                            </button>
                                        )}

                                        {[
                                            "ADMINISTRATOR",
                                            "MANAGER",
                                            "PUBLISHER",
                                            "ACCOUNTANT",
                                            "SUPERVISOR",
                                            "CUSTOMER_RELATIONSHIP_MANAGER",
                                        ].includes(userRole) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveTab("ELIGIBLE")
                                                    }
                                                    className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${activeTab === "ELIGIBLE"
                                                        ? "text-green-700"
                                                        : "text-slate-500 hover:text-slate-800"
                                                        }`}
                                                >
                                                    <IconUsers size={17} />
                                                    Eligible Bidders

                                                    {activeTab === "ELIGIBLE" && (
                                                        <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-green-600" />
                                                    )}
                                                </button>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =========================================================
                        CONTENT
                    ========================================================== */}
                        <div
                            className="overflow-y-auto bg-slate-50/70"
                            style={{
                                minHeight: "40vh",
                                maxHeight: "62vh",
                            }}
                        >

                            {/* =====================================================
                            DETAILS
                        ====================================================== */}
                            {activeTab === "DETAILS" && (
                                <div className="p-5 sm:p-7 space-y-5">

                                    {/* Summary card */}
                                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                                                <IconInfoCircle size={18} />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Tender overview
                                                </h3>

                                                <p className="text-xs text-slate-400">
                                                    Key information about this opportunity
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-5">

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                                <div className="rounded-xl bg-slate-50 p-4">
                                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                                        Tender number
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                                        {tender?.tenderNumber}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-4">
                                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                                        Procuring entity
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                                        {tender?.entityName}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-4">
                                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                                        Category
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                                        {tender?.categoryName}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-4">
                                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                                        Closing date
                                                    </p>

                                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                                        {new Date(
                                                            tender?.closeDate!
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Summary */}
                                            <div className="mt-5">
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                    Description
                                                </p>

                                                <div
                                                    className="prose prose-sm max-w-none text-slate-600 leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            tender?.summary!,
                                                    }}
                                                />
                                            </div>

                                            {/* Restricted fee */}
                                            {(userRole === "MANAGER" ||
                                                userRole ===
                                                "ADMINISTRATOR") && (
                                                    <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                                                        <div>
                                                            <p className="text-xs font-semibold text-emerald-700">
                                                                Consultation fee
                                                            </p>

                                                            <p className="text-xs text-emerald-600">
                                                                Internal management information
                                                            </p>
                                                        </div>

                                                        <p className="text-lg font-bold text-emerald-700">
                                                            TZS{" "}
                                                            {new Intl.NumberFormat().format(
                                                                tender?.consultationFee!
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* =================================================
                                    DOCUMENT
                                ================================================== */}
                                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 px-5 py-4">

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                                    <IconFileText size={18} />
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800">
                                                        Tender document
                                                    </h3>

                                                    <p className="text-xs text-slate-400">
                                                        Official tender documentation
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                                PDF Document
                                            </span>
                                        </div>

                                        <div className="bg-slate-100 p-2 sm:p-3">
                                            <iframe
                                                src={
                                                    userData?.role === "BIDDER"
                                                        ? `${tender?.filePath}#toolbar=0&navpanes=0&scrollbar=0`
                                                        : `${tender?.filePath}`
                                                }
                                                width="100%"
                                                height="500px"
                                                title="Tender Document"
                                                className="rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* =====================================================
                            CLARIFICATIONS
                        ====================================================== */}
                            {activeTab === "CLARIFICATION" && (
                                <div className="p-5 sm:p-7">
                                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                        <Clarifications tender={tender!} />
                                    </div>
                                </div>
                            )}

                            {/* =====================================================
                            ELIGIBLE BIDDERS
                        ====================================================== */}
                            {activeTab === "ELIGIBLE" && (
                                <div className="p-5 sm:p-7">
                                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                        <EligibleBidders tender={tender!} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =========================================================
                        FOOTER
                    ========================================================== */}
                        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 sm:px-7 py-4">

                            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                                <IconShieldCheck size={16} className="text-green-500" />
                                <span>
                                    Information provided through Wintender
                                </span>
                            </div>

                            <Button
                                label="Close"
                                size="sm"
                                theme="secondary"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                </div>

                {/* =============================================================
                ASSIGN BIDDER MODAL
            ============================================================== */}
                {assignBidderModalOpen && (
                    <DIFMAssignModel
                        isOpen={assignBidderModalOpen}
                        onClose={() => setAssignBidderModalOpen(false)}
                        tenderId={tender?.id!}
                        onSuccess={handleSuccess}
                    />
                )}

                {/* =============================================================
                TENDER APPLICATION MODAL
            ============================================================== */}
                {isTenderApplyModalOpen && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <PETenderApplicationWizardModal
                            isOpen={isTenderApplyModalOpen}
                            onClose={() =>
                                setIsTenderApplyModalOpen(false)
                            }
                            tenderId={tender?.id!}
                            onSuccess={handleSuccess}
                        />
                    </Suspense>
                )}
            </Dialog>
        </>
    );

}
export default TenderViewModal;
