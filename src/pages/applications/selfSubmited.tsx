import { Fragment, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/submittedColumsColumns";
import { ISubmittedApplication } from "@/types";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { useSubmittedApplication } from "@/hooks/useSubmittedApplications";
import { useUserDataContext } from "@/providers/userDataProvider";
import { deleteApplication } from "@/services/tenders";
import usePopup from "@/hooks/usePopup";
import toast from "react-hot-toast";

export default function SubmittedApplication() {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter] = useState<any>();
  const { userData } = useUserDataContext();  // Use the hook to get user data
  const userRole = userData?.role || "BIDDER";
  const { showConfirmation } = usePopup();

  // Fetch data using custom hook
  const { applications, isLoading, refetch } = useSubmittedApplication({
    page: page,
    search: search,
    sort: sort,
    filter: filter
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

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-bold">Application: Self Submited</h2>
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
                  onClick={() => ""}
                >
                  <IconEye size={20} />
                </button>
                {userRole === "BIDDER" && application.status === "PENDING" && (
                  <><Fragment>

                    <button
                      className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                      onClick={() => ""}
                    >
                      <IconEdit size={20} />
                    </button>
                  </Fragment>
                    <Fragment>

                      <button
                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-red-600"
                        onClick={() => handleDelete(application)}
                      >
                        <IconTrash size={20} />
                      </button>
                    </Fragment></>
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
      </div>
    </div>
  );
}
