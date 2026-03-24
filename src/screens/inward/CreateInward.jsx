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
import { order } from '../../Backend/order.fetch'
import Input from '../../components/inputs/Input'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@mantine/core'
import Loader from '../../components/loader/Loader'
import NoRecord from '../../components/NoRecord'
// import Loader from '../../components/loader/Loader'


const headerLink = [
    { title: "inward", link: "/inward" },
    { title: "create-inward" },
]

const CreateInward = () => {
    const [searchParams] = useSearchParams();
    const poNo = searchParams.get("s") ?? "";

    const [debounceSearch, setDebounceSearch] = useState("");

    /** set reset search value */
    useEffect(() => {
        if (debounceSearch.length > 0) return;
        setDebounceSearch(poNo);
    }, [poNo, debounceSearch]);

    /** for accordian */
    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue == value.id ? '' : String(value.id);
        });
    };

    const { mutateAsync: createData, isPending: createDataPending } = masterData.TQCreateMaster();

    const { data, isLoading } = order.TQPurchaseOrderItemDetails({ poNo: debounceSearch, noLimit: true }, Boolean(debounceSearch));
    const details = data?.data;
    const purchasOrderItems = details?.items;
    // console.log(details)


    const { handleSubmit, register, formState: { errors }, watch, control, reset, getValues } = useForm({
        defaultValues: {
            items: []
        }
    });
    const { fields } = useFieldArray({
        control,
        name: "items"
    });


    /** prepare form for multiple items DYNAMIC */
    useEffect(() => {
        if (!purchasOrderItems?.length) return;

        const items = purchasOrderItems.map(item => ({
            id: item?.id,
            product_id: item?.poi_sourceRequisitionItem?.product_id,
            barcode: item?.poi_sourceRequisitionItem?.product?.barcode,
            qty: item?.qty,
            d_qty: "",
            s_qty: "",
            r_qty: "",
            m_date: "",
            e_date: ""
        }));

        reset({ items });
    }, [purchasOrderItems, reset]);


    async function submitForm(data) {
        if (!details?.po_no) return;

        data.po_no = details?.po_no;
        console.log(data);

        const res = await createData({ path: "/inward/create", formData: data });
    };


    if (isLoading) return <Loader />

    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                className='mb-2 justify-between'
            />

            {!data ?
                <NoRecord />

                : <form onSubmit={handleSubmit(submitForm)} >
                    <div className="panel space-y-6">

                        {/* detail section */}
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

                        {/* accordian section */}
                        <div className="max-h-96 overflow-auto">
                            <div className="space-y-2">
                                {fields?.map((field, idx) => {
                                    const item = purchasOrderItems?.[idx]; // 🔗 FULL DATA
                                    const product = item?.poi_sourceRequisitionItem;

                                    // console.log(item)

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
                                                            className={`py-1 w-full flex items-center justify-between ${active === `${item?.id}` ? '!text-primary' : ''
                                                                }`}
                                                        >
                                                            {/* 1️⃣ barcode */}
                                                            <th className="w-[20%] text-start break-words !pr-0">
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

                                                            {/* 6️⃣ Expand icon */}
                                                            <th className="w-[10%] flex justify-center !px-0">
                                                                <div className={`${active === `${item?.id}` ? 'rotate-180' : ''}`}>
                                                                    <IconCaretDown className='w-6 h-6' />
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                </table>
                                            </div>

                                            {/* table view */}
                                            <AnimateHeight duration={300} height={active === `${item?.id}` ? 'auto' : 0}>
                                                <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3]">

                                                    <div className="grid grid-cols-6 space-x-5">
                                                        {/* Order Qty */}
                                                        <div className="">
                                                            <Input
                                                                label="Order Qty:"
                                                                // labelPosition="inline"
                                                                {...register(`items.${idx}.qty`)}
                                                                disabled={true}
                                                                required={true}
                                                            />
                                                        </div>

                                                        {/* Damage Qty */}
                                                        <div className="">
                                                            <Input
                                                                label="Damage Qty:"
                                                                // labelPosition="inline"
                                                                placeholder="Enter damage qty"
                                                                {...register(`items.${idx}.d_qty`, {
                                                                    min: {
                                                                        value: 0,
                                                                        message: "Damage qty cannot be negative"
                                                                    },
                                                                    validate: (value) => value <= item.qty || "Damage qty cannot exceed available qty",
                                                                    pattern: {
                                                                        value: /^(0|[1-9]\d*)$/,
                                                                        message: "Only numbers allowed"
                                                                    },
                                                                })}
                                                                error={errors?.items?.[idx]?.d_qty?.message}
                                                            />
                                                        </div>

                                                        {/* Shortage Qty */}
                                                        <div className="">
                                                            <Input
                                                                label="Shortage Qty:"
                                                                // labelPosition="inline"
                                                                placeholder="Enter shortage qty"
                                                                {...register(`items.${idx}.s_qty`, {
                                                                    min: {
                                                                        value: 0,
                                                                        message: "Damage qty cannot be negative"
                                                                    },
                                                                    validate: (value) => value <= item.qty || "Shortage qty cannot exceed available qty",
                                                                    pattern: {
                                                                        value: /^(0|[1-9]\d*)$/,
                                                                        message: "Only numbers allowed"
                                                                    }
                                                                })}
                                                                error={errors?.items?.[idx]?.s_qty?.message}
                                                            />
                                                        </div>

                                                        {/* Receive Qty */}
                                                        <div className="">
                                                            <Input
                                                                label="Receive Qty:"
                                                                // labelPosition="inline"
                                                                placeholder="Enter receive qty"
                                                                {...register(`items.${idx}.r_qty`, {
                                                                    min: {
                                                                        value: 0,
                                                                        message: "Receive qty cannot be negative"
                                                                    },
                                                                    validate: {
                                                                        notEmpty: (value) => value !== "" || "This field required!!!",
                                                                        notExceedBase: (value) => value <= item.qty || "Receive qty cannot exceed available qty",
                                                                        invalideEntry: (value) => {
                                                                            const d_qty = Number(getValues(`items.${idx}.d_qty`));
                                                                            const s_qty = Number(getValues(`items.${idx}.s_qty`));
                                                                            const total = d_qty + s_qty + Number(value || 0);

                                                                            return total <= item.qty || "";
                                                                        },
                                                                    },
                                                                    pattern: {
                                                                        value: /^(0|[1-9]\d*)$/,
                                                                        message: "Only numbers allowed"
                                                                    }
                                                                })}
                                                                required={true}
                                                                error={errors?.items?.[idx]?.r_qty?.message}
                                                            />
                                                        </div>

                                                        {/* Manufacturing Date */}
                                                        <div className="">
                                                            <Input
                                                                type="date"
                                                                label="Mfg. Date:"
                                                                {...register(`items.${idx}.m_date`)}
                                                            />
                                                        </div>

                                                        {/* Expiry Date */}
                                                        <div className="">
                                                            <Input
                                                                type="date"
                                                                label="Expiry Date:"
                                                                {...register(`items.${idx}.e_date`)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {
                                                        (errors?.items?.[idx]?.r_qty?.type === "invalideEntry") &&
                                                        <div className="flex items-center justify-center">
                                                            <p className="text-lg text-danger">Invalide Qty!!!</p>
                                                        </div>
                                                    }

                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* button section */}
                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-5 !mt-14">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Input
                                    label="Batch No:"
                                    labelPosition="inline"
                                    labelcolor="text-black whitespace-nowrap"
                                    placeholder="Enter batch number..."
                                    {...register("batch")}
                                />
                                <Input
                                    type="date"
                                    label="Receive Date:"
                                    labelPosition="inline"
                                    labelcolor="text-black whitespace-nowrap"
                                    placeholder="Enter batch number..."
                                    {...register("received_date")}
                                />
                            </div>
                            <div className="">
                                <Button
                                    type='submit'
                                    loading={createDataPending}
                                >
                                    Receive & Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </form >
            }
        </div>
    )
}

export default CreateInward