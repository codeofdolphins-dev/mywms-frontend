import React from 'react'
import Input from '../../../../components/inputs/Input'
import { useForm } from 'react-hook-form'
import { Button } from '@mantine/core'
import masterData from '../../../../Backend/master.backend'
import { utcToLocal } from '../../../../utils/UTCtoLocal'
import { warningAlert } from '../../../../utils/alerts'


const FgReceiveForm = ({ receipt, setIsShow }) => {
    const status = receipt?.status;

    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["productionReceiptItem", "productionReceiptList"]);


    const { handleSubmit, register, formState: { errors }, getValues, setValue } = useForm();


    /** Calculate expiry date from mfg date and shelf life */
    const calculateExpiryDate = (date) => {
        if (!date || !receipt?.receivedProduct?.has_expiry) return null;

        const expiryDate = new Date(date);
        const shelfLife = Number(receipt?.receivedProduct?.shelf_life) || 0;
        expiryDate.setDate(expiryDate.getDate() + shelfLife);
        return expiryDate;
    }


    /** status badge color */
    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-info";
            case "accepted": return "bg-success";
            case "rejected": return "bg-danger";
            default: return "bg-warning";
        }
    }


    /** handle submit form */
    async function submitForm(data) {
        if (!receipt?.receipt_no) {
            warningAlert("Missing Receipt Number");
            return;
        }

        data.pr_no = receipt.receipt_no;
        data.receipt_id = receipt?.id;

        // console.log("data", data);

        await updateData({ path: "/production-receipt/accept", formData: data });
        setIsShow(false);
    };


    if (!receipt) return null;

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <div className="panel space-y-6 mt-2">

                {/* Receipt Info Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">
                        {receipt?.receipt_no}
                    </h2>
                    <span className={`badge whitespace-nowrap uppercase ${statusColor(status)}`}>
                        {status?.replace("_", " ")}
                    </span>
                </div>

                {/* Details Grid - Read Only Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 bg-gray-50 rounded border border-gray-200">

                    {/* Production Order No */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Production Order No</label>
                        <p className="text-sm font-medium text-gray-800">
                            {receipt?.parentProductionOrder?.production_order_no ?? "-"}
                        </p>
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Product</label>
                        <p className="text-sm font-medium text-gray-800">
                            {receipt?.receivedProduct?.name ?? "-"}
                        </p>
                    </div>

                    {/* Barcode */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Barcode</label>
                        <p className="text-sm font-mono text-gray-800">
                            {receipt?.receivedProduct?.barcode ?? "-"}
                        </p>
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">SKU</label>
                        <p className="text-sm font-mono text-gray-800">
                            {receipt?.receivedProduct?.sku ?? "-"}
                        </p>
                    </div>

                    {/* FG Store */}
                    <div >
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Production</label>
                        <p className="text-sm font-medium text-gray-800">
                            {receipt?.fgStore?.name ?? "-"}
                        </p>
                    </div>

                    {/* MFG Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Manufacturing Date</label>
                        <p className="text-sm font-medium text-gray-800">
                            {receipt?.mfg_date ? utcToLocal(receipt.mfg_date) : "-"}
                        </p>
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Expiry Date</label>
                        <p className="text-sm font-medium text-red-600">
                            {utcToLocal(calculateExpiryDate(receipt.mfg_date))}
                        </p>
                    </div>
                </div>


                {/* Editable Form Fields */}
                <div className="border border-gray-200 rounded p-4 bg-white">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Receive Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                        {/* batch no */}
                        <Input
                            label="Batch No:"
                            placeholder="auto-generated"
                            disabled={status === "accepted"}
                            {...register("batch_no")}
                        />

                        {/* Received Qty */}
                        <Input
                            label="Received Qty:"
                            defaultValue={receipt?.send_qty}
                            disabled={status === "accepted"}
                            {...register("received_qty", {
                                required: "Required",
                                min: {
                                    value: 0,
                                    message: "Cannot be negative"
                                },
                                pattern: {
                                    value: /^(0|[1-9]\d*(\.\d+)?)$/,
                                    message: "Numbers only"
                                }
                            })}
                            error={errors?.received_qty?.message}
                        />

                        {/* Damage Qty */}
                        <Input
                            label="Damage Qty:"
                            {...(Number(receipt?.dmg_qty) > 0 ? { defaultValue: receipt?.dmg_qty } : {})}
                            placeholder="0"
                            className="text-red-500"
                            disabled={status === "accepted"}
                            {...register("damage_qty", {
                                onChange: (e) => {
                                    const d_qty = Number(e.target.value) || 0;
                                    const s_qty = Number(getValues("shortage_qty")) || 0;
                                    const total = Number(getValues("received_qty")) || 0;
                                    const accepted = total - d_qty - s_qty;
                                    setValue("accepted_qty", accepted >= 0 ? accepted : 0);
                                },
                                min: {
                                    value: 0,
                                    message: "Cannot be negative"
                                },
                                validate: (value) => Number(value || 0) <= Number(getValues("received_qty") || 0) || "Exceeds received qty",
                                pattern: {
                                    value: /^(0|[1-9]\d*(\.\d+)?)$/,
                                    message: "Numbers only"
                                }
                            })}
                            error={errors?.damage_qty?.message}
                        />

                        {/* Shortage Qty */}
                        <Input
                            label="Shortage Qty:"
                            {...(Number(receipt?.short_qty) > 0 ? { defaultValue: receipt?.short_qty } : {})}
                            placeholder="0"
                            className="text-red-500"
                            disabled={status === "accepted"}
                            {...register("shortage_qty", {
                                onChange: (e) => {
                                    const s_qty = Number(e.target.value) || 0;
                                    const d_qty = Number(getValues("damage_qty")) || 0;
                                    const total = Number(getValues("received_qty")) || 0;
                                    const accepted = total - d_qty - s_qty;
                                    setValue("accepted_qty", accepted >= 0 ? accepted : 0);
                                },
                                min: {
                                    value: 0,
                                    message: "Cannot be negative"
                                },
                                validate: (value) => Number(value || 0) <= Number(getValues("received_qty") || 0) || "Exceeds received qty",
                                pattern: {
                                    value: /^(0|[1-9]\d*(\.\d+)?)$/,
                                    message: "Numbers only"
                                }
                            })}
                            error={errors?.shortage_qty?.message}
                        />

                        {/* Accepted Qty (auto-calculated) */}
                        <Input
                            label="Accepted Qty:"
                            placeholder="0"
                            defaultValue={receipt?.received_qty > 0 ? receipt?.received_qty : receipt?.send_qty}
                            disabled={status === "accepted"}
                            {...register("accepted_qty", {
                                required: "Required",
                                min: {
                                    value: 0,
                                    message: "Cannot be negative"
                                },
                                validate: {
                                    notExceed: (value) => Number(value || 0) <= Number(getValues("received_qty") || 0) || "Exceeds received qty",
                                    invalidTotal: (value) => {
                                        const d_qty = Number(getValues("damage_qty") || 0);
                                        const s_qty = Number(getValues("shortage_qty") || 0);
                                        const total = d_qty + s_qty + Number(value || 0);
                                        return total <= Number(getValues("received_qty") || 0) || "Total exceeds received qty";
                                    }
                                },
                                pattern: {
                                    value: /^(0|[1-9]\d*(\.\d+)?)$/,
                                    message: "Numbers only"
                                }
                            })}
                            required={true}
                            error={errors?.accepted_qty?.message}
                        />
                    </div>
                </div>


                {/* Button Section */}
                {status !== "accepted" && (
                    <div className="flex justify-end">
                        <Button
                            type='submit'
                            loading={updatePending}
                        >
                            Accept & Update Stock
                        </Button>
                    </div>
                )}
            </div>
        </form>
    )
}

export default FgReceiveForm;