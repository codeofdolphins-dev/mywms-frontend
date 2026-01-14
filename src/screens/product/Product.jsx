import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput'
import IconSettings from '../../components/Icon/IconSettings';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import Input from '../../components/inputs/Input';
import ItemTable from '../../components/ItemTable';
import { FiPlus } from 'react-icons/fi';
import fetchData from '../../Backend/fetchData.backend';
import { confirmation, successAlert } from '../../utils/alerts';
import masterData from '../../Backend/master.backend';

const colName = [
    { key: "id", label: "ID" },
    { key: "photo", label: "Logo", type: "image" },
    { key: "name", label: "Name" },
    { key: "barcode", label: "Barcode" },
    { key: "sku", label: "SKU" },
    { key: "package_type", label: "Package Type" },
    { key: "purchase_price", label: "Purchase Price" },
    { key: "MRP", label: "MRP" },
    { key: "productBrands", label: "Brands", type: "array", arrayRender: (item) => item.name },
    { key: "productCategories", label: "Categories", type: "array", arrayRender: (item) => item.name },
    { key: "is_active", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const Product = () => {

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
    const { data: productList, isLoading } = fetchData.TQProductList();

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
        <div>
            {/* breadcrumb */}
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

            {/* Item table */}
            <ItemTable
                columns={colName}
                items={productList?.data}
                edit={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
                totalPage={productList?.meta?.totalPages}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isLoading={isLoading}
            />

        </div >
    )
}

export default Product;