import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ComponentHeader from '@/components/ComponentHeader'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import CustomeButton from "@/components/inputs/Button"
import IconMenuNotes from '@/components/Icon/Menu/IconMenuNotes'
import { TRANSFER_ORDER_COLUMN } from './helper'
import TableBody from '../../components/table/TableBody'
import TableRow from '../../components/table/TableRow'
import { useSelector } from 'react-redux'
import AddModal from '../../components/Add.modal'
import { TRANSFER_ORDER_RAW_PRODUCT_COLUMN } from '../../utils/helper'
import { production } from '../../Backend/production.fetch'
import { FiPlus } from 'react-icons/fi'
import ItemIssueForm from '../../components/store/production/ItemIssue.form'



const getStatusColor = (status) => {
    switch (status) {
        case "requested":
            return "bg-warning";
        case "dispatched":
            return "bg-info";
        case "received":
            return "bg-success";
        case "cancelled":
            return "bg-danger";
        default:
            return "bg-secondary";
    }
};


const TransferOrderList = () => {
    const store = useSelector(state => state.auth.userData?.activeNode?.store);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isShow, setIsShow] = useState(false);
    const [isIssueItemShow, setIsIssueItemShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { data: transferOrderData, isLoading: transferOrderLoading } = production.TQTransferOrderList();
    const isEmpty = transferOrderData?.data?.length < 1;

    function handleDelete(id) {
        // Handle delete logic here
        console.log("Delete", id);
    };

    function handleShowDetails(items) {
        setSelectedItem(items);
        setIsShow(true);
    }

    return (
        <div>

            <div className="">
                <div className="flex justify-end items-center mb-4">
                    {/* <h3 className="text-lg font-semibold text-gray-800">Required Raw Materials</h3> */}
                    <button className="btn btn-primary" onClick={() => setIsIssueItemShow(true)}><FiPlus size={20} className='mr-2' />Material Issue</button>
                </div>

                {/* Item table */}
                <div className="panel mt-5 z-0 min-h-64">
                    <TableBody
                        columns={TRANSFER_ORDER_COLUMN}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={transferOrderData?.pagination?.totalPages || 1}
                        isEmpty={isEmpty}
                        isLoading={transferOrderLoading}
                    >
                        {transferOrderData?.data?.map((item) => {
                            const isReceiver = store?.id === item?.to_location_id;
                            const isSender = store?.id === item?.from_location_id;
                            const isNotRequested = item?.status !== "requested";

                            return <TableRow
                                key={item.id}
                                columns={TRANSFER_ORDER_COLUMN}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (isSender && isNotRequested) navigate(item.transfer_no);
                                }}
                                row={{
                                    transfer_no: (
                                        <span
                                            className={`font-semibold ${isReceiver ? "text-primary cursor-pointer hover:underline" : ""}`}
                                            onClick={isReceiver ? () => navigate(item.transfer_no) : {}}
                                        >
                                            {item.transfer_no}
                                        </span>
                                    ),
                                    type: (
                                        <span className="capitalize">
                                            {item.type?.replace("_", " ")}
                                        </span>
                                    ),
                                    from_location: item?.from_location?.name,
                                    to_location: item?.to_location?.name,
                                    items: Array.isArray(item.transferOrderItem) ? item.transferOrderItem.length : 0,
                                    required_date: new Date(item.required_date).toLocaleDateString(),
                                    status: (
                                        <span className={`badge uppercase rounded-full ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    ),
                                    action: (
                                        <div className='flex items-center justify-center space-x-2'>
                                            {/* <CustomeButton onClick={() => handleDelete(item.id)}>
                                            <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                        </CustomeButton> */}

                                            <CustomeButton onClick={(e) => {
                                                e.stopPropagation();
                                                handleShowDetails(item.transferOrderItem);
                                            }}>
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        })}
                    </TableBody>
                </div>
            </div>

            {/* Item details modal */}
            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Transfer Order Item Details"
                maxWidth='75'
            >
                <div className="panel mt-5 z-0">
                    <div className="table-responsive max-h-[400px] overflow-y-auto">
                        <table className="table-hover">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr>
                                    {TRANSFER_ORDER_RAW_PRODUCT_COLUMN.map((col, idx) => (
                                        <th key={idx}>{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(!selectedItem || selectedItem.length < 1) ? (
                                    <tr>
                                        <td colSpan={TRANSFER_ORDER_RAW_PRODUCT_COLUMN.length} className="text-center py-4">
                                            No Data Available
                                        </td>
                                    </tr>
                                ) : (
                                    selectedItem.map((item, idx) => {
                                        const product = item?.transferProduct;
                                        return (
                                            <tr key={item.id}>
                                                <td>{product?.name}</td>
                                                <td>{product?.sku}</td>
                                                <td>{`${product?.measure || ''} ${product?.unit_type || ''} ${product?.package_type || ''}`.trim()}</td>
                                                <td>{item?.requested_qty}</td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AddModal>

            {/* item issue form */}
            <AddModal
                isShow={isIssueItemShow}
                setIsShow={setIsIssueItemShow}
                title="Raw Material Issue Form"
            >
                <ItemIssueForm
                    setIsShow={setIsIssueItemShow}
                />
            </AddModal>

        </div>
    )
}

export default TransferOrderList