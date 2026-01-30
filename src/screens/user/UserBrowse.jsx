import React, { useEffect, useState } from 'react'
import masterData from '@/Backend/master.backend';
import fetchData from '@/Backend/fetchData.backend';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import SearchInput from '@/components/inputs/SearchInput';
import TableHeader from '@/components/table/TableHeader';
import TableRow from '@/components/table/TableRow';
import CustomeButton from "@/components/inputs/Button"
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import BasicPagination from '@/components/BasicPagination';
import ImageComponent from '@/components/ImageComponent';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import { USER_LIST_COLUMN } from '../../utils/helper';
import { confirmation } from '../../utils/alerts';


const headerLink = [
    // { title: "master", link: "/master" },
    { title: "user" },
]

const UserBrowse = () => {
    const navigate = useNavigate();

    const [debounceSearch, setDebounceSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster();

    const params = {
        ...(debounceSearch && { text: debounceSearch }),
        page: currentPage || null,
        limit: limit || null
    };
    const { data: userList, isLoading } = fetchData.TQAllUserList(params);
    const isEmpty = userList?.data?.length === 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch]);

    useEffect(() => {
        if (!isShow) setEditId(null);
    }, [isShow]);


    function handleEdit(id) {
        navigate(`/user/update/${id}`)
    };

    async function handleDelete(id) {
        console.log(id)
        try {
            const isConfirm = await confirmation();

            if (isConfirm) {
                const res = await deleteData({ path: `/product/delete/${id}` });
                if (res?.success) successAlert();
            }

        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className='space-y-4'>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                primaryText='All Users'
                searchPlaceholder='Search by name, email, phone...'
                setDebounceSearch={setDebounceSearch}
                btnTitle='Add User'
                btnOnClick={() => navigate("register")}
            />

            <div className={`panel mt-5 relative ${isEmpty ? "min-h-64" : ""}`}>
                <div className="overflow-x-auto">
                    <TableHeader columns={USER_LIST_COLUMN} />
                    <TableBody
                        isEmpty={isEmpty}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={userList?.meta?.totalPages}
                    >
                        {userList?.data?.map((item) =>
                            <TableRow
                                key={item.id}
                                columns={USER_LIST_COLUMN}
                                onClick={() => navigate(`/user/profile/${item.id}`)}
                                row={{
                                    logo: (
                                        <ImageComponent
                                            src={item?.profile_image}
                                            className={"w-12 h-12 object-top"}
                                        />
                                    ),
                                    name: item?.name?.full_name,
                                    email: item?.email,
                                    phone: item?.phone_no,
                                    active: item?.is_active ? "Active" : "Inactive",
                                    action: (
                                        <div className="flex space-x-3">
                                            <CustomeButton
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEdit(item.id)
                                                }}
                                            >
                                                <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                            </CustomeButton>

                                            <CustomeButton onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.id)
                                            }}>
                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        )}
                    </TableBody>
                </div>
            </div>
        </div>
    )
}

export default UserBrowse