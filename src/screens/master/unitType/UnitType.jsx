import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '@/components/inputs/SearchInput'
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
import ComponentHeader from '@/components/ComponentHeader';


const colName = [
    { key: "id", label: "#" },
    { key: "name", label: "Unit Type", },
    { key: "isActive", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const headerLink = [
    { title: "master", link: "/master" },
    { title: "unit-type" },
]

const UnitType = () => {
    const navigate = useNavigate();

    const { mutateAsync: deleteData } = masterData.TQDeleteMaster(["unitTypeList"]);

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
    const { data, isLoading } = fetchData.TQUnitTypeList(params);


    function handleEdit(id) {
        setEditId(id);
        setIsShow(true);
    }

    const handleDelete = async (id) => {
        try {

            const isConfirm = await confirmation();
            if (isConfirm) {
                const res = await deleteData({ path: `/unit/delete/${id}` });
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
                primaryText='Unit Types'
                secondaryText='Manage measurement units for products'
                btnOnClick={() => setIsShow(p => !p)}
                searchPlaceholder='Search by unit type...'
                btnTitle='Add Type'
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
                title="Add New Unit Type"
                maxWidth={'50'}
            >
                <UnitTypeForm
                    setIsShow={setIsShow}
                    editId={editId}
                />
            </AddModal>

        </div >
    )
}

export default UnitType;