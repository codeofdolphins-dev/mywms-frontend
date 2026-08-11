import React, { useEffect, useState } from 'react'
import ItemTable from '../../components/ItemTable'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi';
import TableHeader from '../../components/table/TableHeader';
import TableRow from '../../components/table/TableRow';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconNotes from '../../components/Icon/IconNotes';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import BasicPagination from '../../components/BasicPagination';
import AddModal from '../../components/Add.modal';
import RequisitionDetails from '../../components/requisition/RequisitionDetails';
import CustomeButton from "../../components/inputs/Button";
import { confirmation } from '../../utils/alerts';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import fetchData from '../../Backend/fetchData.backend';
import masterData from '../../Backend/master.backend';
import { MdOutlineDownload } from 'react-icons/md';
import pdf from '../../Backend/downloads/pdf/pdf.download';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { REQUISITION_COLUMN_MANUFACTURING, REQUISITION_COLUMN_NON_MANUFACTURING, TRADING_REQUISITION_COLUMN } from './helper';
import { TbArrowBarDown, TbArrowBarUp } from 'react-icons/tb';
import requisition from '../../Backend/requisition.backend';

const HEADER_LINKS = [
    { title: "requisition" },
];

const tabList = [
    { id: 1, title: "Requisition" },
    { id: 2, title: "Trading REQ." },
];

/** trading statuses grouped per sub-tab — in progress is still moving, completed is settled */
const TRADING_TAB_STATUS = {
    1: ["pending", "assign", "dispatched"],
    2: ["closed", "return", "cancelled"],
};

const tradingTabList = [
    { id: 1, title: "In Progress" },
    { id: 2, title: "Completed" },
];

