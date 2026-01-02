import React, { useEffect, useRef, useState } from 'react';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import { Controller, useForm } from 'react-hook-form';
import ItemTable from '../../components/ItemTable';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import { Button } from '@mantine/core';
import Input from '../../components/inputs/Input';
import { REQUISITION_CREATE_COLUMN } from '../../utils/helper';
import { Link } from 'react-router-dom';


const tableData = [
    {
        id: 1,
        gstin: "27AAEPM1234Q1Z5",
        brand: "Brand A",
        product: "Product A",
        packSize: "500ml",
        reqQty: 120,
    },
    {
        id: 2,
        gstin: "29BBBPX2345R2Z7",
        brand: "Brand B",
        product: "Product B",
        packSize: "1L",
        reqQty: 400,
    },
    {
        id: 3,
        gstin: "07AACCM3456H1Z2",
        brand: "Brand C",
        product: "Product C",
        packSize: "250ml",
        reqQty: 310,
    },
    {
        id: 4,
        gstin: "19AAECS5678T1Z4",
        brand: "Brand D",
        product: "Product D",
        packSize: "750ml",
        reqQty: 100,
    },
];
const options = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

const CreateRequisition = () => {

    const [itemCount, setItemCount] = useState(1);

    const [supplier, setSupplier] = useState('1');
    const [warehouse, setWarehouse] = useState('');
    const [items, setItems] = useState(tableData || []);

    const { handleSubmit, control, register, formState: { errors } } = useForm();


    const addItem = () => {
        setItemCount(prev => prev + 1);
    };

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div>
            {/* breadcrumb */}
            <ul className=" flex space-x-2 ">
                <li className="">
                    <Link to="/requisition" className="text-primary hover:underline">
                        requisition
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2 ">
                    <span>create requisition</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-3">
                <div>
                    <h1 className="text-4xl font-bold my-3">Create Requisition</h1>
                </div>
            </div>

            <div className="panel mt-3" id="forms_grid">
                <div className="mb-5">
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                        {/* first row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                            label="Warehouse"
                                            selectKey='hsn_code'
                                            // options={hsnData?.data}
                                            error={error?.message}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>
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

                                            label="Supplier"
                                            selectKey='hsn_code'
                                            // options={hsnData?.data}
                                            error={error?.message}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* second row */}
                        {supplier &&
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div>
                                    <Input
                                        type="number"
                                        label="GST No."
                                        placeholder="Enter GST number"
                                        {...register("gst", {
                                            required: {
                                                message: "GST no required",
                                                value: true
                                            }
                                        })}
                                        error={errors.gst?.message}
                                        required={true}
                                    />
                                </div>

                                {/* brand */}
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
                                                selectKey='hsn_code'
                                                // options={hsnData?.data}
                                                error={error?.message}
                                                required={true}
                                            />
                                        )}
                                    />
                                </div>

                                {/* product */}
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

                                                label="Product"
                                                selectKey='hsn_code'
                                                // options={hsnData?.data}
                                                error={error?.message}
                                                required={true}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Pack Size */}
                                <div>
                                    <Input
                                        label="Pack Size"
                                        placeholder="Enter pack size"
                                        {...register("packSize", {
                                            required: {
                                                message: "pack size required",
                                                value: true
                                            }
                                        })}
                                        error={errors.packSize?.message}
                                        required={true}
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

                                <Button
                                    type="submit"
                                    className="btn btn-primary !mt-6"
                                    onClick={addItem}
                                >
                                    Add Item
                                </Button>
                            </div>
                        }

                        {itemCount > 0 &&
                            <div className='!mt-10'>
                                <ItemTable
                                    columns={REQUISITION_CREATE_COLUMN}
                                    items={items}
                                    isLoading={false}
                                />
                                <button type="button" className="btn btn-primary mt-5 ml-auto">Submit Requisition</button>
                            </div>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateRequisition;