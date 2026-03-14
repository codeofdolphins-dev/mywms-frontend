import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { IRootState } from '../store';
// import { setPageTitle } from '../store/themeConfigSlice';
import RequisitionCard from '../components/dashboard/RequisitionCard';
import fetchData from '../Backend/fetchData.backend';
import { currencyFormatter } from '../utils/currencyFormatter';
import AddModal from '../components/Add.modal';
import { FiMapPin, FiUser, FiFileText, FiClock } from 'react-icons/fi';
import { MdOutlineAttachMoney } from 'react-icons/md';

const Dashboard = () => {
    const [isShow, setIsShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { data: rfqList, isLoading: rfqListLoading } = fetchData.TQRfqList();


    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('Sales Admin'));
    // });
    // const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    // const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // console.log(rfqList?.data)

    return (
        <div>
            <div className="max-w-[40rem] w-full mx-auto space-y-5 cursor-pointer">
                {rfqList?.data?.map(item => {
                    // console.log(item)

                    return <div
                        key={item.id}
                        className="max-w-3xl mx-auto space-y-4"
                        onClick={() => {
                            setIsShow(true);
                            setSelectedItem(item);
                        }}
                    >
                        {/* RFQ Card */}
                        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden">
                            {/* Subtle background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                            
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex items-start gap-3 w-full pr-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                                        <FiFileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-300 truncate">{item?.title || "Untitled Requisition"}</h2>
                                        <p className="text-sm font-medium text-gray-400 mt-1 flex items-start gap-1 break-all">
                                            <span className="shrink-0 mt-0.5">#</span> {item?.rfq_no}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        item?.priority?.toLowerCase() === "high"
                                            ? "bg-red-50 text-red-600 border border-red-100"
                                            : item?.priority?.toLowerCase() === "normal"
                                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                                            : "bg-gray-50 text-gray-600 border border-gray-100"
                                    }`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        item?.priority?.toLowerCase() === "high" ? "bg-red-500" :
                                        item?.priority?.toLowerCase() === "normal" ? "bg-blue-500" : "bg-gray-500"
                                    }`}></div>
                                    {item?.priority || "N/A"}
                                </span>
                            </div>

                            {/* Content grid */}
                            <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-50/50 rounded-xl border border-gray-50 relative z-10">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <FiClock className="text-blue-500" size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Deadline</p>
                                        <p className="font-semibold text-gray-700">{item?.submission_deadline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <MdOutlineAttachMoney className="text-green-500" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">Total Amount</p>
                                        <p className="font-bold text-gray-800">{currencyFormatter(item?.grand_total)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                        <FiUser size={14} />
                                    </div>
                                    <span className="font-medium text-gray-700">{item?.meta?.name || "Unknown"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-600">
                                    <FiMapPin size={14} className="text-red-400" />
                                    <span className="font-medium text-xs">{item?.meta?.location || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                maxWidth='55'
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
