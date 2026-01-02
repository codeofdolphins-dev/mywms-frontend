import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import ItemTable from '../../components/ItemTable';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';

const CreateQuotation = () => {


    const { handleSubmit, control, register, formState: { errors } } = useForm();

    function submitForm(data) {
        console.log(data);
    }

    return (
        <div>
            {/* breadcrumb */}
            <ul className=" flex space-x-2 ">
                <li className="">
                    <Link to="/requisition" className="text-primary hover:underline">
                        quotation
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2 ">
                    <span>create quotation</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-3">
                <div>
                    <h1 className="text-4xl font-bold my-3">Create Quotation</h1>
                </div>
            </div>

            <div className="panel mt-3" id="forms_grid">
                <div className="mb-5">
                    <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>

                        {/* first row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name="hsn_code"
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

                                            label="Warehouse"
                                            selectKey='hsn_code'
                                            // options={hsnData?.data}
                                            error={error?.message}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="hsn_code"
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

                                            label="Supplier"
                                            selectKey='hsn_code'
                                            // options={hsnData?.data}
                                            error={error?.message}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* second row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <Input
                                    type="number"
                                    label="GST No."
                                    placeholder="Enter GST number"
                                    {...register("gst", {
                                        required: {
                                            message: "GST no required",
                                            value: true
                                        }
                                    })}
                                    error={errors.gst?.message}
                                    required={true}
                                />
                            </div>

                            {/* brand */}
                            <div>
                                <Controller
                                    name="brand"
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

                                            label="Brand"
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
                                <Controller
                                    name="hsn_code"
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

                                            label="Product"
                                            selectKey='hsn_code'
                                            // options={hsnData?.data}
                                            error={error?.message}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>

                            {/* Pack Size */}
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

                            <Button
                                type="submit"
                                className="btn btn-primary !mt-6"
                            // onClick={addItem}
                            >
                                Add Item
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default CreateQuotation