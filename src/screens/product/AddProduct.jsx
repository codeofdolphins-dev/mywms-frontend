import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import TextArea from '../../components/inputs/TextArea';
import Input from '../../components/inputs/Input';
import FileUpload from '../../components/inputs/File';
import { Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import RHRadioGroup from '../../components/inputs/RHF/RHRadioGroup';


const gstType = [
    { value: "include", label: "Shoes" },
    { value: "exclude", label: "Hats" },
]

const options = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

const AddProduct = () => {
    const navigate = useNavigate();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const submit = (data) => {
        console.log(data);
        setTimeout(() => {
            reset();
        }, 3000);
    }

    const handelCancel = () => {
        reset();
        navigate(-1);
    }

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <Link to="/master/products" className="text-primary hover:underline">
                        Product
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>Add Products</span>
                </li>
            </ul>

            <div>
                {/* Grid */}
                <div className="panel" id="forms_grid">
                    <div className="mb-5">
                        <form onSubmit={handleSubmit(submit)} className="space-y-5">
                            {/* 2nd row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label={"Product Name"}
                                        placeholder={"Enter product name..."}
                                        {...register("productName", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.productName?.message}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{
                                            required: "This field is required!!!"
                                        }}
                                        render={({ field: { value, onChange, ref, onBlur }, fieldState: { error } }) => (
                                            <RHSelect
                                                ref={(el) => {
                                                    ref({
                                                        focus: () => el?.focus(),
                                                    });
                                                }}
                                                value={value}
                                                onChange={onChange}

                                                label="Category"
                                                options={options}
                                                error={error?.message}
                                                isMulti={true}
                                                required={true}
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
                                        render={({ field: { value, onChange } }) => (
                                            <RHSelect
                                                value={value}
                                                onChange={onChange}

                                                label="Sub Category"
                                                options={options}
                                                isMulti={true}
                                                disabled={true}
                                            />
                                        )}
                                    />
                                </div>
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
                                                options={options}
                                                error={error?.message}
                                                isMulti={true}
                                                required={true}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* 4th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Controller
                                        name="hsn"
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

                                                label="HSN Code"
                                                options={options}
                                                error={error?.message}
                                                required={true}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label={"SKU"}
                                        placeholder={"Enter SKU"}
                                        {...register("sku", { required: "This field is required!!!" })}
                                        error={errors.sku?.message}
                                        required={true}
                                    />
                                </div>
                            </div>

                            {/* 5th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label={"Barcode"}
                                        placeholder={"Enter Barcode"}
                                        {...register("barcode", { required: "This field is required!!!" })}
                                        error={errors.barcode?.message}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        name="gstType"
                                        control={control}
                                        rules={{
                                            required: "Please select a GST type!",
                                        }}
                                        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                            <RHRadioGroup
                                                ref={(el) => {
                                                    ref({
                                                        focus: () => el?.focus(),
                                                    });
                                                }}
                                                value={value}
                                                onChange={onChange}
                                                label="GST Type"
                                                required={true}
                                                options={[
                                                    { label: "Include", value: "include" },
                                                    { label: "Exclude", value: "exclude" },
                                                ]}
                                                error={error?.message}
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
                                            name="packageType"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <RHSelect
                                                    label="Package Type"
                                                    options={gstType}
                                                    value={value}
                                                    onChange={onChange}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Input
                                            type={"number"}
                                            label={"Measure"}
                                            placeholder={"Enter Measure"}
                                            {...register("measure", { required: "This field is required!!!" })}
                                            error={errors.measure?.message}
                                            required={true}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="unit"
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

                                                    label="Unit"
                                                    options={options}
                                                    error={error?.message}
                                                    required={true}
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

                                                label="Unit Type"
                                                options={options}
                                                error={error?.message}
                                                required={true}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type={"number"}
                                        label={"Selling Price"}
                                        placeholder={"Enter Selling Price"}
                                        {...register("sellPrice", { required: "This field is required!!!" })}
                                        error={errors.sellPrice?.message}
                                        required={true}
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
                                        {...register("mrp", { required: "This field is required!!!" })}
                                        error={errors.mrp?.message}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type={"number"}
                                        label={"Reorder Level"}
                                        placeholder={"Enter Reorder Level"}
                                        {...register("reorderLevel", { required: "This field is required!!!" })}
                                        error={errors.reorderLevel?.message}
                                        required={true}
                                    />
                                </div>
                            </div>

                            {/* 9th row */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                                <div>
                                    <TextArea
                                        label="Description"
                                        placeholder="Enter Description"
                                        className="text-sm"
                                        {...register("desc")}
                                    />
                                </div>
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
                            </div>
                            <div className="flex">
                                <Button variant="outline" color="gray" size="md" radius="md" onClick={handelCancel} >Cancel</Button>
                                
                                <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false} className='ml-auto'>Add Product</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default AddProduct
