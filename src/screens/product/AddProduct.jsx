import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import TextArea from '../../components/inputs/TextArea';
import Input from '../../components/inputs/Input';
import FileUpload from '../../components/inputs/File';
import { Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import RHRadioGroup from '../../components/inputs/RHF/RHRadioGroup';
import fetchData from '../../Backend/fetchData';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import masterData from '../../Backend/master.backend';
import { RHFToFormData } from '../../utils/RHFtoFD';
import CategoryTree from './CategoryTree';
import { successAlert } from '../../utils/alerts';


const gstType = [
    { value: "include", label: "Shoes" },
    { value: "exclude", label: "Hats" },
]


const packageType = [
    { value: 'tetra pack', label: 'Tetra Pack' },
    { value: 'plastic', label: 'Plastic' },
];

const unitType = [
    { value: 'box', label: 'Box' },
    { value: 'kg', label: 'Kg' },
    { value: 'ml', label: 'Ml' },
    { value: 'piece', label: 'Piece' },
    { value: 'bottol', label: 'Bottol' },
];

const AddProduct = ({ editId = null }) => {
    const navigate = useNavigate();

    const { data: categoryData, isLoading: cateLoading } = fetchData.TQAllCategoryList();
    const { data: brandData, isLoading: brandLoading } = fetchData.TQAllBrandList();
    const { data: hsnData, isLoading: hsnLoading } = fetchData.TQAllHsnList();

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster();
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm();

    const submit = async (data) => {
        // console.log(data);
        try {

            if (editId) {

            } else {
                const fd = RHFToFormData(data);
                const res = await createData({ path: "/product/create-raw", formData: fd });
                if(res.success) successAlert(res.message);
                reset();
                navigate(-1);
            }

        } catch (error) {
            console.log(error);
        }
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
                <div className="panel mt-5" id="forms_grid">
                    <div className="">
                        <div className="text-3xl mb-5">
                            <h1>Add Product</h1>
                        </div>

                        <form onSubmit={handleSubmit(submit)} className="space-y-5">

                            {/* 2nd row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* left */}
                                <div className="grid grid-cols-1 gap-2">

                                    {/* Product Name */}
                                    <div>
                                        <Input
                                            label={"Product Name"}
                                            placeholder={"Enter product name..."}
                                            {...register("name", {
                                                required: "This field is required!!!"
                                            })}
                                            error={errors.name?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* hsn_code */}
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

                                                    label="HSN Code"
                                                    selectKey='hsn_code'
                                                    options={hsnData?.data}
                                                    error={error?.message}
                                                    required={true}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* sku */}
                                    <div>
                                        <Input
                                            label={"SKU"}
                                            placeholder={"Enter SKU"}
                                            {...register("sku", { required: "This field is required!!!" })}
                                            error={errors.sku?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* Barcode */}
                                    <div>
                                        <Input
                                            label={"Barcode"}
                                            placeholder={"Enter Barcode"}
                                            {...register("barcode", { required: "This field is required!!!" })}
                                            error={errors.barcode?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* gstType */}
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

                                {/* right */}
                                <div className="grid grid-cols-1 gap-2">

                                    {/* brand */}
                                    <div className="">
                                        <Controller
                                            name="brands"
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
                                                    options={brandData?.data}
                                                    error={error?.message}
                                                    isMulti={true}
                                                    required={true}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* category */}
                                    <div className="">
                                        <Controller
                                            name="categories"
                                            control={control}
                                            rules={{
                                                validate: (v) =>
                                                    v?.length > 0 || "Please select at least one category",
                                            }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <CategoryTree
                                                        data={categoryData}
                                                        value={field.value || []}
                                                        onChange={field.onChange}
                                                    />

                                                    {fieldState.error && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {fieldState.error.message}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* 6th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div>
                                        <Controller
                                            name="package_type"
                                            control={control}
                                            render={({ field }) => (
                                                <SearchableSelect
                                                    {...field}
                                                    label='Package Type'
                                                    options={packageType}
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
                                            {...register("measure")}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="unitType"
                                            control={control}
                                            render={({ field }) => (
                                                <SearchableSelect
                                                    {...field}
                                                    label="Unit Type"
                                                    options={unitType}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 7th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        type={"number"}
                                        label={"Unit"}
                                        placeholder={"Enter unit"}
                                        {...register("unit")}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type={"number"}
                                        label={"Selling Price"}
                                        placeholder={"Enter Selling Price"}
                                        {...register("selling_price", { required: "This field is required!!!" })}
                                        error={errors.selling_price?.message}
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
                                        {...register("MRP", { required: "This field is required!!!" })}
                                        error={errors.MRP?.message}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type={"number"}
                                        label={"Reorder Level"}
                                        placeholder={"Enter Reorder Level"}
                                        {...register("reorder_level")}
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
                                        {...register("description")}
                                    />
                                </div>
                                {/* file upload */}
                                <div className="grid grid-cols-1">
                                    <Controller
                                        name="image"
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
