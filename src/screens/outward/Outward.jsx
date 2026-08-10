import React, { useEffect, useState } from 'react'
import ComponentHeader from '../../components/ComponentHeader'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AnimateHeight from 'react-animate-height';
import { BsBoxSeam } from 'react-icons/bs';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import CustomeButton from "../../components/inputs/Button"
import BasicPagination from '../../components/BasicPagination';
import Loader from '../../components/loader/Loader';
import fetchData from '../../Backend/fetchData.backend';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { IoMdDownload } from 'react-icons/io';
import pdf from '../../Backend/downloads/pdf/pdf.download';
import { LuLoaderCircle } from 'react-icons/lu';

const headerLink = [
    { title: "outward" },
];

const tabList = [
    { id: 1, title: "Pending" },
    { id: 2, title: "Completed" },
];

/** outward statuses grouped per tab — pending is still actionable, completed is already dispatched */
const TAB_STATUS = {
    1: ["pending", "picking", "picked"],
    2: ["dispatched", "return", "cancelled"],
};

/** an invoice exists from dispatch onward — a return does not void it */
const INVOICE_STATUS = ["dispatched", "return"];

const Outward = () => {
    const navigate = useNavigate();

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [downloadingInvoice, setDownloadingInvoice] = useState(null);

    /**************** accordian state *******************/
    const [active, setActive] = useState('');
    const togglePara = (id) => {
        setActive((oldValue) => oldValue === String(id) ? '' : String(id));
    };

    /**************** tab state *******************/
    const [searchParams, setSearchParams] = useSearchParams();
    const tabValue = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabValue ? Number(tabValue) : 1);

    /** sync the active tab from the url search params */
    useEffect(() => {
        if (tabValue && Number(tabValue) !== activeTab) {
            setActiveTab(Number(tabValue));
        }
    }, [tabValue]);

    /** update the tab to url search params when active tab is changed */
    useEffect(() => {
        setSearchParams(prev => {
            prev.set('tab', activeTab);
            return prev;
        });
        setCurrentPage(1);
        setActive('');
    }, [activeTab, setSearchParams]);


    const { mutateAsync, isPending } = pdf.TQOutwardInvoicePDFDownload();
    const { mutateAsync: tradingInvoiceDownload, isPending: tradingInvoicePending } = pdf.TQTradingInvoicePDFDownload();

    const invoicePending = isPending || tradingInvoicePending;

    const params = {
        ...(debounceSearch && { outward_no: debounceSearch }),
        status: (TAB_STATUS[activeTab] ?? []).join(","),
        page: currentPage,
        limit: limit,
    };
    const { data: outwardList, isLoading: outwardListLoading } = fetchData.TQOutwardList(params);

    const isEmpty = !outwardList?.data?.length;

    /**
     * A trading outward has no Invoice row of its own — its invoice is generated from the
     * trading requisition, the same split the outward details page makes.
     */
    async function handelDownloadInvoice(outward) {
        if (invoicePending) return;

        setDownloadingInvoice(outward?.outward_no);
        try {
            if (outward?.meta?.trading) {
                await tradingInvoiceDownload({ requisition_no: outward?.pr_no });
            } else {
                await mutateAsync({ out_no: outward?.outward_no });
            }
        } catch {
            /* the mutation already surfaces the error */
        } finally {
            setDownloadingInvoice(null);
        }
    }

    /** set status color — neutral while idle, warm while in progress, green done, red on a problem */
    function statusColor(status) {
        switch (status) {
            case "pending":
                return "bg-secondary";      // nothing has happened yet
            case "picking":
                return "bg-warning";        // being worked on
            case "picked":
                return "bg-info";           // ready to leave
            case "dispatched":
                return "bg-success";        // completed cleanly
            case "return":
                return "bg-danger";         // came back short or damaged
            case "cancelled":
                return "bg-dark";           // terminated, not a failure
            default:
                return "bg-secondary";
        }
    }

    /** set priority color — escalating heat, matching the low/normal/high/urgent enum */
    function priorityColor(priority) {
        switch (priority) {
            case "urgent":
                return "bg-danger";
            case "high":
                return "bg-warning";
            case "normal":
                return "bg-info";
            case "low":
                return "bg-secondary";
            default:
                return "bg-secondary";
        }
    }

    return (
        <>
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                btnTitle='Add Outward'
                btnOnClick={() => navigate('/outward/create')}
            />

            {/* wizards / tabs */}
            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    {tabList.map((item) => (
                        <li key={item.id}>
                            <div
                                className={`
                                    ${activeTab === item.id ? '!bg-primary text-white' : ''}
                                    block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-44 cursor-pointer
                                `}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <p className='mb-1 font-semibold'>{item.title}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Outward list section */}
            <div className="panel z-0 min-h-64">
                {outwardListLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 min-h-64">
                        <Loader />
                    </div>
                ) : isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-4 min-h-64">
                        <BsBoxSeam fontSize={40} color='grey' />
                        <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {outwardList?.data?.map((outward) => {
                                const isOpen = active === String(outward.id);
                                const items = outward?.outwardItemList ?? [];
                                /** only trading and external outwards produce an invoice */
                                const hasInvoice = Boolean(outward?.meta?.trading) || outward?.type === "external";
                                const canDownloadInvoice = INVOICE_STATUS.includes(outward?.status) && hasInvoice;

                                return (
                                    <div
                                        className="border border-[#d3d3d3] rounded bg-white overflow-hidden"
                                        key={outward.id}
                                    >
                                        {/* outward summary */}
                                        <div
                                            className={`flex items-center justify-between cursor-pointer px-4 ${isOpen ? 'bg-blue-50' : 'bg-gray-50'}`}
                                            onClick={() => togglePara(outward.id)}
                                        >
                                            <div className={`py-3 w-full flex items-center justify-between gap-3 ${isOpen ? 'text-blue-600' : 'text-gray-700'}`}>

                                                {/* 1️⃣ outward no */}
                                                <div className="w-[20%] text-start truncate">
                                                    <Link
                                                        to={`/outward/${outward.outward_no}`}
                                                        className='font-semibold hover:underline text-primary'
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {outward?.outward_no}
                                                    </Link>
                                                </div>

                                                {/* 2️⃣ transport pass */}
                                                <div className="w-[13%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Transport Pass</p>
                                                    <p className="text-xs font-bold">{outward?.tpass_no}</p>
                                                </div>

                                                {/* 2️⃣ created date */}
                                                <div className="w-[13%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Created</p>
                                                    <p className="text-xs font-medium">{utcToLocal(outward?.createdAt)}</p>
                                                </div>

                                                {/* 3️⃣ deadline */}
                                                <div className="w-[13%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Deadline</p>
                                                    <p className="text-xs font-medium">{utcToLocal(outward?.required_by)}</p>
                                                </div>

                                                {/* 3️⃣ vehicle no */}
                                                <div className="w-[10%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Vehicle no</p>
                                                    <p className="text-xs font-bold">{outward?.vehicle_no}</p>
                                                </div>

                                                {/* 4️⃣ status */}
                                                <div className="w-[10%] text-center">
                                                    <span className={`badge uppercase rounded-full ${statusColor(outward?.status)}`}>
                                                        {outward?.status}
                                                    </span>
                                                </div>

                                                {/* 5️⃣ priority */}
                                                <div className="w-[8%] text-center">
                                                    <span className={`badge uppercase rounded-full ${priorityColor(outward?.priority)}`}>
                                                        {outward?.priority}
                                                    </span>
                                                </div>

                                                {/* 6️⃣ note */}
                                                <div className="w-[12%] text-start truncate">
                                                    {outward?.note || "—"}
                                                </div>

                                                {/* 7️⃣ total items */}
                                                <div className="w-[10%] text-start truncate !px-0 whitespace-nowrap">
                                                    Items: <span className="font-bold">{items.length}</span>
                                                </div>

                                                {/* 8️⃣ total price */}
                                                <div className="w-[13%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Total Price</p>
                                                    <p className="text-xs font-medium">{currencyFormatter(outward?.total_price)}</p>
                                                </div>

                                                {/* 9️⃣ action */}
                                                <div
                                                    className="w-[6%] flex items-center justify-end"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {canDownloadInvoice &&
                                                        <CustomeButton
                                                            title="Download invoice"
                                                            onClick={() => handelDownloadInvoice(outward)}
                                                        >
                                                            {invoicePending && downloadingInvoice === outward.outward_no
                                                                ? <LuLoaderCircle size={20} className='animate-spin' />
                                                                : <IoMdDownload size={20} className="hover:scale-110 cursor-pointer" />
                                                            }
                                                        </CustomeButton>
                                                    }
                                                </div>

                                                {/* 🔟 Expand icon */}
                                                <div className={`w-[4%] flex justify-end transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}>
                                                    <IconCaretDown className='w-6 h-6' />
                                                </div>
                                            </div>
                                        </div>

                                        {/* item details */}
                                        <AnimateHeight duration={300} height={isOpen ? 'auto' : 0}>
                                            <div className="p-5 text-gray-700 border-t border-[#d3d3d3] bg-white">
                                                {items.length === 0 ? (
                                                    <p className='text-center text-gray-400 font-semibold py-4'>No Items</p>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left border-collapse text-[13px]">
                                                            <thead>
                                                                <tr className="text-[11px] text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider whitespace-nowrap">
                                                                    <th className="p-3 font-semibold">Barcode</th>
                                                                    <th className="p-3 font-semibold">Product</th>
                                                                    <th className="p-3 font-semibold">SKU</th>
                                                                    <th className="p-3 font-semibold">Pack Size</th>
                                                                    <th className="p-3 font-semibold text-right">Req. Qty</th>
                                                                    {activeTab === 2 && <>
                                                                        <th className="p-3 font-semibold text-right text-rose-600">Dmg. Qty</th>
                                                                        <th className="p-3 font-semibold text-right text-amber-600">Stg. Qty</th>
                                                                    </>}
                                                                    <th className="p-3 font-semibold text-right">Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {items.map((item) => {
                                                                    const product = item?.outwardProduct;
                                                                    const damage = Number(item?.total_damage_qty) || 0;
                                                                    const shortage = Number(item?.total_shortage_qty) || 0;

                                                                    return (
                                                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                                                            <td className="p-3 font-medium text-slate-800">{product?.barcode || "—"}</td>
                                                                            <td className="p-3 font-semibold text-slate-800">{product?.name}</td>
                                                                            <td className="p-3 font-mono text-xs">{product?.sku}</td>
                                                                            <td className="p-3">
                                                                                {`${product?.measure ?? ""} ${product?.unit_type ?? ""} ${product?.package_type ?? ""}`.trim() || "—"}
                                                                            </td>
                                                                            <td className="p-3 text-right font-bold text-slate-800">{item?.requested_qty}</td>
                                                                            {activeTab === 2 && <>
                                                                                <td className="p-3 text-right font-medium text-rose-600">
                                                                                    {damage > 0 ? damage.toFixed(2) : "—"}
                                                                                </td>
                                                                                <td className="p-3 text-right font-medium text-amber-600">
                                                                                    {shortage > 0 ? shortage.toFixed(2) : "—"}
                                                                                </td>
                                                                            </>}
                                                                            <td className="p-3 text-right font-bold text-slate-800">{currencyFormatter(item?.line_total_price)}</td>
                                                                            {/* <td className="p-3 text-right">{currencyFormatter(item?.unit_price)}</td> */}
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                );
                            })}
                        </div>

                        <BasicPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            setLimit={setLimit}
                            totalPage={outwardList?.pagination?.totalPages || 1}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default Outward
