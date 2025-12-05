import { Button } from '@mantine/core'
import React from 'react'
import FileUpload from '../inputs/File'
import { Controller, useForm } from 'react-hook-form'
import Input from '../inputs/Input'
import RHSelect from '../inputs/RHF/Select.RHF'
import TextArea from '../inputs/TextArea'

const gstType = [
    { value: "include", label: "Shoes" },
    { value: "exclude", label: "Hats" },
]

const Form = () => {

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const submit = (data) => {
        console.log(data);
    }

    return (
        <div>
            {/* Grid */}
            <div className="panel" id="forms_grid">
                <div className="mb-5">
                    <form onSubmit={handleSubmit(submit)} className="space-y-5">
                        {/* file upload */}
                        <div className="grid grid-cols-1">
                            <Controller
                                name="productImage"
                                control={control}
                                defaultValue={null}
                                render={({ field: { onChange } }) => (
                                    <FileUpload
                                        label="Product Image"
                                        onChange={onChange} // gets File object
                                    />
                                )}
                            />
                        </div>

                        {/* 2nd row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label={"Product Name"}
                                    placeholder={"Enter product name..."}
                                    {...register("productName", { required: true })}
                                    error={errors.productName?.message === ''}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <RHSelect
                                            label="Category"
                                            // options={categoryOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* 3rd row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name="subCat"
                                    control={control}
                                    render={({ field }) => (
                                        <RHSelect
                                            label="Sub Category"
                                            // options={categoryOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={true}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="brand"
                                    control={control}
                                    render={({ field }) => (
                                        <RHSelect
                                            label="Brand"
                                            // options={categoryOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* 4th row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name="hsnCode"
                                    control={control}
                                    render={({ field }) => (
                                        <RHSelect
                                            label="HSN Code"
                                            // options={categoryOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Input
                                    label={"SKU"}
                                    placeholder={"Enter SKU"}
                                    {...register("sku", { required: true })}
                                    error={errors.sku?.message === ''}
                                />
                            </div>
                        </div>

                        {/* 5th row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label={"Barcode"}
                                    placeholder={"Enter Barcode"}
                                    {...register("barcode", { required: true })}
                                    error={errors.barcode?.message === ''}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="gst"
                                    control={control}
                                    render={({ field }) => (
                                        <RHSelect
                                            label="GST Type"
                                            options={gstType}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* 6th row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div>
                                    <Controller
                                        name="package"
                                        control={control}
                                        render={({ field }) => (
                                            <RHSelect
                                                label="Package Type"
                                                options={gstType}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    type={"number"}
                                    label={"Measure"}
                                    placeholder={"Enter Measure"}
                                    {...register("barcode", { required: true })}
                                    error={errors.barcode?.message === ''}
                                />
                                <div>
                                    <Controller
                                        name="unit"
                                        control={control}
                                        render={({ field }) => (
                                            <RHSelect
                                                label="Unit"
                                                options={gstType}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 7th row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name="unitType"
                                    control={control}
                                    render={({ field }) => (
                                        <RHSelect
                                            label="Unit Type"
                                            options={gstType}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Input
                                    type={"number"}
                                    label={"Selling Price"}
                                    placeholder={"Enter Selling Price"}
                                    {...register("barcode", { required: true })}
                                    error={errors.barcode?.message === ''}
                                />
                            </div>
                        </div>

                        {/* 8th row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    type={"number"}
                                    label={"MRP"}
                                    placeholder={"₹ Enter MRP"}
                                    {...register("mrp", { required: true })}
                                    error={errors.mrp?.message === ''}
                                />
                            </div>
                            <div>
                                <Input
                                    type={"number"}
                                    label={"Reorder Level"}
                                    placeholder={"Enter Reorder Level"}
                                    {...register("reorder", { required: true })}
                                    error={errors.reorder?.message === ''}
                                />
                            </div>
                        </div>

                        {/* 9th row */}
                        <div className="grid grid-cols-1">
                            <div>
                                <TextArea
                                    label="Description"
                                    placeholder="Enter Description"
                                    className="text-sm"
                                    {...register("desc")}
                                />
                            </div>
                        </div>
                        <div className="flex">
                            <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false} className='ml-auto'>Add Product</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Form
