import React, { useEffect, useState } from 'react'
import masterData from '../../Backend/master.backend';
import fetchData from '../../Backend/fetchData.backend';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { IMAGE_URL, USER_LIST_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import CustomeButton from "../../components/inputs/Button"
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import BasicPagination from '../../components/BasicPagination';
import ImageComponent from '../../components/ImageComponent';

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

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch]);

    useEffect(() => {
        if (!isShow) setEditId(null);
    }, [isShow]);


    function handleEdit(id) {
        navigate(`edit-product/${id}`)
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
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className='self-start'>
                    <h1 className="text-2xl font-bold mb-3 sm:mb-0">All Users</h1>

                </div>
                <SearchInput
                    type="text"
                    placeholder="Search by name, email, phone..."
                    className=""
                    setValue={setDebounceSearch}

                    addButton={true}
                    btnTitle={"Add User"}
                    btnOnClick={() => navigate("register")}
                />
            </div>

            <div className="panel">
                <TableHeader columns={USER_LIST_COLUMN} />
                {
                    userList?.data?.map((item) =>
                        <TableRow
                            key={item.id}
                            columns={USER_LIST_COLUMN}
                            onClick={() => navigate(`/user/profile/${item.id}`)}
                            row={{
                                logo: (
                                    <ImageComponent
                                        src={item?.profile_image}
                                        className={"w-12 h-12"}
                                    />
                                ),
                                name: item?.name?.full_name,
                                email: item?.email,
                                phone: item?.phone_no,
                                address: `
                                        ${item?.address?.address}, ${item?.address?.pincode},
                                        ${item?.address?.district}, ${item?.address?.state}
                                    `,
                                active: item?.is_active ? "Active" : "Inactive",
                                action: (
                                    <div className="flex space-x-3">
                                        <CustomeButton onClick={() => handleEdit(item.id)}>
                                            <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                        </CustomeButton>

                                        <CustomeButton onClick={() => handleDelete(item.id)}>
                                            <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                        </CustomeButton>
                                    </div>
                                )
                            }}
                        />
                    )
                }
                <BasicPagination
                    totalPage={userList?.meta?.currentPage || 1}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
        </div>
    )
}

export default UserBrowse