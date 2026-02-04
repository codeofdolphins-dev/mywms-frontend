import React, { useEffect } from 'react'
import TableHeader from '../table/TableHeader'
import { REQUISITION_RECEIVE_DETAILS_COLUMN } from '../../utils/helper'
import TableBody from '../table/TableBody'
import fetchData from '../../Backend/fetchData.backend'
import TableRow from '../table/TableRow'
import Input from '../inputs/Input'
import { Controller, useForm } from 'react-hook-form'
import TextArea from '../inputs/TextArea'
import { Button } from '@mantine/core'

const QuotationForm = ({ editId, editItem, setIsShowEditDetails, quoteItem, setQuoteItem }) => {

    const { handleSubmit, register, control, formState: { errors }, setValue, watch } = useForm();
    const offerPrice = watch("offerPrice");

    function submit(data) {
        // console.log(data);
        setIsShowEditDetails(false);
        setQuoteItem(prev => [...prev, data]);
    }

    // console.log(editItem);
    useEffect(() => {
        if (editId) {
            quoteItem.filter(i => i.id === editId).map(item => {
                setValue("barcode", item?.barcode);
                setValue("name", item?.name);
                setValue("price", item?.price);
                setValue("offerPrice", item?.offerPrice);
                setValue("qty", item?.qty);
                setValue("total", item?.total);
                setValue("tax", item?.tax);
            })
        } else {
            setValue("id", editItem?.id);
            setValue("barcode", editItem?.product?.barcode);
            setValue("name", editItem?.product?.name);
            setValue("price", editItem?.priceLimit);
            setValue("qty", editItem?.qty);
            setValue("total", editItem?.qty * offerPrice);
        }
    }, [editItem, offerPrice])

    return (
        <div>
            <div className="panel" id="forms_grid">
                <div className="mb-5">
                    <form onSubmit={handleSubmit(submit)} className="space-y-5">
                        <input type="hidden" {...register("id")} />

                        {/* 1st row */}
                        <div className="flex items-center gap-5">
                            <Input
                                label={"Barcode"}
                                labelPosition="inline"
                                placeholder={"Enter website URL (e.g., https://example.com)"}
                                {...register("barcode")}
                                disabled={true}
                            />
                            <Input
                                label={"Name"}
                                labelPosition="inline"
                                placeholder={"Enter website URL (e.g., https://example.com)"}
                                {...register("name")}
                                disabled={true}
                            />
                        </div>

                        {/* 2nd row */}
                        <div className="grid grid-cols-2 gap-5">
                            <Input
                                label="Qty."
                                labelPosition="inline"
                                {...register("qty")}
                                disabled={true}
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <label className='inline-block pl-1 text-sm text-gray-600'>Price</label>
                                <Input
                                    {...register("price")}
                                    disabled={true}
                                />
                                <Input
                                    placeholder={"Enter your price..."}
                                    {...register("offerPrice", {
                                        required: "This field is required!!!",
                                        max: {
                                            value: editItem?.priceLimit,
                                            message: "price more than limit price not allow!!!"
                                        },
                                    })}
                                    error={errors.offerPrice?.message}
                                />
                            </div>
                        </div>


                        {/* 3rd row */}
                        <div className="flex items-center gap-5">
                            <Input
                                label={"Tax Percent %"}
                                labelPosition="inline"
                                placeholder={"Enter brand name..."}
                                {...register("tax", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.tax?.message}
                                required={true}
                            />

                            <Input
                                label={"Total"}
                                labelPosition="inline"
                                placeholder={"total price"}
                                {...register("total")}
                                disabled={true}
                            />
                        </div>

                        <div className="flex">
                            <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false} className='ml-auto'>
                                {editId ? "Close" : "Add"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default QuotationForm