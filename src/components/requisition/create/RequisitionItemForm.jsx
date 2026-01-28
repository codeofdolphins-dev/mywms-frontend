import React from 'react'
import Input from '../../inputs/Input';
import Button from '../../inputs/Button';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../inputs/RHF/Select.RHF";

const RequisitionItemForm = ({
    setSelectedItems = () => { }
}) => {

    const { handleSubmit, control, register, reset, formState: { errors } } = useForm();

    function submitForm(data) {
        console.log(data);
    }

    return (
        <div className="panel" id="forms_grid">

            <form onSubmit={handleSubmit(submitForm)}>
                {/* form */}
                <div className="grid grid-cols-2 gap-5">
                    {/* barcode */}
                    <div>
                        <Input
                            type="text"
                            label="Barcode"
                            placeholder="Enter barcode number"
                            {...register("barcode", {
                                required: {
                                    message: "Barcode required",
                                    value: true
                                }
                            })}
                            error={errors.barcode?.message}
                            required={true}
                        />
                    </div>

                    {/* category */}
                    <div>
                        <Controller
                            name="category"
                            control={control}
                            rules={{
                                required: "This field is required!!!"
                            }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}

                                    label="Category"
                                    selectKey='hsn_code'
                                    // options={hsnData?.data}
                                    error={error?.message}
                                    required={true}
                                />
                            )}
                        />
                    </div>

                    {/* product */}
                    <div>
                        <Input
                            label="Product Name"
                            placeholder="Enter product name"
                            {...register("productName", {
                                required: true
                            })}
                            error={errors.productName?.message}
                            required={true}
                        />
                    </div>

                    {/* unit type */}
                    <div>
                        <Input
                            label="Unit Type"
                            placeholder="Enter unit type"
                            {...register("unitType", {
                                required: {
                                    message: "pack size required",
                                    value: true
                                }
                            })}
                            error={errors.unitType?.message}
                            required={true}
                        />
                    </div>

                    {/* pack size */}
                    <div>
                        <Input
                            label="Pack Size"
                            placeholder="Enter pack size"
                            {...register("packSize", {
                                required: {
                                    message: "pack size required",
                                    value: true
                                }
                            })}
                            error={errors.packSize?.message}
                            required={true}
                        />
                    </div>

                    {/* Req Qty */}
                    <div>
                        <Input
                            label="Req Qty."
                            placeholder="Enter Qty"
                            {...register("ReqQty", {
                                required: {
                                    message: "QTY required",
                                    value: true
                                }
                            })}
                            error={errors.ReqQty?.message}
                            required={true}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Button
                        type="submit"
                        className="btn btn-primary !mt-6"
                    >
                        Add Item
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RequisitionItemForm;