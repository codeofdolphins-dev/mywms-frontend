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

    const { handleSubmit, control, register, reset, watch, formState: { errors } } = useForm();
    const barcode = watch("barcode");

    const [searchText, setSearchText] = useState("");

    const { data, isLoading } = fetchData.TQProductList({ barcode: searchText }, !!searchText);
    const product = data?.data?.[0];

    const deBounceFn = useMemo(() =>
        debounce((value) => {
            setSearchText(value);
            console.log("Searching for:", value);
        }, 500),
        []
    );

    useEffect(() => {

        return () => {
            deBounceFn.cancel();
        };
    }, []);

    // set value
    useEffect(() => {
        if (!product) return;

        reset({
            productName: product?.name,
            packSize: `${product?.measure} ${product?.unit_type}`,
            packageType: product?.package_type,
        });
    }, [product])


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
                            onChange={(e) => deBounceFn(e.target.value)}
                            error={errors.barcode?.message}
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