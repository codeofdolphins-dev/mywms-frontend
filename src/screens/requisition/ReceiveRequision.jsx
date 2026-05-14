import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { REQUISITION_CREATE_COLUMN, REQUISITION_RECEIVE_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import AddModal from '../../components/Add.modal';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import fetchData from '../../Backend/fetchData.backend';
import { Controller, useForm } from 'react-hook-form';
import masterData from '../../Backend/master.backend';
import { useSelector } from 'react-redux';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { MdCurrencyRupee } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import { LuBookmarkPlus } from 'react-icons/lu';
import Button from '../../components/inputs/Button';
import RHSelect from "../../components/inputs/RHF/Select.RHF"


const headerLink = [
    { title: "requisition", link: "/requisition" },
    { title: "received-requisition" },
];

const ReceiveRequision = () => {
    const userData = useSelector(state => state?.auth?.userData);
    const nodeId = userData?.userBusinessNode?.id;
    const navigate = useNavigate();
    const { handleSubmit, register, watch, formState: { errors }, reset, setValue, control } = useForm();


    /**************** pagination state *******************/
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    /**************** details state *******************/
    const [details, setDetails] = useState(null);


    /**************** modal state *******************/
    const [isShowDetails, setIsShowDetails] = useState(false);
    const [isShow, setIsShow] = useState(false);


    /**************** APT mutation *******************/
    const { mutateAsync: create, isPending: createPending } = masterData.TQCreateMaster(["receiveRequisitionList"]);


    /**************** data fetching GET *******************/
    const { data: receiveRequisitionList, isLoading: receiveRequisitionListLoading } = fetchData.TQReceiveRequisitionList();
    const { data: storeList, isLoading: storeListLoading } = fetchData.TQStoreList({ store_type: "fg_store", isAdmin: true });

    const isEmpty = receiveRequisitionList?.data?.length === 0;

    const fgStore = watch("fg_store");

    /** assign to FG store */
    async function assignFgStore() {
        const item = details?.items?.map((item) => {
            return {
                vendor_product_id: item.product_id,
                requested_qty: item.qty,
            }
        });

        const payload = {
            buyer_business_node_id: details?.buyer_business_node_id,
            type: "internal",
            store_id: fgStore?.id,
            priority: details?.priority,
            note: details?.notes,
            required_by_date: details?.required_by_date,
            items: item
        }

        // console.log("details", details)
        // console.log("payload", payload)

        const res = await create({ path: "/outward/create", formData: payload });
        if (res?.success) {
            setIsShow(false);
            setIsShowDetails(false);
        }
    }


    /** set status color */
    function statusColor(status) {
        // follow jointable status order
        switch (status) {
            case "sent":
                return "bg-primary";
            case "quoted":
                return "bg-info";
            case "accepted":
                return "bg-success";
            case "rejected":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    }

    if (receiveRequisitionListLoading) return <FullScreenLoader />;

    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by sender name...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
            />

            {/* table view */}
            <div className="panel mt-5 z-0 min-h-64 relative">
                <TableBody
                    columns={REQUISITION_RECEIVE_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={1}
                    isEmpty={isEmpty}
                >
                    {receiveRequisitionList?.data?.map((item, idx) => (
                        <TableRow
                            key={idx}
                            columns={REQUISITION_RECEIVE_COLUMN}
                            row={{
                                id: item?.requisition_no,
                                title: item?.title,
                                sender: item?.buyer?.nodeDetails?.name,
                                priority: (
                                    <>
                                        <span className={`badge uppercase rounded-full ${item?.priority === "high" ? "badge-outline-danger" : item?.priority === "normal" ? "badge-outline-primary" : "badge-outline-secondary"}`}>
                                            {item?.priority}
                                        </span>
                                    </>
                                ),
                                status: (
                                    <>
                                        <span className={`badge uppercase rounded-full ${statusColor(item?.status)}`}>
                                            {item?.status === "sent" ? "Received" : item?.status}
                                        </span>
                                    </>
                                ),
                                itemsCount: item?.items?.length,
                                notes: item?.notes,
                                action: (
                                    <div className='flex items-center justify-center gap-2'>

                                        {item?.status !== "assign_fg" &&
                                            <Tippy
                                                content="Assign FG Store"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setDetails(item);
                                                        setIsShow(true);
                                                    }}
                                                >
                                                    <LuBookmarkPlus
                                                        className="hover:scale-110 cursor-pointer"
                                                        strokeWidth={1.5}
                                                        size={20}
                                                    />
                                                </button>
                                            </Tippy>
                                        }

                                        <Tippy
                                            content="Preview"
                                        >
                                            <button
                                                onClick={() => {
                                                    setDetails(item);
                                                    setIsShowDetails(true);
                                                }}
                                            >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </button>
                                        </Tippy>
                                    </div>
                                )
                            }}
                        />
                    ))}
                </TableBody>
            </div>



            {/* Item Details */}
            <AddModal
                isShow={isShowDetails}
                setIsShow={setIsShowDetails}
                title={"Preview Item Details"}
                maxWidth='80'
            >
                <div className='panel'>

                    {/* header section */}
                    <div className="">

                        {/* header title and priority */}
                        <div className='flex items-center'>
                            <span>Received Requisition Details of</span>
                            <span className="font-bold uppercase ml-1">{details?.title || "..."}</span>
                            <span
                                className={`
                                        badge uppercase ml-1 rounded-full
                                        ${details?.priority === "high" ? "badge-outline-danger" : details?.priority === "normal" ? "badge-outline-primary" : "badge-outline-secondary"}
                                    `}
                            >
                                {details?.priority || "..."}
                            </span>
                        </div>

                        <div className='max-h-36 overflow-auto'>
                            <div className="mt-2 flex justify-between sm:flex-row flex-col gap-6 border p-4 border-dotted rounded-lg bg-gray-100">

                                {/* PO details */}
                                <div className="xl:1/3 lg:w-2/5 sm:w-1/2 text-sm">
                                    <div className="flex w-full items-center justify-between mb-2">
                                        <div className="text-white-dark">RQ Number:</div>
                                        <span className='text-sm'># {details?.requisition_no || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Issued Date :</div>
                                        <span>{utcToLocal(details?.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Required By:</div>
                                        <span className='text-sm'>{utcToLocal(details?.required_by_date) || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Total Items:</div>
                                        <span className='text-sm'>{details?.items?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Grand Total:</div>
                                        <span className='flex items-center'>
                                            <MdCurrencyRupee />
                                            {details?.grandTotal}
                                        </span>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Note:</div>
                                        <span className='text-sm'> {details?.notes || "N/A"} </span>
                                    </div>
                                </div>

                                {/* Node details */}
                                <div className="xl:1/3 lg:w-2/5 sm:w-1/2 text-sm">
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Buyer Name:</div>
                                        <div className="">{details?.buyer?.name || "N/A"}</div>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">GST No:</div>
                                        <div>{details?.buyer?.nodeDetails?.gst_no || "N/A"}</div>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">Location:</div>
                                        <div>{details?.buyer?.nodeDetails?.location || "N/A"}</div>
                                    </div>
                                    <div className="flex items-center w-full justify-between mb-2 gap-5">
                                        <div className="flex items-center w-full justify-between">
                                            <div className="text-white-dark">Lat:</div>
                                            <div>{details?.buyer?.nodeDetails?.address?.lat || "N/A"}</div>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <div className="text-white-dark">Long:</div>
                                            <div>{details?.buyer?.nodeDetails?.address?.long || "N/A"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center w-full justify-between mb-2 gap-5">
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">Address:</p>
                                            <p>{details?.buyer?.nodeDetails?.address?.address || "N/A"}</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">Pincode:</p>
                                            <p>{details?.buyer?.nodeDetails?.address?.pincode || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center w-full justify-between mb-2 gap-5">
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">State:</p>
                                            <p>{details?.buyer?.nodeDetails?.address?.state?.name || details?.buyer?.nodeDetails?.address?.state || "N/A"}</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">District:</p>
                                            <p>{details?.buyer?.nodeDetails?.address?.district?.name || details?.buyer?.nodeDetails?.address?.district || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* table section */}
                    <div className="mt-5">
                        <form onSubmit={handleSubmit()}>
                            <div className="grid grid-cols-1">

                                {/* table side */}
                                <div className="">
                                    <div className="overflow-x-auto">
                                        <TableBody
                                            columns={REQUISITION_CREATE_COLUMN}
                                            isEmpty={false}
                                            showPagination={false}
                                        >
                                            {details?.items?.map((item, idx) => (
                                                <TableRow
                                                    key={item?.id}
                                                    columns={REQUISITION_CREATE_COLUMN}
                                                    row={{
                                                        barcode: item?.product?.barcode,
                                                        product: item?.product?.name,
                                                        brand: item?.brand,
                                                        category: item?.category,
                                                        subCategory: item?.sub_category,
                                                        packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                                                        reqQty: item?.qty,
                                                    }}
                                                />
                                            ))}
                                        </TableBody>
                                    </div>
                                </div>
                            </div>

                            {/* buttton */}
                            {/* <div className="flex items-center mt-1">
                                <button
                                    type='button'
                                    className='btn btn-secondary mx-auto'
                                    onClick={() => setIsShow(true)}
                                >
                                    Assign to FG Store
                                </button>
                            </div> */}
                        </form>
                    </div>
                </div>
            </AddModal >



            {/* Assign FG Store */}
            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Assign FG Store"
                maxWidth='50'
            >
                <div className="panel">
                    <div>
                        {/* fg_store */}
                        <Controller
                            name="fg_store"
                            control={control}
                            rules={{
                                required: "This field is required!!!"
                            }}
                            render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}

                                    label="Select FG Store"
                                    // labelPosition='inline'
                                    options={storeList?.data}
                                    required={true}
                                    objectReturn={true}

                                    addButton={false}
                                    buttonTitle="Add FG Store"
                                    buttonOnClick={() => setStore("FIN")}
                                />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-10">
                        <Button
                            className="btn !btn-primary rounded-full"
                            onClick={assignFgStore}
                        >
                            <span>Assign</span>
                        </Button>
                    </div>
                </div>
            </AddModal>
        </div >
    )
}

export default ReceiveRequision