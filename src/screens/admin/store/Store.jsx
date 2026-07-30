import React, { useEffect, useState } from 'react';
import { FaPlus, FaWarehouse, FaIndustry, FaBox, FaLayerGroup } from 'react-icons/fa';
import { IoMdMore } from 'react-icons/io';
import { LiaSpinnerSolid } from "react-icons/lia";
import Breadcrumb from '../../../components/Breadcrumb';
import TableBody from '../../../components/table/TableBody';
import TableRow from '../../../components/table/TableRow';
import { STORE_LIST_COLUMN } from '../../../utils/helper';
import { Link } from 'react-router-dom';
import AddModal from '../../../components/Add.modal';
import CreateStoreForm from '../../../components/admin/Store/CreateStoreForm';
import fetchData from '../../../Backend/fetchData.backend';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconMenuNotes from '../../../components/Icon/Menu/IconMenuNotes';
import { MdOutlineDownload } from 'react-icons/md';
import CustomeButton from '../../../components/inputs/Button';
import masterData from '../../../Backend/master.backend';
import { confirmation } from '../../../utils/alerts';
import ComponentHeader from '../../../components/ComponentHeader';
import IconPencil from '../../../components/Icon/IconPencil';

// card code -> store_type expected by the API
const STORE_TYPE_BY_CODE = {
    RAW: "rm_store",
    MFG: "production",
    FIN: "fg_store",
};

