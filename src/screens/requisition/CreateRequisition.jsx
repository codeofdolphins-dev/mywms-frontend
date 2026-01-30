import React, { useEffect, useRef, useState } from 'react';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import { Controller, useForm } from 'react-hook-form';
import ItemTable from '../../components/ItemTable';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import { Button } from '@mantine/core';
import Input from '../../components/inputs/Input';
import { REQUISITION_CREATE_COLUMN } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import AddModal from '../../components/Add.modal';
import RequisitionItemForm from "../../components/requisition/create/RequisitionItemForm";
import fetchData from '../../Backend/fetchData.backend';
import { useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import TableHeader from '../../components/table/TableHeader';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import CustomeButton from "../../components/inputs/Button"
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import masterData from '../../Backend/master.backend';


const PRIORITY = [
    { label: "Low", value: "low" },
    { label: "Normal", value: "normal" },
    { label: "High", value: "high" },
]

const CreateRequisition = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.userData);
    const currentLocation = user?.userBusinessNode?.[0]?.nodeDetails?.name
    const { handleSubmit, control, register, formState: { errors }, setValue, reset } = useForm({
        defaultValues: {
            supplier_node: "",
            title: "",
            required_by_date: "",
            priority: "",
        }
    });

    const [isShow, setIsShow] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [item, setItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster();
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster();

    const { data: allownodeList, isLoading: allownodeListLoading } = fetchData.TQAllowNodeList();


    setValue("buyer", currentLocation);

    useEffect(() => {
        setIsEmpty(Boolean(!selectedItems?.length));

    }, [selectedItems, setItem])


    const onSubmit = async (data) => {
        data.items = selectedItems
        console.log(data);

        try {
            const res = await createData({ path: "/requisition/create", formData: data });
            if (res.success) {
                reset();
                setSelectedItems([]);
                navigate(-1);
            }

        } catch (error) {
            console.log(error)
        }
    };

    function handleDelete(id) {
        setSelectedItems(prev => prev.filter(item => item.barcode !== id));
    }

    return (
        <div className='!mt-0'>
            {/* breadcrumb */}
            <div className="flex items-center gap-5 ">
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

                <div
                    title='Add Item'
                    className="w-8 h-8 rounded-full bg-primary flex justify-center items-center cursor-pointer"
                    onClick={() => setIsShow(true)}
                >
                    <FiPlus size={22} color='white' />
                </div>
            </div>


            <div className="" id="forms_grid">
                <div className="mb-5">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* left side */}
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
                                            name="supplier_node"
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
                                            name="priority"
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

                                                    label="Priority"
                                                    labelPosition={"inline"}
                                                    options={PRIORITY}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* total cost price */}
                                    {/* <div className="">
                                        <Input
                                            type="number"
                                            label="Total Cost Price"
                                            labelPosition="inline"
                                            {...register("totalCost")}
                                            disabled={true}
                                        />
                                    </div> */}

                                    {/* total MRP */}
                                    {/* <div className="">
                                        <Input
                                            type="number"
                                            label="Total MRP"
                                            labelPosition="inline"
                                            {...register("totalMRP")}
                                            disabled={true}
                                        />
                                    </div> */}
                                </div>

                                <div className="mt-10">
                                    <Button
                                        type="submit"
                                        className="btn btn-primary ml-auto"
                                        disabled={isEmpty}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>

                            {/* right side */}
                            <div className={`panel ${isEmpty ? "min-h-64" : ""} relative`}>
                                <div className="overflow-x-auto">
                                    <TableHeader columns={REQUISITION_CREATE_COLUMN} />
                                    <TableBody
                                        isEmpty={isEmpty}
                                        showPagination={false}
                                    >
                                        {selectedItems?.map((item, idx) => (
                                            <TableRow
                                                key={idx}
                                                columns={REQUISITION_CREATE_COLUMN}
                                                row={{
                                                    // id: item?.id,
                                                    barcode: item?.barcode,
                                                    brand: item?.name?.full_name,
                                                    product: item?.productName,
                                                    packSize: item?.packSize,
                                                    reqQty: item?.reqQty,
                                                    action: (
                                                        <div className='flex items-center justify-center'>
                                                            {/* <CustomeButton
                                                                onClick={() => handleEdit(item.id)}
                                                            >
                                                                <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                            </CustomeButton> */}

                                                            <CustomeButton
                                                                onClick={() => handleDelete(item.barcode)}
                                                            >
                                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer text-center" />
                                                            </CustomeButton>
                                                        </div>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </TableBody>
                                </div>
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
                    setIsShow={setIsShow}
                    setItem={setItem}
                />
            </AddModal>


        </div>
    )
}

export default CreateRequisition;