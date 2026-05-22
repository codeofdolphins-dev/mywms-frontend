import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import Input from '../inputs/Input';
import RHSelect from '../inputs/RHF/Select.RHF';
import fetchData from '../../Backend/fetchData.backend';
import masterData from '../../Backend/master.backend';
import IconTrashLines from '../Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import { FiPlus } from 'react-icons/fi';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import API from '../../Backend';
import business from '../../Backend/business.fetch';


// ─── Allocation row sub-component ─────────────────────────────────────────────
const AllocationRow = ({ itemIndex, allocIndex, control, register, errors, batchOptions, batchLoading, selectedBatchIds, remove, item, isExisting }) => {

    return (
        <div className="grid grid-cols-12 gap-3 items-end bg-white rounded-lg p-2 border border-gray-100 shadow-sm">
            {/* Row number badge */}
            <div className="col-span-1 flex items-center justify-center pb-1">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {allocIndex + 1}
                </span>
            </div>

            {/* Batch select */}
            <div className="col-span-6">
                <Controller
                    name={`items.${itemIndex}.allocations.${allocIndex}.batch_id`}
                    control={control}
                    rules={{ required: "Select a batch" }}
                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                        // console.log(batchOptions)

                        const batchList = batchOptions?.map(b => ({
                            id: b.id,
                            name: `${b.batch_no} | Exp: ${b.expiry_date || 'N/A'} | Available: ${b.available_qty}`
                        }));

                        return <RHSelect
                            ref={(el) => ref({ focus: () => el?.focus() })}
                            value={value}
                            onChange={onChange}
                            label="Batch"
                            options={batchList || []}
                            error={error?.message}
                            required={true}
                            isLoading={batchLoading}
                            placeholder="Select batch..."
                            hiddenIds={selectedBatchIds.filter((_, i) => i !== allocIndex)}
                            isClearable
                            disabled={isExisting}
                        />
                    }}
                />
            </div>

            {/* Send Qty */}
            <div className="col-span-4">
                <Input
                    label="Send Qty"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register(`items.${itemIndex}.allocations.${allocIndex}.send_qty`, {
                        required: "Qty required",
                        min: { value: 0.01, message: "Must be > 0" }
                    })}
                    error={errors?.items?.[itemIndex]?.allocations?.[allocIndex]?.send_qty?.message}
                    required={true}
                    unit={item?.unit}
                    disabled={isExisting}
                />
            </div>

            {/* Delete alloc */}
            <div className="col-span-1 flex items-center justify-center pb-1">
                {!isExisting && (
                    <Tippy content="Remove allocation">
                        <button
                            type="button"
                            onClick={remove}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-danger"
                        >
                            <IconTrashLines className="w-4 h-4" />
                        </button>
                    </Tippy>
                )}
            </div>
        </div>
    );
};


