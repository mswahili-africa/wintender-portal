import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import columns from "./fragments/ApplicantColumns";
import Chip from "@/components/chip/Chip";
import getApplications from "@/hooks/useApplicantsList";
import ApplicantViewModal from "./fragments/ApplicantViewModel";
import { RequirementStage } from "@/types/tenderWizard";
import Tooltip from "@/components/tooltip/Tooltip";
import Button from "@/components/button/Button";
import { useTranslation } from "react-i18next";

export const ApplicantsList = () => {
    const tenderId = useParams().tenderId;
    const location = useLocation();
    const [tenderDetails, setTenderDetails] = useState<any>(null);
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [comment, setComment] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("SUBMITTED");
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
    const { t } = useTranslation();

    // JCM getting tender details
    // Reset state when navigation state changes
    useEffect(() => {
        setTenderDetails(null);
    }, [location.state.tender]);

    useEffect(() => {

        if (location.state?.tender) {
            setTenderDetails(location.state.tender);
        }
    }, [location.state.tender]);

    // Fetch data using custom hook
    const { applicantList } = getApplications({
        tenderId: tenderId ?? "",
        page,
        search,
        sort,
        filter: undefined,
        status: status,
        comment: comment || null
    });

    // Handle sorting of table columns
    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    // Handle opening the ApplicationsList modal
    const handleViewDetails = (content: any) => {
        setSelectedApplicant(content);
        setIsApplicationModalOpen(true);
    };

    const handleFilteringChange = (comment: string | null, status: string) => {
        setComment(comment);
        setStatus(status);
    };

    const currentDate = new Date().getTime();
    const closeDate = tenderDetails?.closeDate;
    const remainingTime = closeDate - currentDate;
    const remainingDays = remainingTime / (1000 * 60 * 60 * 24);


    // JCM Tender Tabs
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        "DETAILS",
        RequirementStage.PRELIMINARY,
        RequirementStage.TECHNICAL,
        RequirementStage.COMMERCIAL,
        RequirementStage.FINANCIAL,
        RequirementStage.CONSENT,
    ];

    const handleCompleteStep = (index: number) => {
        if (!completedSteps.includes(index)) {
            setCompletedSteps([...completedSteps, index]);
        }
        setCurrentStep(index + 1);
    };

    const renderStepContent = () => {

        if (currentStep === 0) {
            return (
                <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                        {/* <input
                            type="text"
                            placeholder="Search"
                            className="input-normal py-2 w-1/2 lg:w-1/4"
                            onChange={(e) => setSearch(e.target.value)} // Update search query
                        /> */}
                    </div>

                    {/* Render the main table with applicants list*/}
                    <Table
                        columns={columns}
                        data={applicantList?.content || []}
                        hasSelection={false}
                        hasActions={true}
                        onSorting={handleSorting}
                        actionSlot={(selectedApplicant: any) => (
                            <div className="flex space-x-2">
                                <button onClick={() => handleViewDetails(selectedApplicant)}>
                                    <IconEye size={20} />
                                </button>
                            </div>
                        )}
                    />


                    {/* Pagination control */}
                    <div className="flex justify-end items-center ms-auto p-4 lg:px-8">
                        {applicantList?.pageable && (
                            <Pagination
                                currentPage={page}
                                setCurrentPage={setPage}
                                pageCount={applicantList.totalPages || 1}
                            />
                        )}
                    </div>

                </div>
            );
        }

        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Chip
                        label={steps[currentStep]}
                        theme="success"
                        size="sm"
                    />
                    <h2 className="text-lg font-bold">{steps[currentStep]}</h2>
                </div>
                <p className="text-gray-600">{tenderDetails?.description}</p>
            </div>
        )

    }
    return (
        <div>
            <div className="flex flex-col justify-between mb-10 gap-3">
                <h2 className="text-lg font-bold">Tender Box</h2>
                <div className="flex">
                    <strong className="w-32 text-gray-600">Tender:</strong>

                    <h2 className="font-bold">{tenderDetails?.title}</h2>
                </div>
            </div>

            <div className="flex flex-nowrap gap-2 overflow-x-auto mb-4">
                {steps.map((title, index) => {
                    const isActive = currentStep === index;
                    const isClickable = index === 0 || completedSteps.includes(index - 1);

                    return (
                        <button
                            key={title.toString()}
                            type="button"
                            onClick={() => {
                                if (isClickable) setCurrentStep(index);
                            }}
                            className={`flex-1 whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all ${isActive
                                ? "bg-green-600 text-white"
                                : isClickable
                                    ? "bg-green-100 text-gray-700 hover:bg-green-200"
                                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {typeof title === "string" ? title : title}
                        </button>
                    );

                })}
            </div>

            {/* CONTENT */}
            <div className="bg-white p-6 rounded-md shadow overflow-y-auto flex-grow">
                {renderStepContent()}
            </div>

            <div className="mt-6 flex justify-between">
                {currentStep > 0 && (
                    <Tooltip content={t("tender-wizard-back-tooltip")}>
                        <Button
                            size="md"
                            type="button"
                            label={t("tender-wizard-back-button")}
                            theme="secondary"
                            onClick={() => setCurrentStep((prev) => prev - 1)}
                        />
                    </Tooltip>
                )}
                {currentStep < steps.length - 1 ? (
                    <Tooltip content={t("tender-wizard-next-tooltip")}>
                        <Button
                            size="md"
                            type="button"
                            label={t("tender-wizard-next-button")}
                            theme="primary"
                            onClick={() => handleCompleteStep(currentStep)}
                        />
                    </Tooltip>
                ) : (
                    <Tooltip content={t("tender-wizard-publish-tooltip")}>
                        <Button
                            size="md"
                            type="submit"
                            label={t("tender-wizard-publish-button")}
                            theme="primary"
                        // loading={uploadTenderMutation.isPending}
                        />
                    </Tooltip>
                )
                }
            </div>



            {/* JCM  Modal to display Applicants details */}
            {isApplicationModalOpen && (
                <ApplicantViewModal
                    onClose={() => setIsApplicationModalOpen(false)}
                    applicant={selectedApplicant}
                    title="Applicant details"
                    isLoading={false}
                />
            )}
        </div>
    )
}

