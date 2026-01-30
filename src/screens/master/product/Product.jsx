import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '@/components/inputs/SearchInput'
import IconSettings from '@/components/Icon/IconSettings';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '@/components/Icon/IconCode';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import Input from '@/components/inputs/Input';
import ItemTable from '@/components/ItemTable';
import { FiPlus } from 'react-icons/fi';
import fetchData from '@/Backend/fetchData.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import masterData from '@/Backend/master.backend';
import ComponentHeader from '@/components/ComponentHeader';

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

const headerLink = [
    { title: "master", link: "/master" },
    { title: "Products" },
]

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
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                primaryText='Products'
                secondaryText='Manage and view all products in your inventory'
                searchPlaceholder='Search by name, SKU, barcode, category, or HSN...'
                setDebounceSearch={setDebounceSearch}
                btnTitle='Add Product'
                btnOnClick={() => navigate("add-product")}
                className={"mb-5 justify-between"}
            />

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