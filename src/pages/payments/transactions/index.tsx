import { IconAlertCircle, IconArrowDownLeft, IconArrowUpRight, IconCalendar, IconCheck, IconChecklist, IconCircleCheck, IconFilter, IconReceipt, IconRecycle, IconSearch, IconSquareRoundedMinus, IconTrendingDown, IconTrendingUp, IconWallet } from "@tabler/icons-react";
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
import { IlistResponse, IPayment, IPaymentSummary, ISummaryReport } from "@/types";
import { update } from "lodash";
import { getAllPayments } from "@/hooks/usePayments";
import { ExportXLSX } from "@/components/widgets/Excel";
import excelColumns from "./fragments/excelPaymentColumns";
import Button from "@/components/button/Button";
import PaymentDetailsModal from "./fragments/paymentDetailsModal";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";
import Select from "react-select";
import { PaymentStatus } from "@/types/statuses";

export default function () {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter, setFilter] = useState<Record<string, any>>();
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

  const addFilter = (key: string, value: any) => {
    // Check if the key already exists in the filter object
    if (filter && filter[key]) {
      // Update the value of the existing key
      setFilter(update(filter, key, () => value));
    } else {
      // Add a new key-value pair to the filter object
      setFilter(prevFilter => {
        const newFilter = { ...prevFilter, [key]: value };
        return newFilter;
      });
    }
  };

  const resetFilter = () => {
    setSearch(undefined);
    setFilter(undefined);
    setSort("createdAt,desc");
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

      {
        ['ADMINISTRATOR', 'MANAGER', 'ACCOUNTANT'].includes(userRole) &&
        <div className="my-10">
          <PaymentSummarySection summary={payments?.summary as unknown as IPaymentSummary} />
        </div>
      }

      <div className="flex justify-between items-center mb-10">

        {/* <h2 className="text-lg font-semibold">{t("payments-header")}</h2> */}
        <h2 className="text-lg font-semibold">Transactions Record</h2>

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
          <div className="flex flex-row gap-x-2">
            <Select
              options={[
                { value: "userName", label: "User" },
                { value: "companyName", label: "Company" },
                { value: "createdAt", label: "Date" },
                { value: "amount", label: "Amount" }
              ]}
              // options={difmApplicationColumnSearchOptions.filter((option: any) => option.value !== "bidderCompanyName")}
              // value={difmApplicationColumnSearchOptions.find((option: any) => option.value === filterQuery?.searchKey)}
              // onChange={(selectedOption) => setFilterQuery({ ...filterQuery, searchKey: selectedOption?.value })}
              placeholder="Search by"
              className="w-[200px] p-0"
            />
            <input
              type="text"
              placeholder="Search"
              // value={filterQuery?.searchValue || ""}
              className="input-normal w-[200px] lg:w-[300px]"
              // onChange={(e) => setFilterQuery({ ...filterQuery, searchValue: e.target.value })} // Update search query
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
          <div className="flex gap-x-2">
            <select
              className="input-normal w-full sm:w-36"
              // value={filterQuery?.status || ""}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">STATUS</option>
              {
                Object.entries(PaymentStatus).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))
              }
            </select>

            <Button
              type="button"
              label="Filter"
              icon={<IconFilter size={18} />}
              // onClick={handleFilterSubmit}
              theme="info"
              size="sm"
            />
            {/* {
              (filterQuery?.searchValue || filterQuery?.status || filterQuery?.searchKey !== 'title') && ( */}
            <Button
              type="button"
              label="Reset"
              icon={<IconRecycle size={18} />}
              onClick={resetFilter}
              theme="warning"
              size="sm"
            />
            {/* )
            } */}

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
                {["ADMINISTRATOR", "ACCOUNTANT"].includes(userRole) &&
                  content.status == "PENDING" && content.source == "POS" && (
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
              totalElements={payments.totalElements}
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


interface IProps {
  summary: IPaymentSummary;
  currency?: string;
}

export function PaymentSummarySection({ summary, currency = "TZS" }: IProps) {
  if(!summary) return null
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-TZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);

  const isIncrease = summary?.monthlyChangeDirection === "INCREASE";

  return (
    <div className="w-full space-y-4">

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Financial & Payment Summary
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time wallet balance, volume trends, and transaction health metrics
          </p>
        </div>

        {/* Current Balance Quick Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl shadow-2xs self-start sm:self-auto">
          <IconWallet size={18} className="text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Wallet Balance</span>
            <span className="text-sm font-black font-mono leading-tight text-emerald-400">
              {formatCurrency(summary.walletBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* CARD 1: Current Month Payments (Hero Focus) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 text-white shadow-md border border-slate-800 flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                This Month's Payments
              </span>
              <span className="p-2 bg-white/10 rounded-xl text-emerald-400 backdrop-blur-xs">
                <IconReceipt size={18} />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                {formatCurrency(summary.currentMonthPayments)}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1 font-bold ${isIncrease ? "text-emerald-400" : "text-rose-400"}`}>
              {isIncrease ? <IconTrendingUp size={16} /> : <IconTrendingDown size={16} />}
              <span>{summary.monthlyPercentageChange}%</span>
              <span className="text-slate-400 font-normal">vs prev month</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">{formatCurrency(summary.previousMonthPayments)}</span>
          </div>
        </div>

        {/* CARD 2: Total Successful Payments Volume */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Successful Volume
              </span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <IconCircleCheck size={18} />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                {formatCurrency(summary.totalSuccessfulPayments)}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Successful volume collected</span>
            <span className="font-mono font-bold text-slate-800">{summary.successfulTransactions.toLocaleString()} txns</span>
          </div>
        </div>

        {/* CARD 3: Success Rate & Transaction Health */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Success Rate
              </span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <IconCheck size={18} />
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                {summary.successRate}%
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {summary.totalTransactions.toLocaleString()} Total Txns
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${summary.successRate}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
              <span className="text-emerald-600 font-semibold">{summary.successfulTransactions} Passed</span>
              <span className="text-rose-500 font-semibold">{summary.nonSuccessfulTransactions} Failed</span>
            </div>
          </div>
        </div>

        {/* CARD 4: Total Wallet Out (Cash Out / Expenses) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Wallet Out
              </span>
              <span className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <IconArrowUpRight size={18} />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                {formatCurrency(summary.totalWalletOut)}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Payouts & Transfers</span>
          </div>
        </div>

      </div>

      {/* 3. Bottom Breakdown Strip: Inflows vs Outflows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Wallet Inflow Card */}
        <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <IconArrowDownLeft size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Total Wallet In (Inflow)
              </p>
              <p className="text-lg font-black font-mono text-emerald-950 mt-0.5">
                {formatCurrency(summary.totalWalletIn)}
              </p>
            </div>
          </div>
        </div>

        {/* Failed / Non-Successful Breakdown Card */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <IconAlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Non-Successful Attempts
              </p>
              <p className="text-lg font-black font-mono text-slate-900 mt-0.5">
                {summary.nonSuccessfulTransactions.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-500">transactions</span>
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
