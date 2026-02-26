import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../inputs/Input';
import Button from '../../inputs/Button';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../inputs/RHF/Select.RHF";
import { debounce } from 'lodash';
import fetchData from '../../../Backend/fetchData.backend';

const RequisitionItemFormRaw = ({
    setIsShow,
    selectedItems,
    setSelectedItems = () => { },
}) => {
    const hiddenIds = selectedItems?.map(i => i.id) ?? [];

    const { handleSubmit, control, register, watch, setValue, reset, formState: { errors }, } = useForm({
        defaultValues: {
            name: "",
            sku: "",
            uom: "",
            priceLimit: "",
            reqQty: ""
        }
    });

    const [searchText, setSearchText] = useState("");
    const [errorText, setErrorText] = useState("");
    const [availCategory, setAvailCategory] = useState(null);

    const { data, isLoading, error, isError } = fetchData.TQProductList({ type: "raw", noLimit: true });


    const name = watch("name");
    useEffect(() => {
        setValue("sku", name?.sku);
        setValue("uom", name?.unit_type);

    }, [name]);


    function submitForm(data) {
        // console.log(data); return
        setSelectedItems(prev => [
            ...prev, 
            {
                ...data,
                id: name?.id,
                name: name?.name
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
                        {/* product name */}
                        <div>
                            <Controller
                                name="name"
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

                                        label="Product Name"
                                        options={data?.data}
                                        error={error?.message}
                                        required={true}
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                        objectReturn={true}
                                        autoFocus={true}
                                        hiddenIds={hiddenIds}
                                    />
                                )}
                            />
                        </div>

                        {/* SKU / code */}
                        <div>
                            <Input
                                label="Product code / SKU"
                                placeholder="product code / SKU"
                                {...register("sku")}
                                disabled={true}
                            />
                        </div>
                    </div>

                    {/* 2nd */}
                    <div className="grid grid-cols-3 gap-5">
                        {/* uom */}
                        <div>
                            <Input
                                label="Unit of masure"
                                placeholder="uom"
                                {...register("uom")}
                                disabled={true}
                            />
                        </div>

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
                                        message: "request qty required!!!",
                                        value: true
                                    }
                                })}
                                error={errors.reqQty?.message}
                                required={true}
                            />
                        </div>
                    </div>

                    {/* 3rd row */}
                    <div className="flex items-center justify-end gap-10 !mt-8">
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
                </div>
            </form>
        </div>
    )
}

export default RequisitionItemFormRaw;