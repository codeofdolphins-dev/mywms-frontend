import React, { useState } from 'react'
import TableRow from '../../../components/table/TableRow';
import TableBody from '../../../components/table/TableBody';
import { PURCHASE_ORDER_BROWSE } from '../../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { currencyFormatter } from '../../../utils/currencyFormatter';
import { utcToLocal } from '../../../utils/UTCtoLocal';
import { order } from '../../../Backend/order.fetch';
import { extractString } from '../../../helper/support';

const PO = ({ debounceSearch }) => {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = {
        ...(debounceSearch && { poNo: debounceSearch }),
        page: currentPage,
        limit: limit
    };
    const { data, isLoading } = order.TQPurchaseOrderList(params);
    const isEmpty = data?.data?.length > 0 ? false : true;


    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "draft": return "bg-secondary";
            case "sent_to_supplier": return "bg-info";
            case "waiting_for_poi": return "bg-warning";
            case "poi_received": return "bg-success";
            case "approved": return "bg-success";
            case "picking_in_progress": return "bg-primary";
            case "closed": return "bg-dark";
            case "cancelled": return "bg-danger";
            default: return "bg-warning";
        }
    }

    return (
        <div className="panel min-h-64 z-0 relative">
            <TableBody
                columns={PURCHASE_ORDER_BROWSE}
                isEmpty={isEmpty}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                limit={limit}
                setLimit={setLimit}
                totalPage={data?.pagination?.totalPages}
            >
                {
                    data?.data?.map((item, idx) => {
                        return (<TableRow
                            key={idx}
                            columns={PURCHASE_ORDER_BROWSE}
                            onClick={() => navigate(`/order/${item?.po_no}?type=purchase`)}
                            row={{
                                no: item?.po_no,
                                to: item?.poToBusinessNode?.nodeDetails?.name ?? item?.poVendor?.name,
                                date: utcToLocal(item?.createdAt),
                                items: item?.purchasOrderItems?.length,
                                price: currencyFormatter(item?.grand_total),
                                status: (
                                    <div>
                                        <span className={`badge whitespace-nowrap ${statusColor(item?.status)}`}>{extractString(item?.status)}</span>
                                    </div>
                                ),
                                createdBy: item?.POcreatedBy?.name?.full_name,
                            }}
                        />);
                    })
                }
            </TableBody>
        </div>
    )
}

export default PO