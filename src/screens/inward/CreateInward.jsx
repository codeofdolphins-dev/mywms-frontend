import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link, useSearchParams } from 'react-router-dom'
import Accordian from '../../components/Accordian'
import TableHeader from '../../components/table/TableHeader'
import { QUOTATION_RECEIVE_COLUMN } from '../../utils/helper'
import TableRow from '../../components/table/TableRow'
import ComponentHeader from '../../components/ComponentHeader'
import AnimateHeight from 'react-animate-height'
import IconCaretDown from '../../components/Icon/IconCaretDown'
import TableBody from '../../components/table/TableBody'
import Dropdown from '../../components/Dropdown'
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots'
import masterData from '../../Backend/master.backend'
import { currencyFormatter } from '../../utils/currencyFormatter'
import { warningAlert } from '../../utils/alerts'
import { utcToLocal } from '../../utils/UTCtoLocal'
import { MdCurrencyRupee } from 'react-icons/md'
import purchaseOrder from '../../Backend/purchaseOrder'
import Input from '../../components/inputs/Input'
import { useForm } from 'react-hook-form'
import { Button } from '@mantine/core'


const headerLink = [
    { title: "inward", link: "/inward" },
    { title: "create-inward" },
]

const CreateInward = () => {
    const [searchParams] = useSearchParams();
    const reqNo = searchParams.get("s") ?? "";

    const [debounceSearch, setDebounceSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    /** set reset search value */
    useEffect(() => {
        if (debounceSearch.length > 0) return;
        setDebounceSearch(reqNo);
    }, [reqNo, debounceSearch])

    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue == value.id ? '' : String(value.id);
        });
    };

    const { handleSubmit, register, formState: { errors }, watch } = useForm();

    const { data, isLoading } = purchaseOrder.TQPurchaseOrderList({ poNo: debounceSearch });


    const details = data?.data;
    const purchasOrderItems = data?.data?.purchasOrderItems;

    console.log(purchasOrderItems);

    async function approveQ(id) {
        if (!id) {
            warningAlert();
            return;
        };

        try {
        } catch (error) {
            console.log(error)
        }
    };

    async function rejectQ(id) {
        if (!id) {
            warningAlert();
            return;
        };

        try {
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                className='mb-2 justify-between'
            />

            <form >
                <div className="panel space-y-6">
                    <div className="">
                        <div className='flex items-center'>
                            <span>Purchase Order Details</span>
                        </div>

                        <div className="max-h-32 overflow-auto mt-2">
                            <div className="flex justify-between sm:flex-row flex-col gap-6 border p-4 border-dotted rounded-lg bg-gray-100">

                                {/* PO details */}
                                <div className="xl:1/3 lg:w-2/5 sm:w-1/2 text-sm">
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">PO Number:</div>
                                        <span className='text-sm'># {details?.po_no || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Issued Date :</div>
                                        <span>{utcToLocal(details?.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Total Items:</div>
                                        <span className='text-sm'>{purchasOrderItems?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Grand Total:</div>
                                        <span className='flex items-center'>
                                            {currencyFormatter(details?.grand_total)}
                                        </span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Note:</div>
                                        <span> {details?.note || "N/A"} </span>
                                    </div>
                                </div>

                                {/* Node details */}
                                <div className="xl:1/3 lg:w-2/5 sm:w-1/2 text-sm">
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Supplier Name:</div>
                                        <div className="whitespace-nowrap">{details?.poToBusinessNode?.name || "N/A"}</div>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">GST No:</div>
                                        <div>{details?.poToBusinessNode?.nodeDetails?.gst_no || "N/A"}</div>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Location:</div>
                                        <div>{details?.poToBusinessNode?.nodeDetails?.location || "N/A"}</div>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2 gap-5">
                                        <div className="flex items-center w-full justify-between">
                                            <div className="text-white-dark">Lat:</div>
                                            <div>{details?.poToBusinessNode?.nodeDetails?.address?.lat || "N/A"}</div>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <div className="text-white-dark">Long:</div>
                                            <div>{details?.poToBusinessNode?.nodeDetails?.address?.long || "N/A"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center w-full justify-between mb-2 gap-5">
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">Address:</p>
                                            <p>{details?.poToBusinessNode?.nodeDetails?.address?.address || "N/A"}</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">Pincode:</p>
                                            <p>{details?.poToBusinessNode?.nodeDetails?.address?.pincode || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center w-full justify-between mb-2 gap-5">
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">State:</p>
                                            <p>{details?.poToBusinessNode?.nodeDetails?.address?.state || "N/A"}</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">District:</p>
                                            <p>{details?.poToBusinessNode?.nodeDetails?.address?.district || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-64 overflow-auto">
                        <div className="space-y-2">
                            {purchasOrderItems?.map((item, idx) => {
                                // const isEmpty = item?.quotation === null ? true : false;
                                const isEmpty = item?.quotation === null ? true : false;
                                const product = item?.poi_sourceRequisitionItem;

                                return (
                                    <div
                                        className={`border border-[#d3d3d3] rounded `}
                                        key={idx}
                                    >
                                        {/* supplier listing */}
                                        <div
                                            className={`flex items-center justify-between cursor-pointer`}
                                            onClick={() => togglePara(item)}
                                        >
                                            <table>
                                                <thead>
                                                    <tr
                                                        className={`py-1 w-full flex items-center justify-between ${active === `${item.id}` ? '!text-primary' : ''
                                                            }`}
                                                    >
                                                        {/* 1️⃣ barcode */}
                                                        <th className="w-[10%] text-start">
                                                            {product?.product?.barcode}
                                                        </th>

                                                        {/* 2️⃣ name */}
                                                        <th className="w-[10%] text-start truncate !px-0">
                                                            {product?.product?.name}
                                                        </th>

                                                        {/* 3️⃣ brand */}
                                                        <th className="w-[10%] text-center truncate !px-0">
                                                            {product?.brand}
                                                        </th>

                                                        {/* 4️⃣ category */}
                                                        <th className="w-[5%] text-start truncate !px-0">
                                                            {product?.category}
                                                        </th>

                                                        {/* 5️⃣ sub_category */}
                                                        <th className="w-[5%] text-start truncate !px-0">
                                                            {product?.sub_category || "-"}
                                                        </th>

                                                        {/* 6️⃣ Actions */}
                                                        <th className="w-[10%] flex justify-center !px-0">
                                                            {
                                                                !true &&
                                                                <div
                                                                    className="dropdown"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Dropdown
                                                                        placement="bottom-end"
                                                                        btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black hover:text-primary"
                                                                        button={<IconHorizontalDots className="w-6 h-6 rotate-90 opacity-70" />}
                                                                    >
                                                                        <ul className="!min-w-[170px]">
                                                                            <li>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => approveQ(item?.quotation?.id)}
                                                                                    className="text-success hover:!bg-success hover:!text-white"
                                                                                >
                                                                                    Approve & Send PO
                                                                                </button>
                                                                            </li>
                                                                            <li>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => rejectQ(item?.quotation?.id)}
                                                                                    className="text-danger hover:!bg-danger hover:!text-white"
                                                                                >
                                                                                    Reject Quotation
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    </Dropdown>
                                                                </div>
                                                            }
                                                            {/* </th> */}

                                                            {/* 7️⃣ Expand icon */}
                                                            {/* <th className="w-[5%] flex justify-center"> */}
                                                            <div className={`${active === `${item.id}` ? 'rotate-180' : ''}`}>
                                                                <IconCaretDown className='w-6 h-6' />
                                                            </div>

                                                        </th>
                                                    </tr>
                                                </thead>

                                            </table>
                                        </div>

                                        {/* table view */}
                                        <AnimateHeight duration={300} height={active === `${item.id}` ? 'auto' : 0}>
                                            <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3]">
                                                <input type="hidden" {...register("barcode")} />
                                                
                                                <div className="grid grid-cols-4 space-x-5">
                                                    <div className="">
                                                        <Input
                                                            label="Qty"
                                                            labelPosition="inline"
                                                            {...register("qty")}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <Input
                                                            label="Damage Qty"
                                                            labelPosition="inline"
                                                            {...register("d_qty")}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <Input
                                                            label="Shortage Qty"
                                                            labelPosition="inline"
                                                            {...register("s_qty")}
                                                        />
                                                    </div>
                                                    <div className="">
                                                        <Input
                                                            type="date"
                                                            label="Expiry Date"
                                                            labelPosition="inline"
                                                            {...register("e_date")}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </AnimateHeight>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-around gap-5">
                        <div className=''>
                            <Input
                                label="Batch Number:"
                                labelPosition="inline"
                                labelcolor="text-black whitespace-nowrap"
                                placeholder="Enter batch number..."
                                {...register("batch")}
                            />
                        </div>
                        <div className="">
                            <Button >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </form >
        </div>
    )
}

export default CreateInward