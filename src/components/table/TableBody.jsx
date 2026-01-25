import React from 'react'
import { BsBoxSeam } from 'react-icons/bs';
import BasicPagination from '../BasicPagination';

const TableBody = ({
    isEmpty = true,
    children,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    totalPage,
}) => {

    if (isEmpty)
        return (
            // <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-28 flex flex-col items-center justify-center gap-4">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <BsBoxSeam fontSize={40} color='grey' />
                <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
            </div>
        )
    return <>
        {children}
        <BasicPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            setLimit={setLimit}
            totalPage={totalPage}
        />
    </>;
}

export default TableBody