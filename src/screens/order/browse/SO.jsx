import React, { useState } from 'react'
import TableRow from '../../../components/table/TableRow';
import TableBody from '../../../components/table/TableBody';
import { useNavigate } from 'react-router-dom';
import { currencyFormatter } from '../../../utils/currencyFormatter';
import { utcToLocal } from '../../../utils/UTCtoLocal';
import { order } from '../../../Backend/order.fetch';
import { extractString } from '../../../helper/support';
import { SALES_ORDER_BROWSE } from './helper';

const SO = ({ debounceSearch }) => {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = {
        ...(debounceSearch && { poNo: debounceSearch }),
        page: currentPage,
        limit: limit
    };
    const { data, isLoading } = order.TQSalesOrderList(params);
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
            case "assign_fg": return "bg-pink-100 text-pink-500";
            default: return "bg-warning";
        }
    }

    return (
        <div className="panel min-h-64 z-0 relative">
            <TableBody
                columns={SALES_ORDER_BROWSE}
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
                            columns={SALES_ORDER_BROWSE}
                            onClick={() => navigate(`/order/${item?.so_no}?type=sales`)}
                            row={{
                                no: <p className='whitespace-nowrap'>
                                    {item?.so_no}
                                </p>,
                                from: <p className='whitespace-nowrap'>
                                    {item?.poBuyer?.name}
                                </p>,
                                date: <p className='whitespace-nowrap'>
                                    {utcToLocal(item?.createdAt)}
                                </p>,
                                name: <p className='whitespace-nowrap'>
                                    {item?.salesOrderItems?.length == 1 ? item?.salesOrderItems?.[0]?.soi_product?.name : "--"}
                                </p>,
                                price: <p className='whitespace-nowrap'>
                                    {currencyFormatter(item?.grand_total)}
                                </p>,
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

export default SO