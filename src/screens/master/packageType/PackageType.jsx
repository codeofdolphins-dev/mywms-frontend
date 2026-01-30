import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Tippy from '@tippyjs/react';
import { useForm } from 'react-hook-form';
import Input from '@/components/inputs/Input';
import ItemTable from '@/components/ItemTable';
import AddModal from '@/components/Add.modal';
import fetchData from '@/Backend/fetchData.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import masterData from '@/Backend/master.backend';
import ButtonBoolean from '@/components/inputs/ButtonBoolean';
import UnitTypeForm from '@/components/unit/UnitType.Form';
import PackageTypeForm from '@/components/packageType/PackageType.Form';
import SearchInput from '@/components/inputs/SearchInput';
import ComponentHeader from '@/components/ComponentHeader';


const colName = [
    { key: "id", label: "#" },
    { key: "name", label: "Package Type", },
    { key: "isActive", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const headerLink = [
    { title: "master", link: "/master" },
    { title: "package-type" },
]

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
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                primaryText='Package Types'
                secondaryText='Define and manage different package types for products'
                btnOnClick={() => setIsShow(p => !p)}
                searchPlaceholder='Search by type...'
                btnTitle='Add type'
                setDebounceSearch={setDebounceSearch}
                className={"mb-5 justify-between"}
            />

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