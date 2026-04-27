import React, { useState } from 'react'
import TableBody from '../../../../components/table/TableBody'
import TableRow from '../../../../components/table/TableRow'
import AddModal from '../../../../components/Add.modal';
import { FiPlus } from 'react-icons/fi';
import ProductionOrderForm from '../../../../components/store/production/ProductionOrder.form';
import { PRODUCTION_ORDER_COLUMN, PRODUCTION_RECEIPT_COLUMN } from '../helper';
import { useNavigate } from 'react-router-dom';
import { production } from '../../../../Backend/production.fetch';
import ProductionReceiptForm from '../../../../components/store/production/ProductionReceiptForm';
import { utcToLocal } from '../../../../utils/UTCtoLocal';


const ProductionReceipt = () => {
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
    const { data: receiptList, isLoading: productionLoading } = production.TQProductionReceiptList(params);
    const isEmpty = receiptList?.data?.length === 0;


    /** production status color */
    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-info";
            case "accepted": return "bg-success";
            default: return "bg-danger";
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
                    {/* <div className="bg-white p-5 rounded shadow-sm border border-gray-100"> */}

                    <div>
                        <TableBody
                            columns={PRODUCTION_RECEIPT_COLUMN}
                            isEmpty={isEmpty}
                            isLoading={productionLoading}
                            limit={limit}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPage={receiptList?.pagination?.totalPages}
                        >
                            {receiptList?.data?.map((item) => (
                                <TableRow
                                    key={item.id}
                                    columns={PRODUCTION_RECEIPT_COLUMN}
                                    // onClick={() => navigate(`order/${item?.production_order_no}`)}
                                    row={{
                                        no: <span>{item?.receipt_no}</span>,

                                        barcode: <span className="font-semibold text-gray-800">{item?.receivedProduct?.barcode}</span>,

                                        product: <span className="font-semibold text-gray-800">{item?.receivedProduct?.name}</span>,

                                        qty: <span className="font-semibold text-gray-800">{item?.received_qty}</span>,

                                        fg_store: <span className="font-semibold text-gray-800">{item?.fgStore?.name ?? "-"}</span>,

                                        mfg_date: <span className="font-semibold text-gray-800">{utcToLocal(item?.mfg_date)}</span>,

                                        status: <span className={`badge whitespace-nowrap uppercase ${statusColor(item?.status)}`}>{item?.status?.replace("_", " ")}</span>,

                                        createdBy: <span className="font-semibold text-gray-800">{item?.proReceiptCreator?.name?.full_name}</span>
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

export default ProductionReceipt;