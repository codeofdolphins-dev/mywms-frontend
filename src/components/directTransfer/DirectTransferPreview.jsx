import React from 'react';
import { Button } from '@mantine/core';
import { utcToLocal } from '../../utils/UTCtoLocal';

const DirectTransferPreview = ({ data, onClose }) => {
    if (!data) return null;

    const hasDiscrepancyOrReturn = data?.transferItems?.some(
        item => item.is_return || Number(item.total_damage_qty) > 0 || Number(item.total_shortage_qty) > 0
    );

    const statusColor = (status) => {
        switch (status) {
            case "send":
            case "pending":
                return "bg-blue-500 text-white";
            case "accepted":
                return "bg-green-500 text-white";
            case "return":
            case "cancelled":
                return "bg-red-500 text-white";
            default:
                return "bg-amber-500 text-white";
        }
    };

    const dotColor = (status) => {
        switch (status) {
            case "send":
            case "pending":
                return "bg-blue-400";
            case "accepted":
                return "bg-green-400";
            case "return":
            case "cancelled":
                return "bg-red-400";
            default:
                return "bg-amber-400";
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
                    <span className={`h-2 w-2 rounded-full ${dotColor(data?.status)} animate-pulse`}></span>
                    Status: <span className={`capitalize px-2 py-0.5 rounded text-[10px] font-bold ${statusColor(data?.status)}`}>
                        {data?.status?.replace("_", " ")}
                    </span>
                </div>
            </div>

            <div className="p-8">
                {/* Return/Discrepancy Summary Banner */}
                {hasDiscrepancyOrReturn && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h5 className="font-bold text-rose-900 text-sm">Return / Discrepancy Detected</h5>
                            <p className="text-xs text-rose-700 mt-1">
                                This transfer contains returned items or quantity discrepancies. Please review the damaged and shorted quantities in the table below.
                            </p>
                        </div>
                    </div>
                )}

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
                                {/* <p className="text-xs text-slate-500 mt-1">
                                    Type: <span className="uppercase font-semibold">{data?.fromLocation?.node_type_code || "N/A"}</span>
                                </p> */}
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
                                {/* <p className="text-xs text-slate-500 mt-1">
                                    Type: <span className="uppercase font-semibold">{data?.toLocation?.node_type_code || "N/A"}</span>
                                </p> */}
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
                                    {hasDiscrepancyOrReturn ? (
                                        <>
                                            <th className="p-3.5 font-semibold text-right text-slate-700">Sent Qty</th>
                                            <th className="p-3.5 font-semibold text-right text-rose-600">Damage Qty</th>
                                            <th className="p-3.5 font-semibold text-right text-amber-600">Shortage Qty</th>
                                            <th className="p-3.5 font-semibold text-right text-emerald-600">Received Qty</th>
                                        </>
                                    ) : (
                                        <th className="p-3.5 font-semibold text-right">Total Qty</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data?.transferItems?.map((item, idx) => (
                                    <tr key={idx} className="text-sm hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-800">
                                                    {item?.transferItemProduct?.name || "N/A"}
                                                </p>
                                                {item?.is_return && (
                                                    <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                                        Returned
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                                Barcode: {item?.transferItemProduct?.barcode || "N/A"}
                                            </p>
                                        </td>
                                        <td className="p-4 text-right text-slate-600 font-medium">
                                            {item?.transferItemProduct?.unit_type || "N/A"}
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1.5">
                                                {item?.allocations?.map((alloc, aIdx) => {
                                                    const allocDamage = Number(alloc?.damage_qty) || 0;
                                                    const allocShortage = Number(alloc?.shortage_qty) || 0;
                                                    const allocSend = Number(alloc?.send_qty) || 0;
                                                    const allocReceived = allocSend - allocDamage - allocShortage;
                                                    const hasAllocDiscrepancy = allocDamage > 0 || allocShortage > 0;
                                                    return (
                                                        <div key={aIdx} className="flex flex-col gap-1 text-xs whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                                                                    Batch: {alloc?.allocationBatch?.batch_no || "N/A"}
                                                                </span>
                                                                <span className="text-slate-400">|</span>
                                                                <span className="text-slate-600 font-semibold">
                                                                    Sent: {allocSend.toFixed(2)}
                                                                </span>
                                                            </div>
                                                            {hasAllocDiscrepancy && (
                                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pl-2">
                                                                    {allocDamage > 0 && (
                                                                        <span className="text-rose-600 font-medium">
                                                                            Dmg: {allocDamage.toFixed(2)}
                                                                        </span>
                                                                    )}
                                                                    {allocDamage > 0 && allocShortage > 0 && <span className="text-slate-300">|</span>}
                                                                    {allocShortage > 0 && (
                                                                        <span className="text-amber-600 font-medium">
                                                                            Shrt: {allocShortage.toFixed(2)}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-slate-300">|</span>
                                                                    <span className="text-emerald-600 font-semibold">
                                                                        Rec: {allocReceived.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        {hasDiscrepancyOrReturn ? (
                                            <>
                                                <td className="p-4 text-right text-slate-700 font-medium">
                                                    {Number(item?.total_send_qty || 0).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-right text-rose-600 font-medium">
                                                    {Number(item?.total_damage_qty) > 0 ? Number(item?.total_damage_qty).toFixed(2) : "-"}
                                                </td>
                                                <td className="p-4 text-right text-amber-600 font-medium">
                                                    {Number(item?.total_shortage_qty) > 0 ? Number(item?.total_shortage_qty).toFixed(2) : "-"}
                                                </td>
                                                <td className="p-4 text-right font-bold text-emerald-600">
                                                    {(Number(item?.total_send_qty || 0) - Number(item?.total_damage_qty || 0) - Number(item?.total_shortage_qty || 0)).toFixed(2)}
                                                </td>
                                            </>
                                        ) : (
                                            <td className="p-4 text-right font-bold text-slate-900">
                                                {Number(item?.total_send_qty || 0).toFixed(2)}
                                            </td>
                                        )}
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
