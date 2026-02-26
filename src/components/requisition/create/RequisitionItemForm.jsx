import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../inputs/Input';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../inputs/RHF/Select.RHF";
import { debounce } from 'lodash';
import fetchData from '../../../Backend/fetchData.backend';
import { Button } from '@mantine/core';

const RequisitionItemForm = ({
    setIsShow,
    selectedItems,
    setSelectedItems = () => { },
}) => {
    const hiddenIds = selectedItems?.map(i => i.id) ?? [];

    const { handleSubmit, control, register, watch, setValue, resetField, reset, formState: { errors }, setError, clearErrors } = useForm({
        defaultValues: {
            barcode: "",
            category: "",
            subCategory: "",
            brand: "",
            productName: "",
            packSize: "",
            packageType: "",
            reqQty: "",
        }
    });

    const barcode = watch("barcode");

    const [searchText, setSearchText] = useState("");
    const [availCategory, setAvailCategory] = useState(null);

    const { data, isLoading, error, isError } = fetchData.TQProductList({ barcode: searchText, type: "finished", noLimit: true }, !!searchText);

    // debounce function
    const deBounceFn = useMemo(() =>
        debounce((value) => {
            setSearchText(value);
        }, 500),
        []
    );
    useEffect(() => {
        return () => deBounceFn.cancel();
    }, []);

    const product = data?.data[0] ?? null;
    console.log(product)


    /** check product is available or not  */
    useEffect(() => {
        if (!barcode?.length) return;

        if (!product) {
            setError("barcode", { message: "Product not found!!!" })
        } else {
            clearErrors("barcode");
        }

    }, [product, barcode]);


    /** check entered product already selected or not */
    const isAlreadySelected = hiddenIds?.includes(product?.id);
    useEffect(() => {
        if (isAlreadySelected) {
            setError("barcode", {
                message: "product already selected!!!"
            })
        } else {
            clearErrors("barcode");
        }

    }, [isAlreadySelected]);


    // auto fill values on fields
    useEffect(() => {
        if (!barcode?.length) return;

        if (product) {
            setValue("productName", product?.name);
            setValue("packSize", `${product?.measure} ${product?.unit_type}`);
            setValue("packageType", product?.package_type);
            setValue("brand", product?.productBrands?.[0]?.name);
            setValue("category", product?.productCategories?.[0]?.name);
            setValue("subCategory", product?.productCategories?.[0]?.subcategories?.[0]?.name);

        } else {
            resetField("productName");
            resetField("packSize");
            resetField("packageType");
            resetField("brand");
            resetField("ReqQty");
            resetField("category");
            resetField("subCategory");
        }
    }, [barcode, data]);


    function submitForm(data) {
        setSelectedItems(prev => [
            ...prev,
            {
                ...data,
                id: product?.id,
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
                                placeholder="Enter barcode number"
                                {...register("barcode", {
                                    required: {
                                        message: "Barcode required",
                                        value: true
                                    }
                                })}
                                onChange={(e) => {
                                    register("barcode").onChange(e);
                                    deBounceFn(e.target.value);
                                }}
                                error={errors.barcode?.message}
                                required={true}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* product name */}
                        <div>
                            <Input
                                label="Product Name"
                                placeholder="Enter product name"
                                {...register("productName")}
                                disabled={true}
                            />
                        </div>
                    </div>

                    {/* 2nd */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* category */}
                        <div>
                            <Input
                                label="Category"
                                placeholder="Enter Category"
                                {...register("category")}
                                required={true}
                                disabled={true}
                            />
                        </div>

                        {/* sub-category */}
                        <div>
                            <Input
                                label="Sub Category"
                                placeholder="Enter Sub-Category"
                                {...register("subCategory")}
                                required={true}
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
                                placeholder="Enter Brand Name"
                                {...register("brand")}
                                required={true}
                                disabled={true}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {/* Package type */}
                            <div>
                                <Input
                                    label="Package Type"
                                    placeholder="Enter unit type"
                                    {...register("packageType")}
                                    disabled={true}
                                />
                            </div>

                            {/* pack size */}
                            <div>
                                <Input
                                    label="Pack Size"
                                    placeholder="Enter pack size"
                                    {...register("packSize")}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4th */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Price Limit */}
                        <div>
                            <Input
                                label="Price Limit"
                                placeholder="Enter limit"
                                {...register("priceLimit", {
                                    required: {
                                        message: "price limit required!!!",
                                        value: true
                                    }
                                })}
                                error={errors.priceLimit?.message}
                                required={true}
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
                                error={errors.ReqQty?.message}
                                required={true}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-10">
                        <button
                            className='btn btn-outline-dark'
                            onClick={() => reset()}
                            type='button'
                        >Reset</button>
                        <Button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isAlreadySelected || !product}
                            loading={isLoading}
                        >
                            Add Item
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RequisitionItemForm;