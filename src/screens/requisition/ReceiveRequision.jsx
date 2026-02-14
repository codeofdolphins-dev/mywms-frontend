import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { QUOTATION_RECEIVE_COLUMN, REQUISITION_CREATE_COLUMN_ACTION, REQUISITION_RECEIVE_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import CustomeButton from "../../components/inputs/Button";
import AddModal from '../../components/Add.modal';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import fetchData from '../../Backend/fetchData.backend';
import IconPencil from '../../components/Icon/IconPencil';
import QuotationForm from '../../components/quotation/QuotationForm';
import Input from '../../components/inputs/Input';
import { useForm } from 'react-hook-form';
import masterData from '../../Backend/master.backend';
import { successAlert } from '../../utils/alerts';
import { useSelector } from 'react-redux';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { MdCurrencyRupee } from 'react-icons/md';


const headerLink = [
    { title: "requisition", link: "/requisition" },
    { title: "received-requisition" },
];

const ReceiveRequision = () => {
    const userData = useSelector(state => state?.auth?.userData);
    const nodeId = userData?.userBusinessNode?.id;
    const navigate = useNavigate();
    const { handleSubmit, register, watch, formState: { errors }, reset, setValue } = useForm();


    /**************** pagination state *******************/
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    /**************** details state *******************/
    const [editId, setEditId] = useState(null);
    const [requisitionId, setRequisitionId] = useState(null);
    const [details, setDetails] = useState(null);


    /**************** modal state *******************/
    const [itemDetails, setItemDetails] = useState([]);
    const [editItem, setEditItem] = useState([]);
    const [quoteItem, setQuoteItem] = useState([]);


    /**************** modal state *******************/
    const [isShowDetails, setIsShowDetails] = useState(false);
    const [isShowEditDetails, setIsShowEditDetails] = useState(false);
    const [isShowPreview, setIsShowPreview] = useState(false);


    /**************** APT mutation *******************/
    const { mutateAsync: create, isPending: createPending } = masterData.TQCreateMaster(["receiveRequisitionList"]);


    /**************** data fetching GET *******************/
    const { data: quotationList, isLoading: quotationListLoading } = fetchData.TQQuotationList({ requisitionId }, Boolean(requisitionId));
    const { data: receiveRequisitionList, isLoading: receiveRequisitionListLoading } = fetchData.TQReceiveRequisitionList();

    const isEmpty = receiveRequisitionList
        ? !receiveRequisitionList?.data?.length
        : !quotationList?.data?.length;



    /** set selected requisition details */
    function handelShowDetails(data) {
        setDetails(data);
        const isQuoted = ["quoted", "accepted", "rejected"].some(s => s.includes(data?.status));

        setItemDetails(isQuoted ? [] : data?.items);
        if (isQuoted) {
            setIsShowPreview(true);
        }
        else {
            setIsShowDetails(true);
        };

        setRequisitionId(data.id);
    };

    function handleEdit(item) {
        setIsShowEditDetails(true);
        setEditItem(item);
    };

    function handelShow(id) {
        setEditId(id);
        setIsShowEditDetails(true);
    };



    /** reset all state as fresh */
    useEffect(() => {
        if (isShowDetails) return;

        setItemDetails([]);
        setEditItem([]);
        setQuoteItem([]);
        setRequisitionId(null);
    }, [isShowDetails]);

    useEffect(() => {
        if (!isShowEditDetails) setEditId(null);
    }, [isShowEditDetails]);

    /** feed quotation data on available */
    useEffect(() => {
        const quotation = quotationList?.data?.[0]?.quotationItem;
        if (!quotation) return;
        setItemDetails(quotation);

    }, [quotationList, quotationListLoading]);


    async function submit(data) {
        data.items = quoteItem;
        data.reqNo = details?.requisition_no;
        data.grandTotal = quoteItem.reduce((grandTotal, item) => grandTotal + Number(item.total), 0);

        console.log(data)
        // return

        try {
            const res = await create({ path: "/quotation/create", formData: data });
            if (res.success) setIsShowDetails(false);

        } catch (error) {
            console.log(error);
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


    if (quotationListLoading || receiveRequisitionListLoading) return <FullScreenLoader />;

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
                                action: (
                                    <div className='flex items-center justify-center'>
                                        <CustomeButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handelShowDetails(item);
                                            }}
                                            className={"self-center"}
                                        >
                                            <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                        </CustomeButton>
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
                title={"Item Details"}
                maxWidth='95'
            >
                <div className='panel'>
                    <div className="">
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
                                    <div className="flex items-center w-full justify-between mb-2">
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
                                        <span> {details?.note || "N/A"} </span>
                                    </div>
                                </div>

                                {/* Node details */}
                                <div className="xl:1/3 lg:w-2/5 sm:w-1/2 text-sm">
                                    <div className="flex items-center w-full justify-between mb-2">
                                        <div className="text-white-dark">"Buyer Name:"</div>
                                        <div className="whitespace-nowrap">{details?.buyer?.name || "N/A"}</div>
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
                                            <p>{details?.buyer?.nodeDetails?.address?.state || "N/A"}</p>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <p className="text-white-dark">District:</p>
                                            <p>{details?.buyer?.nodeDetails?.address?.district || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <form onSubmit={handleSubmit(submit)}>
                            <div className="grid grid-cols-1 space-x-4">

                                {/* table side */}
                                <div className="col-span-2 panel space-y-5">
                                    <div className="overflow-x-auto">
                                        <TableHeader columns={REQUISITION_CREATE_COLUMN_ACTION} />
                                        {
                                            itemDetails?.map((item, idx) => (
                                                <TableRow
                                                    key={item?.id}
                                                    columns={REQUISITION_CREATE_COLUMN_ACTION}
                                                    row={{
                                                        barcode: item?.product?.barcode,
                                                        product: item?.product?.name,
                                                        brand: item?.brand,
                                                        category: item?.category,
                                                        subCategory: item?.sub_category,
                                                        packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                                                        reqQty: item?.qty,
                                                        priceLimit: item?.priceLimit,
                                                        action: (
                                                            <div className='flex items-center justify-center space-x-3'>
                                                                <CustomeButton
                                                                    onClick={() => handleEdit(item)}
                                                                >
                                                                    <IconPencil className="text-danger hover:scale-110 cursor-pointer" />
                                                                </CustomeButton>
                                                            </div>
                                                        )
                                                    }}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* buttton */}
                            <div className="flex items-center mt-5">
                                <button
                                    type='button'
                                    className='btn btn-secondary ml-auto mt-5'
                                    onClick={() => setIsShowPreview(true)}
                                >
                                    Preview
                                </button>
                                <button
                                    type='submit'
                                    className='btn btn-info ml-auto mt-5'
                                    disabled={quoteItem?.length < 1 ? true : false}
                                >
                                    submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AddModal >

            {/* Edit Item */}
            < AddModal
                isShow={isShowEditDetails}
                setIsShow={setIsShowEditDetails}
                title={"Edit Item"}
                maxWidth='45'
            >
                <QuotationForm
                    editId={editId}
                    editItem={editItem}
                    setIsShowEditDetails={setIsShowEditDetails}
                    quoteItem={quoteItem}
                    setQuoteItem={setQuoteItem}
                />
            </AddModal >

            {/* preview panel */}
            <AddModal
                isShow={isShowPreview}
                setIsShow={setIsShowPreview}
                title={"Quotation Preview"}
                maxWidth='95'
            >
                <div className="panel">
                    <TableBody
                        isEmpty={isEmpty}
                        columns={QUOTATION_RECEIVE_COLUMN}
                        showPagination={false}
                    >
                        {itemDetails?.map((item, j) => {
                            const barcode = item?.product?.barcode ?? item?.sourceRequisitionItem?.product?.barcode;
                            const product = item?.product?.name ?? item?.sourceRequisitionItem?.product?.name;
                            const brand = item?.brand ?? item?.sourceRequisitionItem?.brand;
                            const category = item?.category ?? item?.sourceRequisitionItem?.category;
                            const sub_category = item?.sub_category ?? item?.sourceRequisitionItem?.sub_category;
                            const qty = item?.qty ?? item?.sourceRequisitionItem?.qty;
                            const priceLimit = item?.priceLimit ?? item?.sourceRequisitionItem?.priceLimit;

                            const quotItem = quoteItem?.find(q => q.barcode === barcode);
                            const offerPrice = quotItem?.offerPrice ?? item?.offer_price;
                            const tax = quotItem?.tax ?? item?.tax_percent;
                            const total = quotItem?.total ?? item?.total_price;

                            return (
                                <TableRow
                                    key={j}
                                    columns={QUOTATION_RECEIVE_COLUMN}
                                    row={{
                                        barcode: barcode,
                                        product: product,
                                        brand: brand,
                                        category: category,
                                        subCategory: sub_category,
                                        qty: qty,
                                        priceLimit: priceLimit,

                                        offerPrice: offerPrice,
                                        tax: tax,
                                        total: total
                                    }}
                                />
                            )
                        })}
                    </TableBody>
                </div>
            </AddModal> 
        </div >
    )
}

export default ReceiveRequision