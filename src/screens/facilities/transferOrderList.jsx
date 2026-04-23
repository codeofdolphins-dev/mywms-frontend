import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ComponentHeader from '@/components/ComponentHeader'
import IconTrashLines from '@/components/Icon/IconTrashLines'
import CustomeButton from "@/components/inputs/Button"
import IconMenuNotes from '@/components/Icon/Menu/IconMenuNotes'
import { transferOrder } from '../../Backend/production.fetch'
import { TRANSFER_ORDER_COLUMN } from './helper'
import TableBody from '../../components/table/TableBody'
import TableRow from '../../components/table/TableRow'
import { useSelector } from 'react-redux'



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

const headerLink = [
    { title: "facilities", link: "/facilities" },
    { title: "Transfer Orders" },
];


const TransferOrderList = () => {
    const store = useSelector(state => state.auth.userData.activeNode?.store);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data: transferOrderData, isLoading: transferOrderLoading } = transferOrder.TQTransferOrderList();
    const isEmpty = transferOrderData?.data?.length < 1;

    function handleDelete(id) {
        // Handle delete logic here
        console.log("Delete", id);
    };

    function handleShowDetails(items) {
        // Handle showing details logic
        console.log("Details", items);
    }

    return (
        <div>
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
                    {transferOrderData?.data?.map((item) => (
                        <TableRow
                            key={item.id}
                            columns={TRANSFER_ORDER_COLUMN}
                            row={{
                                transfer_no: (
                                    <span className="font-semibold text-primary cursor-pointer hover:underline">
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

                                        <CustomeButton onClick={() => handleShowDetails(item.transferOrderItem)}>
                                            <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                        </CustomeButton>
                                    </div>
                                )
                            }}
                        />
                    ))}
                </TableBody>
            </div>

        </div>
    )
}

export default TransferOrderList