const Store = () => {
    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["storeCount", "storeList"]);

    const { data: storeCount, isLoading: storeCountLoading } = fetchData.TQStoreCount();
    const countData = storeCount?.data || [];

    const getCount = (type) => {
        const item = countData.find(d => d.store_type === type);
        return item ? parseInt(item.count) : 0;
    };

    // total across every store type, shown on the "All Stores" card
    const totalCount = countData.reduce((sum, d) => sum + (parseInt(d.count) || 0), 0);

    // Top category cards
    const storeCategories = [
        {
            title: "RM Store",
            code: "RAW",
            type: "rm_store", // Keep this to map to the API
            icon: <FaBox />,
            count: getCount("rm_store"),
            bgColor: "bg-blue-50",
            activeBorder: "border-blue-600",
            textColor: "text-blue-600"
        },
        {
            title: "Production",
            code: "MFG",
            type: "production",
            icon: <FaIndustry />,
            count: getCount("production"),
            bgColor: "bg-amber-50",
            activeBorder: "border-amber-600",
            textColor: "text-amber-600"
        },
        {
            title: "FG Store",
            code: "FIN",
            type: "fg_store",
            icon: <FaWarehouse />,
            count: getCount("fg_store"),
            bgColor: "bg-emerald-50",
            activeBorder: "border-emerald-600",
            textColor: "text-emerald-600"
        },
    ];


    /**************** modal variables *******************/
    const [selectedStore, setSelectedStore] = useState(null);

    /**************** pagination variables *******************/
    const [activeStore, setActiveStore] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState(null);

    /**************** others variables *******************/
    const [editData, setEditData] = useState(null);


    /**************** data fetching GET *******************/
    const params = {
        ...(search && { name: search }),
        ...(!search && {
            page: currentPage,
            limit,
        }),
        isAdmin: true,
        // omitted when the "All Stores" card is active so every type comes back
        ...(activeStore && { store_type: STORE_TYPE_BY_CODE[activeStore] }),
    };

    useEffect(() => {
        setSearch(null);
        setCurrentPage(1);
    }, [activeStore]);

    const { data: storeList, isLoading: storeListLoading } = fetchData.TQStoreList(params);
    const isEmpty = storeList?.data?.length === 0 ? true : false;


    // reset edit data when modal closed
    useEffect(() => {
        if (selectedStore) return;

        setEditData(null);
    }, [selectedStore]);


    async function handleDelete(id) {
        try {
            const isConfirm = await confirmation("Are you sure you want to delete this store? This action cannot be undone.");

            if (isConfirm) {
                await deleteData({ path: `/store/delete/${id}` });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handelShow = (item) => {
        // console.log(item)
        setEditData(item);
        setSelectedStore(true);
    }


    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Breadcrumb
                options={[{ title: "store" }]}
                className='mb-1'
            />

            {/* 1. Top Category Cards with Add Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                {/* default card — clears the store type filter and lists every store */}
                <div
                    onClick={() => setActiveStore(null)}
                    className={`group rounded-2xl border-2 p-4 hover:shadow-md transition-all relative flex gap-5 items-center cursor-pointer bg-slate-50 ${!activeStore ? "border-slate-700 shadow-md" : "border-gray-200 shadow-sm"}
                    `}
                >
                    <div className="p-4 rounded-xl bg-white text-slate-700 text-2xl">
                        <FaLayerGroup />
                    </div>

                    <div className="w-full min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 truncate">All Stores</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ALL</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            {
                                storeCountLoading ? (
                                    <LiaSpinnerSolid size={15} className='animate-spin text-blue-400' />
                                ) : (
                                    <span className="text-sm text-blue-600 whitespace-nowrap">{totalCount} Store(s)</span>
                                )
                            }
                        </div>
                    </div>
                </div>

                {storeCategories.map((cat, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveStore(prev => prev === cat.code ? null : cat.code)}
                        className={`group rounded-2xl border-2 p-4 hover:shadow-md transition-all relative flex gap-5 items-center cursor-pointer ${cat.bgColor} ${activeStore === cat.code ? `${cat.activeBorder} shadow-md` : "border-gray-200 shadow-sm"}
                        `}
                    >

                        <div className={`p-4 rounded-xl bg-white ${cat.textColor} text-2xl`}>
                            {cat.icon}
                        </div>

                        <div className="w-full flex justify-between items-start">
                            <div className="self-start">
                                <h3 className="text-xl font-bold text-gray-800">{cat.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{cat.code}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    {
                                        storeCountLoading ? (
                                            <LiaSpinnerSolid size={15} className='animate-spin text-blue-400' />
                                        ) : (
                                            <span className="text-sm text-blue-600">{cat.count} Store(s)</span>
                                        )
                                    }
                                </div>
                            </div>

                            {/* The "Add" Icon for each category */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStore(cat.code)
                                }}
                                className="bg-gray-50 text-gray-400 p-2 rounded-full hover:bg-[#0052CC] hover:text-white transition-all shadow-sm"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            <div className="panel">
                <ComponentHeader
                    addButton={false}
                    searchPlaceholder='Search by name'
                    searchClassName='z-5'
                    setDebounceSearch={setSearch}
                />

                {/* table */}
                <div className="z-0 min-h-64 mt-5">
                    <TableBody
                        columns={STORE_LIST_COLUMN}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={storeList?.pagination?.totalPages || 1}
                        isEmpty={isEmpty}
                        isLoading={storeListLoading}
                    >
                        {
                            storeList?.data?.map((item, idx) => (
                                <TableRow
                                    key={item.id}
                                    columns={STORE_LIST_COLUMN}
                                    row={{
                                        name: item?.name,
                                        location: item?.location,
                                        category: item?.store_type === "rm_store" ? "RM Store" : item?.store_type === "fg_store" ? "FG Store" : "Production",
                                        linked: (
                                            <span className='text-sm capitalize'>
                                                {`${item?.parentBusinessNode?.nodeDetails?.name} - ${item?.parentBusinessNode?.nodeDetails?.location}`}
                                            </span>
                                        ),
                                        status: item?.isActive ? "Active" : "Inactive",
                                        action: (
                                            <div className='flex items-center justify-start space-x-2'>
                                                <CustomeButton onClick={() => handelShow(item)}>
                                                    <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                </CustomeButton>

                                                <CustomeButton
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                                </CustomeButton>

                                            </div>
                                        )
                                    }}
                                />
                            ))
                        }
                    </TableBody>
                </div>
            </div>

            <AddModal
                isShow={Boolean(selectedStore)}
                setIsShow={setSelectedStore}
                title={"Add New Store"}
                maxWidth='75'
            >
                <CreateStoreForm
                    selectedStore={selectedStore}
                    setSelectedStore={setSelectedStore}
                    editData={editData}
                />
            </AddModal>


        </div>
    );
};

export default Store;