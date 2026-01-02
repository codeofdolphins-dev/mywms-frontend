import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ButtonBoolean from '../../components/inputs/ButtonBoolean'
import SearchInput from '../../components/inputs/SearchInput'
import ItemTable from '../../components/ItemTable'
import fetchData from '../../Backend/fetchData'
import { PERMISSION_COL } from '../../utils/helper'

const Permission = () => {

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const params = {
        ...(debounceSearch && { text: debounceSearch }),
        page: currentPage || null,
        limit: limit || null
    };
    const { data, isLoading } = fetchData.TQPermissionList(params)

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <p className="">
                        Access
                    </p>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Permission</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Permissions</h1>
                    <p className='text-gray-600 text-base'>Manage and view all Permissions</p>
                </div>
                <ButtonBoolean
                // setState={setIsShow}
                >
                    Add Permissions
                </ButtonBoolean>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name or description..."
                    className="bg- border-pink-500"
                    setValue={setDebounceSearch}
                />
            </div>

            <ItemTable
                columns={PERMISSION_COL}
                items={data?.data}
                // edit={true}
                deleteBtn={false}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
                totalPage={data?.meta?.totalPages}
                isLoading={isLoading}
            />

        </div>
    )
}

export default Permission