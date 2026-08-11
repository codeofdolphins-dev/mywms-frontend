import React, { useEffect, useRef, useState } from 'react';
import { FiUser, FiMapPin, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import fetchData from '../../Backend/fetchData.backend';
import masterData from '../../Backend/master.backend';
import ComponentHeader from '../../components/ComponentHeader';
import { Button } from '@mantine/core';
import { FaFileDownload } from 'react-icons/fa';
import pdf from '../../Backend/downloads/pdf/pdf.download';
import { LuLoaderCircle } from 'react-icons/lu';
import AddModal from '../../components/Add.modal';
import Input from '../../components/inputs/Input';
import { generateCode } from '../../utils/generateCode';


const HEAD_LINK = [
    { title: "outward", link: "/outward" },
    { title: "details" }
]

const OutwardDetails = () => {
    const { out_no } = useParams();
    const navigate = useNavigate();

    const { mutateAsync: update, isPending: updatePending } = masterData.TQUpdateMaster(["outwardDetails", "outwardList"]);
    const { mutateAsync, isPending } = pdf.TQOutwardInvoicePDFDownload();
    const { mutateAsync: tradingInvoiceDownload, isPending: tradingInvoicePending } = pdf.TQTradingInvoicePDFDownload();

    // State to hold selected batches per item
    const [selectedBatches, setSelectedBatches] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [transportNo, setTransportNo] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');

    const { data: outwardDetails, isLoading, isError } = fetchData.TQOutwardDetails(out_no, Boolean(out_no));

    // Handle change of batches dropdown
    const handleBatchChange = (selectedOptions, itemId) => {
        setSelectedBatches(prev => ({
            ...prev,
            [itemId]: selectedOptions
        }));
    };

    const data = outwardDetails?.data;
    const items = data?.outwardItemList;
    const destAddess = data?.buyer?.meta?.address || data?.buyer?.nodeDetails?.address;
    const destAddessStr = `${destAddess?.address || "N/A"}, ${destAddess?.district?.name || "N/A"}, ${destAddess?.state?.name || "N/A"}, ${destAddess?.pincode || "N/A"}`

    /** once dispatched the screen never goes back to allocation — a return only changes the dmg/stg figures */
    const isPreview = ["dispatched", "return"].includes(data?.status);
    const isReturned = ["return"].includes(data?.status);
    const isExternal = data?.type === "external";
    const isTrading = Boolean(data?.meta?.trading);

    // console.log(data)
    // console.log(isPreview)

    // pre fill transport number field
    useEffect(() => {
        setTransportNo(generateCode("TPN", data?.id));
    }, [isModalOpen]);

    /**
     * FIFO pre-selection — batches sorted by earliest expiry first (no-expiry last),
     * picking just enough to cover the requested qty. The dispatch API consumes
     * batches in payload order, so this ordering is what actually gets drained first.
     * Runs once per outward so a refetch never overwrites manual changes.
     */
    const preSelectedFor = useRef(null);
    useEffect(() => {
        if (!items?.length || isPreview || preSelectedFor.current === out_no) return;
        preSelectedFor.current = out_no;

        const preSelected = {};
        items.forEach((item) => {
            const sorted = [...(item?.batch ?? [])]
                .filter(b => Number(b.available_qty) > 0)
                .sort((a, b) => {
                    if (!a.expiry_date && !b.expiry_date) return 0;
                    if (!a.expiry_date) return 1;
                    if (!b.expiry_date) return -1;
                    return new Date(a.expiry_date) - new Date(b.expiry_date);
                });

            let remaining = Number(item.requested_qty);
            const picked = [];
            for (const b of sorted) {
                if (remaining <= 0) break;
                picked.push({
                    value: b.batch_no,
                    label: `${b.batch_no} | Exp: ${b.expiry_date || 'N/A'} | Available: ${Number(b.available_qty)}`
                });
                remaining -= Number(b.available_qty);
            }

            if (picked.length) preSelected[item.vendor_product_id] = picked;
        });

        setSelectedBatches(preSelected);
    }, [outwardDetails, isPreview, out_no]);

    async function handleConfirmAllocation() {
        const items = [];

        for (const [key, value] of Object.entries(selectedBatches)) {
            items.push({
                product_id: key,
                batches: value ? value.map(opt => opt.value) : []
            });
        }
        const payload = {
            outward_no: out_no,
            ...(transportNo && { tpass_no: transportNo }),
            ...(vehicleNo && { vehicle_no: vehicleNo }),
            items: items
        };

        const res = await update({ path: "/outward/dispatch", formData: payload });
        if (res?.success) {
            setIsModalOpen(false);
            // navigate("/outward");
        }
    }

    async function downloadInvoice() {
        /** trading outward — invoice generated from the trading requisition no */
        if (isTrading) {
            await tradingInvoiceDownload({ requisition_no: data?.pr_no });
            return;
        }
        await mutateAsync({ out_no });
    }


    /** Get status badge — same reading as the outward list, in the soft palette this page uses */
    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return "bg-slate-100 text-slate-700";   // nothing has happened yet
            case "picking":
                return "bg-amber-100 text-amber-800";   // being worked on
            case "picked":
                return "bg-blue-100 text-blue-800";     // ready to leave
            case "dispatched":
                return "bg-green-100 text-green-800";   // completed cleanly
            case "return":
                return "bg-red-100 text-red-800";       // came back short or damaged
            case "cancelled":
                return "bg-zinc-800 text-white";        // terminated, not a failure
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <ComponentHeader
                headerLink={HEAD_LINK}
                showSearch={false}
                addButton={false}
            />

            {/* Header Section */}
            <div className="my-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Outward Details</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and allocate stock for this order</p>

                    {/* order / transport identifiers as labeled chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-indigo-200 bg-white text-sm shadow-sm">
                            <span className="bg-indigo-50 text-indigo-500 px-2.5 py-1.5 font-semibold uppercase tracking-wider text-[10px]">Order</span>
                            <span className="px-2.5 py-1.5 font-mono font-semibold text-indigo-700">{out_no}</span>
                        </div>

                        {isPreview && <>
                            <div className="inline-flex items-center overflow-hidden rounded-lg border border-emerald-200 bg-white text-sm shadow-sm">
                                <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1.5 font-semibold uppercase tracking-wider text-[10px]">T-Pass</span>
                                <span className="px-2.5 py-1.5 font-mono font-semibold text-emerald-700">{data?.tpass_no || "—"}</span>
                            </div>

                            <div className="inline-flex items-center overflow-hidden rounded-lg border border-amber-200 bg-white text-sm shadow-sm">
                                <span className="bg-amber-50 text-amber-600 px-2.5 py-1.5 font-semibold uppercase tracking-wider text-[10px]">Vehicle</span>
                                <span className="px-2.5 py-1.5 font-mono font-semibold uppercase text-amber-700">{data?.vehicle_no || "—"}</span>
                            </div>
                        </>}
                    </div>
                </div>
                {isPreview ?
                    ((isExternal || isTrading) && <Button
                        className="bg-secondary px-2 py-2.5 rounded-lg font-medium shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
                        onClick={downloadInvoice}
                        disabled={isPending || tradingInvoicePending}
                    >
                        {(isPending || tradingInvoicePending) ?
                            <LuLoaderCircle size={20} className='mr-4 animate-spin text-primary' />
                            : <FaFileDownload size={18} className='mr-4' />
                        }
                        Download Invoice
                    </Button>)
                    :
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2.5 rounded-lg font-medium shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
                        onClick={() => {
                            if (Object.keys(selectedBatches).length < 1) return;
                            setIsModalOpen(true)
                        }}
                        loading={updatePending}
                        disabled={Object.keys(selectedBatches).length < 1}
                    >
                        {!updatePending && <FiCheckCircle size={18} className='mr-4' />}
                        Confirm Dispatch
                    </Button>
                }
            </div>

            {/* Top Cards: Buyer & Location Information */}
            <div className="grid grid-cols-1 gap-6 mb-8">

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-md text-blue-600">
                            <FiUser size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-lg font-medium text-slate-900">
                            Buyer information
                            <span className={`ml-2 badge ${getStatusBadge(data?.status)}`}>{data?.status?.toUpperCase()}</span>
                        </h2>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2 md:gap-x-6">
                        {/* Name */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                            <p className=" font-medium text-slate-900">{data?.buyer?.nodeDetails?.name ?? data?.buyer?.name}</p>
                        </div>

                        {/* Warehouse */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Warehouse</label>
                            <p className=" font-medium text-slate-900">{data?.buyer?.meta?.parentBusinessNode?.name || data?.buyer?.name || "N/A"}</p>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email address</label>
                            <p className=" font-medium text-slate-900">{data?.buyer?.contact_email || data?.buyer?.email || "N/A"}</p>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone number</label>
                            <p className=" font-medium text-slate-900">{data?.buyer?.contact_phone || data?.buyer?.phone_no}</p>
                        </div>

                        {/* Address - Full Width */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination address</label>
                            <p className=" font-medium text-slate-900 leading-relaxed text-right">{destAddessStr}</p>
                        </div>

                        <div className="flex items-center justify-between gap-1 bg-yellow-100 py-2 px-3 rounded-lg border-l-4 border-l-yellow-600">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</label>
                            <p className=" font-medium text-slate-900 leading-relaxed">{data?.note}</p>
                        </div>

                        {/* Coordinates - Separated */}
                        <div className="col-span-2 pt-2 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center justify-between gap-1">
                                    <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Latitude</label>
                                    <p className=" font-medium text-slate-900">{destAddess?.lat || "—"}</p>
                                </div>
                                <div className="flex items-center justify-between gap-1">
                                    <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Longitude</label>
                                    <p className=" font-medium text-slate-900">{destAddess?.long || "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Outward Items Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                            <FiShoppingBag size={22} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Outward Items</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Select batches to fulfill the requested quantities</p>
                        </div>
                    </div>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                        {items?.length} Items Total
                    </span>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-600 text-sm border-b border-slate-200 whitespace-nowrap">
                                <th className="px-6 py-4 font-semibold min-w-1/5">Barcode</th>
                                <th className="px-6 py-4 font-semibold min-w-1/5">Product Name</th>
                                <th className="px-6 py-4 font-semibold min-w-1/5">Product SKU</th>
                                <th className="px-6 py-4 font-semibold min-w-1/5">HSN</th>
                                <th className="px-6 py-4 font-semibold min-w-1/5">Req. Qty</th>
                                {isReturned && <>
                                    <th className="px-6 py-4 font-semibold">Dmg. Qty</th>
                                    <th className="px-6 py-4 font-semibold">Stg. Qty</th>
                                </>}
                                <th className="px-6 py-4 font-semibold text-center w-[480px]">Allocate Batches</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items?.map((item) => {
                                // Formatting batches for react-select dropdown
                                const batchOptions = item?.batch?.map(b => ({
                                    value: b.batch_no,
                                    label: `${b.batch_no} | Exp: ${b.expiry_date || 'N/A'} | Available: ${Number(b.available_qty)}`
                                }));

                                const allocatedBatches = item?.alloted_batch?.map(b => ({
                                    id: b.id,
                                    code: b.batch.batch_no,
                                    qty: b.allocated_qty
                                }));

                                const product = item?.outwardProduct;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                        <td className="px-6 py-2 font-medium text-slate-800">{product?.barcode}</td>
                                        <td className="px-6 py-2">
                                            <div className="font-medium text-slate-700">{product?.name}</div>
                                        </td>
                                        <td className="px-6 py-2 font-medium text-slate-800">{product?.sku}</td>
                                        <td className="px-6 py-2 font-medium text-slate-800">{product?.hsn_code}</td>

                                        {/* req. qty */}
                                        <td className="px-6 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg text-slate-800">{item.requested_qty}</span>
                                                <span className="text-slate-400 text-xs font-semibold uppercase">{product?.unit_type}</span>
                                            </div>
                                        </td>

                                        {isReturned && <>
                                            {/* damaged qty */}
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg text-red-500">{item.total_damage_qty}</span>
                                                    <span className="text-red-500 text-xs font-semibold uppercase">{product?.unit_type}</span>
                                                </div>
                                            </td>

                                            {/* shortage qty */}
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg text-red-500">{item.total_shortage_qty}</span>
                                                    <span className="text-red-500 text-xs font-semibold uppercase">{product?.unit_type}</span>
                                                </div>
                                            </td>
                                        </>}

                                        {/* allocate batches */}
                                        <td className="px-6 py-2 ">
                                            {isPreview ? (
                                                <AllocatedBatchesCell
                                                    allocatedBatches={allocatedBatches}
                                                    requiredQty={item?.requested_qty}
                                                    unit={product?.unit_type}
                                                />
                                            ) : (
                                                // fixed width so adding/removing chips never resizes the table column
                                                <div className="w-[480px]">
                                                    <Select
                                                        isMulti
                                                        options={batchOptions}
                                                        className="text-sm"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select from available batches..."
                                                        onChange={(val) => handleBatchChange(val, item.vendor_product_id)}
                                                        value={selectedBatches[item.vendor_product_id] || []}
                                                        menuPortalTarget={document.body}
                                                        menuPosition="fixed"
                                                        styles={{
                                                            menuPortal: (baseStyles) => ({
                                                                ...baseStyles,
                                                                zIndex: 9999
                                                            }),
                                                            /** chips scroll after ~3 rows instead of growing the control forever */
                                                            valueContainer: (baseStyles) => ({
                                                                ...baseStyles,
                                                                maxHeight: '110px',
                                                                overflowY: 'auto',
                                                            }),
                                                            control: (baseStyles, state) => ({
                                                                ...baseStyles,
                                                                borderColor: state.isFocused ? '#6366f1' : '#e2e8f0',
                                                                boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
                                                                borderRadius: '0.75rem',
                                                                padding: '2px 4px',
                                                                minHeight: '44px',
                                                                backgroundColor: state.isFocused ? '#ffffff' : '#f8fafc',
                                                                '&:hover': {
                                                                    borderColor: state.isFocused ? '#6366f1' : '#cbd5e1'
                                                                }
                                                            }),
                                                            menu: (baseStyles) => ({
                                                                ...baseStyles,
                                                                zIndex: 50,
                                                                borderRadius: '0.75rem',
                                                                overflow: 'hidden',
                                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                                                            }),
                                                            option: (baseStyles, state) => ({
                                                                ...baseStyles,
                                                                backgroundColor: state.isSelected ? '#indigo-500' : state.isFocused ? '#e0e7ff' : 'white',
                                                                color: state.isSelected ? 'white' : '#1e293b',
                                                                padding: '10px 14px',
                                                                cursor: 'pointer',
                                                                fontSize: "13px"
                                                            }),
                                                            multiValue: (baseStyles) => ({
                                                                ...baseStyles,
                                                                backgroundColor: '#e0e7ff',
                                                                borderRadius: '0.375rem',
                                                                padding: '2px'
                                                            }),
                                                            multiValueLabel: (baseStyles) => ({
                                                                ...baseStyles,
                                                                color: '#4338ca',
                                                                fontWeight: '600'
                                                            }),
                                                            multiValueRemove: (baseStyles) => ({
                                                                ...baseStyles,
                                                                color: '#4338ca',
                                                                ':hover': {
                                                                    backgroundColor: '#c7d2fe',
                                                                    color: '#312e81',
                                                                    borderRadius: '0.25rem'
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* confirmation & extra field input modal */}
            <AddModal
                title="Fill these fields"
                isShow={isModalOpen}
                setIsShow={setIsModalOpen}
                maxWidth='40'
            >
                <div className="panel">
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="Enter T. Pass No."
                                labelPosition="inline"
                                placeholder="Transport pass number"
                                value={transportNo}
                                onChange={(e) => setTransportNo(e.target.value)}
                            />
                            <Input
                                label="Enter Vehicle No."
                                labelPosition="inline"
                                placeholder="Vehicle number"
                                value={vehicleNo}
                                onChange={(e) => setVehicleNo(e.target.value)}
                            />
                        </div>
                        <div className="self-center">
                            <Button
                                onClick={handleConfirmAllocation}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </AddModal>

        </div >
    );
};

export default OutwardDetails;


const AllocatedBatchesCell = ({ allocatedBatches = [], requiredQty, unit }) => {
    const totalAllocated = allocatedBatches.reduce((sum, b) => sum + Number(b.qty), 0);
    const isFulfilled = totalAllocated >= requiredQty;
    const isOver = totalAllocated > requiredQty;

    return (
        <td className="px-4 py-3 align-top">
            {allocatedBatches.length === 0 ? (
                <span className="text-xs text-gray-400 italic">No batches allocated</span>
            ) : (
                <div className="flex flex-col gap-2 ">
                    <div className="flex flex-wrap whitespace-nowrap gap-1.5">
                        {allocatedBatches.map((batch) => (
                            <span
                                key={batch.id}
                                className="inline-flex items-center gap-1.5 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-gray-50"
                            >
                                <span className="font-mono">{batch.code}</span>
                                <span className="bg-blue-50 text-blue-600 font-mono font-medium rounded px-1.5 py-0.5 text-[11px]">
                                    {batch.qty} {unit}
                                </span>
                            </span>
                        ))}
                    </div>

                    <span
                        className={`inline-flex items-center gap-1 w-fit text-[11px] font-medium rounded px-2 py-0.5 ${isOver
                            ? "bg-amber-50 text-amber-600"
                            : isFulfilled
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                            }`}
                    >
                        {isFulfilled && !isOver && "✓"}
                        {isOver && "!"}
                        {!isFulfilled && "✗"}
                        {totalAllocated} / {requiredQty} {unit}
                        {isOver ? " over-allocated" : isFulfilled ? " fulfilled" : " remaining"}
                    </span>
                </div>
            )}
        </td>
    );
};