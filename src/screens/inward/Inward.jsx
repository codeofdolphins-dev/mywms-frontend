import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AnimateHeight from 'react-animate-height';
import { BsBoxSeam } from 'react-icons/bs';
import ComponentHeader from '../../components/ComponentHeader';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import BasicPagination from '../../components/BasicPagination';
import Loader from '../../components/loader/Loader';
import inward from '../../Backend/inward.fetch';
import masterData from '../../Backend/master.backend';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { Button } from '@mantine/core';



const headerLink = [
    { title: "inward" }
];

const tabList = [
    { id: 1, title: "Transit" },
    { id: 2, title: "Report" },
    { id: 3, title: "Receive" },
];

const getStatus = (activeTab) => {
    switch (activeTab) {
        case 1: return "transit";
        case 2: return "report";
        default: return "accepted";
    }
};

const Inward = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    /**************** accordian state *******************/
    const [active, setActive] = useState('');
    const togglePara = (id) => {
        setActive((oldValue) => oldValue === String(id) ? '' : String(id));
    };

    /**************** tab state *******************/
    const [searchParams, setSearchParams] = useSearchParams();
    const tabValue = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabValue ? Number(tabValue) : 1);

    /** sync the active tab from the url search params */
    useEffect(() => {
        if (tabValue && Number(tabValue) !== activeTab) {
            setActiveTab(Number(tabValue));
        }
    }, [tabValue]);

    /** update the tab to url search params when active tab is changed */
    useEffect(() => {
        setSearchParams(prev => {
            prev.set('tab', activeTab);
            return prev;
        });
        setCurrentPage(1);
        setActive('');
    }, [activeTab, setSearchParams]);

    const params = {
        page: currentPage,
        limit,
        status: getStatus(activeTab)
    };

    const { data: inwardData, isLoading } = inward.TQInwardList(params);
    const isEmpty = !inwardData?.data?.length;

    /** transit -> report: accepting the record stamps the report time on the GRN */
    const { mutateAsync: markReport, isPending: reportPending } = masterData.TQUpdateMaster(["inwardList"]);
    const [acceptingGrn, setAcceptingGrn] = useState(null);

    async function handleAcceptTransit(grn) {
        if (reportPending) return;

        setAcceptingGrn(grn?.grn_no);
        try {
            const res = await markReport({ path: `/inward/report/${grn?.grn_no}` });
            if (res.success) {
                setActiveTab(2);
            }
        } catch {
            /* the mutation already surfaces the error */
        } finally {
            setAcceptingGrn(null);
        }
    }

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "transit": return "bg-warning";
            case "report": return "bg-info";
            case "accepted": return "bg-success";
            case "draft": return "bg-info";
            default: return "bg-secondary";
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

            {/* wizards / tabs */}
            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    {tabList.map((item) => (
                        <li key={item.id}>
                            <div
                                className={`
                                    ${activeTab === item.id ? '!bg-primary text-white' : ''}
                                    block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-44 cursor-pointer
                                `}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <p className='mb-1 font-semibold'>{item.title}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Inward list section */}
            <div className="panel z-0 relative min-h-64">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 min-h-64">
                        <Loader />
                    </div>
                ) : isEmpty ? (
                    <div className="flex flex-col items-center justify-center gap-4 min-h-64">
                        <BsBoxSeam fontSize={40} color='grey' />
                        <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {inwardData?.data?.map((grn) => {
                                const isOpen = active === String(grn.id);
                                const items = grn?.grnLineItems ?? [];
                                const outward = grn?.reference?.outward;
                                const reference = grn?.purchase_order || grn?.reference?.requisition_no;

                                return (
                                    <div
                                        className="border border-[#d3d3d3] rounded bg-white overflow-hidden"
                                        key={grn.id}
                                    >
                                        {/* grn summary */}
                                        <div
                                            className={`flex items-center justify-between cursor-pointer px-4 ${isOpen ? 'bg-blue-50' : 'bg-gray-50'}`}
                                            onClick={() => togglePara(grn.id)}
                                        >
                                            <div className={`py-3 w-full flex items-center justify-between gap-3 ${isOpen ? 'text-blue-600' : 'text-gray-700'}`}>

                                                {/* 1️⃣ grn no */}
                                                <div className="w-[16%] text-start truncate">
                                                    {activeTab === 2 ? (
                                                        <Link
                                                            to={`/inward/create/${grn?.grn_no}`}
                                                            className='font-semibold hover:underline text-primary'
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {grn?.grn_no}
                                                        </Link>
                                                    ) : (
                                                        <span className='font-semibold'>{grn?.grn_no}</span>
                                                    )}
                                                </div>

                                                {/* 2️⃣ reference */}
                                                <div className="w-[14%] text-start truncate">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Reference</p>
                                                    <p className="text-xs font-medium truncate">{reference || "—"}</p>
                                                </div>

                                                {/* 3️⃣ transport pass */}
                                                <div className="w-[10%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Transport Pass</p>
                                                    <p className="text-xs font-bold">{outward?.tpass_no || "—"}</p>
                                                </div>

                                                {/* 4️⃣ vehicle no */}
                                                <div className="w-[10%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Vehicle no</p>
                                                    <p className="text-xs font-bold">{outward?.vehicle_no || "—"}</p>
                                                </div>

                                                {/* 5️⃣ receive date / reported at */}
                                                <div className="w-[12%] text-start whitespace-nowrap">
                                                    {grn?.status === "report" ? (
                                                        <>
                                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Reported At</p>
                                                            <p className="text-xs font-medium">{utcToLocal(grn?.report_date, true)}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Receive Date</p>
                                                            <p className="text-xs font-medium">{utcToLocal(grn?.received_date)}</p>
                                                        </>
                                                    )}
                                                </div>

                                                {/* 6️⃣ status */}
                                                {/* <div className="w-[10%] text-center">
                                                    <span className={`badge uppercase rounded-full whitespace-nowrap ${statusColor(grn?.status)}`}>
                                                        {grn?.status}
                                                    </span>
                                                </div> */}

                                                {/* 6️⃣.5 total price */}
                                                <div className="w-[10%] text-start whitespace-nowrap">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Total Price</p>
                                                    <p className="text-xs font-medium">{currencyFormatter(grn?.total_price)}</p>
                                                </div>

                                                {/* 7️⃣ received by / accept action */}
                                                {grn?.status === "transit" ? (
                                                    <div
                                                        className="w-[16%] text-start"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Button
                                                            size="xs"
                                                            loading={reportPending && acceptingGrn === grn?.grn_no}
                                                            onClick={() => handleAcceptTransit(grn)}
                                                        >
                                                            Accept
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="w-[12%] text-center truncate">
                                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 leading-none mb-1">Received By</p>
                                                        <p className="text-xs font-medium truncate">{grn?.creator?.name?.full_name || "—"}</p>
                                                    </div>
                                                )}

                                                {/* 8️⃣ total items */}
                                                <div className="w-[8%] text-start truncate !px-0 whitespace-nowrap">
                                                    Items: <span className="font-bold">{items.length}</span>
                                                </div>

                                                {/* 9️⃣ Expand icon */}
                                                <div className={`w-[4%] flex justify-end transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}>
                                                    <IconCaretDown className='w-6 h-6' />
                                                </div>
                                            </div>
                                        </div>

                                        {/* item details */}
                                        <AnimateHeight duration={300} height={isOpen ? 'auto' : 0}>
                                            <div className="p-5 text-gray-700 border-t border-[#d3d3d3] bg-white">
                                                {items.length === 0 ? (
                                                    <p className='text-center text-gray-400 font-semibold py-4'>No Items</p>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-left border-collapse text-[13px]">
                                                            <thead>
                                                                <tr className="text-[11px] text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider whitespace-nowrap">
                                                                    <th className="p-3 font-semibold">Barcode</th>
                                                                    <th className="p-3 font-semibold">Product</th>
                                                                    <th className="p-3 font-semibold">SKU</th>
                                                                    <th className="p-3 font-semibold text-right">Ordered Qty</th>
                                                                    <th className="p-3 font-semibold text-right">Received Qty</th>
                                                                    <th className="p-3 font-semibold text-right">Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {items.map((item) => {
                                                                    const product = item?.grnProduct;
                                                                    const damage = Number(item?.damage_qty) || 0;
                                                                    const shortage = Number(item?.shortage_qty) || 0;

                                                                    return (
                                                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors whitespace-nowrap">
                                                                            <td className="p-3 font-medium text-slate-800">{product?.barcode || "—"}</td>
                                                                            <td className="p-3 font-semibold text-slate-800">{product?.name || `#${item?.product_id}`}</td>
                                                                            <td className="p-3 font-mono text-xs">{product?.sku || "—"}</td>
                                                                            <td className="p-3 text-right font-bold text-slate-800">{item?.ordered_qty}</td>
                                                                            <td className="p-3 text-right font-bold text-slate-800">{item?.received_qty}</td>
                                                                            <td className="p-3 text-right font-bold text-slate-800">{currencyFormatter(item?.line_total_price)}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                );
                            })}
                        </div>

                        <BasicPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            setLimit={setLimit}
                            totalPage={inwardData?.pagination?.totalPages || 1}
                        />
                    </>
                )}
            </div>

        </div >
    )
}



// export default Inward                        })
//                     }
//                 </TableBody>
//             </div>

//         </div >
//     )
// }

export default Inward