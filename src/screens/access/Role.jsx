import React, { useState } from 'react'
import fetchData from '../../Backend/fetchData.backend';
import ButtonBoolean from '../../components/inputs/ButtonBoolean';
import SearchInput from '../../components/inputs/SearchInput';
import ItemTable from '../../components/ItemTable';
import TableHeader from '../../components/table/TableHeader';
import TableRow from '../../components/table/TableRow';
import BasicPagination from '../../components/BasicPagination';
import AddModal from '../../components/Add.modal';
import CategoryForm from '../../components/category/CategoryForm';
import RoleForm from '../../components/access/RoleForm';
import { useNavigate } from 'react-router-dom';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import manageAccess from '../../Backend/manageAccess.backend';
import { ROLE_COL } from './helper';
import { FaPencil } from 'react-icons/fa6';
import Tippy from '@tippyjs/react';
import { TbClipboardList } from 'react-icons/tb';
import { IoTrashOutline } from 'react-icons/io5';
import masterData from '../../Backend/master.backend';
import { confirmation } from '../../utils/alerts';


const headerLink = [
    { title: "role" },
];


const Role = () => {
    const navigate = useNavigate()

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["allRole"]);

    const { data: allRole, isLoading: roleLoading } = manageAccess.TQAllRole();

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isShow, setIsShow] = useState(false);
    const [editData, setEditData] = useState(null);

    const isEmpty = allRole?.data?.length > 0 ? false : true;


    function editHandler(data) {
        setIsShow(true);
        setEditData(data);
    }

    async function deleteHandler(id) {
        try {
            const isConfirm = await confirmation()
            if (isConfirm) {
                await deleteData({ path: `/role/delete-role/${id}` });
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                                id: index + 1,
                                role: item.role?.toUpperCase(),
                                action: (
                                    <div className='flex items-center justify-center gap-5'>
                                        <Tippy content="Assign Permissions" >
                                            <button
                                                onClick={() => navigate(`assign/${item?.id}`)}
                                            >
                                                <TbClipboardList
                                                    className=''
                                                    size={22}
                                                />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit Role" >
                                            <button
                                                onClick={() => editHandler(item)}
                                            >
                                                <FaPencil
                                                    className=''
                                                    size={18}
                                                />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete Role" >
                                            <button
                                                onClick={() => deleteHandler(item.id)}
                                            >
                                                <IoTrashOutline
                                                    className='text-red-500'
                                                    size={20}
                                                />
                                            </button>
                                        </Tippy>
                                    </div>
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
                title={editData ? "Edit Role" : "Add New Role"}
                maxWidth='60'
            >
                <RoleForm
                    setIsShow={setIsShow}
                    editData={editData}
                    setEditData={setEditData}
                />
            </AddModal>

        </div>
    )
}

export default Role