import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ButtonBoolean from '../../components/inputs/ButtonBoolean'
import SearchInput from '../../components/inputs/SearchInput'
import ItemTable from '../../components/ItemTable'
import fetchData from '../../Backend/fetchData.backend'
import { PERMISSION_COL } from '../../utils/helper'
import ComponentHeader from '../../components/ComponentHeader'



const headerLink = [
    { title: "permission" },
];


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
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                setDebounceSearch={setDebounceSearch}
            />

            <div className="mt-5">
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
        </div>
    )
}

export default Permission