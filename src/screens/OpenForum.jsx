import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { IRootState } from '../store';
// import { setPageTitle } from '../store/themeConfigSlice';
import RequisitionCard from "../components/dashboard/RequisitionCard";
import fetchData from "../Backend/fetchData.backend";
import { currencyFormatter } from "../utils/currencyFormatter";
import AddModal from "../components/Add.modal";
import { FiMapPin, FiUser, FiFileText, FiClock, FiSearch } from "react-icons/fi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useSelector } from "react-redux";
import ComponentHeader from "../components/ComponentHeader";
import SearchableSelect from "../components/inputs/SearchableSelect";
import BasicPagination from "../components/BasicPagination";
import { BsBoxSeam } from "react-icons/bs";

const Dashboard = () => {
    const isLogin = useSelector(state => state.auth.status);

    const [isShow, setIsShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("open");
    const [priority, setPriority] = useState("all");

    /** pagination states */
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = {
        ...(search && { search }),
        status,
        priority,
        limit,
        page: currentPage
    }
    const { data: rfqList, isLoading: rfqListLoading } = fetchData.TQRfqList(params);
    const isEmpty = rfqList?.data?.length === 0;

    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('Sales Admin'));
    // });
    // const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    // const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // console.log(rfqList?.data)
    // console.log(appliedRfqList?.data);


    return (
        <div>
            {/* search bar with filter */}
            <div className="flex items-center gap-4 mb-5 mt-2">
                <div className="w-full">
                    <ComponentHeader
                        addButton={false}
                        searchPlaceholder="Search by RFQ no..."
                        setDebounceSearch={setSearch}
                    />
                </div>

                {/* status */}
                <div className="">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border-gray-200 rounded-lg p-2 border"
                    >
                        <option value="open">Status: Open</option>
                        <option value="closed">Status: Closed</option>
                    </select>
                </div>

                {/* priority */}
                <div className="">
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border-gray-200 rounded-lg p-2 border"
                    >
                        <option value="all">Priority: All</option>
                        <option value="high">Priority: High</option>
                        <option value="normal">Priority: Normal</option>
                        <option value="low">Priority: Low</option>
                    </select>
                </div>
            </div>


            {/* main component */}
            <div className="w-full overflow-hidden space-y-5">

                {isEmpty ?
                    <div className="flex flex-col items-center justify-center gap-4 min-h-64">
                        <BsBoxSeam fontSize={40} color='grey' />
                        <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
                    </div>
                    : <>
                        {rfqList?.data?.map((item) => {
                            // if (appliedRfqList?.data?.find((rfq_id) => rfq_id === item.id)) {
                            //     return null; // Skip this item if it's in the appliedRfqList
                            // }

                            return (
                                <div key={item.id} className="panel">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-[#f5f5f5] dark:bg-[#1b2e4b]/40">
                                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Requisition</th>
                                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Priority</th>
                                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">RFQ. Deadline</th>
                                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Total Amount</th>
                                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Requested By</th>
                                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] last:border-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1b2e4b]/40 cursor-pointer transition-colors"
                                                onClick={() => {
                                                    setIsShow(true);
                                                    setSelectedItem(item);
                                                }}
                                            >
                                                <td className="px-3 py-3">
                                                    <p className="font-semibold truncate max-w-[200px]">{item?.title || "Untitled Requisition"}</p>
                                                    <p className="text-xs text-white-dark font-mono mt-0.5"># {item?.rfq_no}</p>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span
                                                        className={`badge rounded-full capitalize text-xs ${item?.priority?.toLowerCase() === "high"
                                                            ? "badge-outline-danger"
                                                            : item?.priority?.toLowerCase() === "normal"
                                                                ? "badge-outline-primary"
                                                                : "badge-outline-secondary"
                                                            }`}
                                                    >
                                                        {item?.priority || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 whitespace-nowrap">{item?.submission_deadline}</td>
                                                <td className="px-3 py-3 font-semibold whitespace-nowrap">{currencyFormatter(item?.grand_total)}</td>
                                                <td className="px-3 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                                            <FiUser size={12} />
                                                        </div>
                                                        <span className="truncate max-w-[120px]">{item?.meta?.name || "Unknown"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <FiMapPin size={13} className="text-danger shrink-0" />
                                                        <span className="text-xs truncate max-w-[130px]">{item?.meta?.nodeDetails?.location || "N/A"}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                        < BasicPagination
                            totalPage={rfqList?.totalPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            setLimit={setLimit}
                        />
                    </>
                }
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                maxWidth="55"
                placement="start"
            // blur={false}
            >
                <RequisitionCard
                    details={selectedItem}
                    setIsRequisitionCardShow={setIsShow}
                />
            </AddModal>
        </div>
    );
};

export default Dashboard;
