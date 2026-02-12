import React, { useState } from 'react'
import fetchData from '../../Backend/fetchData.backend';
import ButtonBoolean from '../../components/inputs/ButtonBoolean';
import SearchInput from '../../components/inputs/SearchInput';
import ItemTable from '../../components/ItemTable';
import TableHeader from '../../components/table/TableHeader';
import TableRow from '../../components/table/TableRow';
import { ROLE_COL } from '../../utils/helper';
import BasicPagination from '../../components/BasicPagination';
import AddModal from '../../components/Add.modal';
import CategoryForm from '../../components/category/CategoryForm';
import RoleForm from '../../components/access/RoleForm';
import { useNavigate } from 'react-router-dom';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import manageAccess from '../../Backend/manageAccess.backend';


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


const headerLink = [
    { title: "role" },
];


const Role = () => {
    const navigate = useNavigate()
    const { data: allRole, isLoading: roleLoading } = manageAccess.TQAllRole();

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isShow, setIsShow] = useState(false);

    const isEmpty = allRole?.data?.length > 0 ? false : true;

    // console.log(allRole?.data)

    // const params = {
    //     ...(debounceSearch && { text: debounceSearch }),
    //     page: currentPage || null,
    //     limit: limit || null
    // };
    // const { data, isLoading } = fetchData.TQPermissionList(params)

    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                btnTitle='Add Role'
                btnOnClick={() => setIsShow(prev => !prev)}
                setDebounceSearch={setDebounceSearch}
                searchPlaceholder='Search by role...'
            />

            <div className="mt-5 z-0 panel border rounded overflow-hidden">
                <TableBody
                    columns={ROLE_COL}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={1}
                >
                    {allRole?.data?.map((item, index) => (
                        <TableRow
                            key={item.id}
                            columns={ROLE_COL}
                            row={{
                                id: item.id,
                                role: item.role?.toUpperCase(),
                                action: (
                                    <button
                                        className="text-sm btn btn-primary"
                                        onClick={() => navigate(`assign/${item?.id}`)}
                                    >
                                        Assign Permission
                                    </button>
                                ),
                                status: item.status ? "Active" : "Inactive"
                            }}
                        />
                    ))}
                </TableBody>
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