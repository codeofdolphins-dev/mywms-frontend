import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IconSettings from '@/components/Icon/IconSettings';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '@/components/Icon/IconCode';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import Input from '@/components/inputs/Input';
import ButtonBoolean from '@/components/inputs/ButtonBoolean';
import ItemTable from '@/components/ItemTable';
import fetchData from '@/Backend/fetchData.backend';
import masterData from '@/Backend/master.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import TableHeader from '@/components/table/TableHeader';
import TableRow from '@/components/table/TableRow';
import CustomeButton from "@/components/inputs/Button";
import renderTwoLevelArray from '@/utils/twoLevelArrayViewer';
import TwoLevelArrayViewer from '@/utils/twoLevelArrayViewer';
import { BsBoxSeam } from 'react-icons/bs';
import Loader from '@/components/loader/Loader';
import BasicPagination from '@/components/BasicPagination';
// import ComponentHeader from '@/components/ComponentHeader';
import TableBody from '../../../components/table/TableBody';
import ImageComponent from '../../../components/ImageComponent';
import { BRAND_COLUMN } from '../../../utils/helper';
import Form from '../../../components/brand/Form';
import AddModal from '../../../components/Add.modal';
import ComponentHeader from '../../../components/ComponentHeader';


const headerLink = [
    { title: "Master", link: "/master" },
    { title: "Brand" },
]

const Brand = () => {
    const imageUrl = import.meta.env.VITE_IMAGE_URL;
    const { mutateAsync: deleteData, isLoading: deleteLoading } = masterData.TQDeleteMaster();

    const [debounceSearch, setDebounceSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);

    const params = {
        ...(debounceSearch && { text: debounceSearch }),
        page: currentPage || null,
        limit: limit || null
    };
    const { data, isLoading } = fetchData.TQAllBrandList(params);
    const isEmpty = data?.data?.length === 0;

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch]);

    useEffect(() => {
        if (!isShow) setEditId(null);
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
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                // primaryText='Brands'
                // secondaryText='Manage and view all brands'
                searchPlaceholder='Search by brand name, slug...'
                setDebounceSearch={setDebounceSearch}
                btnTitle='Add Brand'
                btnOnClick={() => setIsShow(p => !p)}
            />

            {/* display table */}
            <div className={`panel mt-5 ${isEmpty ? "min-h-64" : ""} relative`}>
                <div className="overflow-x-auto">
                    {
                        isLoading ? (
                            <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                <TableHeader columns={BRAND_COLUMN} />
                                <TableBody
                                    isEmpty={isEmpty}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    limit={limit}
                                    setLimit={setLimit}
                                    totalPage={data?.meta?.totalPages}
                                >
                                    {data?.data?.map((item, idx) => (
                                        <TableRow
                                            key={idx}
                                            columns={BRAND_COLUMN}
                                            row={{
                                                id: item?.id,
                                                logo: (
                                                    <ImageComponent
                                                        src={item?.logo}
                                                        className={"w-12 h-12"}
                                                    />
                                                ),
                                                name: item?.name,
                                                slug: item?.slug,
                                                supplier: (
                                                    <TwoLevelArrayViewer
                                                        data={item?.suppliers}
                                                        labelKey="name.full_name"
                                                    />
                                                ),
                                                is_active: item?.isActive ? "Active" : "Inactive",
                                                action: (
                                                    <div className="flex space-x-3">
                                                        <CustomeButton onClick={() => handleEdit(item.id)}>
                                                            <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                        </CustomeButton>

                                                        <CustomeButton onClick={() => handleDelete(item.id)}>
                                                            <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                                        </CustomeButton>
                                                    </div>
                                                ),
                                            }}
                                        />
                                    ))}
                                </TableBody>
                            </>
                        )
                    }
                </div>
            </div>


            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add New Brand"
                maxWidth='55'
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
