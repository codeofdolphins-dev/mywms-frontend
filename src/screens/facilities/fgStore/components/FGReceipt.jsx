import React, { useState } from 'react'
import TableBody from '../../../../components/table/TableBody'
import TableRow from '../../../../components/table/TableRow'
import AddModal from '../../../../components/Add.modal';
import { FiPlus } from 'react-icons/fi';
import ProductionOrderForm from '../../../../components/store/production/ProductionOrder.form';
import { useNavigate } from 'react-router-dom';
import { production } from '../../../../Backend/production.fetch';
import ProductionReceiptForm from '../../../../components/store/production/ProductionReceiptForm';
import { utcToLocal } from '../../../../utils/UTCtoLocal';
import { FG_RECEIPT_COLUMN } from '../helper';
import FgReceiveForm from './FgReceiveForm';


const FGReceipt = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false);
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

    const handleGenerateInward = (item) => {
        setSelectedItem(item);
        setIsShow(true);
    }

    return (
        <div>

            <div className="panel z-0">

                <div className="">
                    <div>
                        <TableBody
                            columns={FG_RECEIPT_COLUMN}
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
                                    columns={FG_RECEIPT_COLUMN}
                                    onClick={() => handleGenerateInward(item)}
                                    row={{
                                        no: <span>{item?.receipt_no}</span>,

                                        barcode: <span className="font-semibold text-gray-800">{item?.receivedProduct?.barcode}</span>,

                                        product: <span className="font-semibold text-gray-800">{item?.receivedProduct?.name}</span>,

                                        qty: <span className="font-semibold text-gray-800">{item?.received_qty > 0 ? item?.received_qty : item?.send_qty}</span>,

                                        fg_store: <span className="font-semibold text-gray-800">{item?.fgStore?.name ?? "-"}</span>,

                                        mfg_date: <span className="font-semibold text-gray-800">{utcToLocal(item?.mfg_date)}</span>,

                                        status: <span className={`badge whitespace-nowrap uppercase ${statusColor(item?.status)}`}>{item?.status?.replace("_", " ")}</span>
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
                title="Generate Inward"
            >
                <FgReceiveForm
                    setIsShow={setIsShow}
                    receipt={selectedItem}
                />
            </AddModal>
        </div>
    )
}

export default FGReceipt;