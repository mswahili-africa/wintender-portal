import { IconArrowUpRight, IconCalendar, IconCheck, IconChecklist, IconClock, IconFilter, IconFilterOff, IconReceipt, IconRecycle, IconReportAnalytics, IconSearch, IconSquareRoundedMinus, IconTrendingUp } from "@tabler/icons-react";
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
          <TransactionsSummary />
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


function TransactionsSummary() {
  const [selectedMonth, setSelectedMonth] = useState('2026-07');

  // Example data payload (Replace with dynamic props/API data)
  const stats = {
    monthlyVolume: 128450.00,
    monthlyVolumeChange: +14.2, // % vs last month
    monthlyCount: 1420,

    overallVolume: 1845200.50,
    overallVolumeChange: +22.8, // % vs last year
    overallCount: 18940,

    successfulRate: 98.4,
    avgTransactionValue: 90.45,
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TZS' }).format(val);

  return (
    <div className="w-full space-y-4">

      {/* 1. Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Transaction Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Summary performance metrics and total processed volume
          </p>
        </div>

        {/* Month Selector Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-05">May 2026</option>
            </select>
            <IconCalendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Main Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* CARD 1: Monthly Volume (Primary Focus) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 text-white shadow-md border border-slate-800 flex flex-col justify-between">
          {/* Background Decorative Glow */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Monthly Volume
              </span>
              <span className="p-2 bg-white/10 rounded-xl text-emerald-400 backdrop-blur-xs">
                <IconReceipt size={18} />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                {formatCurrency(stats.monthlyVolume)}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-bold text-emerald-400">
              <IconTrendingUp size={16} />
              <span>+{stats.monthlyVolumeChange}%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
            <span className="text-slate-400 font-medium">{stats.monthlyCount.toLocaleString()} txns</span>
          </div>
        </div>

        {/* CARD 2: Overall Total Volume */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Volume
              </span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <IconArrowUpRight size={18} />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                {formatCurrency(stats.overallVolume)}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 font-bold text-emerald-600">
              <IconTrendingUp size={16} />
              <span>+{stats.overallVolumeChange}%</span>
              <span className="text-slate-400 font-normal">all-time</span>
            </div>
            <span className="text-slate-500 font-semibold">{stats.overallCount.toLocaleString()} total</span>
          </div>
        </div>

        {/* CARD 3: Success Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Success Rate
              </span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <IconCheck size={18} />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                {stats.successfulRate}%
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            {/* Visual Mini Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.successfulRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 4: Avg Transaction Size */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Avg. Ticket Size
              </span>
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <IconClock size={18} />
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                {formatCurrency(stats.avgTransactionValue)}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Per successful transaction</span>
          </div>
        </div>

      </div>
    </div>
  );
}
