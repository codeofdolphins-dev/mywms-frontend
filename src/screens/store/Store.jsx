import React, { useState } from 'react';
import { FaPlus, FaWarehouse, FaIndustry, FaBox } from 'react-icons/fa';
import { IoMdMore } from 'react-icons/io';
import Breadcrumb from '../../components/Breadcrumb';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import { STORE_LIST_COLUMN } from '../../utils/helper';
import { Link } from 'react-router-dom';
import AddModal from '../../components/Add.modal';
import CreateStoreForm from './CreateStoreForm';

const Store = () => {
    // Top category cards
    const storeCategories = [
        { title: "RM Store", code: "RAW", icon: <FaBox />, count: 5, color: "blue" },
        { title: "Production", code: "MFG", icon: <FaIndustry />, count: 2, color: "amber" },
        { title: "FG Store", code: "FIN", icon: <FaWarehouse />, count: 4, color: "emerald" },
    ];

    const [activeStore, setActiveStore] = useState("RAW");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isShow, setIsShow] = useState(null);


    // console.log(activeStore)

    const requisitionList = {};



    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Breadcrumb
                options={[{ title: "store" }]}
                className='mb-1'
            />

            {/* 1. Top Category Cards with Add Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                {storeCategories.map((cat, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveStore(cat.code)}
                        className={`group bg-${cat.color}-100 rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all relative flex gap-5 items-center cursor-pointer`}
                    >

                        <div className={`p-4 rounded-xl bg-${cat.color}-50 text-${cat.color}-600 text-2xl`}>
                            {cat.icon}
                        </div>

                        <div className="w-full flex justify-between items-start">
                            <div className="self-start">
                                <h3 className="text-xl font-bold text-gray-800">{cat.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{cat.code}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-sm text-blue-600 font-medium truncate">{cat.count} Locations</span>
                                </div>
                            </div>

                            {/* The "Add" Icon for each category */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsShow(cat.code)
                                }}
                                className="bg-gray-50 text-gray-400 p-2 rounded-full hover:bg-[#0052CC] hover:text-white transition-all shadow-sm"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            {/* table */}
            <div className="panel mt-5 z-0 min-h-64">
                <TableBody
                    columns={STORE_LIST_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    // totalPage={requisitionList?.meta?.totalPages || 1}
                    isEmpty={false}
                // isLoading={requisitionListLoading}
                >
                    {
                        requisitionList?.data?.map((item, idx) => (
                            <TableRow
                                key={item.id}
                                columns={STORE_LIST_COLUMN}
                                row={{
                                    id: (
                                        <Link to={`/quotation/received-quotation?s=${item.requisition_no}`} className='hover:underline text-primary' >
                                            {item?.requisition_no}
                                        </Link>
                                    ),
                                    title: item?.title,
                                    status: (
                                        <>
                                            <span className={`badge uppercase rounded-full ${statusColor(item?.status)}`}>
                                                {item?.status === "po_created" ? "po. created" : item?.status}
                                            </span>
                                        </>
                                    ),
                                    priority: (
                                        <>
                                            <span className={`badge uppercase rounded-full ${item?.priority === "high" ? "badge-outline-danger" : item?.priority === "normal" ? "badge-outline-primary" : "badge-outline-secondary"}`}>
                                                {item?.priority}
                                            </span>
                                        </>
                                    ),
                                    notes: item?.notes,
                                    grandTotal: item?.grandTotal,
                                    action: (
                                        <div className='flex items-center justify-center space-x-2'>
                                            <CustomeButton
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                            </CustomeButton>

                                            <CustomeButton onClick={() => handelShow(item.items)} >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>

                                            <CustomeButton onClick={() => handelDownload(item?.requisition_no)} >
                                                {requisitionPdf_pending && (downloadReqNo === item?.requisition_no)
                                                    ?
                                                    <span class="animate-spin border-[3px] border-black border-l-transparent rounded-full w-4 h-4 inline-block align-middle" />
                                                    :
                                                    <MdOutlineDownload
                                                        className="hover:scale-110 cursor-pointer w-5 h-5"
                                                        title='download'
                                                    />
                                                }
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        ))
                    }
                </TableBody>
            </div>

            <AddModal
                isShow={Boolean(isShow)}
                setIsShow={setIsShow}
                title={"Add New Store"}
                maxWidth='75'
            >
                <CreateStoreForm
                    setIsShow={setIsShow}
                />
            </AddModal>


        </div>
    );
};

export default Store;