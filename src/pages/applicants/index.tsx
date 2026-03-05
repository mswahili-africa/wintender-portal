import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import columns from "./fragments/ApplicantColumns";
import getApplications from "@/hooks/useApplicantsList";
import ApplicantViewModal from "./fragments/ApplicantViewModel";
import { RequirementStage } from "@/types/tenderWizard";
import Tooltip from "@/components/tooltip/Tooltip";
import Button from "@/components/button/Button";
import { useTranslation } from "react-i18next";
import { useUserDataContext } from "@/providers/userDataProvider";
import { ITenders } from "@/types";

export const ApplicantsList = () => {
    const  {tenderId}  = useParams();
    // const  tenderId  = params.tenderId;
    const location = useLocation();
    const [tenderDetails, setTenderDetails] = useState<ITenders | null>(location.state?.tender);
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [reviewStage, setReviewStage] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const { t } = useTranslation();
    const { userData } = useUserDataContext();
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
    const { applicantList,refetch,isLoading } = getApplications({
        tenderId: tenderId ?? tenderDetails?.id!,
        page,
        size: 10,
        search: search ? search : undefined,
        sort,
        filter: undefined,
        status: reviewStage === "PRELIMINARY" ? undefined : status,
        reviewStage: reviewStage === "PRELIMINARY" ? undefined : reviewStage
    });

    if(!tenderDetails) return <div>Loading...</div>

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

    const renderStepContent = () => {

        return (
            <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input-normal py-2 w-1/2 lg:w-1/4"
                        onChange={(e) => setSearch(e.target.value)} // Update search query
                    />
                </div>

                {/* Render the main table with applicants list*/}
                <Table
                    columns={columns}
                    data={applicantList?.content || []}
                    hasSelection={false}
                    isLoading={isLoading}
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(selectedApplicant: any) => (
                        <div className="flex space-x-2">
                            {
                                userData?.role !== "PROCUREMENT_ENTITY" &&
                                <Tooltip content="Review application details">
                                    <button onClick={() => setHandleModal({ type: "viewApplication", object: selectedApplicant })}>
                                        <IconEye size={20} />
                                    </button>
                                </Tooltip>
                            }
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
        <div>
            <div className="flex flex-col justify-between mb-6 gap-3">
                <h2 className="text-lg font-bold">Tender Box Review</h2>
                <div className="flex">
                    <strong className=" text-gray-400">Tender:</strong>

                    <h2 className="ps-2 font-bold">{tenderDetails?.title}</h2>
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
                                handleFilteringChange(title, index);
                            }}
                            className={`flex-1 whitespace-nowrap px-4 py-3 rounded-md text-sm font-medium transition-all ${isActive
                                ? "bg-green-600 text-white"
                                : "bg-green-100 text-gray-700 hover:bg-green-200"}`}
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

