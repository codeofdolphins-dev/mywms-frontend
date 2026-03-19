import React from 'react'
import { BsBoxSeam } from 'react-icons/bs';
import BasicPagination from '../BasicPagination';
import TableHeader from './TableHeader';
import Loader from '../loader/Loader';

const TableBody = ({
    isEmpty = true,
    showPagination = true,
    children,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    totalPage,
    columns,
    isLoading
}) => {

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 min-h-64">
                <Loader />
            </div>
        );
    };

    if (isEmpty) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 min-h-64">
                <BsBoxSeam fontSize={40} color='grey' />
                <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
            </div>
        )
    }

    return <>
        <div className="overflow-auto">
            <TableHeader columns={columns} />
            {children}
        </div>
        {
            showPagination &&
            <BasicPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                limit={limit}
                setLimit={setLimit}
                totalPage={totalPage}
            />
        }
    </>;
}

export default TableBody