import React from 'react';
import { Button } from '@mantine/core';
import { utcToLocal } from '../../utils/UTCtoLocal';

const DirectTransferPreview = ({ data, onClose }) => {
    if (!data) return null;

    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-blue-500 text-white";
            case "accepted": return "bg-green-500 text-white";
            case "cancelled": return "bg-red-500 text-white";
            default: return "bg-amber-500 text-white";
        }
    };

    return (
        <div className="mx-auto bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden font-sans">
            {/* Top Status Bar */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <span className="bg-indigo-600 text-[11px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                        {data?.dir_trans_no || "DIRECT TRANSFER"}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold">
                        Date: {utcToLocal(data?.transfer_date)}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                    Status: <span className={`capitalize px-2 py-0.5 rounded text-[10px] font-bold ${statusColor(data?.status)}`}>
                        {data?.status?.replace("_", " ")}
                    </span>
                </div>
            </div>

            <div className="p-8">
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-12 border-b border-slate-100 pb-8 mb-8">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Sender Location</h4>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                <span className="font-bold text-slate-600">
                                    {data?.fromLocation?.nodeDetails?.name?.substring(0, 2).toUpperCase() || "FR"}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                    {data?.fromLocation?.nodeDetails?.name || "N/A"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Type: <span className="uppercase font-semibold">{data?.fromLocation?.node_type_code || "N/A"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Target Location</h4>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                                <span className="font-bold text-indigo-600">
                                    {data?.toLocation?.nodeDetails?.name?.substring(0, 2).toUpperCase() || "TO"}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                    {data?.toLocation?.nodeDetails?.name || "N/A"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Type: <span className="uppercase font-semibold">{data?.toLocation?.node_type_code || "N/A"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transfer Items */}
                <div className="mb-8">
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">
                        Transfer Items ({data?.transferItems?.length || 0})
                    </h4>
                    <div className="overflow-x-auto border border-slate-100 rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider">
                                    <th className="p-3.5 font-semibold">Product Details</th>
                                    <th className="p-3.5 font-semibold text-right">Unit</th>
                                    <th className="p-3.5 font-semibold">Batch Allocation Details</th>
                                    <th className="p-3.5 font-semibold text-right">Total Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data?.transferItems?.map((item, idx) => (
                                    <tr key={idx} className="text-sm hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-semibold text-slate-800">
                                                {item?.transferItemProduct?.name || "N/A"}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                                Barcode: {item?.transferItemProduct?.barcode || "N/A"}
                                            </p>
                                        </td>
                                        <td className="p-4 text-right text-slate-600 font-medium">
                                            {item?.transferItemProduct?.unit_type || "N/A"}
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1.5">
                                                {item?.allocations?.map((alloc, aIdx) => (
                                                    <div key={aIdx} className="flex items-center gap-2 text-xs">
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                                                            Batch: {alloc?.allocationBatch?.batch_no || "N/A"}
                                                        </span>
                                                        <span className="text-slate-400">|</span>
                                                        <span className="text-slate-600 font-semibold">
                                                            Qty: {alloc?.send_qty}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-bold text-slate-900">
                                            {item?.total_send_qty}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Creator Details */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-100 text-xs text-slate-500">
                    <div>
                        <span className="font-medium text-slate-400">Created By:</span>{" "}
                        <span className="font-semibold text-slate-700">{data?.transferCreator?.name?.full_name || data?.transferCreator?.name || "N/A"}</span>
                        {data?.transferCreator?.email && (
                            <span className="text-slate-400 ml-1">({data?.transferCreator?.email})</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="bg-slate-50 px-8 py-4 flex justify-end border-t border-slate-200">
                <Button
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg shadow-sm transition"
                    onClick={onClose}
                >
                    Close Preview
                </Button>
            </div>
        </div>
    );
};

export default DirectTransferPreview;
