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
import { FiPlus } from 'react-icons/fi';
import fetchData from '@/Backend/fetchData.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import masterData from '@/Backend/master.backend';
import ItemTable from '../../../components/ItemTable';
import ComponentHeader from '../../../components/ComponentHeader';
import AddModal from '../../../components/Add.modal';
import RawForm from '../../../components/product/Raw.Form';

const colName_raw = [
    // { key: "id", label: "#" },
    // { key: "barcode", label: "Barcode" },
    { key: "photo", label: "Logo", type: "image" },
    { key: "name", label: "Name" },
    { key: "sku", label: "code / SKU" },
    { key: "unit_type", label: "Unit of Masure" },
    { key: "reorder_level", label: "Reorder Level" },
    { key: "description", label: "Description" },
    { key: "is_active", label: "Status", render: v => v ? "Active" : "Inactive" }
];
const colName_finished = [
    // { key: "id", label: "ID" },
    { key: "barcode", label: "Barcode" },
    { key: "photo", label: "Logo", type: "image" },
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "package_type", label: "Package Type" },
    { key: "productBrands", label: "Brands", type: "nested", nested: (items) => Array.isArray(items) ? items.map(i => i.name) : "-" },
    { key: "productCategories", label: "Categories", type: "array", arrayRender: (item) => item.name },
    { key: "is_active", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const headerLink = [
    { title: "master", link: "/master" },
    { title: "Products" },
]

const Product = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [editRawProduct, setEditRawProduct] = useState(null);

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["productList"]);

    const params = {
        ...(debounceSearch && { text: debounceSearch }),
        page: currentPage,
        limit: limit,
        type: activeTab === 1 ? "finished" : "raw"
    };
    const { data: productList, isLoading } = fetchData.TQProductList(params);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch]);


    function handleEdit(id) {
        if (activeTab === 1)
            navigate(`edit-product/${id}`);
        else {
            const item = productList?.data?.find(item => item.id === id);
            setIsShow(true);
            setEditRawProduct(item);
        }
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
                searchPlaceholder='Search by name, sku, barcode...'
                setDebounceSearch={setDebounceSearch}
                className={"mb-5 justify-between"}

                addButton={true}
                btnTitle='Finished'
                btnOnClick={() => navigate("add-product")}

                addButton2={true}
                btn2Title='Raw'
                btn2OnClick={() => setIsShow(true)}
            />

            {/* wizards */}
            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    <li>
                        <div
                            className={`
                                ${activeTab === 1 ? '!bg-primary text-white' : ''}
                                block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-36 cursor-pointer
                            `}
                            onClick={() => setActiveTab(1)}
                        >
                            <p className='-mb-1'>Finished Product</p>
                        </div>
                    </li>

                    <li>
                        <div className={`
                                ${activeTab === 2 ? '!bg-primary text-white' : ''} 
                                block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-36 cursor-pointer
                            `}
                            onClick={() => setActiveTab(2)}
                        >
                            <p className='-mb-1'>Raw Product</p>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Item table */}
            <ItemTable
                columns={activeTab == 1 ? colName_finished : colName_raw}
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

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add Raw Product"
            >
                <RawForm
                    setIsShow={setIsShow}
                    editRawProduct={editRawProduct}
                />
            </AddModal>

        </div >
    )
}

export default Product;