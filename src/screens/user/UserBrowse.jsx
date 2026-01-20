import React, { useEffect, useState } from 'react'
import masterData from '../../Backend/master.backend';
import fetchData from '../../Backend/fetchData.backend';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { IMAGE_URL, USER_LIST_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import CustomeButton from "@/components/inputs/Button"
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import BasicPagination from '../../components/BasicPagination';

const SAMPLE_IMAGE = "/assets/images/user-profile.jpeg"

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

    function click(data){
        console.log(data)
    }

    return (
        <div>{/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>Products</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-bold my-3">User</h1>
                </div>
                <button
                    className='btn btn-primary'
                    onClick={() => navigate("add-product")}
                >
                    <FiPlus size={20} className='mr-2' />
                    Add Product
                </button>
            </div>

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <SearchInput
                    type="text"
                    placeholder="Search by name, SKU, barcode, category, or HSN..."
                    className="bg- border-pink-500"
                    setValue={setDebounceSearch}
                />
            </div>

            <div className="panel">
                <TableHeader columns={USER_LIST_COLUMN} />
                {
                    userList?.data?.map((item) =>
                        <TableRow
                            key={item.id}
                            columns={USER_LIST_COLUMN}
                            onClick={() => click(item.id)}
                            row={{
                                logo: (
                                    <img
                                        class="w-12 h-12 rounded-full overflow-hidden object-cover"
                                        src={
                                            item?.profile_image !== null
                                                ? `${IMAGE_URL}/${item?.profile_image}`
                                                : SAMPLE_IMAGE
                                        }
                                        alt="profile image"
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