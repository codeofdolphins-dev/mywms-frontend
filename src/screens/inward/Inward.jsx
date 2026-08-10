import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import inward from '../../Backend/inward.fetch';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { INWARD_COLUMN } from './helper';



const headerLink = [
    { title: "inward" }
];

const tabList = [
    { id: 1, title: "Transit" },
    { id: 2, title: "Report" },
    { id: 3, title: "Receive" },
];

const Inward = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [isShow, setIsShow] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    /**************** accordian state *******************/
    // const [active, setActive] = useState('');
    // const togglePara = (id) => {
    //     setActive((oldValue) => oldValue === String(id) ? '' : String(id));
    // };

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
        // setActive('');
    }, [activeTab, setSearchParams]);


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
                                    reference: item?.purchase_order || item?.reference?.requisition_no,
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