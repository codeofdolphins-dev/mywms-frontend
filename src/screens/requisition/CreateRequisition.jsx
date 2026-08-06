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
import RequisitionCategoryForm from '../../components/requisition/create/RequisitionCategoryForm';
import requisition from '../../Backend/requisition.backend';
import TextArea from '../../components/inputs/TextArea';
import RHRadioGroup from '../../components/inputs/RHF/RHRadioGroup';
import { Helmet } from 'react-helmet-async';
import business from '../../Backend/business.fetch';


const PRIORITY = [
    { label: "High", value: "high" },
    { label: "Normal", value: "normal" },
    { label: "Low", value: "low" },
]

const REQ_TYPE = [
    { label: "Trading Requisition", value: "trade" },
    { label: "Open Forum", value: "openForum" },
    { label: "Internal Stock Transfer", value: "internal" },
]

const CreateRequisition = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.userData);

    const node = user?.activeNode;


    /**************** global variable *******************/
    // const locationName = user?.activeNode?.nodeDetails?.name;
    const isManufacture = node?.NodeUser?.department !== null ? true : false;


    /**************** APT mutation *******************/
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["requisitionList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["requisitionList"]);




    /**************** react form hook *******************/
    const { handleSubmit, control, register, formState: { errors }, setValue, reset, watch } = useForm();

    const req_type = watch("req_type");
    const vendor_id = watch("vendor_id");

    const isTrader = req_type === "trade";
    const isOpen = req_type === "openForum";
    const isInternal = req_type === "internal";




    /**************** data fetching GET *******************/
    // const { data: requisitionCatList, isLoading: requisitionCatListLoading } = requisition.TQRequisitionCategoryList(isManufacture);
    const { data: locationData, isLoading: locationIsLoading } = business.TQTenantRegisteredNodeList({}, isTrader);
    const { data: supplierData, isLoading: supplierIsLoading } = vendor.TQVendorList({}, isTrader);

    /** For internal requisitions the supplier list comes from the allowed-node API */
    const { data: allownodeList, isLoading: allownodeListLoading } = fetchData.TQAllowNodeList(isInternal);

    /** for trading requisition fetch all locations of that vendor */
    const [tenant_code, setTenant_code] = useState(null);
    useEffect(() => {
        if (!isTrader) return;

        setTenant_code(
            supplierData?.data?.find(sd => sd.id === vendor_id)?.tenant
        )
    }, [isTrader, vendor_id, supplierData]);

    console.log("tenant_code", tenant_code);

    const { data: tenantLocationData, isLoading: tenantLocationIsLoading } = business.TQLocationsOfTenant(tenant_code, Boolean(tenant_code));


    /**
     * Requisition type availability by user type:
     * - Root user (is_owner) -> can raise ALL types
     * - Logical user (NodeUser.department has a value) -> cannot raise "internal"
     * - Inter-location user (NodeUser.department is null) -> can ONLY raise "internal"
     */
    const reqTypeOptions = REQ_TYPE.map(opt => ({
        ...opt,
        isDisabled: user?.is_owner
            ? false
            : isManufacture
                ? opt.value === "internal"
                : opt.value !== "internal",
    }));


    const [isShow, setIsShow] = useState(false);
    const [isReqForm, setIsReqForm] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    /** Calculate total amount of items */
    useEffect(() => {
        const calculateTotals = (items) => {
            return items?.reduce((total, item) => {
                const limit = parseFloat(item?.priceLimit) || 0;
                const qty = parseFloat(item?.reqQty) || 0;
                return total + (limit * qty);
            }, 0);
        };

        setValue("total", calculateTotals(selectedItems));
    }, [selectedItems, setValue]);

    /** For internal requisition, buyer is always the active node */
    useEffect(() => {
        if (isInternal) {
            setValue("buyer_node", node?.nodeDetails?.name);
        }
    }, [isInternal, node?.nodeDetails?.name, setValue]);


    /** handle submit */
    const onSubmit = async (data) => {
        data.items = selectedItems
        // console.log(data); return

        try {
            if (isOpen) {
                const res = await createData({ path: "/requisition/create/open-forum", formData: data });
                if (res.success) {
                    reset();
                    setSelectedItems([]);
                    navigate("/requisition?tab=1");
                }
                return;
            };
            if (isTrader) {
                const res = await createData({ path: "/requisition/create/trading", formData: data });
                if (res.success) {
                    reset();
                    setSelectedItems([]);
                    navigate("/requisition?tab=2");
                }
                return;
            };

            if (isInternal) {
                data.vendor_id = Array.isArray(data?.vendor_id) ? data?.vendor_id : [data?.vendor_id];
                const res = await createData({ path: "/requisition/create/internal", formData: data });
                if (res.success) {
                    reset();
                    setSelectedItems([]);
                    navigate("/requisition?tab=1");
                };
                return;
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
            <Helmet><title>Create Requisition | MYWMS</title></Helmet>

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

                <button
                    title='Add Item'
                    className={`w-8 h-8 rounded-full bg-primary flex justify-center items-center
                        ${!req_type || (isTrader && !vendor_id) || (isOpen && selectedItems?.length >= 1) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                    onClick={() => setIsShow(true)}
                    disabled={!req_type || (isTrader && !vendor_id) || (isOpen && selectedItems?.length >= 1)}
                >
                    <FiPlus size={22} color='white' />
                </button>
            </div>


            <div className="mt-5" id="forms_grid">
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* left side */}
                        <div className="panel">

                            {/* input fields */}
                            <div className="grid grid-cols-1 gap-5">

                                {/* req type */}
                                <div className="">
                                    <Controller
                                        name="req_type"
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
                                                isClearable={true}

                                                label="Requisition Type"
                                                labelPosition={"inline"}
                                                options={reqTypeOptions}
                                            />
                                        )}
                                    />
                                </div>

                                {req_type && <>

                                    {/* buyer */}
                                    {(isTrader || isInternal) &&
                                        <div>
                                            {isInternal ? (
                                                <Input
                                                    label="Buyer"
                                                    labelPosition="inline"
                                                    disabled={true}
                                                    readOnly
                                                    value={node?.nodeDetails?.name ?? ""}
                                                />
                                            ) : (
                                                <Controller
                                                    name="buyer_node"
                                                    control={control}
                                                    rules={{
                                                        required: "This field is required!!!"
                                                    }}
                                                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                                                        const buyyerOptions = locationData?.data?.map(node => ({
                                                            id: node?.business_node_id,
                                                            name: `${node?.name} - ${node?.location}`
                                                        }));

                                                        return <RHSelect
                                                            ref={(el) => {
                                                                ref({
                                                                    focus: () => el?.focus(),
                                                                });
                                                            }}
                                                            value={value}
                                                            onChange={onChange}

                                                            label="Buyer"
                                                            labelPosition='inline'
                                                            options={buyyerOptions}
                                                            error={error?.message}
                                                            required={true}
                                                            // isMulti={true}
                                                            isClearable={true}
                                                        />
                                                    }}
                                                />
                                            )}
                                        </div>
                                    }

                                    {/* supplier & locations */}
                                    {(isTrader || isInternal) &&
                                        <>
                                            {/* supplier */}
                                            <Controller
                                                name="vendor_id"
                                                control={control}
                                                rules={{
                                                    required: "This field is required!!!"
                                                }}
                                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                                                    const supplierOptions = isInternal
                                                        ? allownodeList?.data?.map(node => ({
                                                            id: node?.business_node_id ?? node?.id,
                                                            name: node?.location ? `${node?.name} - ${node?.location}` : node?.name
                                                        }))
                                                        : supplierData?.data?.map(node => ({
                                                            id: node?.id,
                                                            name: `${node?.name}`
                                                        }));

                                                    return <RHSelect
                                                        ref={(el) => {
                                                            ref({
                                                                focus: () => el?.focus(),
                                                            });
                                                        }}
                                                        value={value}
                                                        onChange={onChange}

                                                        label="Supplier"
                                                        labelPosition='inline'
                                                        options={supplierOptions}
                                                        error={error?.message}
                                                        required={true}
                                                        // isMulti={true}
                                                        isClearable={true}
                                                    />
                                                }}
                                            />

                                            {/* supplier internal locations */}
                                            {isTrader &&
                                                <Controller
                                                    name="seller_node"
                                                    control={control}
                                                    rules={{
                                                        required: "This field is required!!!"
                                                    }}
                                                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                                                        const locationOption = tenantLocationData?.data?.map(node => ({
                                                            id: node?.id,
                                                            name: `${node?.name}`
                                                        }));

                                                        return <RHSelect
                                                            ref={(el) => {
                                                                ref({
                                                                    focus: () => el?.focus(),
                                                                });
                                                            }}
                                                            value={value}
                                                            onChange={onChange}

                                                            label="Locations"
                                                            labelPosition='inline'
                                                            options={locationOption}
                                                            error={error?.message}
                                                            required={true}
                                                            isClearable={true}
                                                            isLoading={tenantLocationIsLoading}
                                                            disabled={!vendor_id}
                                                        />
                                                    }}
                                                />
                                            }
                                        </>
                                    }

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

                                    {/* required date / deadline */}
                                    <div>
                                        <Input
                                            type="date"
                                            label={isTrader ? "Required Date" : "Deadline"}
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

                                    {/* price limit */}
                                    {isOpen && (
                                        <div className="">
                                            <Controller
                                                name="limit_type"
                                                control={control}
                                                // rules={{ required: "Price Limit is required!!!" }}
                                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                    <RHRadioGroup
                                                        ref={(el) => {
                                                            ref({
                                                                focus: () => el?.focus(),
                                                            });
                                                        }}
                                                        value={value}
                                                        onChange={onChange}
                                                        label="Price Limit"
                                                        labelPosition="inline"
                                                        options={[
                                                            { label: "Upper Limit", value: "upper_limit", title: "High amount is not allowed" },
                                                            { label: "Lower Limit", value: "lower_limit", title: "Low amount is not allowed" },
                                                        ]}
                                                    // error={error?.message}
                                                    // required={true}
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* total */}
                                    {isOpen && (
                                        <div className="">
                                            <Input
                                                label="Total"
                                                labelPosition="inline"
                                                disabled={true}
                                                {...register("total")}
                                            />
                                        </div>
                                    )}

                                    {/* note */}
                                    <div className="">
                                        <TextArea
                                            label="Note"
                                            labelPosition="inline"
                                            {...register("notes")}
                                        />
                                    </div>
                                </>}

                            </div>

                            {/* button  group*/}
                            <div className="mt-10 flex items-center justify-end gap-5">
                                <Button
                                    type="reset"
                                    className="btn-secondary"
                                    onClick={() => {
                                        reset();
                                        setSelectedItems([]);
                                    }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    className="btn btn-primary"
                                // disabled={isEmpty}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>

                        {/* right side */}
                        <div className="panel min-h-64 relative z-0">
                            <div className="overflow-x-auto">
                                <TableBody
                                    isEmpty={selectedItems?.length === 0}
                                    showPagination={false}
                                    columns={
                                        isOpen ? REQUISITION_CREATE_RAW_COLUMN_ACTION : REQUISITION_CREATE_COLUMN_ACTION
                                    }
                                >
                                    {selectedItems?.map((item, idx) => (
                                        isOpen ? (
                                            /** raw material preview */
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
                maxWidth='50'
            >
                {isOpen && <RequisitionItemFormRaw
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    setIsShow={setIsShow}
                />}

                {(isTrader || isInternal) &&
                    <RequisitionItemForm
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        setIsShow={setIsShow}
                        vendorId={isInternal ? null : vendor_id}
                    />
                }

            </AddModal>

            <AddModal
                isShow={isReqForm}
                setIsShow={setIsReqForm}
                title={"Add New Requisition Category"}
                maxWidth='40'
            >
                <RequisitionCategoryForm
                    setIsShow={setIsReqForm}
                />
            </AddModal>
        </div >
    )
}

export default CreateRequisition;


// requisition category - hidden for trader
// !isTrader && (
//     <div>
//         <Controller
//             name="requisition_category_id"
//             control={control}
//             render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
//                 <RHSelect
//                     value={value}
//                     onChange={onChange}

//                     label="Requisition Category"
//                     labelPosition='inline'
//                     options={requisitionCatList?.data}

//                     addButton={true}
//                     buttonTitle='Req Category'
//                     buttonOnClick={() => setIsReqForm(true)}
//                 />
//             )}
//         />
//     </div>
// )