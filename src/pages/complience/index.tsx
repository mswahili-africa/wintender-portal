import { IconEye, IconSquareRoundedMinus } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import Pagination from "@/components/widgets/table/Pagination";
import { SortDirection, Table } from "@/components/widgets/table/Table";
import columns from "./fragments/documentColumns";
import useCompanyDocuments from "@/hooks/useCompanyDocuments";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import usePopup from "@/hooks/usePopup";
import { ICompanyDocuments } from "@/types";
import { deleteDocument } from "@/services/entities";
import { authStore } from "@/store/auth";
import { useSnapshot } from "valtio";
import DocumentUpload from "./fragments/uploadDocumentForm";
import DocumentViewModal from "./fragments/documentViewModel";
import Button from "@/components/button/Button";
import { useTranslation } from "react-i18next";
import Tooltip from "@/components/tooltip/Tooltip";

export default function CompanyDocuments() {

  const auth = useSnapshot(authStore);

  const account = auth?.user?.account || "";

  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>();
  const [sort, setSort] = useState<string>("createdAt,desc");
  const [filter] = useState<any>();
  const { showConfirmation } = usePopup();
  const [selectedDocument, setSelectedDocument] = useState<ICompanyDocuments | null>(null);
  const { t } = useTranslation();

  const { documents, isLoading, refetch } = useCompanyDocuments({
    page: page,
    search: search,
    sort: sort,
    filter: filter,
    account,
  });
  const handleSorting = (field: string, direction: SortDirection) => {
    setSort(`${field},${direction.toLowerCase()}`);
  };

  const deteleMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: (res) => {
      toast.success("Deleted successful");
      refetch();
    },
    onError: (error: any) => {
      toast.error("Delete failed");
    },
  });


  const reject = (payload: ICompanyDocuments) => {
    showConfirmation({
      theme: "danger",
      title: "Delete this document?",
      message:
        "This action cannot be undone. Please verify that you want to delete.",
      onConfirm: () => {
        deteleMutation.mutate(payload.id);
        refetch();
      },
      onCancel: () => { },
    });
  };

  const handleView = (content: ICompanyDocuments) => {
    setSelectedDocument(content);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-semibold">{t("documents-header")}</h2>
        <DocumentUpload
          onSuccess={() => {
            refetch();
          }}
        />
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
          data={documents ? documents.content : []}
          isLoading={isLoading}
          hasSelection={false}
          hasActions={true}
          onSorting={handleSorting}
          actionSlot={(content: ICompanyDocuments) => {
            return (
              <div className="flex justify-center items-center space-x-3">
                <Tooltip content={t("documents-view-button-tooltip")}>
                  <button
                    className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-blue-600"
                    onClick={() => handleView(content)}
                  >
                    <IconEye size={20} />
                  </button>
                </Tooltip>
                <Fragment>
                  <Tooltip content={t("documents-delete-button-tooltip")}>
                    <button
                      className="flex items-center text-xs xl:text-sm text-slate-600 hover:text-green-600"
                      onClick={() => reject(content)}
                    >
                      <IconSquareRoundedMinus size={20} />
                    </button>
                  </Tooltip>
                </Fragment>
              </div>
            );
          }}
        />

        <div className="flex justify-between items-center p-4 lg:px-8">
          <div></div>

          {documents?.pageable && (
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              pageCount={documents.totalPages}
            />
          )}
        </div>
      </div>

      {selectedDocument && (
        <DocumentViewModal
          documentType={selectedDocument.documentType}
          onClose={() => setSelectedDocument(null)}
        >
          <div className="space-y-4">
            {/* Tender Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedDocument.documentNumber}</h3>
            </div>

            {/* PDF Viewer */}
            <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <iframe
                src={selectedDocument.filePath}
                width="100%"
                height="500px"
                frameBorder="0"
                title="Tender Document"
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button label="Close" size="sm" theme="danger" onClick={() => setSelectedDocument(null)} />
            </div>
          </div>
        </DocumentViewModal>
      )}

    </div>
  );
}