const Requisition = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.userData);

    const [searchParams, setSearchParams] = useSearchParams();
    const tabValue = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState(tabValue ? Number(tabValue) : 1);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isShow, setIsShow] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [downloadReqNo, setDownloadReqNo] = useState(null);

    /**************** global variable *******************/
    const isManufacture = user?.activeNode?.NodeUser?.department !== null ? true : false;

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
    }, [activeTab, setSearchParams]);

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["requisitionList"]);
    const { mutateAsync: requisitionPdf_download, isPending: requisitionPdf_pending } = pdf.TQRequisitionPDFDownload();

    /**************** trading sub-tab state *******************/
    const [tradingTab, setTradingTab] = useState(1);
    const handleTradingTab = (id) => {
        setTradingTab(id);
        setCurrentPage(1);
    };

    const tradingParams = {
        page: currentPage,
        limit,
        status: (TRADING_TAB_STATUS[tradingTab] ?? []).join(","),
    };

    /** only the active tab's list is fetched */
    const { data: requisitionList, isLoading: requisitionListLoading } = fetchData.TQRequisitionList({}, activeTab === 1);
    const { data: tradingList, isLoading: tradingListLoading } = requisition.TQTradingRequisitionList(tradingParams, activeTab === 2);

    const isEmpty = requisitionList?.data?.length < 1;
    const tradingIsEmpty = tradingList?.data?.length < 1;


    function handelShow(items) {
        setIsShow(true);
        setSelectedItems(items)
    }

    async function handelDownload(requisition_no) {
        setDownloadReqNo(requisition_no);
        try {
            const res = await requisitionPdf_download({ requisition_no });
            if (res.status === 200) {
                setDownloadReqNo(null);
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete(id) {
        try {
            const isConfirm = await confirmation();
            if (isConfirm) await deleteData({ path: `/requisition/delete/${id}` });
        } catch (error) {
            console.log(error);
        }
    };

    /** set status color — shared by both tabs, so it covers the normal and the trading statuses */
    function statusColor(status) {
        // follow jointable status order
        switch (status) {
            case "pending":
                return "bg-primary";
            case "quoted":
                return "bg-warning";
            case "po_created":
                return "bg-success";
            case "cancelled":
                return "bg-dark";           // terminated, not a failure

            /** trading only */
            case "assign":
                return "bg-warning";        // outward raised, being fulfilled
            case "dispatched":
                return "bg-info";           // goods sent, awaiting inward
            case "return":
                return "bg-danger";         // received short or damaged
            case "closed":
                return "bg-success";        // received clean

            default:
                return "bg-secondary";
        }
    }

    /** priority badge */
    function priorityBadge(priority) {
        return (
            <span className={`badge uppercase rounded-full ${priority === "high" ? "badge-outline-danger" : priority === "normal" ? "badge-outline-primary" : "badge-outline-secondary"}`}>
                {priority}
            </span>
        );
    }

    return (
        <div>
            <Helmet><title>Requisition | MYWMS</title></Helmet>

            {/* Header Section */}
            <ComponentHeader
                headerLink={HEADER_LINKS}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                btnTitle='Add Requisition'
                btnOnClick={() => navigate('/requisition/create')}
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

            {/* ── Tab 1: Normal Requisition ── */}
            {activeTab === 1 && (
                <div className="panel z-0 min-h-64">
                    <TableBody
                        columns={isManufacture ? REQUISITION_COLUMN_MANUFACTURING : REQUISITION_COLUMN_NON_MANUFACTURING}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={requisitionList?.meta?.totalPages || 1}
                        isEmpty={isEmpty}
                        isLoading={requisitionListLoading}
                    >
                        {requisitionList?.data?.map((item) => {
                            const reqType = item.type

                            return <TableRow
                                key={item.id}
                                columns={isManufacture ? REQUISITION_COLUMN_MANUFACTURING : REQUISITION_COLUMN_NON_MANUFACTURING}
                                row={{
                                    id: (
                                        <Link
                                            to={reqType === "internal" ? "/inward" : `/quotation/received-quotation?s=${item.requisition_no}`}
                                            className={`whitespace-nowrap ${item?.isAnyQuotation ? "text-blue-600 hover:underline" : "pointer-events-none"}`}
                                        >
                                            {item?.requisition_no}
                                        </Link>
                                    ),
                                    title: <p className='whitespace-nowrap'>{item?.title}</p>,
                                    status: (
                                        <span className={`badge uppercase rounded-full ${statusColor(item?.status)}`}>
                                            {item?.status === "po_created" ? "po. created" : item?.status}
                                        </span>
                                    ),
                                    priority: priorityBadge(item?.priority),
                                    notes: item?.notes,
                                    deadline: <p className='whitespace-nowrap'>{utcToLocal(item?.required_by_date)}</p>,
                                    // grandTotal: <p className='whitespace-nowrap'>{currencyFormatter(item?.grandTotal)}</p>,
                                    action: (
                                        <div className='flex items-center justify-center space-x-2'>
                                            <CustomeButton
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                            </CustomeButton>

                                            {!isManufacture &&
                                                <CustomeButton onClick={() => handelShow(item.items)} >
                                                    <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                                </CustomeButton>
                                            }

                                            <CustomeButton onClick={() => handelDownload(item?.requisition_no)} >
                                                {requisitionPdf_pending && (downloadReqNo === item?.requisition_no)
                                                    ?
                                                    <span class="animate-spin border-[3px] border-black border-l-transparent rounded-full w-4 h-4 inline-block align-middle" />
                                                    :
                                                    <MdOutlineDownload
                                                        className="hover:scale-110 cursor-pointer w-5 h-5"
                                                        title='download'
                                                    />
                                                }
                                            </CustomeButton>
                                        </div>
                                    ),

                                    // for manufacturinf
                                    name: item?.items?.[0]?.product?.name,  // restrict to one item in RFQ
                                    quotationReceived: item?.receiveQuotationCount,
                                    price: currencyFormatter(item?.items?.[0]?.price_limit),
                                    limitType: <p className={`flex items-center uppercase whitespace-nowrap`}>
                                        {item?.price_limit_type?.split("_")?.join(" ") ?? "—"}
                                        <span className={`ml-2 ${item?.price_limit_type === "lower_limit" ? "text-success" : item?.price_limit_type === "upper_limit" ? "text-danger" : ""}`}>
                                            {item?.price_limit_type === "lower_limit" && <TbArrowBarUp size={18} />}
                                            {item?.price_limit_type === "upper_limit" && <TbArrowBarDown size={18} />}
                                        </span>
                                    </p>,
                                    // for non manufacturing
                                    items: item?.items?.length
                                }}
                            />
                        })}
                    </TableBody>
                </div>
            )}

            {/* ── Tab 2: Trading Requisition ── */}
            {activeTab === 2 && (
                <div className="panel z-0 min-h-64">
                    {/* status sub-tabs */}
                    <div className="flex items-center gap-2 mb-4">
                        {tradingTabList.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`
                                    px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors
                                    ${tradingTab === item.id
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'}
                                `}
                                onClick={() => handleTradingTab(item.id)}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>

                    <TableBody
                        columns={TRADING_REQUISITION_COLUMN}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={tradingList?.pagination?.totalPages || 1}
                        isEmpty={tradingIsEmpty}
                        isLoading={tradingListLoading}
                    >
                        {tradingList?.data?.map((item) => (
                            <TableRow
                                key={item.id}
                                columns={TRADING_REQUISITION_COLUMN}
                                row={{
                                    id: (
                                        <Link
                                            to={`/requisition/trading/${item.id}`}
                                            className='whitespace-nowrap text-blue-600 hover:underline'
                                        >
                                            {item?.requisition_no}
                                        </Link>
                                    ),
                                    title: <p className='whitespace-nowrap'>{item?.title}</p>,
                                    items: item?.intercompanyItems?.length,
                                    total: currencyFormatter(item?.total_price),
                                    status: (
                                        <span className={`badge uppercase rounded-full ${statusColor(item?.status)}`}>
                                            {item?.status === "po_created" ? "po. created" : item?.status}
                                        </span>
                                    ),
                                    priority: priorityBadge(item?.priority),
                                    notes: item?.notes,
                                    deadline: <p className='whitespace-nowrap'>{utcToLocal(item?.required_by_date)}</p>,
                                    action: (
                                        <div className='flex items-center justify-center space-x-2'>
                                            <CustomeButton onClick={() => handelShow(item?.intercompanyItems)} >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    ),
                                }}
                            />
                        ))}
                    </TableBody>
                </div>
            )}

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Preview Requisition Items"}
                maxWidth='50'
            >
                <RequisitionDetails
                    setIsShow={setIsShow}
                    selectedItems={selectedItems}
                />
            </AddModal>

        </div >
    )
}

export default Requisition
