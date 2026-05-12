import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { IconChevronLeft, IconChevronRight, IconEye, IconPdf, IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import columns from "./fragments/ApplicantColumns";
import getApplications from "@/hooks/useApplicantsList";
import ApplicantViewModal from "./fragments/ApplicationViewModel";
import { IApplicationInterface, IStageMarks, RequirementStage } from "@/types/tenderWizard";
import Tooltip from "@/components/tooltip/Tooltip";
import Button from "@/components/button/Button";
import { ITenders } from "@/types";

export const ApplicantsList = () => {
    const { tenderId } = useParams();
    const location = useLocation();
    const [tenderDetails, setTenderDetails] = useState<ITenders | null>(location.state?.tender);
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [reviewStage, setReviewStage] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [handleModal, setHandleModal] = useState<{ type: "viewApplication" | null, object: any }>({ type: null, object: null });

    const handleModalClose = () => {
        setHandleModal({ type: null, object: null });
    }

    const steps = [
        "OPEN",
        RequirementStage.PRELIMINARY,
        RequirementStage.TECHNICAL,
        RequirementStage.FINANCIAL,
        RequirementStage.COMMERCIAL,
        "NEGOTIATION",
        "AWARDED"
    ];

    // JCM getting tender details
    // Reset state when navigation state changes
    useEffect(() => {
        if (location.state?.tender) {
            setTenderDetails(location.state.tender);
        }
    }, [location.state.tender]);


    // Fetch data using custom hook
    const { applicantList, refetch, isLoading } = getApplications({
        tenderId: tenderId ?? tenderDetails?.id!,
        page,
        size: 20,
        search: search ? search : undefined,
        sort,
        filter: undefined,
        status: reviewStage === "PRELIMINARY" ? undefined : status,
        reviewStage: reviewStage === "PRELIMINARY" ? undefined : reviewStage
    });

    if (!tenderDetails) return <div>Loading...</div>

    // Handle sorting of table columns
    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };


    const handleFilteringChange = (stage: string, currentIndexStep: number) => {
        if (stage !== "AWARDED") {
            setReviewStage(steps[currentIndexStep + 1]);
            setStatus("SUBMITTED");
            handleCompleteStep(currentIndexStep - 1);
        } else {
            setReviewStage(stage);
            setStatus("AWARDED");
            handleCompleteStep(currentIndexStep - 1);
        }
    };



    // JCM Tender Tabs
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [currentStep, setCurrentStep] = useState(0);


    const handleCompleteStep = (index: number) => {
        if (!completedSteps.includes(index)) {
            setCompletedSteps([...completedSteps, index]);
        }
        setCurrentStep(index + 1);
    };

    // HIGHEST SCORE AND LOWEST SCORE
    const scores = applicantList?.content?.map((a: IApplicationInterface) => a.totalMarks) || [];

    // Use fallback 0 to avoid -Infinity/Infinity
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const passMark = applicantList?.content[0]?.stageMarks.map((stageMark: IStageMarks) => stageMark.passMark)[0];

    const renderStepContent = () => {

        return (
            <div className="bg-white border rounded-xl shadow-sm">

                <div className="flex items-center justify-between p-4 border-b">

                    <input
                        type="text"
                        placeholder="Search applicants..."
                        className="input-normal py-2 w-64"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <span className="text-sm text-slate-500">
                        Showing {applicantList?.content?.length ?? 0} application(s)
                    </span>

                </div>

                <Table
                    columns={columns}
                    data={applicantList?.content || []}
                    isLoading={isLoading}
                    hasActions
                    onSorting={handleSorting}
                    actionSlot={(selectedApplicant: any) => (
                        <Tooltip content="Review application">
                            <button
                                onClick={() =>
                                    setHandleModal({
                                        type: "viewApplication",
                                        object: selectedApplicant
                                    })
                                }
                            >
                                <IconEye size={18} />
                            </button>
                        </Tooltip>
                    )}
                />

                <div className="flex justify-end p-4 border-t">
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        pageCount={applicantList?.totalPages || 1}
                    />
                </div>

            </div>
        );

    }
    return (
        <div>
            <div className="flex flex-col justify-between mb-6 gap-3">
                <div className="flex items-start justify-between mb-6">

                    <div>
                        <h1 className="text-xl font-semibold text-slate-800">
                            Tender Review Workspace
                        </h1>

                        <p className="text-sm text-slate-500">
                            {tenderDetails?.title}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            label="Refresh"
                            theme="info"
                            loading={isLoading}
                            icon={<IconRefresh size={18} />}
                            onClick={() => refetch()}
                        />

                        <Button
                            label="Export Report"
                            variant="pastel"
                            icon={<IconPdf className="text-red-500" size={24} />}
                            onClick={() => refetch()}
                        />
                    </div>

                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

                    <div className="bg-white border rounded-lg p-4">
                        <p className="text-xs text-slate-500">Total Applications</p>
                        <p className="text-xl font-semibold">
                            {applicantList?.totalElements ?? 0}
                        </p>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                        <p className="text-xs text-slate-500">Current Stage</p>
                        <p className="text-sm text-green-600 font-semibold">
                            {steps[currentStep]}
                        </p>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                        <p className="text-xs text-slate-500">Pass Mark</p>
                        <p className="text-lg text-green-600 font-semibold">
                            {passMark ?? 0}%
                        </p>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                        <p className="text-xs text-slate-500">Under Review</p>
                        <p className="text-xl font-semibold">
                            {applicantList?.content?.length ?? 0}
                        </p>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                        <p className="text-xs text-slate-500">Completion</p>
                        <p className="text-xl font-semibold">
                            {Math.round((currentStep / (steps.length - 1)) * 100)}%
                        </p>
                    </div>

                </div>
            </div>

            <div className="bg-white border rounded-lg p-4 mb-6">

                <div className="flex items-center gap-2 overflow-x-auto">

                    {steps.map((step, index) => {

                        const isActive = currentStep === index
                        const completed = index < currentStep

                        return (
                            <button
                                key={step.toString()}
                                onClick={() => handleFilteringChange(step, index)}
                                className={`
            px-4 py-2 text-sm rounded-full border transition
            ${isActive
                                        ? "bg-green-600 text-white border-green-600"
                                        : completed
                                            ? "bg-green-100 border-green-300 text-green-700"
                                            : "bg-white border-slate-200 text-slate-600"}
          `}
                            >
                                {step}
                            </button>
                        )

                    })}

                </div>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">

                <div className="bg-white border rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Highest Score</p>
                    <p className="text-lg font-semibold">{highestScore ?? "—"}</p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Lowest Score</p>
                    <p className="text-lg font-semibold">{lowestScore ?? "—"}</p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Evaluators Assigned</p>
                    <p className="text-lg font-semibold">{"Current"}</p>
                </div>

            </div>

            {/* CONTENT */}
            <div className="bg-white p-6 rounded-md shadow overflow-y-auto flex-grow">
                {renderStepContent()}
            </div>

            <div className="flex justify-between mt-8">

                {currentStep > 0 && (
                    <Button
                        icon={<IconChevronLeft size={18} />}
                        label="Previous Stage"
                        theme="secondary"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                    />
                )}

                {currentStep < steps.length - 1 && (
                    <Button
                        icon={<IconChevronRight size={18} />}
                        iconPosition="right"
                        label="Next Stage"
                        theme="primary"
                        onClick={() => handleCompleteStep(currentStep)}
                    />
                )}

            </div>



            {/* JCM  Modal to display Applicants details */}
            {
                handleModal.type === "viewApplication" && handleModal.object &&
                <ApplicantViewModal
                    onClose={handleModalClose}
                    applicant={handleModal.object}
                    title="Application details"
                    refetch={refetch}
                />
            }


        </div>
    )
}

