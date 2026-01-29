import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../inputs/Input';
import Button from '../../inputs/Button';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../inputs/RHF/Select.RHF";
import { debounce } from 'lodash';
import fetchData from '../../../Backend/fetchData.backend';

const RequisitionItemForm = ({
    setSelectedItems = () => { }
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
            productName: "",
            packSize: "",
            packageType: "",
            ReqQty: "",
        }
    });

    const barcode = watch("barcode");

    const [searchText, setSearchText] = useState("");
    const [errorText, setErrorText] = useState("");

    const { data, isLoading, error, isError } = fetchData.TQProductList({ barcode: searchText }, !!searchText);

    // set value
    useEffect(() => {
        if (!barcode?.length) return;
        const product = data?.data;

        if (product?.length) {
            setErrorText("");

            setValue("productName", product?.[0]?.name);
            setValue("packSize", `${product?.[0]?.measure} ${product?.[0]?.unit_type}`);
            setValue("packageType", product?.[0]?.package_type);
        } else {
            setErrorText("Product not found!!!");

            resetField("productName");
            resetField("packSize");
            resetField("packageType");
            resetField("ReqQty");
        }
    }, [barcode, data]);


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


    function submitForm(data) {
        console.log(data);
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

                    {/* category */}
                    <div>
                        <Controller
                            name="category"
                            control={control}
                            // rules={{
                            //     required: "This field is required!!!"
                            // }}
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
                                // required={true}
                                />
                            )}
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

                    {/* unit type */}
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