import React, { useEffect, useState } from 'react'
import { FiHome, FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
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
import inward from '../../Backend/inward.fetch'
// import Loader from '../../components/loader/Loader'


const headerLink = [
    { title: "inward", link: "/inward" },
    { title: "create-inward" },
]

const CreateInward = () => {
    const { poNo } = useParams();
    const location = useLocation();
    const grn_no = location.state?.grn_no;

    const [activeTab, setActiveTab] = useState(1);

    /** for accordian */
    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue == value.id ? '' : String(value.id);
        });
    };

    const { mutateAsync: createData, isPending: createDataPending } = masterData.TQCreateMaster();

    const { data, isLoading } = order.TQPurchaseOrderItemDetails({ poNo, noLimit: true }, Boolean(poNo));
    const details = data?.data;
    const purchasOrderItems = details?.items;

    const { data: inwardData, isLoading: inwardLoading } = inward.TQInwardItemDetails(poNo, Boolean(poNo));

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
        const sourceData = inwardData?.data;
        if (!sourceData?.length) return;

        const items = sourceData.map(item => {
            // Find the matching PO item using the buyer_product_id
            const matchingPoItem = purchasOrderItems?.find(
                (poItem) => poItem.buyer_product_id === item.buyer_product_id
            );

            const allocations = item.outwardItemAllocations?.length > 0
                ? item.outwardItemAllocations.map(alloc => ({
                    batch_no: alloc.batch_no || "",
                    qty: item.requested_qty,
                    d_qty: "",
                    s_qty: "",
                    r_qty: item.requested_qty,
                    e_date: alloc.expiry_date ? alloc.expiry_date.split('T')[0] : "",
                }))
                : [{
                    batch_no: "",
                    qty: item.requested_qty,
                    d_qty: "",
                    s_qty: "",
                    r_qty: item.requested_qty,
                    e_date: ""
                }];

            return {
                // id: item.id,
                po_item_id: matchingPoItem ? matchingPoItem.id : null,
                vendor_product_id: item.vendor_product_id,
                buyer_product_id: item.buyer_product_id,
                allocations
            };
        });

        reset({ items });
    }, [inwardData?.data, purchasOrderItems, reset]);


    async function submitForm(data) {
        if (!details?.po_no || !grn_no) {
            warningAlert("Missing PO Number or GRN Number");
            return;
        }

        data.po_no = details?.po_no || poNo;
        data.grn_no = grn_no;

        console.log("Submitting Form Data:", data);

        // const res = await createData({ path: "/inward/create", formData: data });
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
                addButton={false}
                showSearch={false}
            />

            {!data ?
                <NoRecord />
                : <form onSubmit={handleSubmit(submitForm)}>
                    <div className="panel space-y-6 mt-2">

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
                        <div className="max-h-96 overflow-auto shadow-sm">
                            <div className="space-y-4">
                                {fields?.map((field, idx) => {
                                    const item = inwardData?.data?.[idx]; // 🔗 FULL DATA
                                    const product = item?.buyer_product_details;

                                    if (!item) return null;

                                    const reqQtyNum = Number(item.requested_qty) || 0;

                                    return (
                                        <div
                                            className={`border border-[#d3d3d3] rounded bg-white overflow-hidden`}
                                            key={field.id}
                                        >
                                            {/* product listing */}
                                            <div
                                                className={`flex items-center justify-between cursor-pointer px-4 bg-gray-50`}
                                                onClick={() => togglePara(item)}
                                            >
                                                <table className="w-full">
                                                    <thead>
                                                        <tr
                                                            className={`py-3 w-full flex items-center justify-between ${active === `${item?.id}` ? 'text-blue-600' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {/* 1️⃣ barcode */}
                                                            {product?.barcode &&
                                                                <th className="w-[20%] text-start break-words !pr-0 font-medium">
                                                                    {product?.barcode}
                                                                </th>
                                                            }

                                                            {/* 2️⃣ name */}
                                                            <th className="w-[20%] text-start truncate font-semibold">
                                                                {product?.name}
                                                            </th>

                                                            {/* 3️⃣ sku */}
                                                            <th className="w-[20%] text-start truncate !px-0 font-mono text-xs">
                                                                {product?.sku}
                                                            </th>

                                                            {/* 4️⃣ product_type */}
                                                            <th className="w-[15%] text-start truncate !px-0 uppercase text-[11px] font-bold tracking-wider">
                                                                {product?.product_type}
                                                            </th>

                                                            {/* 5️⃣ requested_qty */}
                                                            <th className="w-[15%] text-start truncate !px-0">
                                                                Req. Qty: <span className="font-bold">{item.requested_qty} {product?.unit_type}</span>
                                                            </th>

                                                            {/* 6️⃣ Expand icon */}
                                                            <th className="w-[10%] flex justify-end !px-0">
                                                                <div className={`transition-transform duration-200 ${active === `${item?.id}` ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}>
                                                                    <IconCaretDown className='w-6 h-6' />
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                </table>
                                            </div>

                                            {/* table view mapping over allocations */}
                                            <AnimateHeight duration={300} height={active === `${item?.id}` ? 'auto' : 0}>
                                                <div className="space-y-4 p-5 text-gray-700 text-[13px] border-t border-[#d3d3d3] bg-white">
                                                    {field.allocations?.map((alloc, allocIdx) => (
                                                        <div key={allocIdx} className="grid grid-cols-6 gap-4 items-start border-b border-gray-100 pb-5 mb-2 last:border-0 last:pb-0 last:mb-0">
                                                            {/* Batch No */}
                                                            <div className="">
                                                                <Input
                                                                    label="Batch No:"
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.batch_no`)}
                                                                />
                                                            </div>

                                                            {/* Order Qty */}
                                                            <div className="">
                                                                <Input
                                                                    label="Alloc Qty:"
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.qty`)}
                                                                    disabled={true}
                                                                    required={true}
                                                                />
                                                            </div>

                                                            {/* Damage Qty */}
                                                            <div className="">
                                                                <Input
                                                                    label="Damage Qty:"
                                                                    placeholder="0"
                                                                    className="text-red-500"
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.d_qty`, {
                                                                        min: {
                                                                            value: 0,
                                                                            message: "Cannot be negative"
                                                                        },
                                                                        validate: (value) => Number(value || 0) <= reqQtyNum || "Exceeds max req qty",
                                                                        pattern: {
                                                                            value: /^(0|[1-9]\d*(\.\d+)?)$/,
                                                                            message: "Numbers only"
                                                                        },
                                                                    })}
                                                                    error={errors?.items?.[idx]?.allocations?.[allocIdx]?.d_qty?.message}
                                                                />
                                                            </div>

                                                            {/* Shortage Qty */}
                                                            <div className="">
                                                                <Input
                                                                    label="Shortage Qty:"
                                                                    placeholder="0"
                                                                    className="text-red-500"
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.s_qty`, {
                                                                        min: {
                                                                            value: 0,
                                                                            message: "Cannot be negative"
                                                                        },
                                                                        validate: (value) => Number(value || 0) <= reqQtyNum || "Exceeds max req qty",
                                                                        pattern: {
                                                                            value: /^(0|[1-9]\d*(\.\d+)?)$/,
                                                                            message: "Numbers only"
                                                                        }
                                                                    })}
                                                                    error={errors?.items?.[idx]?.allocations?.[allocIdx]?.s_qty?.message}
                                                                />
                                                            </div>

                                                            {/* Receive Qty */}
                                                            <div className="">
                                                                <Input
                                                                    label="Receive Qty:"
                                                                    placeholder="0"
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.r_qty`, {
                                                                        min: {
                                                                            value: 0,
                                                                            message: "Cannot be negative"
                                                                        },
                                                                        validate: {
                                                                            notEmpty: (value) => value !== "" || "Required!!!",
                                                                            notExceedBase: (value) => Number(value || 0) <= reqQtyNum || "Exceeds max qty",
                                                                            invalideEntry: (value) => {
                                                                                const d_qty = Number(getValues(`items.${idx}.allocations.${allocIdx}.d_qty`) || 0);
                                                                                const s_qty = Number(getValues(`items.${idx}.allocations.${allocIdx}.s_qty`) || 0);
                                                                                const total = d_qty + s_qty + Number(value || 0);

                                                                                return total <= reqQtyNum || "";
                                                                            },
                                                                        },
                                                                        pattern: {
                                                                            value: /^(0|[1-9]\d*(\.\d+)?)$/,
                                                                            message: "Numbers only"
                                                                        }
                                                                    })}
                                                                    required={true}
                                                                    error={errors?.items?.[idx]?.allocations?.[allocIdx]?.r_qty?.message}
                                                                />
                                                            </div>

                                                            {/* Expiry Date */}
                                                            <div className="">
                                                                <Input
                                                                    type="date"
                                                                    label="Expiry Date:"
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.e_date`)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Total Validation Display - loops error check */}
                                                    {field.allocations?.map((alloc, allocIdx) => (
                                                        errors?.items?.[idx]?.allocations?.[allocIdx]?.r_qty?.type === "invalideEntry" ? (
                                                            <div key={`err-${allocIdx}`} className="flex items-center justify-center p-2 bg-red-50 text-red-600 rounded">
                                                                <p className="text-sm font-bold">Invalid Qty on row {allocIdx + 1}!!! Ensure Receive + Damage + Shortage does not exceed Requested Qty.</p>
                                                            </div>
                                                        ) : null
                                                    ))}

                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* button section */}
                        <div className="flex justify-end">
                            <Button
                                type='submit'
                                loading={createDataPending}
                            >
                                Receive & Post
                            </Button>
                        </div>
                    </div>
                </form >
            }
        </div>
    )
}

export default CreateInward