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
import { useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import CreateHSNForm from '../../components/HSN/CreateHSN.Form';
import fetchData from '../../Backend/fetchData';


const tableData = [
    {
        id: 1,
        name: 'John Doe',
        email: '18'
    },
    {
        id: 2,
        name: 'Shaun Park',
        email: '20'
    },
    {
        id: 3,
        name: 'Alma Clarke',
        email: '15'
    },
    {
        id: 4,
        name: 'Vincent Carpenter',
        email: '18'
    },
];

const colName = [
    { key: "id", label: "ID" },
    { key: "hsn_code", label: "HSN Code", },
    { key: "rate", label: "Rate %" },
    { key: "staus", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const HSN = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);

    const { register } = useForm();

    const params = {

    }

    const {} = fetchData


    const handleEdit = (id) => { };
    const handleDelete = (id) => { };

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch])

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
                    <span>HSN Codes</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">HSN Codes</h1>
                    <p className='text-gray-600 text-base'>Manage and view all HSN Codes</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsShow(true)}
                >Create HSN</button>
            </div>

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name or description..."
                    className="bg- border-pink-500"
                    setValue={setDebounceSearch}
                />
            </div>

            <ItemTable
                columns={colName}
                items={tableData}
                edit={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
                // totalPage={data?.meta?.totalPages}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isLoading={false}
            />

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add New HSN"
                maxWidth={'50'}
            >
                <CreateHSNForm
                    setIsShow={setIsShow}
                />
            </AddModal>

        </div >
    )
}

export default HSN;