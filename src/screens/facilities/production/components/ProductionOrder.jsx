import React, { useState } from 'react'
import TableBody from '../../../../components/table/TableBody'
import TableRow from '../../../../components/table/TableRow'
import AddModal from '../../../../components/Add.modal';
import { FiPlus } from 'react-icons/fi';
import ProductionOrderForm from '../../../../components/store/production/ProductionOrder.form';
import { transferOrder } from '../../../../Backend/production.fetch';
import { PRODUCTION_ORDER_COLUMN } from '../helper';
import { useNavigate } from 'react-router-dom';


const ProductionOrder = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);


    const params = {
        page: currentPage,
        limit: limit
    }
    const { data: productionOrderList, isLoading: productionLoading } = transferOrder.TQProductionOrderList(params);
    const isEmpty = productionOrderList?.data?.length === 0;

    return (
        <div>

            <div className="panel z-0">

                {/* Items Listing using TableBody and TableRow */}
                <div className="">
                    {/* <div className="bg-white p-5 rounded shadow-sm border border-gray-100"> */}

                    <div className="flex justify-end items-center mb-4">
                        {/* <h3 className="text-lg font-semibold text-gray-800">Required Raw Materials</h3> */}
                        <button className="btn btn-primary" onClick={() => setIsShow(true)}><FiPlus size={20} className='mr-2' />Production Order</button>
                    </div>

                    <div className="overflow-hidden">
                        <TableBody
                            columns={PRODUCTION_ORDER_COLUMN}
                            isEmpty={isEmpty}
                            isLoading={productionLoading}
                            limit={limit}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPage={productionOrderList?.pagination?.totalPages}
                        >
                            {productionOrderList?.data?.map((item) => (
                                <TableRow
                                    key={item.id}
                                    columns={PRODUCTION_ORDER_COLUMN}
                                    onClick={() => navigate(`order/${item?.production_order_no}`)}
                                    row={{
                                        no: <span className="">{item?.production_order_no}</span>,
                                        date: <span className="font-medium text-gray-700">{item?.start_date}</span>,
                                        product: <span className="font-semibold text-gray-800">{item?.targetProduct?.name}</span>,
                                        qty: <span className="font-semibold text-gray-800">{item?.planned_qty}</span>,
                                        items: <span className="font-semibold text-gray-800">{item?.productionOrderItem?.length}</span>,
                                        status: <span className="font-semibold text-gray-800">{item?.status}</span>,
                                        createdBy: <span className="font-semibold text-gray-800">{item?.proCreator?.name?.full_name}</span>
                                    }}
                                />
                            ))}
                        </TableBody>
                    </div>
                </div>
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Create Production Order"
            // placement='start'
            >
                <ProductionOrderForm setIsShow={setIsShow} />
            </AddModal>
        </div>
    )
}

export default ProductionOrder;