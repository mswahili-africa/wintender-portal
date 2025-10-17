import { useState } from "react";
import { useUserDataContext } from "@/providers/userDataProvider";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/applicationGroupColumns";
import ApplicationsList from "./fragments/Applications";
import { IApplicationGroup } from "@/types";
import { IconEye, IconFile } from "@tabler/icons-react";
import { getAllApplicationsGroup } from "@/hooks/useApplicationsGroup";
import Tabs from "@/components/widgets/Tabs";
import DIFMapplications from "./fragments/DIFMApplications";
import { useNavigate } from "react-router-dom";
import useApplicationsList from "@/hooks/useApplicationsList";
import PrivateTenderRequestButton from "./fragments/privateTenderRequestButton";

export default function ApplicationGroups() {
  const { userData } = useUserDataContext();
  const userRole = userData?.role || "BIDDER";
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("updatedAt,desc");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroupList, setSelectedGroupList] = useState<IApplicationGroup | null>(null); // Track selected group

  // Fetch data using custom hook
  const { applicationGroupList, isLoading, refetch } = getAllApplicationsGroup({
    page,
    search,
    sort,
    filter: undefined,
  });

  // Handle sorting of table columns
  const handleSorting = (field: string, direction: SortDirection) => {
    setSort(`${field},${direction.toLowerCase()}`);
  };

  // Handle opening the ApplicationsList modal
  const handleViewApplications = (group: IApplicationGroup) => {
    setSelectedGroupList(group);
    setIsGroupModalOpen(true);
  };


  // Invoice generation logic (moved to ApplicationInvoice.tsx)
  // const viewProfomaInvoice = (id: string) => {
  //   // filter applications based on status
  //   const { applicationList, isLoading, refetch } = useApplicationsList({
  //     applicationGroup: null,
  //     groupId: "e0c7d6a4-7b5a-4f7f-9a7e-9e0a9e0a9e0a", // Dummy ID for all applications
  //     page,
  //     search,
  //     sort,
  //     filter: undefined,
  //     visibility: "all"
  //   });


  //   navigate(`/application-profoma-invoice`, {
  //     state: { applicationGroupData: applicationGroup, applicationData: application }
  //   });
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-bold">Application: Do it For Me</h2>
        {userRole !== "BIDDER" && (
          <PrivateTenderRequestButton onSuccess={refetch} />
        )}
      </div>

      {userData?.role === "BIDDER" ? (
        <div className="border border-slate-200 bg-white rounded-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-200">
            <input
              type="text"
              placeholder="Search"
              className="input-normal py-2 w-1/2 lg:w-1/4"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Per Bidder Table */}
          <Table
            columns={columns}
            data={applicationGroupList?.content || []}
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

          {/* Modal for applications */}
          {isGroupModalOpen && selectedGroupList && (
            <ApplicationsList
              applicationGroup={selectedGroupList}
              groupId={selectedGroupList.id}
              onClose={() => {
                setSelectedGroupList(null);
                setIsGroupModalOpen(false);
              }}
              onRefetch={refetch}
            />
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 lg:px-8">
            {applicationGroupList?.pageable && (
              <Pagination
                currentPage={page}
                setCurrentPage={setPage}
                pageCount={applicationGroupList.totalPages}
              />
            )}
          </div>
        </div>
      ) : (
        <Tabs panels={["Per bidder", "All applications"]}>
          <>
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
                data={applicationGroupList?.content || []}
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

              {isGroupModalOpen && selectedGroupList && (
                <ApplicationsList
                  applicationGroup={selectedGroupList}
                  groupId={selectedGroupList.id}
                  onClose={() => {
                    setSelectedGroupList(null);
                    setIsGroupModalOpen(false);
                  }}
                  onRefetch={refetch}
                />
              )}

              <div className="flex justify-between items-center p-4 lg:px-8">
                {applicationGroupList?.pageable && (
                  <Pagination
                    currentPage={page}
                    setCurrentPage={setPage}
                    pageCount={applicationGroupList.totalPages}
                  />
                )}
              </div>
            </div>
          </>

          <DIFMapplications />
        </Tabs>
      )}


    </div>
  );
}
