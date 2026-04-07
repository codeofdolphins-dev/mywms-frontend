import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput'
import IconSettings from '../../components/Icon/IconSettings';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import { useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import ItemTable from '../../components/ItemTable';
import fetchData from '../../Backend/fetchData.backend';
import SelectRHF from '../../components/inputs/RHF/Select.RHF';
import TableHeader from '../../components/table/TableHeader';


const tableData = [
    {
        "Id": 1,
        "Email": "john.doe@example.com",
        "Name": "John Doe",
        "Number": "9876543210",
        "GST No.": "27ABCDE1234F1Z5",
        "License No.": "LIC123456",
        "Type": "Mfg Bond Warehouse",
        "Address": "123 Main Street, New York, NY",
        "Lat.": 40.712776,
        "Long.": -74.005974
    },
    {
        "Id": 2,
        "Email": "jane.smith@example.com",
        "Name": "Jane Smith",
        "Number": "9123456780",
        "GST No.": "29FGHIJ5678K2Z6",
        "License No.": "LIC789012",
        "Type": "Regional Warehouse",
        "Address": "456 Oak Avenue, Los Angeles, CA",
        "Lat.": 34.052235,
        "Long.": -118.243683
    },
    {
        "Id": 3,
        "Email": "michael.brown@example.com",
        "Name": "Michael Brown",
        "Number": "9988776655",
        "GST No.": "33LMNOP9012Q3Z7",
        "License No.": "LIC345678",
        "Type": "State Warehouse",
        "Address": "789 Pine Road, Chicago, IL",
        "Lat.": 41.878113,
        "Long.": -87.629799
    },
    {
        "Id": 4,
        "Email": "emily.wilson@example.com",
        "Name": "Emily Wilson",
        "Number": "9012345678",
        "GST No.": "07RSTUV3456W4Z8",
        "License No.": "LIC901234",
        "Type": "3PL Warehouse",
        "Address": "321 Maple Lane, Houston, TX",
        "Lat.": 29.760427,
        "Long.": -95.369804
    }
];

const colName = ["Id", "Email", "Name", "Number", "GST No.", "License No.", "Type", "Address", "Lat.", "Long.", "Actions"];

const Warehouse = () => {

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [options, setOptions] = useState([]);
    const [type, setType] = useState();


    function handleEdit(id) { };
    async function handleDelete(id) { };

    // console.log(type)

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
                    <span>Category</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">All Warehouse</h1>
                    <p className='text-gray-600 text-base'>Manage and view all warehouse types</p>
                </div>
                {/* <button
                    className="btn btn-primary"
                    onClick={() => setIsShow(true)}
                >Create Warehouse</button> */}
            </div>


            {/* Search and Add Button */}
            <div className="grid grid-cols-1 my-4">
                <div className='col-span-2'>
                    <SearchInput
                        type="text"
                        placeholder="Search by name or description..."
                        setValue={setDebounceSearch}
                    />
                </div>
            </div>

            <div className="panel">
                <TableHeader />
            </div>

        </div >
    )
}

export default Warehouse;