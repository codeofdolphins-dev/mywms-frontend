import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@mantine/core'
import { FiCheckCircle, FiPackage, FiCalendar, FiHash } from 'react-icons/fi'
import masterData from '../../../Backend/master.backend'
import fetchData from '../../../Backend/fetchData.backend'
import Input from '../../inputs/Input'
import RHSelect from '../../inputs/RHF/Select.RHF'
import TextArea from '../../inputs/TextArea'
import SearchableSelect from '../../inputs/SearchableSelect'



const ProductionReceiptForm = ({ productionOrder, setIsShow }) => {
    const [previewData, setPreviewData] = useState(null);

    const { mutateAsync: createData, isPending: createIsPending } = masterData.TQCreateMaster(["productionOrderList", "productionReceiptList"]);

    /**************** data fetching *******************/
    const { data: storeList, isLoading: storesLoading } = fetchData.TQStoreList(
        { noLimit: true, store_type: "fg_store", isAdmin: true }
    );


    /**************** form *******************/
    const { register, handleSubmit, control, reset, formState: { errors }, } = useForm({
        defaultValues: {
            production_order_id: productionOrder?.id ?? "",
            product_id: productionOrder?.target_product_id ?? "",
            batchNo: productionOrder?.receipts?.[productionOrder?.receipts?.length - 1]?.batch_no ?? "",
            fg_store_id: "",
            send_qty: "",
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
                            label="Batch No"
                            type="text"
                            placeholder="Auto-generated"
                            {...register("batchNo")}
                        />

                        <Input
                            label="Release Qty"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("send_qty", {
                                required: "Release quantity is required!!!",
                                min: { value: 0.01, message: "Must be greater than 0" },
                            })}
                            error={errors.send_qty?.message}
                            required
                        />
                    </div>

                    {/* ── Row 4: Mfg Date ── */}
                    <div className='grid grid-cols-2 gap-4'>
                        <Input
                            type="date"
                            className="form-input w-full"
                            label="Mfg. Date"
                            labelIcon={<FiCalendar size={13} />}
                            {...register("mfg_date")}
                        />

                        <div className="">
                            <Controller
                                name="po_status"
                                control={control}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <SearchableSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}
                                        isSearchable={false}

                                        label="Receipt Type"
                                        options={[
                                            { label: "Keep Production Order Open", value: "open" },
                                            { label: "Close Production Order", value: "closed" },
                                        ]}
                                        isClearable={true}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="">
                        <TextArea
                            label="Remarks (Optional)"
                            placeholder="Add remarks if any"
                            className="form-input w-full"
                            {...register("remarks")}
                        />
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
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Send Qty</p>
                                <p className="font-bold text-gray-800">{previewData.send_qty}</p>
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

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Batch No</p>
                                <p className="font-medium text-gray-800">
                                    {previewData.batchNo || <span className="italic text-gray-400">Auto-generated</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Receipt Type</p>
                                <p className="font-medium text-gray-800">
                                    {previewData.po_status === "open" ? "Keep Production Order Open" : previewData.po_status === "closed" ? "Close Production Order" : <span className="italic text-gray-400">Not specified</span>}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm">
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Remarks</p>
                            <p className="font-medium text-gray-800">
                                {previewData.remarks || <span className="italic text-gray-400">No remarks</span>}
                            </p>
                        </div>
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
