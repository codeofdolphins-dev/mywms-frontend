import React, { useState } from 'react'
import TableBody from '../../../../components/table/TableBody'
import TableRow from '../../../../components/table/TableRow'
import { transferOrder } from '../../../../Backend/production.fetch';
import { useParams } from 'react-router-dom';
import { PRODUCTION_ORDER_ITEM_COLUMN } from '../helper';
import ComponentHeader from '../../../../components/ComponentHeader';


const headerLink = [
    { title: "Production Order", link: "/production/store/wip?tab=3" },
    { title: "Details" }
]

const ProductionOrderDetails = () => {
    const { pro_no } = useParams();

    const { data: productionOrder, isLoading: isProductionOrderLoading } = transferOrder.TQProductionOrderItem(pro_no, Boolean(pro_no));

    const order = productionOrder?.data;
    const items = productionOrder?.data?.productionOrderItem;

    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                showSearch={false}
                addButton={false}
            />

            <div className="panel mt-4 space-y-6">

                {/* Order Details Header */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-5 bg-white rounded shadow-sm border border-gray-100">
                    <div className=''>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Order No.</p>
                        <p className="font-semibold text-gray-800"># {order?.production_order_no}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Target Product</p>
                        <p className="font-semibold text-gray-800">{order?.targetProduct?.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Barcode</p>
                        <p className="font-semibold text-gray-800">{order?.targetProduct?.barcode}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">SKU</p>
                        <p className="font-semibold text-gray-800">{order?.targetProduct?.sku}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Planned Qty</p>
                        <p className="font-semibold text-gray-800">{order?.planned_qty}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Status</p>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-600 uppercase border border-blue-100">
                            {order?.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Items Listing using TableBody and TableRow */}
                <div className="bg-white p-5 rounded shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Required Raw Materials</h3>
                    <div className="border border-gray-200 rounded overflow-hidden">
                        <TableBody
                            isEmpty={items?.length === 0}
                            showPagination={false}
                            columns={PRODUCTION_ORDER_ITEM_COLUMN}
                            isLoading={false}
                        >
                            {items?.map((item) => (
                                <TableRow
                                    key={item.id}
                                    columns={PRODUCTION_ORDER_ITEM_COLUMN}
                                    row={{
                                        sku: <span className="font-mono text-xs">{item?.rmProduct?.sku}</span>,
                                        rm_name: <span className="font-medium text-gray-700">{item?.rmProduct?.name}</span>,
                                        required_qty: <span className="font-semibold text-gray-800">{item.required_qty} {item?.rmProduct?.unit_type}</span>
                                    }}
                                />
                            ))}
                        </TableBody>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductionOrderDetails;