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
                >
                    <>
                        <hr /><hr /><br /><br />
                        <div className="space-y-4">
                            <div className="flex items-center  mb-4">
                                <strong className="w-32 text-gray-600">Bidder:</strong>
                                <h3 className="text-l font-semi-bold text-gray-800">{selectedApplicant?.companyName}</h3>
                            </div>
                            <div className="flex items-center mb-4">
                                <strong className="w-32 text-gray-600">Phone:</strong>
                                <a href={`tel:${selectedApplicant.companyPrimaryNumber}`} className="text-l font-semi-bold text-gray-800">
                                    {selectedApplicant.companyPrimaryNumber}
                                </a>
                            </div>
                            <div className="flex items-center mb-4">
                                <strong className="w-32 text-gray-600">Email:</strong>
                                <a href={`mailto:${selectedApplicant.companyEmail}`} className="text-l font-semi-bold text-gray-800">
                                    {selectedApplicant.companyEmail}
                                </a>
                            </div>

                        </div>
                        <div className="space-y-2 w-full">
                            <div className="flex items-center">
                                <strong className="w-32 text-gray-600">Application Date:</strong>
                                <p className="flex-1">{new Date(selectedApplicant.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        {/* PDF Viewer */}
                        <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <iframe
                                src={selectedApplicant.filePath}
                                width="100%"
                                height="500px"
                                title="Tender Document"
                            ></iframe>
                        </div>
                    </>
                </ApplicantViewModal>
            )}
        </div>
    )
}

