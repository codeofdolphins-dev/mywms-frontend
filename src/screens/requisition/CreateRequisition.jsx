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
import fetchData from '../../Backend/fetchData.backend';
import { useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';


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

const PRIORITY = [
    { label: "Low", value: "low" },
    { label: "Normal", value: "normal" },
    { label: "High", value: "high" },
]

const CreateRequisition = () => {
    const user = useSelector(state => state.auth.userData);
    const currentLocation = user?.userBusinessNode?.[0]?.nodeDetails?.name

    const [items, setItems] = useState(tableData || []);

    const [isShow, setIsShow] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const { handleSubmit, control, register, formState: { errors }, setValue } = useForm();

    const { data: allownodeList, isLoading: allownodeListLoading } = fetchData.TQAllowNodeList();

    // console.log(allownodeList);
    setValue("buyer", currentLocation)


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
                <li className="before:content-['/'] before:mr-2">
                    <span>create requisition</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-1">
                <div className='flex items-center gap-6'>

                    <h1 className="text-2xl font-bold">Create Requisition</h1>

                    <div
                        title='Add Item'
                        className="w-8 h-8 rounded-full bg-primary flex justify-center items-center cursor-pointer"
                        onClick={() => setIsShow(true)}
                    >
                        <FiPlus size={22} color='white' />
                    </div>
                </div>
            </div>

            <div className="mt-1" id="forms_grid">
                <div className="mb-5">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* first row */}
                            <div className="panel">

                                <div className="grid grid-cols-1 gap-5">
                                    {/* buyer */}
                                    <div>
                                        <Input
                                            label="Buyer"
                                            labelPosition="inline"
                                            {...register("buyer")}
                                            required={true}
                                            disabled={true}
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
                                                    labelPosition='inline'
                                                    selectKey='nodeDetails'
                                                    selectSubKey='name'
                                                    options={allownodeList?.data}
                                                    error={error?.message}
                                                    required={true}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* title */}
                                    <div>
                                        <Input
                                            label="Title"
                                            labelPosition="inline"
                                            placeholder="Enter title"
                                            {...register("title", {
                                                required: "Title Required"
                                            })}
                                            error={errors.title?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* required date */}
                                    <div>
                                        <Input
                                            type="date"
                                            label="Required Date"
                                            labelPosition="inline"
                                            {...register("required_by_date")}
                                        />
                                    </div>

                                    {/* node type */}
                                    <div className="">
                                        <Controller
                                            name="node_type"
                                            control={control}
                                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                <SearchableSelect
                                                    ref={(el) => {
                                                        ref({
                                                            focus: () => el?.focus(),
                                                        });
                                                    }}
                                                    value={value}
                                                    onChange={onChange}
                                                    isSearchable={false}

                                                    label="User Type"
                                                    labelPosition={"inline"}
                                                    options={PRIORITY}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="mt-10 flex items-center justify-end gap-5">
                                    {/* <Button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setIsShow(true)}
                                        // loading={true}
                                    >
                                        Add Item
                                    </Button> */}
                                    <Button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setIsShow(true)}
                                    // loading={true}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>

                            {/* second row */}
                            <div className=''>
                                <ItemTable
                                    columns={REQUISITION_CREATE_COLUMN}
                                    items={items}
                                    isLoading={false}
                                />
                            </div>
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