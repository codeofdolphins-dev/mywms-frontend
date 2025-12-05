import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput'
import IconSettings from '../../components/Icon/IconSettings';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import Input from '../../components/inputs/Input';
import ButtonBasic from '../../components/inputs/ButtonBasic';
import ItemTable from '../../components/ItemTable';
import AddProductModal from '../../components/product/AddProduct.modal';


const tableData = [
    {
        Id: 1,
        Product: "Sample Product 1",
        Sku: "SKU001",
        Category: "Category A",
        "Hsn Code": "1001",
        Price: 199,
        Mrp: 249,
        Type: "Physical",
        Status: "Active",

    },
    {
        Id: 2,
        Product: "Sample Product 2",
        Sku: "SKU002",
        Category: "Category B",
        "Hsn Code": "1002",
        Price: 299,
        Mrp: 349,
        Type: "Digital",
        Status: "Inactive",

    },
    {
        Id: 3,
        Product: "Sample Product 3",
        Sku: "SKU003",
        Category: "Category A",
        "Hsn Code": "1003",
        Price: 149,
        Mrp: 199,
        Type: "Physical",
        Status: "Active",

    },
    {
        Id: 4,
        Product: "Sample Product 4",
        Sku: "SKU004",
        Category: "Category C",
        "Hsn Code": "1004",
        Price: 499,
        Mrp: 599,
        Type: "Digital",
        Status: "Active",

    },
    {
        Id: 5,
        Product: "Sample Product 5",
        Sku: "SKU005",
        Category: "Category B",
        "Hsn Code": "1005",
        Price: 259,
        Mrp: 299,
        Type: "Physical",
        Status: "Inactive",

    },
    {
        Id: 6,
        Product: "Sample Product 6",
        Sku: "SKU006",
        Category: "Category A",
        "Hsn Code": "1006",
        Price: 99,
        Mrp: 149,
        Type: "Digital",
        Status: "Active",

    },
    {
        Id: 7,
        Product: "Sample Product 7",
        Sku: "SKU007",
        Category: "Category C",
        "Hsn Code": "1007",
        Price: 350,
        Mrp: 400,
        Type: "Physical",
        Status: "Inactive",

    },
    {
        Id: 8,
        Product: "Sample Product 8",
        Sku: "SKU008",
        Category: "Category B",
        "Hsn Code": "1008",
        Price: 120,
        Mrp: 180,
        Type: "Digital",
        Status: "Active",

    }
];

const Product = () => {

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [items, setItems] = useState(tableData);    

    const colName = ["Id", "Product", "Sku", "Category", "Hsn Code", "Price", "Mrp", "Type", "Status", "Actions"];

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);


    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Products</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Products</h1>
                    <p className='text-gray-600 text-base'>Manage and view all products in your inventory</p>
                </div>
                <ButtonBasic
                    setState={setIsShow}
                >Add Product</ButtonBasic>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name, SKU, barcode, category, or HSN..."
                    className="bg- border-pink-500"
                    value={search}
                    setValue={setSearch}
                />
            </div>

            {/* Item table */}
            <ItemTable
                colName={colName}
                items={items}
                setItems={setItems}
                upperCase={true}
                edit={true}
            />

            {/* add product modal */}
            <AddProductModal
                isShow={isShow}
                setIsShow={setIsShow}
            />
        </div >
    )
}

export default Product;