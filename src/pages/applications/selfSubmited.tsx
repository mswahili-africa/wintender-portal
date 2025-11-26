import { Fragment, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/submittedColumsColumns";
import { ISubmittedApplication } from "@/types";
import { IconEdit, IconEye, IconRecycle, IconTrash } from "@tabler/icons-react";
import { useSubmittedApplication } from "@/hooks/useSubmittedApplications";
import { useUserDataContext } from "@/providers/userDataProvider";
import { deleteApplication } from "@/services/tenders";
import usePopup from "@/hooks/usePopup";
import toast from "react-hot-toast";
import ApplicantViewModal from "../applicants/fragments/ApplicantViewModel";
import PETenderApplicationWizard from "../tenders/fragments/PETenderApplicationWizard";
import Select from "react-select";

export default function SubmittedApplication() {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [status, setStatus] = useState<any>("PENDING");
  const [comment, setComment] = useState<any>({ value: null, label: "Submitted" });
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [filter] = useState<any>();
  const [selectedApplication, setSelectedApplication] = useState<ISubmittedApplication | null>(null);
  const { userData } = useUserDataContext();  // Use the hook to get user data
  const userRole = userData?.role || "BIDDER";
  const { showConfirmation } = usePopup();

  // Fetch data using custom hook
  const { applications, isLoading, refetch } = useSubmittedApplication({
    page: page,
    search: search,
    sort: sort,
    filter: filter,
    status: status,
    comment: comment?.value
  });

  const deleteMutation = useMutation({
    mutationFn: (data: ISubmittedApplication) => deleteApplication(data.id),
    onSuccess: () => {
      refetch();
      toast.success("Tender deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "");
    }
  });

  const handleSorting = (field: string, direction: SortDirection) => {
    setSort(`${field},${direction.toLowerCase()}`);
  }

  const handleDelete = (content: ISubmittedApplication) => {
    showConfirmation({
      theme: "danger",
      title: "Delete Application",
      message: "This action cannot be undone. Please verify that you want to delete.",
      onConfirm: () => deleteMutation.mutate(content),
      onCancel: () => { }
    })
  }

  // JCM handle view &&
  const handleTenderActions = (action: "view" | "edit", content: ISubmittedApplication) => {
    if (action === "view") {
      setSelectedApplication(content);
      setViewOpen(true);
    } else if (action === "edit") {
      setSelectedApplication(content);
      setEditOpen(true);
    }
  }

  const handleSubmissions = (comment: any) => {
    setStatus(comment?.value === "ACCEPTED" ? "CLOSED":"SUBMITTED");
    setComment(comment);

  }


  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-bold">Submissions</h2>
        <Select
          options={[
            { value: "PENDING", label: "Pending" },
            { value: "SUBMITTED", label: "Submitted" },
            { value: "REJECTED", label: "Evaluated" },
            { value: "ACCEPTED", label: "Awarded" },
          ]}
          onChange={(e) => handleSubmissions({ value: e?.value, label: e?.label })}
          placeholder="Filter by"
          value={comment}
        />
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

        {/* Render the main table with application groups */}
        <Table
          columns={columns}
          data={applications?.content || []}
          isLoading={isLoading}
          hasSelection={false}
          hasActions={true}
          onSorting={handleSorting}
          actionSlot={(application: ISubmittedApplication) => {
            return (
              <div className="flex justify-center space-x-2">
                <button
                  className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                  onClick={() => handleTenderActions("view", application)}
                >
                  <IconEye size={20} />
                </button>
                <button
                  className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                  onClick={() => handleTenderActions("edit", application)}
                >
                  <IconEdit size={20} />
                </button>
                {userRole === "BIDDER" && application.tenderCloseDate > Date.now() && (
                  <>
                    <Fragment>
                      <button
                        title={application.status === "SUBMITTED" ? "Recover Application" : "Delete Application"}
                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                        onClick={() => handleDelete(application)}
                      >
                        {application.status === "SUBMITTED" ? (
                          <IconRecycle size={20} />
                        ) : (
                          <IconTrash size={20} />
                        )}
                      </button>
                    </Fragment>
                  </>
                )}
              </div>
            );
          }}
        />

        {/* Pagination control */}
        <div className="flex justify-between items-center p-4 lg:px-8">
          {applications?.pageable && (
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              pageCount={applications.totalPages}
            />
          )}
        </div>

        {/* View modal */}
        {viewOpen && selectedApplication && (
          <ApplicantViewModal
            applicant={selectedApplication}
            title="View Application"
            onClose={() => setViewOpen(false)}
            isLoading={false}
          />
        )}

        {/* Edit modal */}
        {editOpen && selectedApplication && (
          // <PETenderApplicationWizard
          //   tender={selectedApplication}
          //   onClose={() => setEditOpen(false)}
          // />
          <div></div>
        )}
      </div>
    </div>
  );
}
