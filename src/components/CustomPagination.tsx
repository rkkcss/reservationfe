import { Pagination } from 'antd'
import { PaginationProps } from 'antd/lib';

const DEFAULT_PAGE_SIZE = 20;

type CustomPaginationProps = {
    fetchNextPage: () => void;
    fetchPrevPage: () => void;
    fetchPage: (page: number) => void;
    totalItems: number;
    currentPage: number;
    pageSize?: number;
}

const CustomPagination = ({ fetchNextPage, fetchPrevPage, fetchPage, totalItems, currentPage, pageSize = DEFAULT_PAGE_SIZE }: CustomPaginationProps) => {

    const itemRender: PaginationProps['itemRender'] = (parameter, type, originalElement) => {

        if (type === 'prev') {
            return <div onClick={fetchPrevPage}>{originalElement}</div>;
        }
        if (type === 'next') {
            return <div onClick={fetchNextPage}>{originalElement}</div>;
        }
        if (type === 'page') {
            return <div onClick={() => fetchPage(parameter - 1)}>{originalElement}</div>;
        }
        return originalElement;
    };

    return (
        <div className="mt-5">
            <Pagination
                itemRender={itemRender}
                total={totalItems}
                current={currentPage + 1} // Ant Design uses 1-based index for current page
                pageSize={pageSize} // Assuming 20 items per page
            />
        </div>
    )
}

export default CustomPagination