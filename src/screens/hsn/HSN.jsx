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
import CreateHSNForm from '../../components/HSN/HSN.Form';
import fetchData from '../../Backend/fetchData.backend';
import { confirmation, successAlert } from '../../utils/alerts';
import masterData from '../../Backend/master.backend';


const colName = [
    { key: "id", label: "ID" },
    { key: "hsn_code", label: "HSN Code", },
    { key: "rate", label: "Rate %" },
    { key: "status", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const HSN = () => {
    const navigate = useNavigate();

    const { mutateAsync: deleteData, isLoading } = masterData.TQDeleteMaster();

    const [isShow, setIsShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);

    const params = {
        ...(debounceSearch.includes('%')
            ? { rate: debounceSearch.trim().slice(0, -1) }
            : { search: debounceSearch }
        ),
        page: currentPage || null,
        limit: limit || null
    };
    const { data, isLoading: deleteIsLoading } = fetchData.TQAllHsnList(params);


    function handleEdit(id) {
        setEditId(id);
        setIsShow(true);
    }

    const handleDelete = async (id) => {
        try {

            const isConfirm = await confirmation();
            if (isConfirm) {
                const res = await deleteData({ path: `/hsn/delete/${id}` });
                if (res.success) successAlert(res.message);
            };
        } catch (error) {
            console.log(error);
        };
    };

    useEffect(() => {
        if (!isShow) {
            setEditId(null);
        }
    }, [isShow]);

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
                    placeholder="Search by HSN code or rate. use % for rates"
                    className="bg- border-pink-500"
                    setValue={setDebounceSearch}
                />
            </div>

            <ItemTable
                columns={colName}
                items={data?.data}
                edit={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
                totalPage={data?.meta?.totalPages}
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
                    editId={editId}
                />
            </AddModal>

        </div >
    )
}

export default HSN;