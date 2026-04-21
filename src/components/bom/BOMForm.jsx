import React, { useState } from 'react'
import Input from '../inputs/Input'
import { Button } from '@mantine/core'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import RHSelect from '../inputs/RHF/Select.RHF'
import fetchData from '../../Backend/fetchData.backend'
import masterData from '../../Backend/master.backend'
import { errorAlert } from '../../utils/alerts'
import IconTrashLines from '../Icon/IconTrashLines'
import Tippy from '@tippyjs/react'


const BOMForm = ({ setIsShow }) => {
    const { mutateAsync: createBOM, isPending: createPending } = masterData.TQCreateMaster(["bomList"]);

    /** fetch finished products (all products) & raw products */
    const { data: finishedProducts, isLoading: finishedLoading } = fetchData.TQProductList({ noLimit: true, type: "finished" });
    const { data: rawProducts, isLoading: rawLoading } = fetchData.TQProductList({ noLimit: true, type: "raw" });

    const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm({
        defaultValues: {
            finished_product_barcode: "",
            output_qty: "",
            desc: "",
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
            // extract barcode from selected finished product
            const barcode = data.finished_product_barcode?.barcode;
            if (!barcode) {
                errorAlert("Please select a finished product");
                return;
            }

            const payload = {
                finished_product_barcode: barcode,
                output_qty: data.output_qty,
                desc: data.desc,
                items: data.items.map(item => ({
                    raw_product_id: item.raw_product_id?.id || item.raw_product_id,
                    required_qty: item.required_qty,
                }))
            };

            // console.log(data)
            // console.log(payload)
            // return

            const result = await createBOM({ path: "/bom/create", formData: payload });
            if (result?.success) {
                reset();
                setIsShow(false);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="panel" id="bom-form">
            <div className="mb-5">
                <form onSubmit={handleSubmit(submitData)} className="space-y-5">

                    {/* Row 1: Finished Product + Output Qty */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <Controller
                                name="finished_product_barcode"
                                control={control}
                                rules={{ required: "Select finished product!!!" }}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <RHSelect
                                        ref={(el) => {
                                            ref({ focus: () => el?.focus() });
                                        }}
                                        value={value}
                                        onChange={onChange}

                                        label="Finished Product"
                                        selectKey="name"
                                        options={finishedProducts?.data || []}
                                        error={error?.message}
                                        required={true}
                                        objectReturn={true}
                                        isLoading={finishedLoading}
                                        placeholder="Select product..."
                                        autoFocus={true}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Input
                                label="Output Quantity"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 100"
                                {...register("output_qty", {
                                    required: "Output qty required!!!",
                                    min: { value: 0.01, message: "Must be > 0" }
                                })}
                                error={errors.output_qty?.message}
                                required={true}
                            />
                        </div>
                        <div>
                            <Input
                                label="Description"
                                placeholder="Optional notes..."
                                {...register("desc")}
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
                                <div key={field.id} className="grid grid-cols-12 gap-3 items-end bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    {/* Row number */}
                                    <div className="col-span-1 flex items-center justify-center">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                    </div>

                                    {/* Raw product select */}
                                    <div className="col-span-6">
                                        <Controller
                                            name={`items.${idx}.raw_product_id`}
                                            control={control}
                                            rules={{ required: "Select raw material!!!" }}
                                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                <RHSelect
                                                    ref={(el) => {
                                                        ref({ focus: () => el?.focus() });
                                                    }}
                                                    value={value}
                                                    onChange={onChange}

                                                    label="Raw Material"
                                                    selectKey="name"
                                                    options={rawProducts?.data || []}
                                                    error={error?.message}
                                                    required={true}
                                                    objectReturn={true}
                                                    isLoading={rawLoading}
                                                    placeholder="Select raw product..."
                                                    hiddenIds={selectedRawIds}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Required qty */}
                                    <div className="col-span-3">
                                        <Input
                                            label="Required Qty"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register(`items.${idx}.required_qty`, {
                                                required: "Qty required!!!",
                                                min: { value: 0.01, message: "Must be > 0" }
                                            })}
                                            error={errors?.items?.[idx]?.required_qty?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* Delete button */}
                                    <div className="col-span-2 flex items-center justify-center pb-1">
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
                            loading={createPending}
                        >
                            Create BOM
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BOMForm
