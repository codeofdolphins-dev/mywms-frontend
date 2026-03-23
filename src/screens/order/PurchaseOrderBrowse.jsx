import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { PURCHASE_ORDER_BROWSE } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Input from '../../components/inputs/Input';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { MdCurrencyRupee } from 'react-icons/md';
import { Button } from '@mantine/core';
import { purchaseOrder } from '../../Backend/purchaseOrder.fetch';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { Link, useNavigate } from 'react-router-dom';


const headerLink = [
    { title: "order" },
];

const PurchaseOrderBrowse = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [activeTab, setActiveTab] = useState(1);

    const params = {
        ...(debounceSearch && { poNo: debounceSearch }),
        page: currentPage,
        limit: limit,
        isOwn: activeTab === 1 ? true : false
    };
    const { data, isLoading } = purchaseOrder.TQPurchaseOrderList(params);
    const isEmpty = data?.data?.length > 0 ? false : true;

    // console.log(data)

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "created": return "bg-secondary";
            case "released": return "bg-secondary";
            case "rejected": return "bg-danger";
            default: return "bg-warning";
        }
    }

    // if (isLoading) return <FullScreenLoader />

    return (
        <div>
            {/*header section */}
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                searchPlaceholder='Search by PO No...'
                setDebounceSearch={setDebounceSearch}
            />

            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    <li>
                        <div
                            className={`
                                ${activeTab === 1 ? '!bg-primary text-white' : ''}
                                block rounded-t-full bg-[#f3f2ee] px-6 py-1.5 cursor-pointer
                            `}
                            onClick={() => setActiveTab(1)}
                        >
                            <p className='-mb-1'>Purchase Order(PO)</p>
                        </div>
                    </li>

                    <li>
                        <div className={`${activeTab === 2 ? '!bg-primary text-white' : ''} 
                                            block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-36 cursor-pointer
                                        `}
                            onClick={() => setActiveTab(2)}
                        >
                            <p className='-mb-1'>Sales Order(SO)</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="panel min-h-64 z-0 relative">
                <TableBody
                    columns={PURCHASE_ORDER_BROWSE}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={data?.meta?.totalPages}
                >
                    {
                        data?.data?.map((item, idx) => {
                            return (<TableRow
                                key={idx}
                                columns={PURCHASE_ORDER_BROWSE}
                                onClick={() => navigate(`/purchase-order/${item?.po_no}`)}
                                row={{
                                    no: item?.po_no,
                                    to: item?.poToBusinessNode?.nodeDetails?.name,
                                    date: utcToLocal(item?.createdAt),
                                    items: item?.purchasOrderItems?.length,
                                    price: currencyFormatter(item?.grand_total),
                                    status: (
                                        <div>
                                            <span className={`badge  ${statusColor(item?.status)}`}>{item?.status?.toUpperCase()}</span>
                                        </div>
                                    ),
                                    createdBy: item?.POcreatedBy?.name?.full_name,
                                }}
                            />);
                        })
                    }
                </TableBody>
            </div>
        </div >
    )
}

export default PurchaseOrderBrowse