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


const headerLink = [
    { title: "order", link: "/order" },
    { title: "details" },
];

const OrderDetails = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeNode = useSelector((state) => state.auth.userData?.activeNode);

    const { id } = useParams();
    const type = searchParams.get("type");

    const isPurchase = type === "purchase" ? true : false;

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [vendor, setVendor] = useState({});

    const params = {
        ...(isPurchase ? { poNo: id } : { soNo: id }),
        page: currentPage,
        limit: limit,
    };
    const { data: poData, isLoading: poLoading } = order.TQPurchaseOrderItemDetails(params, Boolean(isPurchase));
    const { data: soData, isLoading: soLoading } = order.TQSalesOrderItemDetails(params, Boolean(!isPurchase));

    const data = isPurchase ? poData : soData;
    const isLoading = isPurchase ? poLoading : soLoading;
    const isEmpty = data?.data?.items?.length > 0 ? false : true;
    const isInternal = data?.data?.type === "internal" ? true : false;
    const purchasOrderItems = data?.data?.items ?? [];

    const { mutateAsync: pInvoicePdf_download, isPending: pInvoicePdf_pending } = pdf.TQProformaInvoicePDFDownload();

    /** set business node location */
    useEffect(() => {
        const vendor = isPurchase ? data?.data?.poVendor : data?.data?.soBuyer;
        setVendor(vendor);
    }, [data, isLoading]);

    async function downloadPinvoice(id) {
        const res = await pInvoicePdf_download({ po_id: id });
    }

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "urgent": return "bg-danger";   // Red — most critical
            case "high": return "bg-orange-400";  // Orange/Yellow — high priority
            case "medium": return "bg-secondary"; // Grey — moderate
            default: return "bg-light";    // Fallback
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

            <div className="panel mt-1 !py-3">
                {/* <div className="flex items-center gap-2">
                    <Button
                        // loading={true}
                        color='green'
                        size="compact-md"
                        className='rounded-full'
                    >
                        Approve
                    </Button>

                    <Button
                        // loading={true}
                        color='red'
                        size="compact-md"
                        className='rounded-full'
                    >
                        Cancelled
                    </Button>
                </div> */}

                {/* Top Info Cards */}
                <div className="max-h-56 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

                        {/* PO / SO Card */}
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden border-t-[3px] border-t-blue-600">
                            <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 border-b border-blue-100">
                                <FcDocument size={20} />
                                <span className="text-[12px] font-semibold text-blue-600 uppercase tracking-wider">{isPurchase ? "Purchase Order" : "Sales Order"}</span>
                                <span className={`badge ${statusColor(data?.data?.priority)}`}>{data?.data?.priority?.toUpperCase() || "N/A"}</span>
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
                                    {!isPurchase ?
                                        // proforma invoice dropdown
                                        <div className="flex items-center justify-center">
                                            <div className="dropdown">
                                                <Dropdown
                                                    btnClassName="btn btn-primary dropdown-toggle"
                                                    button={
                                                        <>
                                                            Proforma Invoice
                                                            {pInvoicePdf_pending ? (
                                                                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                                                            ) : (
                                                                <span className="ml-1 inline-block">
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
                                                            <button type="button">send(email)</button>
                                                        </li>
                                                    </ul>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        :
                                        <Button
                                            // size="compact-md"
                                            className='btn btn-primary'
                                            onClick={() => navigate(`/inward/create?s=${id}`)}
                                        // onClick={() => navigate(`/inward/create?s=${poNo}&type=${type}`)}
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
        </div >
    )
}

export default OrderDetails