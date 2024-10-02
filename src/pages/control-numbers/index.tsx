import { IconEye, IconSquareRoundedMinus } from "@tabler/icons-react";
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
import TenderViewModelDoItForMe from "./fragments/tenderViewModelDoItForMe";
import Chip from "@/components/chip/Chip";
import Button from "@/components/button/Button";

export default function ContrlNumbers () {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter] = useState<any>();
  const [selectedTender, setSelectedTender] = useState<IControlNumber | null>(null);
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

  const handleView = (content: IControlNumber) => {
    setSelectedTender(content);
  }

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
          hasSelection={false}
          hasActions={true}
          onSorting={handleSorting}
          actionSlot={(content: IControlNumber) => {
            return (
              <div className="flex justify-center items-center space-x-3">
                <button
                  className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                  onClick={() => handleView(content)}
                >
                  <IconEye size={20} />
                </button>
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

      {selectedTender && (
        <TenderViewModelDoItForMe
          title={selectedTender.doForMeApplication.tender.tenderNumber}
          onClose={() => setSelectedTender(null)}
        >
          <div className="space-y-4">
            {/* Tender Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedTender.doForMeApplication.tender.title}</h3>
            </div>

            {/* Tender Details */}
            <div className="space-y-2">
              <div className="flex items-center">
                <p className="flex-1">{selectedTender.doForMeApplication.tender.entity.name}</p>
              </div>
              <div className="flex items-center">
                <strong className="w-32 text-gray-600">Category:</strong>
                <p className="flex-1">{selectedTender.doForMeApplication.tender.category.name}</p>
              </div>
              <div className="flex items-center">
                <p className="flex-1">{selectedTender.doForMeApplication.tender.summary}</p>
              </div>

              <div className="flex items-center">
                <strong className="w-32 text-gray-600">Status:</strong>
                <Chip label={(() => {
                  const currentDate = new Date().getTime();
                  const closeDate = selectedTender.doForMeApplication.tender.closeDate;
                  const remainingTime = closeDate - currentDate;
                  const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

                  return remainingDays <= 2 ? 'CLOSING' : selectedTender.status;
                })()} size="sm" theme="success" />
              </div>
              <div className="flex items-center">
                <strong className="w-32 text-gray-600">Close Date:</strong>
                <p className="flex-1">{new Date(selectedTender.doForMeApplication.tender.closeDate).toLocaleString()}</p>
              </div>
            </div>

            <hr></hr>

            {/* PDF Viewer */}
            <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <iframe
                src={selectedTender.doForMeApplication.tender.filePath}
                width="100%"
                height="500px"
                frameBorder="0"
                title="Tender Document"
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button label="Close" size="sm" theme="danger" onClick={() => setSelectedTender(null)} />
            </div>
          </div>
        </TenderViewModelDoItForMe>
      )}
    </div>
  );
}
