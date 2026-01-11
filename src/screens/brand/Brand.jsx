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
import ButtonBoolean from '../../components/inputs/ButtonBoolean';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import Form from '../../components/brand/Form';
import fetchData from '../../Backend/fetchData';
import masterData from '../../Backend/master.backend';
import { confirmation, successAlert } from '../../utils/alerts';
import TableHeader from '../../components/table/TableHeader';
import { BRAND_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import CustomeButton from "../../components/inputs/Button";
import renderTwoLevelArray from '../../utils/twoLevelArrayViewer';
import TwoLevelArrayViewer from '../../utils/twoLevelArrayViewer';
import { BsBoxSeam } from 'react-icons/bs';
import Loader from '../../components/loader/Loader';


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
                <ButtonBoolean
                    setState={setIsShow}
                >
                    Add Brand
                </ButtonBoolean>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by brand name..."
                    setValue={setDebounceSearch}
                />
            </div>

            {/* display table */}
            <div className="panel">
                {
                    isLoading ? (
                        <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <TableHeader columns={BRAND_COLUMN} />
                            {data?.data.length === 0 ? (
                                <div className="relative table-responsive mb-5 min-h-56">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 flex flex-col items-center justify-center gap-4">
                                        <BsBoxSeam fontSize={40} color="grey" />
                                        <p className="text-base text-gray-400 font-semibold">
                                            No Records Found
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                data?.data?.map((item, idx) => (
                                    <TableRow
                                        key={idx}
                                        columns={BRAND_COLUMN}
                                        row={{
                                            id: item?.id,
                                            logo: (
                                                <img
                                                    src={`${imageUrl}/${item?.logo}`}
                                                    alt="img"
                                                    className="h-16 w-16 object-contain"
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
                                )))
                            }
                        </>
                    )
                }
            </div>


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
