import React, { useEffect, useState } from 'react'
import { FiHome, FiPlus } from 'react-icons/fi';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { ORDER, ORDER_RAW } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Input from '../../components/inputs/Input';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { MdCurrencyRupee } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Button } from '@mantine/core';
import { order } from '../../Backend/order.fetch';
import { FcDocument } from "react-icons/fc";
import Dropdown from '../../components/Dropdown';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import pdf from '../../Backend/downloads/pdf/pdf.download';
import masterData from '../../Backend/master.backend';
import { extractString } from '../../helper/support';
import AddModal from '../../components/Add.modal';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import CreateStoreForm from '../../components/admin/Store/CreateStoreForm';
import fetchData from '../../Backend/fetchData.backend';


const headerLink = [
    { title: "order", link: "/order" },
    { title: "details" },
];

const OrderDetails = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeNode = useSelector((state) => state.auth.userData?.activeNode);

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster();
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["purchaseOrderItemDetails", "salesOrderItemDetails"]);


    const { control, watch, formState: { errors } } = useForm();


    const { id } = useParams();
    const type = searchParams.get("type");

    const isPurchase = type === "purchase" ? true : false;

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [vendor, setVendor] = useState({});
    const [isShow, setIsShow] = useState(false);
    const [store, setStore] = useState(null);

    const params = {
        ...(isPurchase ? { poNo: id } : { soNo: id }),
        page: currentPage,
        limit: limit,
    };
    const { data: poData, isLoading: poLoading } = order.TQPurchaseOrderItemDetails(params, Boolean(isPurchase));
    const { data: soData, isLoading: soLoading } = order.TQSalesOrderItemDetails(params, Boolean(!isPurchase));
    const { data: storeList, isLoading: storeListLoading } = fetchData.TQStoreList({ store_type: "fg_store", isAdmin: true }, !isPurchase);


    const data = isPurchase ? poData : soData;
    const isLoading = isPurchase ? poLoading : soLoading;
    const isEmpty = data?.data?.items?.length > 0 ? false : true;
    const isInternal = data?.data?.type === "internal" ? true : false;
    const purchasOrderItems = data?.data?.items ?? [];

    const { mutateAsync: pInvoicePdf_download, isPending: pInvoicePdf_pending } = pdf.TQProformaInvoicePDFDownload(["purchaseOrderItemDetails", "salesOrderItemDetails"]);


    /** set business node location */
    useEffect(() => {
        const vendor = isPurchase ? data?.data?.poVendor : data?.data?.soBuyer;
        setVendor(vendor);
    }, [data, isLoading]);


    async function downloadPinvoice(id) {
        const res = await pInvoicePdf_download({ so_id: id });
    }

    /** acknowledge purchase order & approve */
    async function handleApprove(id, bpo_id) {
        const res = await updateData({ path: "/indent/update-status", formData: { po_id: id, bpo_id, status: "approved" } });
    }

    /** acknowledge purchase order & reject */
    async function handleReject(id, bpo_id) {
        const res = await updateData({ path: "/indent/update-status", formData: { po_id: id, bpo_id, status: "cancelled" } });
    }

    /** priority color change helper */
    const priorityColor = (status) => {
        switch (status) {
            case "urgent": return "bg-danger";   // Red — most critical
            case "high": return "bg-orange-400";  // Orange/Yellow — high priority
            case "medium": return "bg-secondary"; // Grey — moderate
            default: return "bg-light";    // Fallback
        }
    }

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "draft": return "bg-secondary";
            case "sent_to_supplier": return "bg-info";
            case "waiting_for_poi": return "bg-warning";
            case "poi_received": return "bg-success";
            case "approved": return "bg-success";
            case "picking_in_progress": return "bg-primary";
            case "closed": return "bg-dark";
            case "cancelled": return "bg-danger";
            default: return "bg-warning";
        }
    }

    const fgStore = watch("fg_store");
    async function assignFgStore() {

        const item = data?.data?.items?.map((item) => {
            return {
                sales_order_item_id: item.id,
                vendor_product_id: item.vendor_product_id,
                requested_qty: item.qty,
                unit_price: item.unit_price
            }
        });

        const payload = {
            sales_order_id: data?.data?.id,
            store_id: fgStore?.id,
            priority: data?.data?.priority,
            note: data?.data?.note,
            items: item
        }

        const res = await createData({ path: "/outward/create", formData: payload });
        if (res?.success) {
            setIsShow(false);
        }
    }

    if (isLoading) return <FullScreenLoader />

    return (
        <div>
            {/*header section */}
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                showSearch={false}
            />

            {/* Order Details */}
            <div className="panel mt-1 !py-3">
                {/* Top Info Cards */}
                <div className="max-h-56 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

                        {/* PO / SO Card */}
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden border-t-[3px] border-t-blue-600">

                            <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-blue-50 border-b border-blue-100">
                                <div className="flex items-center gap-2">
                                    <FcDocument size={20} />
                                    <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-wider whitespace-nowrap">{isPurchase ? "Purchase Order" : "Sales Order"}</span>
                                    <span className={`badge ${priorityColor(data?.data?.priority)}`}>{data?.data?.priority?.toUpperCase() || "N/A"}</span>
                                </div>

                                <div className="">
                                    <h2>Status: <span className={`badge ${statusColor(data?.data?.status)}`}>{extractString(data?.data?.status) || "N/A"}</span></h2>
                                </div>
                            </div>

                            <table className="w-full text-[13px] border-collapse">
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-3.5 py-2 text-gray-400 w-[45%]">{isPurchase ? "PO Number" : "SO Number"}</td>
                                        <td className="px-3.5 py-2 font-medium text-right">
                                            <span className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                #{data?.data?.po_no || "N/A"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-3.5 py-2 text-gray-400">Issue Date</td>
                                        <td className="px-3.5 py-2 font-medium text-right">{utcToLocal(data?.data?.createdAt)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-3.5 py-2 text-gray-400">Grand Total</td>
                                        <td className="px-3.5 py-2 text-right">
                                            <span className="text-sm font-bold text-green-600 flex items-center justify-end gap-0.5">
                                                <MdCurrencyRupee />
                                                {data?.data?.grand_total}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-3.5 py-2 text-gray-400">Note</td>
                                        <td className="px-3.5 py-2 text-right italic text-gray-400">
                                            {data?.data?.note || "N/A"}
                                        </td>
                                    </tr>

                                    {isPurchase &&
                                        <tr>
                                            <td className="px-3.5 py-2 text-gray-400">Created By</td>
                                            <td className="px-3.5 py-2 text-right">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                                                        {data?.data?.POcreatedBy?.name?.full_name?.slice(0, 2).toUpperCase() || "—"}
                                                    </div>
                                                    <span className="font-medium">
                                                        {data?.data?.POcreatedBy?.name?.full_name || "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* Supplier/  buyer Card */}
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden border-t-[3px] border-t-violet-600">

                            {/* card header */}
                            <div className="flex items-center justify-between px-3.5 py-2 bg-violet-50 border-b border-violet-100">
                                <div className="flex items-center gap-2 ">
                                    <FiHome size={20} className='text-violet-600' />
                                    <span className="text-[12px] font-semibold text-violet-600 uppercase tracking-wider">{isPurchase ? "Supplier Details" : "Buyer Details"}</span>
                                </div>

                                {/* right side buttons */}
                                <div className="flex items-center gap-2">

                                    {/* button for Assign to FG Store (outward order) */}
                                    {(!isPurchase && data?.data?.status === "approved") &&
                                        <Button
                                            className="btn !btn-primary rounded-full py-1 px-1"
                                            onClick={() => setIsShow(true)}
                                        >
                                            <span className='text-xs'>Assign to FG Store</span>
                                        </Button>
                                    }

                                    {/* proforma invoice dropdown */}
                                    {!isPurchase ?
                                        <div className="flex items-center justify-center">
                                            <div className="dropdown">
                                                <Dropdown
                                                    btnClassName="btn btn-primary dropdown-toggle rounded-full py-2 px-2 flex items-center"
                                                    button={
                                                        <>
                                                            <span className="text-xs">Proforma Invoice</span>
                                                            {pInvoicePdf_pending ? (
                                                                <span className="ml-1 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white flex-shrink-0" />
                                                            ) : (
                                                                <span className="ml-1 inline-block flex-shrink-0">
                                                                    <IconCaretDown />
                                                                </span>
                                                            )}
                                                        </>
                                                    }
                                                >
                                                    <ul className="!min-w-[170px]">
                                                        <li>
                                                            <button
                                                                type="button"
                                                                onClick={() => downloadPinvoice(data?.data?.id)}
                                                            >
                                                                Download(pdf)
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                type="button"
                                                                onClick={() => alert("Working!!!")}
                                                            >send(email)
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        :
                                        (isPurchase && data?.data?.status === "poi_received") &&
                                        <div className="flex items-center gap-2">
                                            <Button
                                                // loading={true}
                                                color='green'
                                                size="compact-md"
                                                className='rounded-full'
                                                onClick={() => handleApprove(data?.data?.id, data?.data?.bpo_id)}
                                            >
                                                Approve
                                            </Button>

                                            <Button
                                                // loading={true}
                                                color='red'
                                                size="compact-md"
                                                className='rounded-full'
                                                onClick={() => handleReject(data?.data?.id, data?.data?.bpo_id)}
                                            >
                                                Cancelled
                                            </Button>
                                        </div>
                                    }

                                    {
                                        (isPurchase && data?.data?.status === "approved") &&
                                        <Button
                                            // loading={true}
                                            color='primary'
                                            size="compact-md"
                                            className='rounded-lg'
                                            onClick={() => navigate(`/inward/create?s=${data?.data?.po_no}`)}
                                        >
                                            Inward
                                        </Button>
                                    }
                                </div>
                            </div>

                            {/* card body */}
                            <table className="w-full text-[13px] border-collapse">
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-3.5 py-2 text-gray-400 w-[45%]">{isPurchase ? "Supplier Name" : "Buyer Name"}</td>
                                        <td className="px-3.5 py-2 font-medium text-right">
                                            {vendor?.nodeDetails?.name || vendor?.name || "N/A"}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-3.5 py-2 text-gray-400">GST No</td>
                                        <td className="px-3.5 py-2 text-right">
                                            <span className="font-mono text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
                                                {vendor?.nodeDetails?.gst_no || vendor?.gst_no || "N/A"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="px-3.5 py-2 text-gray-400">Location</td>
                                        <td className="px-3.5 py-2 font-medium text-right">
                                            {vendor?.nodeDetails?.location || vendor?.location || "N/A"}
                                        </td>
                                    </tr>
                                    {/* Lat / Long */}
                                    <tr className="border-b border-gray-100">
                                        <td colSpan={2} className="p-0">
                                            <div className="grid grid-cols-2">
                                                <div className="px-3.5 py-1 border-r border-gray-100 flex gap-5">
                                                    <div className="text-gray-400 mb-0.5">Latitude</div>
                                                    <div className="font-mono font-medium">
                                                        {vendor?.nodeDetails?.address?.lat || vendor?.address?.lat || "N/A"}
                                                    </div>
                                                </div>
                                                <div className="px-3.5 flex gap-5">
                                                    <div className="text-gray-400 mb-0.5">Longitude</div>
                                                    <div className="font-mono font-medium">
                                                        {vendor?.nodeDetails?.address?.long || vendor?.address?.long || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Address / Pincode */}
                                    <tr className="border-b border-gray-100">
                                        <td colSpan={2} className="p-0">
                                            <div className="grid grid-cols-2">
                                                <div className="px-3.5 py-1 border-r border-gray-100 flex gap-5">
                                                    <div className="text-gray-400 mb-0.5">Address</div>
                                                    <div className="font-medium">
                                                        {vendor?.nodeDetails?.address?.address || vendor?.address?.address || "N/A"}
                                                    </div>
                                                </div>
                                                <div className="px-3.5 flex gap-5">
                                                    <div className="text-gray-400 mb-0.5">Pincode</div>
                                                    <div className="font-mono font-medium">
                                                        {vendor?.nodeDetails?.address?.pincode || vendor?.address?.pincode || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* State / District */}
                                    <tr>
                                        <td colSpan={2} className="p-0">
                                            <div className="grid grid-cols-2">
                                                <div className="px-3.5 py-1 border-r border-gray-100 flex gap-5">
                                                    <div className=" text-gray-400 mb-0.5">State</div>
                                                    <div className="font-medium">
                                                        {vendor?.nodeDetails?.address?.state || vendor?.address?.state || "N/A"}
                                                    </div>
                                                </div>
                                                <div className="px-3.5 flex gap-5">
                                                    <div className=" text-gray-400 mb-0.5">District</div>
                                                    <div className="font-medium ">
                                                        {vendor?.nodeDetails?.address?.district || vendor?.address?.district || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Item Table */}
            <div className="panel mt-5 min-h-64 relative">
                <TableBody
                    columns={(isInternal || !isPurchase) ? ORDER : ORDER_RAW}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={data?.pagination?.totalPages}
                >
                    {
                        purchasOrderItems?.map((item, idx) => {
                            const data = item?.poi_product ?? item?.soi_product;
                            return (<TableRow
                                key={idx}
                                columns={(isInternal || !isPurchase) ? ORDER : ORDER_RAW}
                                row={{
                                    product: data?.name,
                                    sku: item?.poi_product?.sku,
                                    uom: item?.poi_product?.unit_type,
                                    qty: item?.qty,
                                    unitPrice: item?.unit_price,
                                    total: item?.line_total,

                                    // optional fields for finished goods which are not present in raw material items
                                    barcode: data?.barcode,
                                    brand: data?.brand?.name,
                                    category: data?.productCategories?.[0]?.name,
                                    subCategory: data?.productSubCategories?.[0]?.name,
                                    packSize: `${data?.measure} ${data?.unit_type} ${data?.package_type}`,
                                }}
                            />);
                        })
                    }
                </TableBody>
            </div>


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
                                    // error={error?.message}
                                    objectReturn={true}

                                    addButton={true}
                                    buttonTitle="Add FG Store"
                                    buttonOnClick={() => setStore("FIN")}
                                />
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-10">
                        <Button
                            className="btn !btn-primary rounded-full"
                            onClick={() => setIsShow(false)}
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button
                            className="btn !btn-primary rounded-full"
                            onClick={assignFgStore}
                        >
                            <span>Assign</span>
                        </Button>
                    </div>
                </div>
            </AddModal>

            {/* Add New RM Store */}
            <AddModal
                isShow={Boolean(store)}
                setIsShow={setStore}
                title={"Add New RM Store"}
                maxWidth='75'
            >
                <CreateStoreForm
                    selectedStore={store}
                    setSelectedStore={setStore}
                    isTypeDisabled={true}
                />
            </AddModal>

        </div >
    )
}

export default OrderDetails