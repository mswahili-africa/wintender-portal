import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import { IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import columns from "./fragments/ApplicantColumns";
import Chip from "@/components/chip/Chip";
import getApplications from "@/hooks/useApplicantsList";
import ApplicantViewModal from "./fragments/ApplicantViewModel";

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

    return (
        <div>
            <div className="flex flex-col justify-between mb-10 gap-3">
                <h2 className="text-lg font-bold">Tender Box</h2>
                <div className="flex">
                    <strong className="w-32 text-gray-600">Tender:</strong>

                    <h2 className="font-bold">{tenderDetails?.title}</h2>
                </div>
                <div className="flex items-center">
                    <strong className="w-32 text-gray-600">Status:</strong>
                    <Chip label={(() => {


                        if (remainingDays < 0) {
                            return 'CLOSED';
                        } else if (remainingDays <= 2) {
                            return 'CLOSING';
                        } else {
                            return tenderDetails?.status;
                        }
                    })()} size="sm" theme={remainingDays <= 2 && remainingDays > 0 ? "warning" : remainingDays <= 0 ? "danger" : "success"} />
                </div>
                <div className="flex items-center">
                    <strong className="w-32 text-gray-600">Closing Date:</strong>
                    <p className="flex-1">{new Date(tenderDetails?.closeDate).toLocaleString()}</p>
                </div>
            </div>


            {/* Filtering tabs */}
            <div className="flex w-full justify-center mb-2">
                <div className="flex flex-row rounded-2xl w-fit border-2 border-gray-400 gap-1 p-1">
                    <button type="button" onClick={() => handleFilteringChange(null,"SUBMITTED")} className={` rounded-xl p-2 text-sm ${comment === "" ? "bg-green-600 text-white" : "text-gray-500"} `}>Applications</button>
                    <button type="button" onClick={() => handleFilteringChange("ACCEPTED","CLOSED")} className={` rounded-xl p-2 text-sm ${comment === "ACCEPTED" ? "bg-green-600 text-white" : "text-gray-500"} `}>Vendors</button>
                </div>
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

