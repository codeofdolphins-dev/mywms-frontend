import React, { useState } from 'react'
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
import CreateRequsitionModal from '../../components/requisition/CreateRequsition.modal';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import CreateHSNForm from '../../components/HSN/CreateHSN.Form';


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

const colName = ["Id", "Hsn Code", "Rate%", "Actions"];


const HSN = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);

    const { register } = useForm();

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
                    value={search}
                    setValue={setSearch}
                />
            </div>

            <ItemTable
                colName={colName}
                items={tableData}
                edit={true}
            />

            <AddModal 
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add New HSN"
                maxWidth={'50'}
            >
                <CreateHSNForm />
            </AddModal>

        </div >
    )
}

export default HSN;