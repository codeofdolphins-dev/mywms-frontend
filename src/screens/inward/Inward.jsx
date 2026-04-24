import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import { INWARD_COLUMN } from '../../utils/helper';
import inward from '../../Backend/inward.fetch';
import { utcToLocal } from '../../utils/UTCtoLocal';



const headerLink = [
    { title: "inward" }
];

const Inward = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const { data: inwardData, isLoading, isError } = inward.TQInwardList();
    const isEmpty = inwardData?.data?.length === 0;

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "draft": return "bg-info";
            case "accepted": return "bg-success";
            default: return "bg-warning";
        }
    }


    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='search by PO number'
                setDebounceSearch={setSearch}
                addButton={false}
            />

            <div className="panel min-h-64 z-0 relative">
                <TableBody
                    columns={INWARD_COLUMN}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={inwardData?.pagination?.totalPages}
                >
                    {
                        inwardData?.data?.map((item, idx) => {
                            return (<TableRow
                                key={idx}
                                columns={INWARD_COLUMN}
                                onClick={() => { navigate(`/inward/create/${item?.grn_no}`) }}
                                row={{
                                    no: item?.grn_no,
                                    po_no: item?.purchase_order,
                                    date: utcToLocal(item?.received_date),
                                    items: item?.grnLineItems?.length || "-",
                                    status: (
                                        <div>
                                            <span className={`badge whitespace-nowrap ${statusColor(item?.status)}`}>{item?.status?.toUpperCase()}</span>
                                        </div>
                                    ),
                                    createdBy: item?.creator?.name?.full_name,
                                }}
                            />);
                        })
                    }
                </TableBody>
            </div>

        </div >
    )
}

export default Inward