// ─── Product item card ─────────────────────────────────────────────────────────
const ProductItemCard = ({ itemIndex, control, register, errors, watch, setValue, productOptions, productLoading, selectedProductIds, removeItem }) => {
    const item = watch(`items.${itemIndex}`);
    const productId = watch(`items.${itemIndex}.product_id`);
    const { data: batchData, isLoading: batchLoading } = fetchData.TQBatchListByProduct(productId, !!productId);
    const batchOptions = batchData?.data || [];

    const { fields: allocFields, append: appendAlloc, remove: removeAlloc } = useFieldArray({
        control,
        name: `items.${itemIndex}.allocations`,
    });

    const watchedAllocs = watch(`items.${itemIndex}.allocations`);
    const selectedBatchIds = watchedAllocs?.map(a => a.batch_id).filter(Boolean) ?? [];

    // barcode register — enables custom onChange for bidirectional sync
    const barcodeReg = register(`items.${itemIndex}.barcode`);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Product header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-start gap-3">
                    {/* Index badge */}
                    <span className="w-7 h-7 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-6">
                        {itemIndex + 1}
                    </span>

                    {/* Barcode + Product row */}
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        {/* Barcode input */}
                        <Input
                            label="Barcode"
                            placeholder="Scan or type barcode..."
                            disabled={item?.isExisting}
                            {...barcodeReg}
                            onChange={(e) => {
                                barcodeReg.onChange(e);
                                const val = e.target.value;
                                if (val) {
                                    const found = productOptions?.find(p => p.barcode === val);
                                    if (found) {
                                        setValue(`items.${itemIndex}.product_id`, found.id, { shouldValidate: true });
                                        setValue(`items.${itemIndex}.unit`, found.unit_type, { shouldValidate: true });
                                        setValue(`items.${itemIndex}.allocations`, [{ batch_id: '', send_qty: '' }]);
                                    }
                                } else {
                                    setValue(`items.${itemIndex}.product_id`, '', { shouldValidate: true });
                                    setValue(`items.${itemIndex}.allocations`, [{ batch_id: '', send_qty: '' }]);
                                }
                            }}
                            error={errors?.items?.[itemIndex]?.barcode?.message}
                        />

                        {/* Product dropdown */}
                        <Controller
                            name={`items.${itemIndex}.product_id`}
                            control={control}
                            rules={{ required: "Select a product" }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => ref({ focus: () => el?.focus() })}
                                    value={value}
                                    onChange={(val) => {
                                        onChange(val);
                                        const selectedId = val?.id ?? val;
                                        const found = productOptions?.find(p => p.id === selectedId);
                                        setValue(`items.${itemIndex}.barcode`, found?.barcode ?? '', { shouldValidate: true });
                                        setValue(`items.${itemIndex}.unit`, found.unit_type, { shouldValidate: true });
                                        setValue(`items.${itemIndex}.allocations`, [{ batch_id: '', send_qty: '' }]);
                                    }}
                                    label="Product"
                                    options={productOptions || []}
                                    selectKey="name"
                                    error={error?.message}
                                    required={true}
                                    isLoading={productLoading}
                                    placeholder="Select product..."
                                    hiddenIds={selectedProductIds.filter((_, i) => i !== itemIndex)}
                                    isClearable
                                    disabled={item?.isExisting}
                                />
                            )}
                        />
                    </div>

                    {/* Remove button */}
                    {!item?.isExisting && (
                        <Tippy content="Remove product">
                            <button
                                type="button"
                                onClick={removeItem}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-danger mt-6"
                            >
                                <IconTrashLines className="w-4 h-4" />
                            </button>
                        </Tippy>
                    )}
                </div>
            </div>

            {/* Allocations */}
            <div className="p-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch Allocations</p>
                    <Button
                        type="button"
                        variant="light"
                        color="indigo"
                        size="xs"
                        leftSection={<FiPlus size={12} />}
                        disabled={!productId}
                        onClick={() => appendAlloc({ batch_id: '', send_qty: '' })}
                    >
                        Add Batch
                    </Button>
                </div>

                {!productId && (
                    <p className="text-xs text-gray-400 italic text-center py-2">
                        Select a product to add batch allocations.
                    </p>
                )}

                {productId && allocFields.length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-2">
                        No allocations yet. Click "Add Batch".
                    </p>
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {allocFields.map((allocField, allocIdx) => (
                        <AllocationRow
                            key={allocField.id}
                            itemIndex={itemIndex}
                            allocIndex={allocIdx}
                            control={control}
                            register={register}
                            errors={errors}
                            batchOptions={batchOptions}
                            batchLoading={batchLoading}
                            selectedBatchIds={selectedBatchIds}
                            item={item}
                            remove={() => removeAlloc(allocIdx)}
                            isExisting={allocField.isExisting}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


// ─── Main Form ────────────────────────────────────────────────────────────────
const DirectTransferForm = ({ setIsShow, editData }) => {

    /*** mutations ***/
    const { mutateAsync: createTransfer, isPending: createPending } = masterData.TQCreateMaster(['directTransferList']);
    const { mutateAsync: updateTransfer, isPending: updatePending } = masterData.TQUpdateMaster(['directTransferList']);

    /*** data fetching ***/
    // fetch finished product list
    const { data: productData, isLoading: productLoading } = fetchData.TQProductList({ noLimit: true, type: "finished" });
    // fetch locations
    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = business.TQTenantRegisteredNodeList({ noLimit: true, isAttachCurrentNode: false });

    /*** form setup ***/
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors },
    } = useForm({
        defaultValues: {
            target_location_id: '',
            items: [
                { product_id: '', barcode: "", unit: "", allocations: [{ batch_id: '', send_qty: '' }] }
            ],
        }
    });

    const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
        control,
        name: 'items',
    });

    const watchedItems = watch('items');
    const selectedProductIds = watchedItems?.map(i => i.product_id).filter(Boolean) ?? [];

    // Reset form when editData changes
    React.useEffect(() => {
        if (editData) {
            reset({
                target_location_id: editData.target_location_id || '',
                items: editData.transferItems?.map(item => ({
                    product_id: item.product_id || '',
                    barcode: item.transferItemProduct?.barcode || '',
                    unit: item.transferItemProduct?.unit_type || '',
                    isExisting: true,
                    allocations: item.allocations?.map(alloc => ({
                        batch_id: alloc.batch_id || '',
                        send_qty: alloc.send_qty || '',
                        isExisting: true
                    })) || [{ batch_id: '', send_qty: '' }]
                })) || [
                    { product_id: '', barcode: "", unit: "", allocations: [{ batch_id: '', send_qty: '' }] }
                ]
            });
        } else {
            reset({
                target_location_id: '',
                items: [
                    { product_id: '', barcode: "", unit: "", allocations: [{ batch_id: '', send_qty: '' }] }
                ]
            });
        }
    }, [editData, reset]);

    /*** submit ***/
    async function submitForm(data) {
        try {
            console.log("data", data)

            if (editData) {
                const res = await updateTransfer({
                    path: '/direct-transfer/update',
                    formData: { ...data, id: editData.id }
                });
                if (res?.success) {
                    reset();
                    setIsShow?.(false);
                }
            } else {
                const res = await createTransfer({ path: '/direct-transfer/create', formData: data });
                if (res?.success) {
                    reset();
                    setIsShow?.(false);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="panel" id="direct-transfer-form">
            <form onSubmit={handleSubmit(submitForm)} className="space-y-5">

                {/* ── Target Location ──────────────────────────── */}
                <div>
                    <Controller
                        name="target_location_id"
                        control={control}
                        rules={{ required: "Target location is required" }}
                        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                            <RHSelect
                                ref={(el) => ref({ focus: () => el?.focus() })}
                                value={value}
                                onChange={onChange}
                                label="Target Location"
                                options={registeredNodeList?.data || []}
                                selectKey="name"
                                error={error?.message}
                                required={true}
                                isLoading={registeredNodeListLoading}
                                placeholder="Select target location..."
                                isClearable
                                disabled={!!editData}
                            />
                        )}
                    />
                </div>

                {/* ── Divider ───────────────────────────────────── */}
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                            Products &amp; Batch Allocations
                        </h3>
                        <Button
                            type="button"
                            variant="light"
                            color="blue"
                            size="xs"
                            leftSection={<FiPlus size={12} />}
                            onClick={() => appendItem({ product_id: '', barcode: "", unit: "", allocations: [{ batch_id: '', send_qty: '' }] })}
                        >
                            Add Product
                        </Button>
                    </div>

                    {itemFields.length === 0 && (
                        <p className="text-sm text-gray-400 italic text-center py-4">
                            No products added. Click "Add Product" to begin.
                        </p>
                    )}

                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                        {itemFields.map((field, idx) => (
                            <ProductItemCard
                                key={field.id}
                                itemIndex={idx}
                                control={control}
                                register={register}
                                errors={errors}
                                watch={watch}
                                setValue={setValue}
                                productOptions={productData?.data || []}
                                productLoading={productLoading}
                                selectedProductIds={selectedProductIds}
                                removeItem={() => removeItem(idx)}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Actions ───────────────────────────────────── */}
                <div className="flex items-center justify-end gap-4 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => reset()}
                    >
                        Reset
                    </button>
                    <Button
                        type="submit"
                        className="btn btn-primary"
                        loading={editData ? updatePending : createPending}
                        disabled={itemFields.length === 0}
                    >
                        {editData ? "Update Transfer" : "Submit Transfer"}
                    </Button>
                </div>

            </form>
        </div>
    );
};

export default DirectTransferForm;