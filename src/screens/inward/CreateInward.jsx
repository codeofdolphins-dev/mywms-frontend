import React, { useEffect, useState } from 'react'
import { FiHome, FiPlus } from 'react-icons/fi'
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
import { FcDocument } from 'react-icons/fc'
// import Loader from '../../components/loader/Loader'


const headerLink = [
    { title: "inward", link: "/inward" },
    { title: "create-inward" },
]

const CreateInward = () => {
    const [searchParams] = useSearchParams();
    const poNo = searchParams.get("s") ?? "";

    const [activeTab, setActiveTab] = useState(1);
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

    const isEmpty = data?.data?.items?.length > 0 ? false : true;
    const isInternal = data?.data?.type === "internal" ? true : false;
    // const purchasOrderItems = data?.data?.items ?? [];
    const vendor = data?.data?.vendor;


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
            po_item_id: item?.id,
            product_id: item?.product_id,
            ...(item?.poi_product?.barcode && { barcode: item?.poi_product?.barcode }),
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

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "urgent": return "bg-danger";   // Red — most critical
            case "high": return "bg-orange-400";  // Orange/Yellow — high priority
            case "medium": return "bg-secondary"; // Grey — moderate
            default: return "bg-light";    // Fallback
        }
    }

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

                : <form onSubmit={handleSubmit(submitForm)}>
                    <div className="panel space-y-6">
                        
                        {/* detail section */}
                        <div className="max-h-56 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

                                {/* PO Card */}
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden border-t-[3px] border-t-blue-600">
                                    <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 border-b border-blue-100">
                                        <FcDocument size={20} />
                                        <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-wider">Purchase Order</span>
                                        <span className={`badge ${statusColor(data?.data?.priority)}`}>{data?.data?.priority?.toUpperCase() || "N/A"}</span>
                                    </div>
                                    <table className="w-full text-[13px] border-collapse">
                                        <tbody>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400 w-[45%]">PO Number</td>
                                                <td className="px-3.5 py-2 font-medium text-right">
                                                    <span className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                        #{data?.data?.po_no || "N/A"}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">Issue Date</td>
                                                <td className="px-3.5 py-2 font-medium text-right">{utcToLocal(data?.data?.createdAt)}</td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">Grand Total</td>
                                                <td className="px-3.5 py-2 text-right">
                                                    <span className="text-sm font-bold text-green-600 flex items-center justify-end gap-0.5">
                                                        <MdCurrencyRupee />
                                                        {data?.data?.grand_total}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">Note</td>
                                                <td className="px-3.5 py-2 text-right italic text-gray-400">
                                                    {data?.data?.note || "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-3.5 py-2 text-gray-400">Created By</td>
                                                <td className="px-3.5 py-2 text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                                                            {data?.data?.POcreatedBy?.name?.full_name?.slice(0, 2).toUpperCase() || "—"}
                                                        </div>
                                                        <span className="font-medium">
                                                            {data?.data?.POcreatedBy?.name?.full_name || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Supplier Card */}
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden border-t-[3px] border-t-violet-600">
                                    <div className="flex items-center justify-between px-3.5 py-2 bg-violet-50 border-b border-violet-100">
                                        <div className="flex items-center gap-2 ">
                                            <FiHome size={20} className='text-violet-600' />
                                            <span className="text-[12px] font-semibold text-violet-600 uppercase tracking-wider">Supplier Details</span>
                                        </div>
                                    </div>
                                    <table className="w-full text-[13px] border-collapse">
                                        <tbody>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400 w-[45%]">Supplier Name</td>
                                                <td className="px-3.5 py-2 font-medium text-right">
                                                    {vendor?.nodeDetails?.name || vendor?.name || "N/A"}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">GST No</td>
                                                <td className="px-3.5 py-2 text-right">
                                                    <span className="font-mono text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
                                                        {vendor?.nodeDetails?.gst_no || vendor?.gst_no || "N/A"}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">Location</td>
                                                <td className="px-3.5 py-2 font-medium text-right">
                                                    {vendor?.nodeDetails?.location || vendor?.location || "N/A"}
                                                </td>
                                            </tr>
                                            {/* Lat / Long */}
                                            <tr className="border-b border-gray-100">
                                                <td colSpan={2} className="p-0">
                                                    <div className="grid grid-cols-2">
                                                        <div className="px-3.5 py-1 border-r border-gray-100 flex gap-5">
                                                            <div className="text-gray-400 mb-0.5">Latitude</div>
                                                            <div className="font-mono font-medium">
                                                                {vendor?.nodeDetails?.address?.lat || vendor?.address?.lat || "N/A"}
                                                            </div>
                                                        </div>
                                                        <div className="px-3.5 flex gap-5">
                                                            <div className="text-gray-400 mb-0.5">Longitude</div>
                                                            <div className="font-mono font-medium">
                                                                {vendor?.nodeDetails?.address?.long || vendor?.address?.long || "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Address / Pincode */}
                                            <tr className="border-b border-gray-100">
                                                <td colSpan={2} className="p-0">
                                                    <div className="grid grid-cols-2">
                                                        <div className="px-3.5 py-1 border-r border-gray-100 flex gap-5">
                                                            <div className="text-gray-400 mb-0.5">Address</div>
                                                            <div className="font-medium">
                                                                {vendor?.nodeDetails?.address?.address || vendor?.address?.address || "N/A"}
                                                            </div>
                                                        </div>
                                                        <div className="px-3.5 flex gap-5">
                                                            <div className="text-gray-400 mb-0.5">Pincode</div>
                                                            <div className="font-mono font-medium">
                                                                {vendor?.nodeDetails?.address?.pincode || vendor?.address?.pincode || "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* State / District */}
                                            <tr>
                                                <td colSpan={2} className="p-0">
                                                    <div className="grid grid-cols-2">
                                                        <div className="px-3.5 py-1 border-r border-gray-100 flex gap-5">
                                                            <div className=" text-gray-400 mb-0.5">State</div>
                                                            <div className="font-medium">
                                                                {vendor?.nodeDetails?.address?.state || vendor?.address?.state || "N/A"}
                                                            </div>
                                                        </div>
                                                        <div className="px-3.5 flex gap-5">
                                                            <div className=" text-gray-400 mb-0.5">District</div>
                                                            <div className="font-medium ">
                                                                {vendor?.nodeDetails?.address?.district || vendor?.address?.district || "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        
                        {/* accordian section */}
                        <div className="max-h-96 overflow-auto">
                            <div className="space-y-2">
                                {fields?.map((field, idx) => {
                                    const item = purchasOrderItems?.[idx]; // 🔗 FULL DATA
                                    const product = item?.poi_product;

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
                                                            {product?.barcode &&
                                                                <th className="w-[20%] text-start break-words !pr-0">
                                                                    {product?.barcode}
                                                                </th>
                                                            }

                                                            {/* 2️⃣ name */}
                                                            <th className="w-[10%] text-start truncate">
                                                                {product?.name}
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
                                                                {product?.sub_category}
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