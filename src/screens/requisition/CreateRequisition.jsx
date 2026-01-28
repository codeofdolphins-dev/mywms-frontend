import React, { useEffect, useRef, useState } from 'react';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import { Controller, useForm } from 'react-hook-form';
import ItemTable from '../../components/ItemTable';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import { Button } from '@mantine/core';
import Input from '../../components/inputs/Input';
import { REQUISITION_CREATE_COLUMN } from '../../utils/helper';
import { Link } from 'react-router-dom';
import AddModal from '../../components/Add.modal';
import RequisitionItemForm from "../../components/requisition/create/RequisitionItemForm";


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
    const [items, setItems] = useState(tableData || []);
    const [isShow, setIsShow] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

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
                    <h1 className="text-2xl font-bold mb-3">Create Requisition</h1>
                </div>
            </div>

            <div className="panel mt-3" id="forms_grid">
                <div className="mb-5">
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                        {/* first row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* buyer */}
                            <div>
                                <Controller
                                    name="buyer"
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

                                            label="Buyer"
                                            // selectKey=''
                                            // options={hsnData?.data}
                                            error={error?.message}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>

                            {/* supplier */}
                            <div>
                                <Controller
                                    name="supplier"
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

                            <Button
                                type="button"
                                className="btn btn-primary !mt-6"
                                onClick={() => setIsShow(true)}
                            >
                                Add Item
                            </Button>
                        </div>

                        {/* second row */}
                        <div className='!mt-10'>
                            <ItemTable
                                columns={REQUISITION_CREATE_COLUMN}
                                items={items}
                                isLoading={false}
                            />
                            <button type="button" className="btn btn-primary mt-5 ml-auto">Submit Requisition</button>
                        </div>
                    </form>
                </div>
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Add Item"}
                maxWidth='55'
            >
                <RequisitionItemForm
                    setSelectedItems={setSelectedItems}
                />
            </AddModal>


        </div>
    )
}

export default CreateRequisition;