import { IconChecklist, IconSquareRoundedMinus } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/paymentsColumns";
import usePayments from "@/hooks/usePayments";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { approvePayment, rejectPayment } from "@/services/payments";
import usePopup from "@/hooks/usePopup";
import PaymentsForm from "./fragments/paymentsForm";
import { getUserRole } from "@/utils";
import { IPayment } from "@/types";
import { update } from "lodash";

export default function () {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter] = useState<any>();
  const { showConfirmation } = usePopup();
  const { payments, isLoading, refetch } = usePayments({
    page: page,
    search: search,
    sort: sort,
    filter: filter,
  });
  const handleSorting = (field: string, direction: SortDirection) => {
    setSort(`${field},${direction.toLowerCase()}`);
  };
  const approveMutation = useMutation({
    mutationFn: (paymentId: string) => approvePayment(paymentId),
    onSuccess: (res) => {
      toast.success("Approved successful");
      refetch();
    },
    onError: (error: any) => {
      toast.error("Approve failed");
    },
  });
  const handleApprove = (payload: IPayment) => {
    showConfirmation({
      theme: "danger",
      title: "Approve this payment?",
      message:
        "This action cannot be undone. Please verify that you want to approve.",
      onConfirm: () => {
        approveMutation.mutate(payload.id);
        refetch();
      },
      onCancel: () => {},
    });
  };
  const rejectMutation = useMutation({
    mutationFn: (paymentId: string) => rejectPayment(paymentId),
    onSuccess: (res) => {
      toast.success("Payment rejected successful");
      refetch();
    },
    onError: (error: any) => {
      toast.error("Payment rejection failed");
    },
  });

  const reject = (payload: IPayment) => {
    rejectMutation.mutate(payload.id);
  };

  const userRole = getUserRole();

  function setUpdate(update: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-semibold">Payments</h2>
        {(userRole === "ACCOUNTANT" || userRole === "ADMINISTRATOR" || userRole === "MANAGER") && (
          <PaymentsForm
            initials={update}
            onSuccess={() => {
              setUpdate(update);
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
          data={payments ? payments.content : []}
          isLoading={isLoading}
          hasSelection={false}
          hasActions={true}
          onSorting={handleSorting}
          actionSlot={(content: IPayment) => {
            return (
              <div className="flex justify-center items-center space-x-3">
                {(userRole === "ADMINISTRATOR" || userRole === "MANAGER") &&
                  content.status == "PENDING" && (
                    <Fragment>
                      <button
                        className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                        onClick={() => handleApprove(content)}
                      >
                        <IconChecklist size={20} />
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

          {payments?.pageable && (
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              pageCount={payments.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
