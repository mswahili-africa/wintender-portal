import { IconSquareRoundedMinus } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/controlNumberColumns";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { getUserRole } from "@/utils";
import { IControlNumber } from "@/types";
import { deleteDoForMe } from "@/services/tenders";
import useControlNumber from "@/hooks/useControlNumber";

export default function ContrlNumbers () {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter, setFilter] = useState<any>();
  const { showConfirmation } = usePopup();
  const { controlNumbers, isLoading, refetch } = useControlNumber({
    page: page,
    search: search,
    sort: sort,
    filter: filter,
  });
  const handleSorting = (field: string, direction: SortDirection) => {
    setSort(`${field},${direction.toLowerCase()}`);
  };

  const deteleMutation = useMutation({
    mutationFn: (doItForMeId: string) => deleteDoForMe(doItForMeId),
    onSuccess: (res) => {
      toast.success("Request deleted successful");
      refetch();
    },
    onError: (error: any) => {
      toast.error("Delete failed");
    },
  });


  const reject = (payload: IControlNumber) => {
    showConfirmation({
      theme: "danger",
      title: "Delete this request?",
      message:
        "This action cannot be undone. Please verify that you want to delete.",
      onConfirm: () => {
        deteleMutation.mutate(payload.doForMeApplication?.id);
        refetch();
      },
      onCancel: () => {},
    });
  };

  const userRole = getUserRole();

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-semibold">Requests</h2>
      </div>

      <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <input
            type="text"
            placeholder="Search"
            className="input-normal py-2 w-1/2 lg:w-1/4"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          data={controlNumbers ? controlNumbers.content : []}
          isLoading={isLoading}
          hasSelection={true}
          hasActions={true}
          onSorting={handleSorting}
          actionSlot={(content: IControlNumber) => {
            return (
              <div className="flex justify-center items-center space-x-3">
                {userRole === "BIDDER" &&
                  content.status == "REQUESTED" && (
                    <Fragment>
                      <button
                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                        onClick={() => reject(content)}
                      >
                        <IconSquareRoundedMinus size={20} />
                      </button>
                    </Fragment>
                  )}
                  {userRole === "MANAGER" &&
                  content.status != "REQUESTED" && (
                    <Fragment>
                      <button
                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                        onClick={() => reject(content)}
                      >
                        <IconSquareRoundedMinus size={20} />
                      </button>
                    </Fragment>
                  )}
              </div>
            );
          }}
        />

        <div className="flex justify-between items-center p-4 lg:px-8">
          <div></div>

          {controlNumbers?.pageable && (
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              pageCount={controlNumbers.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
