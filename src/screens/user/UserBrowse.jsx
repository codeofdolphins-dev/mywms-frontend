import React, { useEffect, useState } from 'react'
import masterData from '../../Backend/master.backend';
import fetchData from '../../Backend/fetchData.backend';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { USER_LIST_COLUMN } from '../../utils/helper';

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
    const { data: productList, isLoading } = fetchData.TQAllUserList();

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
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Products</h1>
                    <p className='text-gray-600 text-base'>Manage and view all products in your inventory</p>
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
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name, SKU, barcode, category, or HSN..."
                    className="bg- border-pink-500"
                    setValue={setDebounceSearch}
                />
            </div>

            <div className="panel">
                <TableHeader columns={USER_LIST_COLUMN} />
            </div>
        </div>
    )
}

export default UserBrowse