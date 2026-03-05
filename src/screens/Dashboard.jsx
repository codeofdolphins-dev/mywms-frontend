import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { IRootState } from '../store';
// import { setPageTitle } from '../store/themeConfigSlice';
import RequisitionCard from '../components/dashboard/RequisitionCard';
import fetchData from '../Backend/fetchData.backend';
import { currencyFormatter } from '../utils/currencyFormatter';
import AddModal from '../components/Add.modal';

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
                        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-5">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Requisition: {item?.title}</h2>
                                    <p className="text-sm text-gray-500"># {item?.rfq_no}</p>
                                </div>
                                <span
                                    className={`inline-block ml-2 px-3 py-1 rounded-md text-xs font-semibold ${item?.priority?.toLowerCase() === "high"
                                        ? "bg-red-100 text-red-700"
                                        : item?.priority?.toLowerCase() === "normal"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-700 invisible"
                                        }`}
                                >
                                    {item?.priority}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                                <p><span className="font-medium text-gray-700">Deadline:</span> {item?.submission_deadline}</p>
                                <p><span className="font-medium text-gray-700">Total: </span> {currencyFormatter(item?.grand_total)}</p>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                                <span>Posted by: {item?.meta?.name}</span>
                                <span>Location: {item?.meta?.location}</span>
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
