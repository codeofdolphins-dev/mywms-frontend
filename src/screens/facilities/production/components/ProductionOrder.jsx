import React, { useState } from 'react'
import TableBody from '../../../../components/table/TableBody'
import TableRow from '../../../../components/table/TableRow'
import AddModal from '../../../../components/Add.modal';
import { FiPlus } from 'react-icons/fi';
import ProductionOrderForm from '../../../../components/store/production/ProductionOrder.form';
import { PRODUCTION_ORDER_COLUMN } from '../helper';
import { useNavigate } from 'react-router-dom';
import { production } from '../../../../Backend/production.fetch';
import ProductionReceiptForm from '../../../../components/store/production/ProductionReceiptForm';
import { utcToLocal } from '../../../../utils/UTCtoLocal';


const ProductionOrder = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false);
    const [isPRShow, setIsPRShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);


    const params = {
        page: currentPage,
        limit: limit
    }
    const { data: productionOrderList, isLoading: productionLoading } = production.TQProductionOrderList(params);
    const isEmpty = productionOrderList?.data?.length === 0;

    /** production status color */
    const statusColor = (status) => {
        switch (status) {
            case "draft": return "bg-warning";
            case "in_progress": return "bg-info";
            case "hold": return "bg-warning";
            case "completed": return "bg-success";
            case "cancelled": return "bg-danger";
            default: return "bg-info";
        }
    }

    const handleGeneratePR = (item) => {
        setSelectedItem(item);
        setIsPRShow(true);
    }

    return (
        <div>

            <div className="panel z-0">

                {/* Items Listing using TableBody and TableRow */}
                <div className="">
                    <div className="flex justify-end items-center mb-4">
                        {/* <h3 className="text-lg font-semibold text-gray-800">Required Raw Materials</h3> */}
                        <button className="btn btn-primary" onClick={() => setIsShow(true)}><FiPlus size={20} className='mr-2' />Production Order</button>
                    </div>

                    <div>
                        <TableBody
                            columns={PRODUCTION_ORDER_COLUMN}
                            isEmpty={isEmpty}
                            isLoading={productionLoading}
                            limit={limit}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPage={productionOrderList?.pagination?.totalPages}
                        >
                            {productionOrderList?.data?.map((item) => {
                                const isComplete = item?.status === "completed";

                                return <TableRow
                                    key={item.id}
                                    columns={PRODUCTION_ORDER_COLUMN}
                                    onClick={() => navigate(`order/${item?.production_order_no}`)}
                                    row={{
                                        no: <span>{item?.production_order_no}</span>,

                                        product: <span className="font-semibold text-gray-800">{item?.targetProduct?.name}</span>,

                                        qty: <span className="font-semibold text-gray-800">{item?.planned_qty}</span>,

                                        produced_qty: <span className="font-semibold text-gray-800">{item?.produced_qty ?? "-"}</span>,

                                        items: <span className="font-semibold text-gray-800">{item?.productionOrderItem?.length}</span>,

                                        date: <span className="font-medium text-gray-700">{utcToLocal(item?.start_date)}</span>,

                                        completion_date: <span className="font-medium text-gray-700">{utcToLocal(item?.completion_date)}</span>,

                                        status: <span className={`badge whitespace-nowrap uppercase ${statusColor(item?.status)}`}>{item?.status?.replace("_", " ")}</span>,
                                        createdBy: <span className="font-semibold text-gray-800">{item?.proCreator?.name?.full_name}</span>,
                                        action: (
                                            <button
                                                disabled={isComplete}
                                                title='Generate Production Receipt'
                                                className={`${!isComplete ? "text-info hover:cursor-pointer font-semibold hover:underline" : "cursor-not-allowed opacity-50"} `} onClick={(e) => { e.stopPropagation(); handleGeneratePR(item); }}
                                            >
                                                Generate PR
                                            </button>
                                        )
                                    }}
                                />
                            })}
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

            <AddModal
                isShow={isPRShow}
                setIsShow={setIsPRShow}
                title="Production Receipt"
            // placement='start'
            >
                <ProductionReceiptForm
                    productionOrder={selectedItem}
                    setIsShow={setIsPRShow}
                />
            </AddModal>
        </div>
    )
}

export default ProductionOrder;