import React, { useEffect, useState } from 'react'
import Input from '../../inputs/Input'
import { Button } from '@mantine/core'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import RHSelect from '../../inputs/RHF/Select.RHF'
import fetchData from '../../../Backend/fetchData.backend'
import masterData from '../../../Backend/master.backend'
import { errorAlert } from '../../../utils/alerts'
import IconTrashLines from '../../Icon/IconTrashLines'
import Tippy from '@tippyjs/react'


const ProductionOrderForm = ({ setIsShow }) => {
    /**************** states *******************/
    const [previewData, setPreviewData] = useState(null);

    /**************** mutations *******************/
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["productionOrderList"]);


    /**************** data fetching GET *******************/
    const { data: finishedProducts, isLoading: finishedLoading } = fetchData.TQProductList({ noLimit: true, type: "finished" });
    const { data: rawProducts, isLoading: rawLoading } = fetchData.TQProductList({ noLimit: true, type: "raw" });


    /**************** form methods *******************/
    const { register, handleSubmit, formState: { errors }, control, reset, watch, getValues } = useForm({
        defaultValues: {
            finished_product_id: "",
            planned_qty: "",
            items: [{ raw_product_id: "", required_qty: "" }]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });


    /** get selected raw product IDs to prevent duplicates */
    const watchedItems = watch("items");
    const selectedRawIds = watchedItems?.map(item => item.raw_product_id?.id || item.raw_product_id).filter(Boolean);



    async function submitData(data) {
        try {
            const lastIdx = data?.items?.length - 1
            if (!data?.items[lastIdx]?.raw_product_id || !data?.items[lastIdx]?.required_qty) {
                data?.items?.splice(lastIdx, 1);
                remove(lastIdx);
            }

            setPreviewData(data);
        } catch (error) {
            console.log(error);
        }
        console.log(data)
    }

    async function handleConfirmSubmit() {
        try {
            const result = await createData({ path: "/production-order/create", formData: previewData });
            if (result?.success) {
                reset();
                setPreviewData(null);
                setIsShow(false);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="panel" id="bom-form">
            {!previewData ? (
                // production order form section
                <div className="mb-5">
                    <form onSubmit={handleSubmit(submitData)} className="space-y-5">

                        {/* Row 1: Finished Product + Output Qty */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className='col-span-2'>
                                <Controller
                                    name="finished_product_id"
                                    control={control}
                                    rules={{ required: "Select Target Product!!!" }}
                                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                        <RHSelect
                                            ref={(el) => {
                                                ref({ focus: () => el?.focus() });
                                            }}
                                            value={value}
                                            onChange={onChange}

                                            label="Select Target Product"
                                            options={finishedProducts?.data}
                                            error={error?.message}
                                            required={true}
                                            isLoading={finishedLoading}
                                            placeholder="Select Target Product..."
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Planned Qty"
                                    type="number"
                                    placeholder="Planned qty"
                                    {...register("planned_qty", {
                                        required: "Planned qty required!!!",
                                        min: {
                                            value: 1,
                                            message: "Planned qty must be at least 1"
                                        }
                                    })}
                                    required={true}
                                    error={errors.planned_qty?.message}
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Raw Materials</h3>
                                <Button
                                    type="button"
                                    variant="light"
                                    size="xs"
                                    onClick={() => append({ raw_product_id: "", required_qty: "" })}
                                >
                                    + Add Item
                                </Button>
                            </div>

                            {/* Raw material items */}
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {fields.map((field, idx) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        {/* Row number */}
                                        <div className="col-span-1 flex items-center justify-center">
                                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                        </div>

                                        {/* Raw product select */}
                                        <div className="col-span-5">
                                            <Controller
                                                name={`items.${idx}.raw_product_id`}
                                                control={control}
                                                rules={{
                                                    validate: (value) => {
                                                        const qty = getValues(`items.${idx}.required_qty`);
                                                        if (!value && (!qty || qty.toString().trim() === "") && idx === fields.length - 1 && fields.length > 1) return true;
                                                        if (!value) return "Select raw material!!!";
                                                        return true;
                                                    }
                                                }}
                                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                    <RHSelect
                                                        ref={(el) => {
                                                            ref({ focus: () => el?.focus() });
                                                        }}
                                                        value={value}
                                                        onChange={(val) => {
                                                            onChange(val);
                                                            if (idx === fields.length - 1 && val) {
                                                                const qty = getValues(`items.${idx}.required_qty`);
                                                                if (qty && qty.toString().trim() !== "") {
                                                                    append({ raw_product_id: "", required_qty: "" }, { shouldFocus: false });
                                                                }
                                                            }
                                                        }}

                                                        label="Raw Material"
                                                        labelPosition="inline"
                                                        // labelClassName="whitespace-nowrap"

                                                        selectKey="name"
                                                        options={rawProducts?.data || []}
                                                        error={error?.message}
                                                        required={idx !== fields.length - 1 || fields.length === 1}
                                                        // objectReturn={true}
                                                        isLoading={rawLoading}
                                                        placeholder="Select raw product..."
                                                        hiddenIds={selectedRawIds}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Required qty */}
                                        <div className="col-span-5">
                                            {(() => {
                                                const qtyReg = register(`items.${idx}.required_qty`, {
                                                    validate: (value) => {
                                                        const raw = getValues(`items.${idx}.raw_product_id`);
                                                        if ((!value || value.toString().trim() === "") && (!raw || raw.toString().trim() === "") && idx === fields.length - 1 && fields.length > 1) return true;
                                                        if (!value || value.toString().trim() === "") return "Qty required!!!";
                                                        if (Number(value) < 0.01) return "Must be > 0";
                                                        return true;
                                                    }
                                                });
                                                return (
                                                    <Input
                                                        label="Required Qty"
                                                        labelPosition="inline"
                                                        // labelClassName="whitespace-nowrap"
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        {...qtyReg}
                                                        onChange={(e) => {
                                                            qtyReg.onChange(e);
                                                            if (idx === fields.length - 1 && e.target.value.trim() !== "") {
                                                                const rawId = getValues(`items.${idx}.raw_product_id`);
                                                                if (rawId) {
                                                                    append({ raw_product_id: "", required_qty: "" }, { shouldFocus: false });
                                                                }
                                                            }
                                                        }}
                                                        error={errors?.items?.[idx]?.required_qty?.message}
                                                        required={idx !== fields.length - 1 || fields.length === 1}
                                                    />
                                                );
                                            })()}
                                        </div>

                                        {/* Delete button */}
                                        <div className="col-span-1 flex items-center justify-center pb-1">
                                            {fields.length > 1 && (
                                                <Tippy content="Remove item">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(idx)}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <IconTrashLines className="text-danger w-5 h-5" />
                                                    </button>
                                                </Tippy>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-center items-center pt-2">
                            <Button
                                variant="filled"
                                color="indigo"
                                size="md"
                                radius="md"
                                type="submit"
                            >
                                Preview Request
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                // Production preview section
                <div className="mb-5 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Production Request Preview</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Target Product</p>
                                <p className="font-medium text-gray-800">
                                    {finishedProducts?.data?.find(p => p.id === previewData?.finished_product_id)?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Planned Quantity</p>
                                <p className="font-medium text-gray-800">{previewData.planned_qty}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-700 mb-3">Required Raw Materials</h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold border-b">#</th>
                                        <th className="px-4 py-2 font-semibold border-b">Raw Material</th>
                                        <th className="px-4 py-2 font-semibold border-b text-right">Required Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.items.map((item, idx) => {
                                        const rawId = item.raw_product_id?.id || item.raw_product_id;
                                        const rawName = rawProducts?.data?.find(p => p.id === rawId)?.name || "Unknown Product";
                                        return (
                                            <tr key={idx} className="border-b last:border-0 hover:bg-smoky-white">
                                                <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
                                                <td className="px-4 py-2 font-medium">{rawName}</td>
                                                <td className="px-4 py-2 text-right font-bold">{item.required_qty}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
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
                            loading={createPending}
                        >
                            Confirm & Submit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductionOrderForm