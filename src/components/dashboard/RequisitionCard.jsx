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
import secureLocalStorage from 'react-secure-storage';

const RequisitionCard = ({ details = null, setIsRequisitionCardShow }) => {
    const buyerTenant = secureLocalStorage.getItem("tenant");

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

    // console.log(details)
    // console.log(buyerTenant)

    return (
        <div className="panel p-0 overflow-hidden relative">

            {/* Header Area */}
            <div className="relative bg-primary/10 dark:bg-primary/5 p-6 pb-8">
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-4 items-start">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-[#e0e6ed] flex items-center justify-center p-1 relative z-20 overflow-hidden shrink-0">
                            <ImageComponent
                                src={details?.meta?.image}
                                dummyImage={3}
                                className={"w-full h-full object-cover"}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                <h2 className="text-xl font-bold leading-tight">
                                    {details?.meta?.name ?? "Dummy Company"}
                                </h2>
                                <span
                                    className={`badge shrink-0 rounded-full capitalize ${details?.priority?.toLowerCase() === "high"
                                        ? "badge-outline-danger"
                                        : details?.priority?.toLowerCase() === "normal"
                                            ? "badge-outline-primary"
                                            : "badge-outline-secondary"
                                        }`}
                                >
                                    {details?.priority}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-white-dark flex items-center gap-1.5">
                                <FiFileText size={14} />
                                {details?.title}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative background pattern */}
                <div className="absolute right-0 bottom-0 opacity-10 blur-sm transform translate-y-1/2 translate-x-1/4 text-primary">
                    <FiPackage size={120} />
                </div>
            </div>

            {/* Info Cards Grid - slightly overlapping the header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 -mt-6 relative z-20">
                <div className="bg-white dark:bg-[#1b2e4b] p-3 rounded-xl shadow-sm border border-[#e0e6ed] dark:border-[#191e3a] flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-dark/5 dark:bg-dark/20 text-white-dark flex items-center justify-center shrink-0">
                        <FiHash size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white-dark">RFQ No.</p>
                        <p className="text-sm font-semibold hover:text-primary cursor-pointer break-all">{details?.rfq_no}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1b2e4b] p-3 rounded-xl shadow-sm border border-[#e0e6ed] dark:border-[#191e3a] flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${details?.status === "open" ? "bg-success/10 text-success" : "bg-dark/5 dark:bg-dark/20 text-white-dark"
                        }`}>
                        <FiTag size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white-dark">Status</p>
                        <p className={`text-sm font-bold capitalize ${details?.status === "open" ? "text-success" : ""
                            }`}>{details?.status}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1b2e4b] p-3 rounded-xl shadow-sm border border-[#e0e6ed] dark:border-[#191e3a] flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                        <MdOutlineAttachMoney size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white-dark">Grand Total</p>
                        <p className="text-sm font-bold break-all">{currencyFormatter(details?.grand_total)}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1b2e4b] p-3 rounded-xl shadow-sm border border-[#e0e6ed] dark:border-[#191e3a] flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
                    <div className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0">
                        <FiMapPin size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white-dark">Location</p>
                        <p className="text-sm font-semibold truncate">{details?.meta?.location}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5">
                {/* Note */}
                {details?.note && (
                    <div className="mb-6 bg-warning/10 border-l border-warning p-4 rounded-xl flex gap-3 items-start">
                        <div className="text-warning mt-0.5">
                            <FiFileText size={18} />
                        </div>
                        <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-warning block mb-1">Note</span>
                            <p className="text-sm leading-relaxed text-white-dark">
                                {details?.note}
                            </p>
                        </div>
                    </div>
                )}

                {/* Items */}
                <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
                        <FiPackage className="text-primary" size={18} />
                        <h3 className="text-base font-bold">Requisition Items</h3>
                        <span className="badge bg-primary/10 text-primary rounded-full ml-auto">
                            {details?.items?.length || 0}
                        </span>
                    </div>

                    <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        <ul className="space-y-2">
                            {details?.items?.map((item, index) => (
                                <li
                                    key={item.id || index}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-[#1b2e4b] border border-[#e0e6ed] dark:border-[#191e3a] rounded-xl p-3 shadow-sm hover:border-primary transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                            {index + 1}
                                        </div>
                                        <span className="font-semibold text-sm">{item.product_name}</span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-11 sm:pl-0">
                                        <div className="bg-dark/5 dark:bg-dark/20 px-3 py-1.5 rounded-lg text-sm">
                                            <span className="font-bold">{item.qty}</span>
                                            <span className="text-white-dark text-xs ml-1 font-medium">{item.uom}</span>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {currencyFormatter(item.price_limit)} <span className="text-white-dark text-xs font-normal">/ {item.uom}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {(!details?.items || details?.items?.length === 0) && (
                            <div className="text-center py-6 text-white-dark text-sm">
                                No items found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-dark/5 dark:bg-dark/10 px-6 py-4 border-t border-[#e0e6ed] dark:border-[#1b2e4b] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-white-dark">
                    <FiClock size={14} />
                    <span>Created {formatCreatedAt(details?.createdAt)}</span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {details?.submission_deadline && (
                        <div className="flex items-center gap-1.5 text-sm badge badge-outline-danger py-1.5">
                            <FiClock size={14} />
                            <span>Deadline: {new Date(details?.submission_deadline).toLocaleDateString()}</span>
                        </div>
                    )}
                    {buyerTenant !== details?.buyer_tenant && (
                        <button
                            type="button"
                            onClick={previewCumSubmit}
                            className="btn btn-primary btn-sm"
                        >
                            Preview
                        </button>
                    )}
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