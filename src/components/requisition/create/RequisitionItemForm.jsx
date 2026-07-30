import React, { useEffect, useState } from 'react'
import Input from '../../inputs/Input';
import { Controller, useForm } from 'react-hook-form';
import fetchData from '../../../Backend/fetchData.backend';
import { Button } from '@mantine/core';
import RHSelect from '../../inputs/RHF/Select.RHF';
import { productOptionLabel, productOptionFilter } from '../../../utils/productOption';

const RequisitionItemForm = ({
    setIsShow,
    selectedItems,
    setSelectedItems = () => { },
    vendorId
}) => {
    const hiddenIds = selectedItems?.map(i => i.id) ?? [];

    const { handleSubmit, control, register, watch, setValue, reset, formState: { errors }, setError, clearErrors } = useForm({
        defaultValues: {
            productId: "",
            barcode: "",
            category: "",
            subCategory: "",
            brand: "",
            productName: "",
            packSize: "",
            mrp: "",
            packageType: "",
            reqQty: "",
        }
    });

    const { data: finishedProducts, isLoading: productsLoading } = fetchData.TQProductList({
        type: "finished",
        noLimit: true,
        ...(vendorId && { vendorId })
    });

    function submitForm(data) {
        setSelectedItems(prev => [
            ...prev,
            {
                ...data,
                id: data.productId,
            }
        ]);

        reset();
        setIsShow(false);
    }

    return (
        <div className="panel" id="forms_grid">
            <form onSubmit={handleSubmit(submitForm)}>
                {/* form */}
                <div className='space-y-5'>

                    {/* 1st */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* barcode */}
                        <div>
                            <Input
                                type="number"
                                label="Barcode"
                                placeholder="Enter or scan barcode"
                                {...register("barcode")}
                                onChange={(e) => {
                                    register("barcode").onChange(e);
                                    const val = e.target.value;
                                    if (val) {
                                        const foundProduct = finishedProducts?.data?.find(p => p.barcode === val);
                                        if (foundProduct) {
                                            if (hiddenIds?.includes(foundProduct.id)) {
                                                setError("barcode", { message: "product already selected!!!" });
                                                setValue("productId", "");
                                                setValue("productName", "");
                                                setValue("packSize", "");
                                                setValue("mrp", "");
                                                setValue("packageType", "");
                                                setValue("brand", "");
                                                setValue("category", "");
                                                setValue("subCategory", "");
                                            } else {
                                                setValue("productId", foundProduct.id, { shouldValidate: true });
                                                setValue("productName", foundProduct.name, { shouldValidate: true });
                                                setValue("packSize", `${foundProduct.measure} ${foundProduct.unit_type}`);
                                                setValue("mrp", `${foundProduct.mrp}`);
                                                setValue("packageType", foundProduct.package_type ?? "");
                                                setValue("brand", foundProduct.productBrands?.[0]?.name ?? "");
                                                setValue("category", foundProduct.productCategories?.[0]?.name ?? "");
                                                setValue("subCategory", foundProduct.productCategories?.[0]?.subcategories?.[0]?.name ?? "");
                                                clearErrors("barcode");
                                            }
                                        } else {
                                            setValue("productId", "");
                                            setValue("productName", "");
                                            setValue("packSize", "");
                                            setValue("mrp", "");
                                            setValue("packageType", "");
                                            setValue("brand", "");
                                            setValue("category", "");
                                            setValue("subCategory", "");
                                            setError("barcode", { message: "Product not found!!!" });
                                        }
                                    } else {
                                        setValue("productId", "");
                                        setValue("productName", "");
                                        setValue("packSize", "");
                                        setValue("mrp", "");
                                        setValue("packageType", "");
                                        setValue("brand", "");
                                        setValue("category", "");
                                        setValue("subCategory", "");
                                        clearErrors("barcode");
                                    }
                                }}
                                error={errors.barcode?.message}
                                isLoading={productsLoading}
                                autoFocus={true}
                            />
                        </div>

                        {/* product name select */}
                        <div>
                            <Controller
                                name="productId"
                                control={control}
                                rules={{ required: "Product Name is required!!!" }}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <RHSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={(val) => {
                                            onChange(val);
                                            if (val) {
                                                const selectedId = val?.id || val;
                                                const foundProduct = finishedProducts?.data?.find(p => p.id === selectedId);
                                                if (foundProduct) {
                                                    setValue("barcode", foundProduct.barcode ?? "", { shouldValidate: true });
                                                    setValue("productName", foundProduct.name ?? "", { shouldValidate: true });
                                                    setValue("packSize", `${foundProduct.measure} ${foundProduct.unit_type}`);
                                                    setValue("mrp", `${foundProduct.mrp}`);
                                                    setValue("packageType", foundProduct.package_type ?? "");
                                                    setValue("brand", foundProduct.productBrands?.[0]?.name ?? "");
                                                    setValue("category", foundProduct.productCategories?.[0]?.name ?? "");
                                                    setValue("subCategory", foundProduct.productCategories?.[0]?.subcategories?.[0]?.name ?? "");
                                                    clearErrors("barcode");
                                                }
                                            } else {
                                                setValue("barcode", "", { shouldValidate: true });
                                                setValue("productName", "", { shouldValidate: true });
                                                setValue("packSize", "");
                                                setValue("mrp", "");
                                                setValue("packageType", "");
                                                setValue("brand", "");
                                                setValue("category", "");
                                                setValue("subCategory", "");
                                            }
                                        }}
                                        label="Product Name"
                                        options={finishedProducts?.data}
                                        formatOptionLabel={productOptionLabel}
                                        filterOption={productOptionFilter}
                                        error={error?.message}
                                        required={true}
                                        isLoading={productsLoading}
                                        placeholder="Select product..."
                                        hiddenIds={hiddenIds}
                                        isClearable={true}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* 2nd */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* category */}
                        <div>
                            <Input
                                label="Category"
                                // placeholder="Category"
                                {...register("category")}
                                disabled={true}
                            />
                        </div>

                        {/* sub-category */}
                        <div>
                            <Input
                                label="Sub Category"
                                // placeholder="Sub-Category"
                                {...register("subCategory")}
                                disabled={true}
                            />
                        </div>
                    </div>

                    {/* 3rd */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* brand */}
                        <div>
                            <Input
                                label="Brand"
                                // placeholder="Brand Name"
                                {...register("brand")}
                                disabled={true}
                            />
                        </div>

                        {/* Package type */}
                        <div>
                            <Input
                                label="Package Type"
                                // placeholder="Package type"
                                {...register("packageType")}
                                disabled={true}
                            />
                        </div>
                    </div>

                    {/* 4th */}
                    <div className="grid grid-cols-3 gap-5">
                        {/* pack size */}
                        <div>
                            <Input
                                label="Pack Size"
                                // placeholder="Pack size"
                                {...register("packSize")}
                                disabled={true}
                            />
                        </div>

                        {/* mrp */}
                        <div>
                            <Input
                                label="MRP"
                                // placeholder="mrp"
                                {...register("mrp")}
                                disabled={true}
                            />
                        </div>

                        {/* Req Qty */}
                        <div>
                            <Input
                                label="Req Qty."
                                placeholder="Enter Qty"
                                {...register("reqQty", {
                                    required: {
                                        message: "QTY required",
                                        value: true
                                    }
                                })}
                                error={errors.reqQty?.message}
                                required={true}
                            />
                        </div>
                    </div>

                    {/* button section */}
                    <div className="flex items-center justify-end gap-10">
                        <button
                            className='btn btn-outline-dark'
                            onClick={() => reset()}
                            type='button'
                        >Reset</button>
                        <Button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!watch("productId")}
                            loading={productsLoading}
                        >
                            Add Item
                        </Button>
                    </div>
                </div>
            </form >
        </div >
    )
}

export default RequisitionItemForm;