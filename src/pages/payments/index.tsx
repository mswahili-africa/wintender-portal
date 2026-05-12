import { IconChecklist, IconFilterOff, IconSearch, IconSquareRoundedMinus } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/paymentsColumns";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { approvePayment, rejectPayment } from "@/services/payments";
import usePopup from "@/hooks/usePopup";
import PaymentsForm from "./fragments/paymentsForm";
import { useUserDataContext } from "@/providers/userDataProvider";
import { IPayment } from "@/types";
import { update } from "lodash";
import { getAllPayments } from "@/hooks/usePayments";
import { ExportXLSX } from "@/components/widgets/Excel";
import excelColumns from "./fragments/excelPaymentColumns";
import Button from "@/components/button/Button";
import PaymentDetailsModal from "./fragments/paymentDetailsModal";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";

export default function () {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter] = useState<any>();
  const { showConfirmation } = usePopup();
  const { t } = useTranslation();

  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

  const { payments, isLoading, refetch } = getAllPayments({
    page: page,
    search: search,
    sort: sort,
    filter: filter, // Pass the appropriate filter value
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
        approveMutation.mutate(payload.transactionReference);
        refetch();
      },
      onCancel: () => { },
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
    showConfirmation({
      theme: "danger",
      title: "Reject this payment?",
      message:
        "This action cannot be undone. Please verify that you want to reject.",
      onConfirm: () => {
        rejectMutation.mutate(payload.transactionReference);
        refetch();
      },
      onCancel: () => { },
    });
  }

  const { userData } = useUserDataContext();
  const userRole = userData?.role || "BIDDER";

  function setUpdate(update: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-semibold">{t("payments-header")}</h2>
        <div className="flex flex-row gap-4">
          {(userRole === "ACCOUNTANT" || userRole === "ADMINISTRATOR" || userRole === "MANAGER" || userRole === "SUPERVISOR") && (
            <>
              <ExportXLSX data={payments?.content || []} name={"Payments"} columns={excelColumns} />
              <PaymentsForm
                initials={update}
                onSuccess={() => {
                  setUpdate(update);
                  refetch();
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <div className="flex flex-row items-center gap-x-2">
            <input
              type="text"
              placeholder="Search"
              value={search}
              className="input-normal py-2 min-w-64 lg:w-1/4"
              onChange={(e) => setSearch(e.target.value)}
            />
            {
              search &&
              <Button
                type="button"
                label="Reset"
                icon={<IconFilterOff size={18} />}
                theme="secondary"
                size="sm"
                onClick={() => setSearch("")}
              />
            }
          </div>
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
                <Tooltip content={t("payments-view-button-tooltip")}>
                  <button
                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                    onClick={() => { setSelectedPayment(content); }}
                  >
                    <IconSearch size={20} />
                  </button>
                </Tooltip>
                {(userRole === "ADMINISTRATOR" || userRole === "ACCOUNTANT") &&
                  content.status == "PENDING" && (
                    <Fragment>
                      <Tooltip content={t("payments-approve-button-tooltip")}>
                        <button
                          className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                          onClick={() => handleApprove(content)}
                        >
                          <IconChecklist size={20} />
                        </button>
                      </Tooltip>
                      <Tooltip content={t("payments-reject-button-tooltip")}>
                        <button
                          className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                          onClick={() => reject(content)}
                        >
                          <IconSquareRoundedMinus size={20} />
                        </button>
                      </Tooltip>
                    </Fragment>
                  )}
              </div>
            );
          }}
        />

        <div className="flex justify-end items-center p-4 lg:px-8">
          {payments?.pageable && (
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              pageCount={payments.totalPages}
            />
          )}
        </div>

        {/* payment details */}
        {
          selectedPayment && <PaymentDetailsModal
            payment={selectedPayment}
            loading={false}
            onClose={() =>
              setSelectedPayment(null)
            } />
        }
      </div>
    </div>
  );
}
