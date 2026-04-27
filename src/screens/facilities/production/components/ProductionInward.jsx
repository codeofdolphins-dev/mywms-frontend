import React, { useEffect, useState } from 'react'
import { FiHome, FiPlus } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import ComponentHeader from '../../../../components/ComponentHeader'
import AnimateHeight from 'react-animate-height'
import IconCaretDown from '../../../../components/Icon/IconCaretDown'
import TableBody from '../../../../components/table/TableBody'
import Dropdown from '../../../../components/Dropdown'
import IconHorizontalDots from '../../../../components/Icon/IconHorizontalDots'
import { currencyFormatter } from '../../../../utils/currencyFormatter'
import { warningAlert } from '../../../../utils/alerts'
import { utcToLocal } from '../../../../utils/UTCtoLocal'
import { MdCurrencyRupee } from 'react-icons/md'
import Input from '../../../../components/inputs/Input'
import { useFieldArray, useForm } from 'react-hook-form'
import Loader from '../../../../components/loader/Loader'
import NoRecord from '../../../../components/NoRecord'
import { FcDocument } from 'react-icons/fc'
import inward from '../../../../Backend/inward.fetch'
import { Button } from '@mantine/core'
import masterData from '../../../../Backend/master.backend'
import { production } from '../../../../Backend/production.fetch'


const headerLink = [
    { title: "RM Issue", link: "/production/store/wip?tab=2" },
    { title: "RM Inward" }
]


const ProductionInward = () => {
    const navigate = useNavigate();
    const { to_no } = useParams();


    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["transferOrderItem", "transferOrderList"]);


    /** for accordian */
    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue == value.id ? '' : String(value.id);
        });
    };


    const { data: toDetails, isLoading, isError } = production.TQTransferOrderItem(to_no, Boolean(to_no));
    const status = toDetails?.data?.status;


    const { handleSubmit, register, formState: { errors }, watch, control, reset, getValues, setValue } = useForm({
        defaultValues: { items: [] }
    });

    const { fields } = useFieldArray({
        control,
        name: "items"
    });


    /** prepare form for multiple items DYNAMIC */
    useEffect(() => {
        const sourceData = toDetails?.data?.transferOrderItem;
        if (!sourceData?.length) return;

        const items = sourceData.map(item => {

            const allocations = item?.alloted_batch?.map(alloc => ({
                item_alloc_id: alloc.id,
                batch_no: alloc?.allocatedBatch?.batch_no || "",
                qty: Number(alloc?.allocated_qty),
                d_qty: Number(alloc?.demaged_qty) || "",
                s_qty: Number(alloc?.shortage_qty) || "",
                r_qty: Number(alloc?.allocated_qty),
                e_date: alloc?.allocatedBatch?.expiry_date
            }))

            return {
                item_id: item.id,
                product_id: item.product_id,
                allocations
            };
        });

        reset({ items });
    }, [toDetails?.data, reset]);


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
                const item = toDetails?.data?.transferOrderItem?.[errorIndex];
                if (item) {
                    setActive(String(item.id));
                }
            }
        }
    };

    /** handle submit form */
    async function submitForm(data) {
        if (!to_no) {
            warningAlert("Missing TO Number");
            return;
        }

        data.to_no = to_no;
        // console.log(data);
        // return;

        const res = await updateData({ path: "/transfer-order/receive", formData: data });
        if (res.success) {
            // navigate("/inward");
        }
    };

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "draft": return "bg-info";
            case "requested": return "bg-warning";
            case "dispatched": return "bg-success";
            case "received": return "bg-success";
            default: return "bg-warning";
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

            {!toDetails ?
                <NoRecord />
                : <form onSubmit={handleSubmit(submitForm, onSubmitError)}>
                    <div className="panel space-y-6 mt-2">

                        {/* accordian section */}
                        <div className="max-h-96 overflow-auto shadow-sm">
                            <div className="space-y-4">
                                {fields?.map((field, idx) => {
                                    const item = toDetails?.data?.transferOrderItem?.[idx]; // 🔗 FULL DATA
                                    const product = item?.transferProduct;

                                    if (!item) return null;

                                    const reqQtyNum = Number(item?.requested_qty);

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
                                                                    disabled={status === "received"}
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
                                                                    disabled={status === "received"}
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
                                                                    disabled={status === "received"}
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
                                                                    disabled={status === "received"}
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
                                                                    disabled={status === "received"}
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
                        {status !== "received" && (
                            <div className="flex justify-end">
                                <Button
                                    type='submit'
                                    loading={updatePending}
                                >
                                    Receive & Update Stock
                                </Button>
                            </div>
                        )}
                    </div>
                </form >
            }
        </div>
    )
}

export default ProductionInward;