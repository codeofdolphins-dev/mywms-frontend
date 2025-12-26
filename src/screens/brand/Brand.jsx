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
import Input from '../../components/inputs/Input';
import ButtonBasic from '../../components/inputs/ButtonBasic';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import Form from '../../components/brand/Form';
import fetchData from '../../Backend/fetchData';
import masterData from '../../Backend/master.backend';
import { confirmation, successAlert } from '../../utils/alerts';


const colName = [
    { key: "id", label: "ID" },
    { key: "logo", label: "Logo", type: "image" },
    { key: "name", label: "Brand Name" },
    { key: "slug", label: "Slug" },
    { key: "isActive", label: "Status", render: v => v ? "Active" : "Inactive" }
];


const Brand = () => {
    const { mutateAsync: deleteData, isLoading: deleteLoading } = masterData.TQDeleteMaster();

    const [debounceSearch, setDebounceSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);

    const params = {
        text: debounceSearch || null,
        page: currentPage || null,
        limit: limit || null
    };
    const { data, isLoading } = fetchData.TQAllBrandList(params);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch]);

    useEffect(() => {
        setEditId(null);
    }, [isShow]);


    function handleEdit(id) {
        setEditId(id);
        setIsShow(true);
    };

    async function handleDelete(id) {
        try {
            const isSuccess = await confirmation();
            if (!isSuccess) return;

            const res = await deleteData({ path: `/brand/delete/${id}` });
            if (res.success) successAlert(res.message);
        } catch (error) {
            console.log(error);
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
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Brand</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Brands</h1>
                    <p className='text-gray-600 text-base'>Manage and view all brands</p>
                </div>
                <ButtonBasic
                    setState={setIsShow}
                >
                    Add Brand
                </ButtonBasic>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by brand name..."
                    className="bg- border-pink-500"
                    setValue={setDebounceSearch}
                />
            </div>

            {/* Item table */}
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
                isLoading={isLoading}
            />


            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add New Brand"
            >
                <Form
                    editId={editId}
                    setIsShow={setIsShow}
                />
            </AddModal>

        </div >
    )
}

export default Brand
