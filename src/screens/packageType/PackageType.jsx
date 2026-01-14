import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput'
import Tippy from '@tippyjs/react';
import { useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import fetchData from '../../Backend/fetchData.backend';
import { confirmation, successAlert } from '../../utils/alerts';
import masterData from '../../Backend/master.backend';
import ButtonBoolean from '../../components/inputs/ButtonBoolean';
import UnitTypeForm from '../../components/unit/UnitType.Form';
import PackageTypeForm from '../../components/packageType/PackageType.Form';


const colName = [
    { key: "id", label: "#" },
    { key: "name", label: "Package Type", },
    { key: "isActive", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const PackageType = () => {
    const navigate = useNavigate();

    const { mutateAsync: deleteData } = masterData.TQDeleteMaster(["packageTypeList"]);

    const [isShow, setIsShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);

    const params = {
        name: debounceSearch,
        page: currentPage,
        limit: limit
    };
    const { data, isLoading } = fetchData.TQPackageTypeList(params);


    function handleEdit(id) {
        setEditId(id);
        setIsShow(true);
    }

    const handleDelete = async (id) => {
        try {
            const isConfirm = await confirmation();
            if (isConfirm) {
                const res = await deleteData({ path: `/package-type/delete/${id}` });
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
            <ul className="flex space-x-2">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>package-type</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-bold my-3">Package Types</h1>
                    <p className='text-gray-600 text-base'>Define and manage different package types for products</p>
                </div>
                <ButtonBoolean
                    className="btn btn-primary"
                    setState={setIsShow}
                >
                    Create type
                </ButtonBoolean>
            </div>

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by type"
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
                isLoading={isLoading}
            />

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add New Package Type"
                maxWidth={'50'}
            >
                <PackageTypeForm
                    setIsShow={setIsShow}
                    editId={editId}
                />
            </AddModal>

        </div >
    )
}

export default PackageType;