import Loader from "@/components/spinners/Loader";
import Pagination from "@/components/widgets/table/Pagination";
import { Table } from "@/components/widgets/table/Table";
import useApplicationsList from "@/hooks/useApplicationsList";
import { IApplications } from "@/types";
import { DIFMStatusOptions } from "@/types/statuses";
import { IconFile } from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";
import Tooltip from "@/components/tooltip/Tooltip";
import { useNavigate } from "react-router-dom";
import InvoiceListColumns from "./fragments/InvoiceListColumns";

export const InvoicePage = () => {
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string>("updatedAt,desc");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // Fetch data using custom hook
  const { applicationList, isLoading } = useApplicationsList({
    applicationGroup: null,
    groupId: "e0c7d6a4-7b5a-4f7f-9a7e-9e0a9e0a9e0a", // Dummy ID for all applications
    page,
    search,
    sort,
    status,
    filter: undefined,
    visibility: "all"
  });



  const viewProfomaInvoice = (application: IApplications) => {
    navigate(`/application-profoma-invoice`, {
      state: { applicationGroupData: [], applicationData: application }
    });
  };



  return (
    <div className="modal-content rounded-lg shadow-lg p-4 z-60"> {/* Set max height and overflow */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{t("difm-tabs-all-applications-header")}</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="input-normal w-full"
            onChange={(e) => setSearch(e.target.value)} // Update search query
          />
          <select
            className={`input-normal w-full sm:w-3/4`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status</option>
            {
              DIFMStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            }
          </select>
        </div>
      </div>


      {isLoading ? (
        <Loader />
      ) : (
        <Table
          columns={InvoiceListColumns}
          data={applicationList?.content || []}
          isLoading={isLoading}
          hasSelection={false}
          hasActions={true}
          actionSlot={(applicationList: IApplications) => (
            <div className="flex justify-center items-center space-x-3">
              <Tooltip content={t("difm-application-invoice-generator-button-tooltip")}>
                <button
                  className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                  onClick={() => viewProfomaInvoice(applicationList)}
                >
                  <IconFile size={20} />
                </button>
              </Tooltip>
            </div>
          )}
        />
      )}


      <div className="flex justify-between items-center p-4 lg:px-8">
        {applicationList?.pageable && (
          <Pagination
            currentPage={page}
            setCurrentPage={setPage}
            pageCount={applicationList.totalPages}
          />
        )}
      </div>
    </div>
  )
}
