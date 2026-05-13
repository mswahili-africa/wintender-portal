import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";
import type { ReactPaginateProps } from "react-paginate";
import * as ReactPaginateModule from "react-paginate";

const ReactPaginate =
  (ReactPaginateModule as any).default?.default ||
  (ReactPaginateModule as any).default ||
  ReactPaginateModule;

interface ClickEvent {
    index: number | null;
    selected: number;
    nextSelectedPage: number | undefined;
    event: object;
    isPrevious: boolean;
    isNext: boolean;
    isBreak: boolean;
    isActive: boolean;
}

interface IProps extends ReactPaginateProps {
    setCurrentPage: Dispatch<SetStateAction<number>>;
    currentPage: number;
    totalElements?: number;
}

export default function ({
    setCurrentPage,
    currentPage,
    totalElements,
    ...paginateProps
}: IProps) {
    const handlePageChange = (selectedPage: ClickEvent) => {
        setCurrentPage(selectedPage.selected);
    };

    return (
        <div className="flex w-full flex-row justify-between items-center">
            {
                totalElements !== undefined && (
                    <div className="flex flex-row gap-x-4 items-center">
                        <div className="text-sm text-gray-500">
                            Page <span className="font-bold">{currentPage + 1}</span> of <span className="font-bold">{paginateProps.pageCount}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Total elements: <span className="font-bold">{totalElements ?? 0}</span>
                        </div>
                    </div>
                )
            }

            <ReactPaginate
                previousLabel={<IconChevronLeft strokeWidth={2} className="h-8 w-8 px-2 py-px border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-md" />}
                activeClassName="bg-green-600 hover:bg-green-400 text-white"
                nextLabel={<IconChevronRight strokeWidth={2} className="h-8 w-8 px-2 py-px border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-md" />}
                containerClassName="flex items-center space-x-2 text-slate-600 font-semibold"
                pageClassName="px-3 py-1 text-sm border border-slate-200 rounded-md"
                disabledLinkClassName={"opacity-50 cursor-not-allowed"}
                pageLinkClassName=""
                onPageChange={handlePageChange}
                forcePage={currentPage}
                {...paginateProps}
            />
        </div>
    )
}