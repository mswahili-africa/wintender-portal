import { useState } from "react";
import { debounce } from "lodash";
import { getUserRole } from "@/utils";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import useApplications from "@/hooks/useApplications";
import columns from "./fragments/applicationGroupColumns";
import PrivateTenderRequest from "./fragments/privateRequestForm";
import ApplicationsList from "./fragments/Applications";
import { IApplicationGroup } from "@/types";
import { IconEye } from "@tabler/icons-react";



export default function ApplicationGroups() {
  const userRole = getUserRole();
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("updatedAt,desc");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [selectedGroup, setSelectedGroup] = useState<IApplicationGroup | null>(null); // Track selected group

  // Fetch data using custom hook
  const { applicationGroup, isLoading, refetch } = useApplications({
    page,
    search,
    sort,
    filter: undefined,
  });

  // Handle sorting of table columns
  const handleSorting = (field: string, direction: SortDirection) => {
    setSort(`${field},${direction.toLowerCase()}`);
  };

  // Toggle expanded row state
  const handleGroupClick = (groupId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [groupId]: !prev[groupId], // Toggle expanded state for the clicked group
    }));
  };

  // Handle opening the ApplicationsList modal
  const handleViewApplications = (group: IApplicationGroup) => {
    setSelectedGroup(group);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-bold">Application</h2>
        {userRole === "BIDDER" && (
          <PrivateTenderRequest onSuccess={refetch} />
        )}
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
          data={applicationGroup?.content || []}
          isLoading={isLoading}
          hasSelection={false}
          hasActions={true}
          onSorting={handleSorting}
          actionSlot={(applicationGroup: IApplicationGroup) => (
            <div className="flex space-x-2">
              <button onClick={() => handleViewApplications(applicationGroup)}>
                <IconEye size={20} />
              </button>
            </div>
          )}
        />

        {/* Modal to display selected group's applications */}
        {selectedGroup && (
          <ApplicationsList
            applicationGroup={selectedGroup}
            applicationList={selectedGroup.application}
            onClose={() => setSelectedGroup(null)} // Close the modal
            onRefetch={refetch} // Pass the refetch function
          />
        )}

        {/* Pagination control */}
        <div className="flex justify-between items-center p-4 lg:px-8">
          {applicationGroup?.pageable && (
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              pageCount={applicationGroup.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
