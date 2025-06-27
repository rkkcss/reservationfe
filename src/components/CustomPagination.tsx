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
            return <a onClick={fetchPrevPage}>{originalElement}</a>;
        }
        if (type === 'next') {
            return <a onClick={fetchNextPage}>{originalElement}</a>;
        }
        if (type === 'page') {
            return <a onClick={() => fetchPage(parameter - 1)}>{originalElement}</a>;
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