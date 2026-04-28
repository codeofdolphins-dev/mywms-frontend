import React, { useEffect, useState } from 'react'
import { FiHome, FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { useNavigate, useParams } from 'react-router-dom'
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
import Input from '../../components/inputs/Input'
import { useFieldArray, useForm } from 'react-hook-form'
import Loader from '../../components/loader/Loader'
import NoRecord from '../../components/NoRecord'
import { FcDocument } from 'react-icons/fc'
import inward from '../../Backend/inward.fetch'
import { Button } from '@mantine/core'


const headerLink = [
    { title: "inward", link: "/inward" },
    { title: "create-inward" },
]

const CreateInward = () => {
    const navigate = useNavigate();
    const { grn_no } = useParams();


    const { mutateAsync: createData, isPending: createDataPending } = masterData.TQCreateMaster(["inwardItemDetails"]);


    /** for accordian */
    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue == value.id ? '' : String(value.id);
        });
    };


    const { data: inwardData, isLoading: inwardLoading } = inward.TQInwardItemDetails(grn_no, Boolean(grn_no));
    const vendor = inwardData?.data?.vendor;
    const status = inwardData?.data?.status;


    const { handleSubmit, register, formState: { errors }, watch, control, reset, getValues, setValue } = useForm({
        defaultValues: { items: [] }
    });

    const { fields } = useFieldArray({
        control,
        name: "items"
    });


    /** prepare form for multiple items DYNAMIC */
    useEffect(() => {
        const sourceData = inwardData?.data?.grnLineItems;
        if (!sourceData?.length) return;

        const items = sourceData.map(item => {

            const allocations = item.grnItemBatches?.length > 0
                ? item.grnItemBatches.map(alloc => ({
                    grn_item_batch_id: alloc.id,
                    batch_no: alloc.batch_no || "",
                    qty: alloc.received_qty,
                    d_qty: "",
                    s_qty: "",
                    r_qty: alloc.received_qty,
                    e_date: alloc.expiry_date ? alloc.expiry_date.split('T')[0] : "",
                }))
                : [{
                    batch_no: "",
                    qty: item.ordered_qty,
                    d_qty: "",
                    s_qty: "",
                    r_qty: item.ordered_qty,
                    e_date: ""
                }];

            return {
                grn_item_id: item.id,
                ...(item.purchase_order_item_id && { po_item_id: item.purchase_order_item_id }),
                product_id: item.product_id,
                allocations
            };
        });

        reset({ items });
    }, [inwardData?.data, reset]);


    /** handle submit form error */
    const onSubmitError = (errors) => {
        // If there are errors in the items arrays, open the first accordion that has an error
        if (errors?.items) {
            let errorIndex = -1;
            if (Array.isArray(errors.items)) {
                errorIndex = errors.items.findIndex(err => err);
            } else {
                const keys = Object.keys(errors.items);
                if (keys.length > 0) errorIndex = keys[0];
            }

            if (errorIndex !== -1) {
                const item = inwardData?.data?.grnLineItems?.[errorIndex];
                if (item) {
                    setActive(String(item.id));
                }
            }
        }
    };

    /** handle submit form */
    async function submitForm(data) {
        if (!grn_no) {
            warningAlert("Missing GRN Number");
            return;
        }

        data.grn_no = grn_no;
        if (inwardData?.data?.purchase_order) data.po_no = inwardData?.data?.purchase_order;

        const res = await createData({ path: "/inward/create", formData: data });
        if (res.success) {
            navigate("/inward");
        }
    };

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "draft": return "bg-info";
            case "accepted": return "bg-success";
            default: return "bg-warning";
        }
    }

    if (inwardLoading) return <Loader />

    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                showSearch={false}
            />

            {!inwardData ?
                <NoRecord />
                : <form onSubmit={handleSubmit(submitForm, onSubmitError)}>
                    <div className="panel space-y-6 mt-2">

                        {/* detail section */}
                        <div className="max-h-56 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

                                {/* PO Card */}
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden border-t-[3px] border-t-blue-600">
                                    <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 border-b border-blue-100">
                                        <FcDocument size={20} />
                                        <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-wider">Good Receipt Note (GRN)</span>
                                        <span className={`badge ${statusColor(inwardData?.data?.status)}`}>{inwardData?.data?.status?.toUpperCase() || "N/A"}</span>
                                    </div>
                                    <table className="w-full text-[13px] border-collapse">
                                        <tbody>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400 w-[45%]">GRN Number</td>
                                                <td className="px-3.5 py-2 font-medium text-right">
                                                    #
                                                    <span className="ml-1 font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                        {inwardData?.data?.grn_no || grn_no || "N/A"}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400 w-[45%]">Reference (PO)</td>
                                                <td className="px-3.5 py-2 font-medium text-right">
                                                    #
                                                    <span className="ml-1 font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                        {inwardData?.data?.purchase_order || "N/A"}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">Issue Date</td>
                                                <td className="px-3.5 py-2 font-medium text-right">{utcToLocal(inwardData?.data?.createdAt)}</td>
                                            </tr>
                                            {/* <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">Grand Total</td>
                                                <td className="px-3.5 py-2 text-right">
                                                    <span className="text-sm font-bold text-green-600 flex items-center justify-end gap-0.5">
                                                        <MdCurrencyRupee />
                                                        {inwardData?.data?.grand_total || "0"}
                                                    </span>
                                                </td>
                                            </tr> */}
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3.5 py-2 text-gray-400">Note</td>
                                                <td className="px-3.5 py-2 text-right italic text-gray-400">
                                                    {inwardData?.data?.note || "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-3.5 py-2 text-gray-400">Created By</td>
                                                <td className="px-3.5 py-2 text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                                                            {
                                                                inwardData?.data?.created_by?.name?.full_name?.slice(0, 2).toUpperCase() ||
                                                                inwardData?.data?.creator?.name?.full_name?.slice(0, 2).toUpperCase() ||
                                                                "—"
                                                            }
                                                        </div>
                                                        <span className="font-medium">
                                                            {
                                                                inwardData?.data?.created_by?.name?.full_name ||
                                                                inwardData?.data?.creator?.name?.full_name ||
                                                                "N/A"
                                                            }
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
                                                <td className="px-3.5 py-2 text-gray-400">Email</td>
                                                <td className="px-3.5 py-2 text-right">
                                                    <span className="font-mono text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
                                                        {vendor?.nodeDetails?.gst_no || vendor?.contact_email || "N/A"}
                                                    </span>
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
                                    const item = inwardData?.data?.grnLineItems?.[idx]; // 🔗 FULL DATA
                                    const product = item?.grnProduct;

                                    if (!item) return null;

                                    const reqQtyNum = Number(item.ordered_qty) || 0;

                                    return (
                                        <div
                                            className={`border border-[#d3d3d3] rounded bg-white overflow-hidden`}
                                            key={field.id}
                                        >
                                            {/* product listing */}
                                            <div
                                                className={`flex items-center justify-between cursor-pointer px-4 ${errors?.items?.[idx] ? 'bg-red-100' : 'bg-gray-50'}`}
                                                onClick={() => togglePara(item)}
                                            >
                                                <table className="w-full">
                                                    <thead>
                                                        <tr
                                                            className={`py-3 w-full flex items-center justify-between ${active === `${item?.id}` ? 'text-blue-600' : (errors?.items?.[idx] ? 'text-red-500' : 'text-gray-700')
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
                                                                Req. Qty: <span className="font-bold">{item.ordered_qty} {product?.unit_type}</span>
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
                                                                    disabled={status === "accepted"}
                                                                />
                                                            </div>

                                                            {/* Order Qty */}
                                                            <div className="">
                                                                <Input
                                                                    label="Requested Qty:"
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
                                                                    disabled={status === "accepted"}
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.d_qty`, {
                                                                        onChange: (e) => {
                                                                            const d_qty = Number(e.target.value) || 0;
                                                                            const s_qty = Number(getValues(`items.${idx}.allocations.${allocIdx}.s_qty`)) || 0;
                                                                            const qty = Number(getValues(`items.${idx}.allocations.${allocIdx}.qty`)) || 0;
                                                                            const new_r_qty = qty - d_qty - s_qty;
                                                                            setValue(`items.${idx}.allocations.${allocIdx}.r_qty`, new_r_qty >= 0 ? new_r_qty : 0, { shouldValidate: true });
                                                                        },
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
                                                                    disabled={status === "accepted"}
                                                                    {...register(`items.${idx}.allocations.${allocIdx}.s_qty`, {
                                                                        onChange: (e) => {
                                                                            const s_qty = Number(e.target.value) || 0;
                                                                            const d_qty = Number(getValues(`items.${idx}.allocations.${allocIdx}.d_qty`)) || 0;
                                                                            const qty = Number(getValues(`items.${idx}.allocations.${allocIdx}.qty`)) || 0;
                                                                            const new_r_qty = qty - d_qty - s_qty;
                                                                            setValue(`items.${idx}.allocations.${allocIdx}.r_qty`, new_r_qty >= 0 ? new_r_qty : 0, { shouldValidate: true });
                                                                        },
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
                                                                    disabled={status === "accepted"}
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
                                                                    disabled={status === "accepted"}
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
                        {status !== "accepted" && (
                            <div className="flex justify-end">
                                <Button
                                    type='submit'
                                    loading={createDataPending}
                                >
                                    Receive & Post
                                </Button>
                            </div>
                        )}
                    </div>
                </form >
            }
        </div>
    )
}

export default CreateInward