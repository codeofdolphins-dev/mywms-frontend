import React, { useState } from 'react'
import { usePagination } from '@mantine/hooks';
import { Pagination } from "@mantine/core";


const limitOption = [10, 20, 50];

const BasicPagination = ({
    totalPage = 5,
    currentPage,
    setCurrentPage,
    setLimit,
}) => {

    // const pagination = usePagination({ total: 10, initialPage: 1 });
    const [value, setValue] = useState(null);

    function changeValue(e) {
        setValue(Number(e.target.value));
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    }

    return (
        <div className="flex items-center justify-between space-y-5">
            <select
                className='w-14 border-2 rounded-md py-1 px-2 mt-4'
                onChange={changeValue}
                defaultValue={value}
            >
                {
                    limitOption.map((item, i) => <option key={i} value={item} >{item}</option>)
                }
            </select>
            <Pagination
                page={currentPage}
                total={totalPage}
                onChange={setCurrentPage}
                boundaries={1}
            />
        </div>
    )
}

export default BasicPagination
