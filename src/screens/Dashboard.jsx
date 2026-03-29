import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { IRootState } from '../store';
// import { setPageTitle } from '../store/themeConfigSlice';
import RequisitionCard from "../components/dashboard/RequisitionCard";
import fetchData from "../Backend/fetchData.backend";
import { currencyFormatter } from "../utils/currencyFormatter";
import AddModal from "../components/Add.modal";
import { FiMapPin, FiUser, FiFileText, FiClock } from "react-icons/fi";
import { MdOutlineAttachMoney } from "react-icons/md";

const Dashboard = () => {
    const [isShow, setIsShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { data: rfqList, isLoading: rfqListLoading } = fetchData.TQRfqList();
    const { data: appliedRfqList, isLoading: appliedRfqListLoading } = fetchData.TQAppliedRfqList();

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
            <div className="w-full overflow-hidden space-y-5">
                {rfqList?.data?.map((item) => {
                    if (appliedRfqList?.data?.find((rfq_id) => rfq_id === item.id)) {
                        return null; // Skip this item if it's in the appliedRfqList
                    }

                    return (
                        <div key={item.id} className="panel">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-[#f5f5f5] dark:bg-[#1b2e4b]/40">
                                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Requisition</th>
                                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Priority</th>
                                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">Deadline</th>
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
                                                className={`badge rounded-full capitalize text-xs ${
                                                    item?.priority?.toLowerCase() === "high"
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
                                                <span className="text-xs truncate max-w-[130px]">{item?.meta?.location || "N/A"}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                maxWidth="55"
                placement="start"

                // blur={false}
            >
                <RequisitionCard details={selectedItem} setIsRequisitionCardShow={setIsShow} />
            </AddModal>
        </div>
    );
};

export default Dashboard;
