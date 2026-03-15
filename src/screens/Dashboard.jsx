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
                        <div className="panel space-y-4 hover:shadow-lg transition-all duration-300">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3 w-full pr-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                                        <FiFileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-bold hover:text-primary transition-colors duration-300 truncate">{item?.title || "Untitled Requisition"}</h2>
                                        <p className="text-sm font-medium mt-1 flex items-start gap-1 break-all text-white-dark">
                                            <span className="shrink-0 mt-0.5">#</span> {item?.rfq_no}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`badge shrink-0 rounded-full capitalize ${
                                        item?.priority?.toLowerCase() === "high"
                                            ? "badge-outline-danger"
                                            : item?.priority?.toLowerCase() === "normal"
                                            ? "badge-outline-primary"
                                            : "badge-outline-secondary"
                                    }`}
                                >
                                    {item?.priority || "N/A"}
                                </span>
                            </div>

                            {/* Content grid */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-info/10 text-info rounded-lg shrink-0">
                                        <FiClock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-semibold text-white-dark mb-0.5">Deadline</p>
                                        <p className="font-semibold text-sm">{item?.submission_deadline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success/10 text-success rounded-lg shrink-0">
                                        <MdOutlineAttachMoney size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-semibold text-white-dark mb-0.5">Total Amount</p>
                                        <p className="font-bold text-sm">{currencyFormatter(item?.grand_total)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-sm border-t border-[#e0e6ed] dark:border-[#1b2e4b] pt-4 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                        <FiUser size={14} />
                                    </div>
                                    <span className="font-medium truncate max-w-[120px]">{item?.meta?.name || "Unknown"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark/5 dark:bg-dark/20 rounded-lg">
                                    <FiMapPin size={14} className="text-danger shrink-0" />
                                    <span className="font-medium text-xs truncate max-w-[150px]">{item?.meta?.location || "N/A"}</span>
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
