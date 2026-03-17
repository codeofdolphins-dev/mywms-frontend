import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import bpo from '../../Backend/bpo.fetch';
import {
    FaBoxOpen,
    FaWarehouse,
    FaRegCalendarAlt,
    FaFileDownload,
    FaCheckCircle
} from 'react-icons/fa';
import { MdOutlineDescription } from 'react-icons/md';

const BPODetailsPage = () => {
    const { id } = useParams();

    const { data: bpoList, isLoading: bpoListLoading } = bpo.TQBlanketOrderItem( id , Boolean(id));
    const isEmpty = bpoList?.data?.length > 0 ? false : true;

    const bpoData = bpoList?.data;
    // console.log(bpoData)

    // Added useEffect to update state when bpoData loads
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        if (bpoData?.blanketOrderItems) {
            setSelectedItems(
                bpoData.blanketOrderItems.map(item => ({
                    ...item,
                    indent_qty: 0,
                    target_store: 'RM-STORE-01'
                }))
            );
        }
    }, [bpoData]);

    const handleQtyChange = (id, val) => {
        setSelectedItems(prev => prev.map(item =>
            item.id === id ? { ...item, indent_qty: val } : item
        ));
    };

    if (bpoListLoading) return <div className="p-8">Loading BPO Details...</div>;
    // if (isEmpty) return <div className="p-8">No BPO Found.</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span>Orders</span> / <span>Blanket PO</span> / <span className="text-blue-600 font-medium">Details</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {bpoData?.bpo_no} <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-wider font-bold">Active</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all font-medium">
                        <FaFileDownload className="text-gray-400" />
                        Download Contract
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-semibold">
                        <FaCheckCircle />
                        Confirm Release Order
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Contract Info & Item Selection */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Item List / Selection Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800 text-lg">Contracted Items</h2>
                            <span className="text-sm text-gray-500">{bpoData?.blanketOrderItems?.length} Products</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <th className="px-6 py-4">Product Info</th>
                                        <th className="px-6 py-4">Total Contract</th>
                                        <th className="px-6 py-4">Remaining</th>
                                        <th className="px-6 py-4 text-[#0052CC]">Release Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {selectedItems?.map((item) => {

                                        console.log(item)

                                        return (<tr key={item.id} className="hover:bg-blue-50/20 transition-colors">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                        <FaBoxOpen size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{item?.product?.name}</div>
                                                        <div className="text-xs text-gray-500">Fixed Price: ₹{item.unit_price}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-gray-600 font-medium">{item.total_contracted_qty}</td>
                                            <td className="px-6 py-6">
                                                <span className="text-green-600 font-bold">{item.remain_contracted_qty || item.total_contracted_qty}</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="w-32 border-2 border-gray-100 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-blue-700"
                                                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                                />
                                            </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Release Context & Store Selection */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Indent Settings
                        </h3>

                        <div className="space-y-6">
                            {/* Target Warehouse Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">Target Store (Buyer Side)</label>
                                <div className="relative">
                                    <FaWarehouse className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 appearance-none focus:ring-2 focus:ring-blue-500 outline-none font-medium">
                                        <option>RM Store - MFG Bond</option>
                                        <option>FG Store - Main Warehouse</option>
                                    </select>
                                </div>
                            </div>

                            {/* Required Date */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">Delivery Required By</label>
                                <div className="relative">
                                    <FaRegCalendarAlt className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            {/* Priority / Shipping Note */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">Dispatch Instructions</label>
                                <div className="relative">
                                    <MdOutlineDescription className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="e.g. Fragile items, pack in wooden crates..."
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500 text-sm">Indent Total (Approx)</span>
                                    <span className="text-xl font-bold text-gray-900">₹0.00</span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-tight">
                                    By confirming, you are issuing a legally binding Release Order against BPO {bpoData?.bpo_no}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BPODetailsPage;