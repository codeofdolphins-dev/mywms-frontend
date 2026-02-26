import React, { useEffect, useRef, useState } from 'react';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import { Controller, useForm } from 'react-hook-form';
import ItemTable from '../../components/ItemTable';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import { Button } from '@mantine/core';
import Input from '../../components/inputs/Input';
import { REQUISITION_CREATE_COLUMN_ACTION, REQUISITION_CREATE_RAW_COLUMN_ACTION } from '../../utils/helper';
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
import { calculateTotals } from '../../helper/calculateTotals';
import vendor from '../../Backend/vendor.backend';
import RequisitionItemFormRaw from '../../components/requisition/create/RequisitionItemFormRaw';


const PRIORITY = [
    { label: "Low", value: "low" },
    { label: "Normal", value: "normal" },
    { label: "High", value: "high" },
]

const CreateRequisition = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.userData);


    /**************** global variable *******************/
    const locationName = user?.activeNode?.nodeDetails?.name;
    const isManufacture = user?.activeNode?.type?.category === "manufacturing" ? true : false;


    /**************** APT mutation *******************/
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["requisitionList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["requisitionList"]);

    /**************** data fetching GET *******************/
    const { data: allownodeList, isLoading: allownodeListLoading } = fetchData.TQAllowNodeList();
    const { data: vendorCatList, isLoading: vendorCatListLoading } = vendor.TQVendorCategoryList()
    
    
    /**************** react form hook *******************/
    const { handleSubmit, control, register, formState: { errors }, setValue, reset } = useForm({
        defaultValues: {
            supplier_node: "",
            title: "",
            required_by_date: "",
            priority: "",
            vendor_category: ""
        }
    });
    setValue("buyer", locationName);


    const [isShow, setIsShow] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);


    useEffect(() => {
        setIsEmpty(Boolean(!selectedItems?.length));
        setValue("total", calculateTotals(selectedItems))

    }, [selectedItems]);


    const onSubmit = async (data) => {
        data.items = selectedItems
        // console.log(data); return

        try {
            if (isManufacture) {
                const res = await createData({ path: "/requisition/create-external", formData: data });
                if (res.success) {
                    reset();
                    setSelectedItems([]);
                    navigate("/requisition");
                }

            } else {
                const res = await createData({ path: "/requisition/create", formData: data });
                if (res.success) {
                    reset();
                    setSelectedItems([]);
                    navigate("/requisition");
                }
            }

        } catch (error) {
            console.log(error)
        }
    };


    function handleDelete(id) {
        setSelectedItems(prev => prev.filter(item => item.id !== id));
    };


    return (
        <div>

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


            <div className="mt-5" id="forms_grid">
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* left side */}
                        <div className="panel">
                            <div className="grid grid-cols-1 gap-5">
                                {/* buyer */}
                                <div>
                                    <Input
                                        label="Buyer (Current Location)"
                                        labelPosition="inline"
                                        {...register("buyer")}
                                        required={true}
                                        disabled={true}
                                    />
                                </div>


                                {/* conditional rendering supplier or vendor */}
                                {isManufacture ? (
                                    <>
                                        {/* vendor */}
                                        <div>
                                            <Controller
                                                name="vendor_category_id"
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

                                                        label="Vendor Category"
                                                        labelPosition='inline'
                                                        options={vendorCatList?.data}
                                                        error={error?.message}
                                                        required={true}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
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
                                                        isMulti={true}
                                                        isClearable={true}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </>
                                )}


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

                                {/* priority */}
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

                                {/* priority */}
                                <div className="">
                                    <Input
                                        label="Total"
                                        labelPosition="inline"
                                        disabled={true}
                                        {...register("total")}
                                    />
                                </div>
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
                        <div className="panel min-h-64 relative z-0">
                            <div className="overflow-x-auto">
                                <TableBody
                                    isEmpty={isEmpty}
                                    showPagination={false}
                                    columns={isManufacture ? REQUISITION_CREATE_RAW_COLUMN_ACTION : REQUISITION_CREATE_COLUMN_ACTION}
                                >
                                    {selectedItems?.map((item, idx) => (
                                        isManufacture ? (
                                            /** finished product preview */
                                            <TableRow
                                                key={idx}
                                                columns={REQUISITION_CREATE_RAW_COLUMN_ACTION}
                                                row={{
                                                    name: item?.name,
                                                    sku: item?.sku,
                                                    uom: item?.uom,
                                                    priceLimit: item?.priceLimit,
                                                    reqQty: item?.reqQty,
                                                    action: (
                                                        <div className='flex items-center justify-center'>
                                                            {/* <CustomeButton
                                                                onClick={() => handleEdit(item.id)}
                                                            >
                                                                <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                            </CustomeButton> */}

                                                            <CustomeButton
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer text-center" />
                                                            </CustomeButton>
                                                        </div>
                                                    )
                                                }}
                                            />

                                        ) : (
                                            /** finished product preview */
                                            <TableRow
                                                key={idx}
                                                columns={REQUISITION_CREATE_COLUMN_ACTION}
                                                row={{
                                                    barcode: item?.barcode,
                                                    product: item?.productName,
                                                    brand: item?.brand,
                                                    category: item?.category,
                                                    subCategory: item?.subCategory,
                                                    packSize: item?.packSize,
                                                    priceLimit: item?.priceLimit,
                                                    reqQty: item?.reqQty,
                                                    action: (
                                                        <div className='flex items-center justify-center'>
                                                            {/* <CustomeButton
                                                                onClick={() => handleEdit(item.id)}
                                                            >
                                                                <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                            </CustomeButton> */}

                                                            <CustomeButton
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer text-center" />
                                                            </CustomeButton>
                                                        </div>
                                                    )
                                                }}
                                            />
                                        )
                                    ))}
                                </TableBody>
                            </div>
                        </div>

                    </div>
                </form>
            </div >

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Add Item"}
                maxWidth='55'
            >
                {isManufacture
                    ? <RequisitionItemFormRaw
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        setIsShow={setIsShow}
                    />
                    : <RequisitionItemForm
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        setIsShow={setIsShow}
                    />
                }
            </AddModal>


        </div >
    )
}

export default CreateRequisition;