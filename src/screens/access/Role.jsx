import React, { useState } from 'react'
import fetchData from '../../Backend/fetchData';
import ButtonBasic from '../../components/inputs/ButtonBasic';
import SearchInput from '../../components/inputs/SearchInput';
import ItemTable from '../../components/ItemTable';
import TableHeader from '../../components/table/TableHeader';
import TableRow from '../../components/table/TableRow';
import { ROLE_COL } from '../../utils/helper';
import BasicPagination from '../../components/BasicPagination';
import AddModal from '../../components/Add.modal';
import CategoryForm from '../../components/category/CategoryForm';
import RoleForm from '../../components/access/RoleForm';


const rawProducts = [
    {
        id: 101,
        name: "Super Admin",
        status: "active"
    },
    {
        id: 102,
        name: "Admin",
        status: "inactive"
    },
    {
        id: 103,
        name: "User",
        status: "active"
    },
    {
        id: 104,
        name: "Supplier",
        status: "active"
    },
    {
        id: 105,
        name: "Distributor",
        status: "inactive"
    }
];



const Role = () => {
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isShow, setIsShow] = useState(false);


    // const params = {
    //     ...(debounceSearch && { text: debounceSearch }),
    //     page: currentPage || null,
    //     limit: limit || null
    // };
    // const { data, isLoading } = fetchData.TQPermissionList(params)

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
                    <span>Role</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Role</h1>
                    <p className='text-gray-600 text-base'>Manage and view all Permissions</p>
                </div>
                <ButtonBasic
                setState={setIsShow}
                >
                    Add Role
                </ButtonBasic>
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

            <div className="panel border rounded overflow-hidden">
                <TableHeader columns={ROLE_COL} />

                {rawProducts.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                        No records found
                    </div>
                ) : (
                    rawProducts.map((item, index) => (
                        <TableRow
                            key={item.id}
                            columns={ROLE_COL}
                            row={{
                                id: index + 1,
                                name: item.name,
                                category: item.category_name,
                                price: `₹${item.price}`,
                                action: (
                                    <button className="text-sm btn btn-primary">
                                        Assign Permission
                                    </button>
                                ),
                                status: item.status
                            }}
                        />
                    ))
                )}
                <BasicPagination
                    totalPage={5}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setLimit={setLimit}
                />
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Add New Role"}
                maxWidth='60'
            >
                <RoleForm
                    setIsShow={setIsShow}
                />
            </AddModal>

        </div>
    )
}

export default Role