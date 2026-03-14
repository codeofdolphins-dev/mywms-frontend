import React, { useEffect, useState } from 'react'
import ImageComponent from '../ImageComponent'
import { formatCreatedAt } from '../../utils/UTCtoLocal';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { Button } from '@mantine/core';
import AddModal from '../Add.modal';
import CustomeButton from "../inputs/Button"
import IconPencil from '../Icon/IconPencil';
import EditItemForm from './form/EditItem.form';
import RFQPreview from './RFQPreview';
import { FiMapPin, FiClock, FiFileText, FiTag, FiHash, FiPackage } from 'react-icons/fi';
import { MdOutlineAttachMoney } from 'react-icons/md';

const RequisitionCard = ({ details = null, setIsRequisitionCardShow }) => {
    // console.log(details);
    const [data, setData] = useState(null);
    // const [rfqItemData, setRfqItemData] = useState(details?.items);

    const [isEditItem, setIsEditItem] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    // const [editItemData, setEditItemData] = useState(null);

    // console.log(rfqItemData);

    // extract selected item data for edit
    function selectEditItem(id) {
        // const item = rfqItemData?.find(i => id === i.id);
        // setEditItemData(item);
        // setIsEditItem(true);
    };

    // handel preview cum submit
    function previewCumSubmit() {
        setData({
            name: details?.meta?.name,
            location: details?.meta?.location,
            priority: details?.priority,
            rfq_no: details?.rfq_no,
            note: details?.note,
            // items: rfqItemData,
            items: details?.items,
        })

        setIsPreview(true);
    }

    // console.log(data)

    return (
        <div className="bg-white rounded-2xl p-0 overflow-hidden relative">

            {/* Header Area with modern gradient banner */}
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50 p-6 pb-8">
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-4 items-start">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-1 relative z-20 overflow-hidden shrink-0">
                            <ImageComponent
                                src={details?.meta?.image}
                                dummyImage={3}
                                className={"w-full h-full object-cover"}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                <h2 className="text-xl font-bold text-gray-800 leading-tight">
                                    {details?.meta?.name ?? "Dummy Company"}
                                </h2>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${details?.priority?.toLowerCase() === "high"
                                            ? "bg-red-50 text-red-600 border border-red-100 shadow-sm"
                                            : details?.priority?.toLowerCase() === "normal"
                                                ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                                                : "bg-gray-100 text-gray-700 shadow-sm invisible"
                                        }`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${details?.priority?.toLowerCase() === "high" ? "bg-red-500" :
                                            details?.priority?.toLowerCase() === "normal" ? "bg-blue-500" : "bg-gray-500"
                                        }`}></div>
                                    {details?.priority}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                <FiFileText size={14} className="text-gray-400" />
                                {details?.title}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative background pattern */}
                <div className="absolute right-0 bottom-0 opacity-10 blur-sm transform translate-y-1/2 translate-x-1/4">
                    <FiPackage size={120} />
                </div>
            </div>

            {/* Info Cards Grid - slightly overlapping the header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 -mt-6 relative z-20">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
                        <FiHash size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">RFQ No.</p>
                        <p className="text-sm font-semibold text-gray-800 hover:text-blue-600 cursor-pointer break-all">{details?.rfq_no}</p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${details?.status === "open" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                        }`}>
                        <FiTag size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</p>
                        <p className={`text-sm font-bold capitalize ${details?.status === "open" ? "text-green-600" : "text-gray-600"
                            }`}>{details?.status}</p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MdOutlineAttachMoney size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Grand Total</p>
                        <p className="text-sm font-bold text-gray-800 break-all">{currencyFormatter(details?.grand_total)}</p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                        <FiMapPin size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Location</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{details?.meta?.location}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5">
                {/* Note */}
                {details?.note && (
                    <div className="mb-6 bg-yellow-50/50 border border-yellow-200/60 p-4 rounded-xl flex gap-3 items-start">
                        <div className="text-yellow-500 mt-0.5">
                            <FiFileText size={18} />
                        </div>
                        <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-yellow-700 block mb-1">Note</span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {details?.note}
                            </p>
                        </div>
                    </div>
                )}

                {/* Items */}
                <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                        <FiPackage className="text-blue-500" size={18} />
                        <h3 className="text-base font-bold text-gray-800">Requisition Items</h3>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                            {details?.items?.length || 0}
                        </span>
                    </div>

                    <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        <ul className="space-y-2">
                            {details?.items?.map((item, index) => (
                                <li
                                    key={item.id || index}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                            {index + 1}
                                        </div>
                                        <span className="font-semibold text-gray-800 text-sm">{item.product_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-11 sm:pl-0">
                                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-sm">
                                            <span className="font-bold text-gray-700">{item.qty}</span>
                                            <span className="text-gray-500 text-xs ml-1 font-medium">{item.uom}</span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-600">
                                            {currencyFormatter(item.price_limit)} <span className="text-gray-400 text-xs font-normal">/ {item.uom}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {(!details?.items || details?.items?.length === 0) && (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                No items found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <FiClock size={14} className="text-gray-400" />
                    <span>Created {formatCreatedAt(details?.createdAt)}</span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {details?.submission_deadline && (
                        <div className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 font-semibold shadow-sm">
                            <FiClock size={14} />
                            <span>Deadline: {new Date(details?.submission_deadline).toLocaleDateString()}</span>
                        </div>
                    )}
                    <Button
                        onClick={previewCumSubmit}
                        color="blue"
                        radius="md"
                        size="sm"
                        className="shadow-md hover:shadow-lg transition-shadow"
                    >
                        Preview
                    </Button>
                </div>
            </div>


            {/* Edit item modal */}
            {/* <AddModal
                title="Edit Item"
                isShow={isEditItem}
                setIsShow={setIsEditItem}
            // placement='start'
            >
                <EditItemForm
                    setIsEditItem={setIsEditItem}
                    data={editItemData}
                />
            </AddModal> */}


            {/* preview cum submit modal */}
            <AddModal
                title="RFQ Preview"
                isShow={isPreview}
                setIsShow={setIsPreview}
                placement='start'
                maxWidth='55'
            >
                <RFQPreview
                    details={data}
                    setIsRequisitionCardShow={setIsRequisitionCardShow}
                    setIsPreviewCardShow={setIsPreview}
                />
            </AddModal>

        </div>
    )
}

export default RequisitionCard