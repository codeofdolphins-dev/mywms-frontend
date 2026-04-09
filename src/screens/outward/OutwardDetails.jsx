import React, { useState } from 'react';
import { FiUser, FiMapPin, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import fetchData from '../../Backend/fetchData.backend';
import masterData from '../../Backend/master.backend';
import ComponentHeader from '../../components/ComponentHeader';


const OutwardDetails = () => {
    const { out_no } = useParams();

    const { mutateAsync: update, isPending: updatePending } = masterData.TQUpdateMaster();

    // State to hold selected batches per item
    const [selectedBatches, setSelectedBatches] = useState({});

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
    const destAddess = data?.buyer?.meta?.address;
    const destAddessStr = `${destAddess?.address || "N/A"}, ${destAddess?.district?.name || "N/A"}, ${destAddess?.state?.name || "N/A"}, ${destAddess?.pincode || "N/A"}`

    const isPreview = data?.status === "dispatched";

    // console.log(data)
    // console.log(isPreview)

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
            items: items
        };

        console.log(payload);

        const res = await update({ path: "/outward/dispatch", formData: payload });
        console.log(res);
    }


    /** Get status badge */
    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "allocated":
                return "bg-blue-100 text-blue-800";
            case "dispatched":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <ComponentHeader
                headerLink={[
                    { title: "outward", link: "/outward" },
                    { title: "details" }
                ]}
                showSearch={false}
                addButton={false}
            />

            {/* Header Section */}
            <div className="my-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Outward Details</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and allocate stock for order <span className="font-semibold text-indigo-600">#{out_no}</span></p>
                </div>
                {!isPreview &&
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
                        onClick={handleConfirmAllocation}
                    >
                        <FiCheckCircle size={18} />
                        Confirm Dispatch
                    </button>
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
                            <p className=" font-medium text-slate-900">{data?.buyer?.name}</p>
                        </div>

                        {/* Warehouse */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Warehouse</label>
                            <p className=" font-medium text-slate-900">{data?.buyer?.meta?.parentBusinessNode?.name}</p>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email address</label>
                            <p className=" font-medium text-slate-900">{data?.buyer?.contact_email}</p>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone number</label>
                            <p className=" font-medium text-slate-900">{data?.buyer?.contact_phone}</p>
                        </div>

                        {/* Address - Full Width */}
                        <div className="flex items-center justify-between gap-1">
                            <label className="mb-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination address</label>
                            <p className=" font-medium text-slate-900 leading-relaxed">{destAddessStr}</p>
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


                {/* Buyer Card */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                            <FiUser size={22} className="stroke-[2.5]" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Buyer Information</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Name</span>
                            <span className="font-semibold text-slate-800 text-right">{data?.buyer?.name}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Email Address</span>
                            <span className="font-medium text-slate-700 text-right">{data?.buyer?.contact_email}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Phone Number</span>
                            <span className="font-medium text-slate-700 text-right">{data?.buyer?.contact_phone}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Warehouse</span>
                            <span className="font-medium text-slate-700 text-right">{data?.buyer?.meta?.parentBusinessNode?.name}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Destination Address</span>
                            <span className="font-medium text-slate-700 text-right max-w-[200px] leading-snug">{destAddessStr}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 text-sm font-medium">Lat</span>
                                <span className="font-medium text-slate-700">{destAddess?.lat || "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 text-sm font-medium">Long</span>
                                <span className="font-medium text-slate-700">{destAddess?.long || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Location Card */}
                {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                            <FiMapPin size={22} className="stroke-[2.5]" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800">Dispatch Location</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Source Warehouse</span>
                            <span className="font-semibold text-slate-800 text-right">{mockData.location.warehouse}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Storage Zone</span>
                            <span className="font-medium text-slate-700 text-right">{mockData.location.zone}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Pick Aisle</span>
                            <span className="font-medium text-slate-700 text-right">{mockData.location.aisle}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-slate-500 text-sm font-medium">Dispatch Dock</span>
                            <span className="font-medium text-slate-700 text-right">{mockData.location.dispatchDock}</span>
                        </div>
                    </div>
                </div> */}
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

                <div className="overflow-visible min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-600 text-sm border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold w-1/5">Barcode</th>
                                <th className="px-6 py-4 font-semibold w-1/5">Product Name</th>
                                <th className="px-6 py-4 font-semibold w-1/5">Product SKU</th>
                                <th className="px-6 py-4 font-semibold w-[12%]">Req. Qty</th>
                                <th className="px-6 py-4 font-semibold">Allocate Batches</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items?.map((item) => {
                                // Formatting batches for react-select dropdown
                                const batchOptions = item?.batch?.map(b => ({
                                    value: b.batch_no,
                                    label: `${b.batch_no} | Available: ${b.available_qty} | Exp: ${b.expiry_date || 'N/A'}`
                                }));

                                const allocatedBatches = item?.alloted_batch?.map(b => ({
                                    id: b.id,
                                    code: b.batch.batch_no,
                                    qty: b.allocated_qty
                                }));

                                const product = item?.outwardProduct;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-2 font-medium text-slate-800">{product?.barcode}</td>
                                        <td className="px-6 py-2">
                                            <div className="font-medium text-slate-700">{product?.name}</div>
                                        </td>
                                        <td className="px-6 py-2 font-medium text-slate-800">{product?.sku}</td>
                                        <td className="px-6 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg text-slate-800">{item.requested_qty}</span>
                                                <span className="text-slate-400 text-xs font-semibold uppercase">{product?.unit_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">

                                            {isPreview ? (
                                                <AllocatedBatchesCell
                                                    allocatedBatches={allocatedBatches}
                                                    requiredQty={item?.requested_qty}
                                                    unit={product?.unit_type}
                                                />
                                            ) : (
                                                <div className="w-full max-w-lg">
                                                    <Select
                                                        isMulti
                                                        options={batchOptions}
                                                        className="text-sm"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select from available batches..."
                                                        onChange={(val) => handleBatchChange(val, item.vendor_product_id)}
                                                        value={selectedBatches[item.vendor_product_id] || []}
                                                        styles={{
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
                                                                cursor: 'pointer'
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

        </div>
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
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
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