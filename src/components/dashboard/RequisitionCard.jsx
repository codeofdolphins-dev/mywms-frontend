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
        <div className="bg-white shadow-lg rounded-2xl px-6 py-3 hover:shadow-xl transition-shadow duration-300 border border-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {details?.meta?.name ?? "Dummy Company"}
                        <span
                            className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold ${details?.priority?.toLowerCase() === "high"
                                ? "bg-red-100 text-red-700"
                                : details?.priority?.toLowerCase() === "normal"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700 invisible"
                                }`}
                        >
                            {details?.priority}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500">{details?.title}</p>
                </div>
                <div>
                    <ImageComponent
                        src={details?.meta?.image}
                        dummyImage={3}
                        className={"w-14 h-14"}
                    />
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="">
                        # <span className="text-gray-500 font-semibold hover:text-blue-600 cursor-pointer">{details?.rfq_no}</span>
                    </p>
                </div>
                <div>
                    <p className="text-gray-500">Status</p>
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${details?.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {details?.status}
                    </span>
                </div>
                <div>
                    <p className="text-gray-500">Grand Total</p>
                    <p className="font-semibold">{currencyFormatter(details?.grand_total)}</p>
                </div>
                <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-semibold">{details?.meta?.location}</p>
                </div>
            </div>

            {/* Note */}
            {details?.note && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Note:</span> {details?.note}
                    </p>
                </div>
            )}

            {/* Items */}
            <div className="mt-4">
                <p className="text-gray-700 font-semibold mb-2">Items</p>
                <div className="max-h-40 overflow-y-auto">
                    <ul className="space-y-1">
                        {details?.items?.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between bg-gray-50 rounded-lg px-3 py-2"
                            >
                                <span>{item.product_name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">
                                        {item.qty} {item.uom} • {currencyFormatter(item.price_limit)} / {item.uom}
                                    </span>
                                    {/* <div className='flex items-center justify-center space-x-3'>
                                        <CustomeButton
                                            onClick={() => selectEditItem(item.id)}
                                        >
                                            <IconPencil className="text-danger hover:scale-110 cursor-pointer w-4 h-4" />
                                        </CustomeButton>
                                    </div> */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-gray-500 border-t pt-3 flex justify-between items-center">
                <span>Created {formatCreatedAt(details?.createdAt)}</span>
                <div className="flex items-center gap-3">
                    {details?.submission_deadline && (
                        <span className="font-bold text-danger">Deadline: {new Date(details?.submission_deadline).toLocaleDateString()}</span>
                    )}
                    <Button
                        onClick={previewCumSubmit}
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