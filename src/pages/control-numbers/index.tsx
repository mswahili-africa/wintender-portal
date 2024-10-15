import { IconEdit, IconEye, IconSquareRoundedMinus } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/controlNumberColumns";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { getUserRole } from "@/utils";
import { IControlNumber } from "@/types";
import { deleteDoForMe, updatePrincipleAmount } from "@/services/tenders";
import useControlNumber from "@/hooks/useControlNumber";
import TenderViewModelDoItForMe from "./fragments/tenderViewModelDoItForMe";
import Chip from "@/components/chip/Chip";
import Button from "@/components/button/Button";
import PrivateTenderRequest from "./fragments/privateRequestForm";

export default function ContrlNumbers() {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter] = useState<any>();
  const [selectedTender, setSelectedTender] = useState<IControlNumber | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [editAmount, setEditAmount] = useState<number | null>(null);  // For editing principal amount
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

  const updateAmountMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string, amount: number }) => updatePrincipleAmount(id, amount),
    onSuccess: () => {
      toast.success("Principal amount updated");
      refetch();
      setIsEditModalOpen(false);  // Close modal after success
    },
    onError: () => {
      toast.error("Update failed");
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
      onCancel: () => { },
    });
  };

  // Edit Principal Amount Handler
  const handleEdit = (content: IControlNumber) => {
    setIsTenderModalOpen(false);
    setEditAmount(content.principleAmount);
    setSelectedTender(content);
    setIsEditModalOpen(true);
  };


  const handleUpdate = () => {
    if (selectedTender && editAmount !== null) {

      setIsEditModalOpen(false);
      showConfirmation({
        theme: "danger",
        title: "Change",
        message:
          "Are you sure you want to change amount?",
        onConfirm: () => {
          updateAmountMutation.mutate({ id: selectedTender.doForMeApplication.id, amount: editAmount });
          refetch();
        },
        onCancel: () => { },
      });

    }
  };

  // View Tender Details
  const handleView = (content: IControlNumber) => {
    setIsEditModalOpen(false);
    setSelectedTender(content);
    setIsTenderModalOpen(true);  // Open tender view modal
  };

  const userRole = getUserRole();

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-bold">Requests</h2>
        {(userRole === "BIDDER") && (
          <PrivateTenderRequest
            onSuccess={() => {
              refetch();
            }}
          />
        )}
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
                      <button className="text-red-600 hover:text-red-700" onClick={() => reject(content)}>
                        <IconSquareRoundedMinus size={20} />
                      </button>
                    </Fragment>
                  )}
                {(userRole === "MANAGER" || userRole === "ADMINISTRATOR") &&
                  content.status == "REQUESTED" && (
                    <Fragment>
                      <button className="hover:text-green-700" onClick={() => handleEdit(content)}>
                        <IconEdit size={20} />
                      </button>
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


      {/* Edit Modal */}
      {isEditModalOpen && selectedTender && (
        <div className="fixed inset-0 flex items-center justify-center z-50">  {/* Add overlay for better visibility */}
          <div className="modal-content bg-green-100 rounded-lg shadow-lg w-[400px] p-4">
            <h3 className="font-bold text-lg mb-4">Edit Consultation Fee</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-600">Principal Amount</label>
              <input
                type="number"
                value={editAmount ?? ""}
                onChange={(e) => setEditAmount(Number(e.target.value))}
                className="input-normal w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button label="Cancel" theme="danger" onClick={() => setIsEditModalOpen(false)} />
              <Button label="Save" theme="primary" onClick={handleUpdate} />
            </div>
          </div>
        </div>
      )}

      {isTenderModalOpen && selectedTender && (
        <TenderViewModelDoItForMe
          tenderGroup={selectedTender.doForMeApplication.tender.tenderGroup}
          onClose={() => setSelectedTender(null)}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <strong className="w-32 text-gray-600">Bidder:</strong>
              <h3 className="text-l font-semi-bold text-gray-800"><strong className="w-32 text-gray-600">{selectedTender.doForMeApplication.user.account}</strong> : {selectedTender.doForMeApplication.user.company.name}</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <strong className="w-32 text-gray-600">Phone:</strong>
              <a href={`tel:${selectedTender.doForMeApplication.user.company.primaryNumber}`} className="text-l font-semi-bold text-gray-800">
                {selectedTender.doForMeApplication.user.company.primaryNumber}
              </a>
            </div>
            <div className="flex items-center justify-between mb-4">
              <strong className="w-32 text-gray-600">Email:</strong>
              <a href={`mailto:${selectedTender.doForMeApplication.user.company.email}`} className="text-l font-semi-bold text-gray-800">
                {selectedTender.doForMeApplication.user.company.email}
              </a>
            </div>

          </div>

          <hr></hr>
          <br></br>

          <div className="space-y-4">
            {/* Tender Header */}
            <div className="flex items-center justify-between mb-4">
              <strong className="w-32 text-gray-600">Title:</strong>
              <h3 className="flex-1 font-bold text-gray-800">{selectedTender.doForMeApplication.tender.tenderNumber} : {selectedTender.doForMeApplication.tender.title}</h3>
            </div>

            {/* Tender Details */}
            <div className="space-y-2">
              <div className="flex items-center">
                <strong className="w-32 text-gray-600">PE:</strong>
                <p className="flex-1 font-bold text-gray-800">{selectedTender.doForMeApplication.tender.entity.name.toUpperCase()}</p>
              </div>
              <div className="flex items-center">
                <strong className="w-32 text-gray-600">Category:</strong>
                <p className="flex-1">{selectedTender.doForMeApplication.tender.category.name}</p>
              </div>
              <div className="flex items-center">
                <strong className="w-32 text-gray-600">Summary:</strong>
                <p className="flex-1">{selectedTender.doForMeApplication.tender.summary}</p>
              </div>

              <div className="flex items-center">
                <strong className="w-32 text-gray-600">Status:</strong>
                <Chip
                  label={(() => {
                    const currentDate = new Date().getTime();
                    const closeDate = selectedTender.doForMeApplication.tender.closeDate;
                    const remainingTime = closeDate - currentDate;
                    const remainingDays = remainingTime / (1000 * 60 * 60 * 24);

                    // Determine the label based on the remaining days
                    if (remainingDays < 0) {
                      return 'CLOSED';
                    } else if (remainingDays <= 2) {
                      return 'CLOSING';
                    } else {
                      return selectedTender.status;
                    }
                  })()}
                  size="sm"
                  theme="success"
                />
              </div>

              <div className="flex items-center">
                <strong className="w-32 text-gray-600">Close Date:</strong>
                <p className="flex-1">{new Date(selectedTender.doForMeApplication.tender.closeDate).toLocaleString()}</p>
              </div>

              <br></br>
              <hr></hr>
              <div className="flex items-center">
                <strong className="w-50 text-gray-600">Consultation Fee:</strong>
                <p className="flex-1">
                  <strong className="w-40 text-gray-600">
                    TZS {new Intl.NumberFormat().format(selectedTender.principleAmount)}
                  </strong>
                </p>
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
