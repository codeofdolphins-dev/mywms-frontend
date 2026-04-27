import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@mantine/core'
import { FiCheckCircle, FiPackage, FiCalendar, FiHash } from 'react-icons/fi'
import masterData from '../../../Backend/master.backend'
import fetchData from '../../../Backend/fetchData.backend'
import Input from '../../inputs/Input'
import RHSelect from '../../inputs/RHF/Select.RHF'



const ProductionReceiptForm = ({ productionOrder, setIsShow }) => {
    const [previewData, setPreviewData] = useState(null);

    const { mutateAsync: createData, isPending: createIsPending } = masterData.TQCreateMaster(["productionReceiptList"]);

    /**************** data fetching *******************/
    const { data: storeList, isLoading: storesLoading } = fetchData.TQStoreList(
        { noLimit: true, store_type: "fg_store", isAdmin: true }
    );


    /**************** form *******************/
    const { register, handleSubmit, control, reset, formState: { errors }, } = useForm({
        defaultValues: {
            production_order_id: productionOrder?.id ?? "",
            product_id: productionOrder?.target_product_id ?? "",
            fg_store_id: "",
            received_qty: "",
            mfg_date: "",
        },
    });


    /**************** submit handlers *******************/
    function onPreview(data) {
        setPreviewData(data);
    }

    /** handle confirm submit */
    async function handleConfirmSubmit() {
        try {
            const res = await createData({ path: "/production-receipt/create", formData: previewData });
            if (res?.success) {
                reset();
                setPreviewData(null);
                setIsShow?.(false);
            }
        } catch (err) {
            console.error(err);
        }
    }


    /**************** helpers *******************/
    const getLabel = (list, id) =>
        list?.data?.find((i) => i.id === (id?.id ?? id))?.name ?? "—";

    return (
        <div className="panel" id="production-receipt-form">

            {!previewData ? (
                /* ─────────── FORM ─────────── */
                <form onSubmit={handleSubmit(onPreview)} className="space-y-5">

                    {/* Header hint */}
                    <div className="flex items-center gap-2 mb-1">
                        <FiPackage className="text-indigo-500" size={18} />
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Production Receipt Details
                        </span>
                    </div>

                    {/* ── Row 1: Production Order ID (read-only) + Receipt No ── */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Production Order"
                                value={productionOrder?.production_order_no ?? ""}
                                readOnly
                                disabled
                            />
                            {/* hidden field carrying the numeric FK */}
                            <input
                                type="hidden"
                                {...register("production_order_id", { required: true })}
                            />
                        </div>
                        <div>
                            <Input
                                label="Receipt No"
                                placeholder="Auto-generated"
                                {...register("receipt_no")}
                            />
                        </div>
                    </div>

                    {/* ── Row 2: Finished Good + FG Store ── */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Finished Good"
                            disabled
                            value={productionOrder?.targetProduct?.name}
                        />

                        <Controller
                            name="fg_store_id"
                            control={control}
                            rules={{ required: "Select FG Store!!!" }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => { ref({ focus: () => el?.focus() }); }}
                                    value={value}
                                    onChange={onChange}
                                    label="FG Store (Destination)"
                                    options={storeList?.data ?? []}
                                    isLoading={storesLoading}
                                    placeholder="Select FG store..."
                                    error={error?.message}
                                    required
                                />
                            )}
                        />
                    </div>

                    {/* ── Row 3: Received Qty + Mfg Date ── */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Received Qty"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("received_qty", {
                                required: "Received quantity is required!!!",
                                min: { value: 0.01, message: "Must be greater than 0" },
                            })}
                            error={errors.received_qty?.message}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <span className="flex items-center gap-1">
                                    <FiCalendar size={13} />
                                    Mfg. Date
                                </span>
                            </label>
                            <input
                                type="date"
                                className="form-input w-full"
                                {...register("mfg_date")}
                            />
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className="flex justify-end pt-2">
                        <Button
                            variant="filled"
                            color="indigo"
                            size="md"
                            radius="md"
                            type="submit"
                        >
                            Preview Receipt
                        </Button>
                    </div>
                </form>

            ) : (
                /* ─────────── PREVIEW ─────────── */
                <div className="space-y-5">

                    <div className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" size={18} />
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Receipt Preview
                        </span>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-4">

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Production Order</p>
                                <p className="font-medium text-gray-800">
                                    {productionOrder?.production_order_no ?? previewData.production_order_id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">
                                    <span className="flex items-center gap-1"><FiHash size={11} />Receipt No</span>
                                </p>
                                <p className="font-medium text-gray-800">
                                    {previewData.receipt_no || <span className="italic text-gray-400">Auto-generated</span>}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Finished Good</p>
                                <p className="font-medium text-gray-800">
                                    {productionOrder?.targetProduct?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">FG Store</p>
                                <p className="font-medium text-gray-800">
                                    {getLabel(storeList, previewData.fg_store_id)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Received Qty</p>
                                <p className="font-bold text-gray-800">{previewData.received_qty}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">
                                    <span className="flex items-center gap-1"><FiCalendar size={11} />Mfg. Date</span>
                                </p>
                                <p className="font-medium text-gray-800">
                                    {previewData.mfg_date || <span className="italic text-gray-400">Not specified</span>}
                                </p>
                            </div>
                        </div>

                        {/* <div className="text-sm">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Status</p>
                            <span
                                className={`badge uppercase whitespace-nowrap ${previewData.status?.id === "accepted"
                                    ? "bg-success"
                                    : previewData.status?.id === "rejected"
                                        ? "bg-danger"
                                        : "bg-warning"
                                    }`}
                            >
                                {previewData.status?.name ?? previewData.status}
                            </span>
                        </div> */}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between items-center pt-2">
                        <Button
                            variant="light"
                            color="gray"
                            onClick={() => setPreviewData(null)}
                        >
                            Back to Edit
                        </Button>
                        <Button
                            variant="filled"
                            color="indigo"
                            onClick={handleConfirmSubmit}
                        >
                            Confirm &amp; Submit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionReceiptForm;
