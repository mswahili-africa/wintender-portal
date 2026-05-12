import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";


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
    setCurrentPage: (page: number) => void;
    currentPage: number;
}

export default function({...props}: IProps) {
    const handlePageChange = (selectedPage: ClickEvent) => {
        props.setCurrentPage(selectedPage.selected);
    };

    return (
        <ReactPaginate
            previousLabel={<IconChevronLeft strokeWidth={2} className="h-8 w-8 px-2 py-px border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-md" />}
            activeClassName="bg-green-600 hover:bg-green-400 text-white"
            nextLabel={<IconChevronRight strokeWidth={2} className="h-8 w-8 px-2 py-px border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-md" />}
            containerClassName="flex items-center space-x-2 text-slate-600 font-semibold"
            pageClassName="px-3 py-1 text-sm border border-slate-200 rounded-md"
            disabledLinkClassName={"opacity-50 cursor-not-allowed"}
            pageLinkClassName=""
            onPageChange={handlePageChange}
            forcePage={props.currentPage}
            {...props}
        />
    )
}