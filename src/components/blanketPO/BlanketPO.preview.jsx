import React from 'react'
import { currencyFormatter } from '../../utils/currencyFormatter'

const BlanketPOPreview = ({ data, setIsShowPreviewsShow }) => {

    // console.log(data)

    return (
        <div>
            <div className="mx-auto bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden font-sans">
                {/* Top Status Bar */}
                <div className="bg-slate-900 px-6 py-3 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Revision: {data?.activeRevision?.revision_no} </span>
                        <span className="text-slate-400 text-xs">RFQ Ref: {data?.requisition?.rfq_no} </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                        Status: <span className="capitalize"> {data?.activeRevision?.status} </span>
                    </div>
                </div>

                <div className="p-8">
                    {/* Header: Vendor & Buyer */}
                    <div className="grid grid-cols-2 gap-12 border-b border-slate-100 pb-8 mb-8">
                        <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Vendor Details</h4>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                    <span className="font-bold text-slate-600"> {data?.vendorTenant?.tenantDetails?.companyName.substring(0, 2).toUpperCase()} </span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 leading-tight"> {data?.vendorTenant?.tenantDetails?.companyName} </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Ship To / Buyer</h4>
                            <p className="font-bold text-slate-900 leading-tight"> {data?.requisition?.meta?.name} </p>
                            <p className="text-xs text-slate-500 mt-1">PR Ref:  {data?.requisition?.pr_reference_code} </p>
                        </div>
                    </div>

                    {/* Quotation Items Table */}
                    <div className="mb-8">
                        <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">Total Items ( {data?.pagination.totalItems} )</h4>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] text-slate-500 border-b border-slate-200">
                                    <th className="pb-2 font-semibold">ITEM DESCRIPTION</th>
                                    <th className="pb-2 font-semibold text-right">QTY</th>
                                    <th className="pb-2 font-semibold text-right">UNIT PRICE</th>
                                    {/* <th className="pb-2 font-semibold text-right">TAX (%)</th> */}
                                    <th className="pb-2 font-semibold text-right">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {/* <!-- Loop through quotationItems --> */}
                                {
                                    data?.quotationItems?.map((item, idx) => {

                                        const lineTotal = Number(item?.sourceRfqItem?.qty) * Number(item?.offer_price)

                                        return <tr key={idx} className="text-sm">
                                            <td className="py-4">
                                                <p className="font-medium text-slate-800">{item?.sourceRfqItem?.product_name}</p>
                                                {/* <p className="text-[11px] text-slate-500">HSN: 7201 | Warehouse: Kolkata</p> */}
                                            </td>
                                            <td className="py-4 text-right text-slate-600">{item?.sourceRfqItem?.qty}</td>
                                            <td className="py-4 text-right text-slate-600">{currencyFormatter(item?.offer_price)}</td>
                                            {/* <td className="py-4 text-right text-slate-600">18%</td> */}
                                            <td className="py-4 text-right font-semibold text-slate-900">{currencyFormatter(lineTotal)}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Summary & Totals */}
                    <div className="flex justify-between items-start pt-8 border-t-2 border-slate-100">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 w-1/2">
                            <h5 className="text-[11px] font-bold text-amber-800 uppercase mb-2">Terms & Validity</h5>
                            <div className="grid grid-cols-2 gap-y-2 text-xs">
                                <span className="text-amber-700">Valid Until:</span>
                                <span className="font-bold text-amber-900"> {data?.valid_till} </span>
                                {/* <span className="text-amber-700">Quotation ID:</span>
                                <span className="font-bold text-amber-900"># id </span> */}
                            </div>
                        </div>

                        <div className="w-1/3 space-y-2">
                            {/* <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>₹ 26,27,118.64</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Total Tax</span>
                                <span>₹ 4,72,881.36</span>
                            </div> */}
                            <div className="flex justify-between items-center pt-4 border-slate-200">
                                <span className="text-base font-bold text-slate-900">Grand Total</span>
                                <span className="text-2xl font-black text-indigo-700">{currencyFormatter(data?.activeRevision?.grand_total)} </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="bg-slate-50 px-8 py-4 flex justify-end gap-3 border-t border-slate-200">
                    {/* <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition">Download PDF</button> */}
                    <button className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-200 transition">
                        Convert to BPO
                    </button>
                </div>
            </div>

        </div>
    )
}

export default BlanketPOPreview