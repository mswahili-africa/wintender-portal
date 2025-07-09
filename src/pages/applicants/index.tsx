import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { IApplicationGroup } from "@/types";
import { IconEye } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import columns from "./fragments/ApplicantColumns";
import ApplicationViewModal from "./fragments/ApplicationViewModel";
import Chip from "@/components/chip/Chip";
import getApplications from "@/hooks/useApplicantsList";

export const ApplicantsList = () => {
    const tenderId = useParams().tenderId;
    const location = useLocation();
    const [page, setPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("updatedAt,desc");
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

    // JCM getting tender details
    const tenderDetails = location.state?.tender;

    // Fetch data using custom hook
    const { applicantList } = getApplications({
        tenderId: tenderId ?? "",
        page,
        search,
        sort,
        filter: undefined,
    });

    // Handle sorting of table columns
    const handleSorting = (field: string, direction: SortDirection) => {
        setSort(`${field},${direction.toLowerCase()}`);
    };

    // Handle opening the ApplicationsList modal
    const handleViewDetails = (group: IApplicationGroup) => {
        // setSelectedGroupList(group);
        setIsApplicationModalOpen(true);
    };

    console.log("applicantList", applicantList?.content);
    return (
        <div>
            <div className="flex flex-col justify-between mb-10">
                <h2 className="text-lg font-bold">{tenderDetails?.title}</h2>
                <div className="flex items-center">
                    <strong className="w-32 text-gray-600">Status:</strong>
                    <Chip label={(() => {
                        const currentDate = new Date().getTime();
                        const closeDate = tenderDetails?.closeDate;
                        const remainingTime = closeDate - currentDate;
                        const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

                        if (remainingDays < 0) {
                            return 'CLOSED';
                        } else if (remainingDays <= 2) {
                            return 'CLOSING';
                        } else {
                            return tenderDetails?.status;
                        }
                    })()} size="sm" theme="success" />
                </div>
                <div className="flex items-center">
                    <strong className="w-32 text-gray-600">Close Date:</strong>
                    <p className="flex-1">{new Date(tenderDetails?.closeDate).toLocaleString()}</p>
                </div>
                {/* {["PROCUREMENT_ENTITY", "PUBLISHER","ADMINISTRATOR"].includes(userRole) && (
                    <PrivateTenderRequest onSuccess={refetch} />
                )} */}
            </div>

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
                    hasActions={true}
                    onSorting={handleSorting}
                    actionSlot={(applicationGroup: IApplicationGroup) => (
                        <div className="flex space-x-2">
                            <button onClick={() => handleViewDetails(applicationGroup)}>
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

            {/* JCM  Modal to display Applicants details */}
            {isApplicationModalOpen && (
                <ApplicationViewModal
                    onClose={() => setIsApplicationModalOpen(false)}
                    tenderId={tenderId ?? ""}
                    title="Applicant application details"
                    isLoading={false}
                    onDoItForMeClick={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                >
                    <>Applicants details</>
                </ApplicationViewModal>
            )}
        </div>
    )
}

