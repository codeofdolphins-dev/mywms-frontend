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
import { useForm } from 'react-hook-form';
import Input from '@/components/inputs/Input';
// import ItemTable from '@/components/ItemTable';
import AddModal from '@/components/Add.modal';
import fetchData from '@/Backend/fetchData.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import masterData from '@/Backend/master.backend';
import ComponentHeader from '@/components/ComponentHeader';
import CreateHSNForm from '../../../components/HSN/HSN.Form';
import ItemTable from '../../../components/ItemTable';


const colName = [
    { key: "id", label: "#" },
    { key: "hsn_code", label: "HSN Code", },
    { key: "default_gst_rate", label: "Rate %" },
    { key: "cess_rate", label: "CESS Rate %" },
    { key: "is_exempt", label: "Exempt", render: v => v ? "Yes" : "No" },
    { key: "effective_from", label: "Effective From" },
    { key: "effective_to", label: "Effective To" },
    { key: "description", label: "description"},
    { key: "is_active", label: "Status", render: v => v ? "Active" : "Inactive" }
];

const headerLink = [
    { title: "master", link: "/master" },
    { title: "hsn" },
]

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
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                primaryText='HSN Codes'
                secondaryText='Manage and view all HSN Codes'
                searchPlaceholder='Search by HSN code or rate. use % for rates...'
                setDebounceSearch={setDebounceSearch}
                btnTitle='Add HSN'
                btnOnClick={() => setIsShow(p => !p)}
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
                isLoading={false}
            />

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add New HSN"
                maxWidth={'65'}
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