import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../inputs/Input';
import Button from '../../inputs/Button';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../inputs/RHF/Select.RHF";
import { debounce } from 'lodash';
import fetchData from '../../../Backend/fetchData.backend';

const RequisitionItemForm = ({
    setIsShow,
    setItem,
    setSelectedItems = () => { },
}) => {

    const {
        handleSubmit, control,
        register, watch, setValue,
        resetField, reset,
        formState: { errors },
    } = useForm({
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
    const category = watch("category");

    const [searchText, setSearchText] = useState("");
    const [errorText, setErrorText] = useState("");
    const [availCategory, setAvailCategory] = useState(null);

    const { data, isLoading, error, isError } = fetchData.TQProductList({ barcode: searchText }, !!searchText);

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

    const product = data?.data[0];

    // set sub-category option
    useEffect(() => {
        setAvailCategory(
            product?.productCategories.flatMap(item => item.id === category.id ? item.subcategories : [])
        )
    }, [category]);
    

    // set value
    useEffect(() => {
        if (!barcode?.length) return;

        if (product) {
            setErrorText("");

            setValue("productName", product?.name);
            setValue("packSize", `${product?.measure} ${product?.unit_type}`);
            setValue("packageType", product?.package_type);
            // setValue("categories", product?.[0]?.selectedCategoryIds);
        } else {
            setErrorText("Product not found!!!");

            resetField("productName");
            resetField("packSize");
            resetField("packageType");
            resetField("ReqQty");
        }
    }, [barcode, data]);


    function submitForm(data) {
        setSelectedItems(prev => [...prev, data]);

        reset();
        setIsShow(false);
    }

    return (
        <div className="panel" id="forms_grid">

            <form onSubmit={handleSubmit(submitForm)} className='space-y-5'>
                {/* form */}
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
                            error={errors.barcode?.message || errorText}
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

                    {/* product category */}
                    <div>
                        <Controller
                            name="category"
                            control={control}
                            rules={{
                                required: "category is required"
                            }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <>
                                    <RHSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus()
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}
                                        error={error?.message}

                                        label={"Category"}
                                        options={product?.productCategories}
                                        required={true}
                                        objectReturn={true}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* product sub-category */}
                    <div>
                        <Controller
                            name="subCategory"
                            control={control}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <>
                                    <RHSelect
                                        value={value}
                                        onChange={onChange}

                                        label={"Sub Category"}
                                        options={availCategory}
                                        disabled={!category}
                                        objectReturn={true}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* product brand */}
                    <div>
                        <Controller
                            name="brand"
                            control={control}
                            rules={{
                                required: "Brand is required",
                            }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <>
                                    <RHSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus()
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}
                                        error={error?.message}

                                        label={"Brand"}
                                        options={product?.productBrands}
                                        required={true}
                                        objectReturn={true}
                                    />
                                </>
                            )}
                        />
                    </div>

                    {/* Package type */}
                    <div>
                        <Input
                            label="Package Type"
                            placeholder="Enter unit type"
                            {...register("packageType")}
                            disabled={true}
                        />
                    </div>

                    {/* category */}
                    {/* <div>
                        <Controller
                            name="categories"
                            control={control}
                            rules={{
                                validate: (v) =>
                                    v?.length > 0 || "Please select at least one category",
                            }}
                            render={({ field: { value, onChange }, fieldState }) => (
                                <>
                                    <CategoryTree
                                        data={data?.data?.[0]?.productCategories}
                                        value={value || []}
                                        onChange={onChange}
                                        disabled={true}
                                    />

                                    {fieldState.error && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div> */}

                    {/* pack size */}
                    <div>
                        <Input
                            label="Pack Size"
                            placeholder="Enter pack size"
                            {...register("packSize")}
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
                    >
                        Add Item
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RequisitionItemForm;