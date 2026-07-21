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
import { remainingDays } from "../utils/remainingDays";
import { utcToLocal } from "../utils/UTCtoLocal";
import MultiAttributeSearch from "../components/inputs/MultiAttributeSearch";
import { Helmet } from "react-helmet-async";
import ConnectRoleModal from "../components/ConnectRoleModal";
import masterData from "../Backend/master.backend";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";



const tabList = [
  { id: 1, title: "All RFQ List" },
  { id: 2, title: "Applied List" },
];

const tableHeader = [
  { key: "requisition", label: "Requisition" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "rfqDeadline", label: "RFQ. Deadline" },
  { key: "remainingDays", label: "Remaining Day(s)" },
  { key: "connection", label: "Connection" },
];

const Dashboard = () => {
  const isLogin = useSelector(state => state.auth.status);
  const buyerTenant = secureLocalStorage.getItem("tenant");
  const navigate = useNavigate();

  const { mutateAsync, isPending } = masterData.TQUpdateMaster(["rfqList"]);

  const [isShow, setIsShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [connectModalShow, setConnectModalShow] = useState(false);
  const [selectedConnectItem, setSelectedConnectItem] = useState(null);
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("all");

  const [search, setSearch] = useState({});

  /** pagination states */
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState(1);

  const params = {
    ...(search && Object.fromEntries(
      Object.entries(search).filter(([_, value]) => value && String(value).trim() !== "")
    )),
    ...(status !== "all" && { status }),
    priority,
    limit,
    page: currentPage
  }
  const { data: rfqList, isLoading: rfqListLoading } = fetchData.TQRfqList(params);
  const { data: appliedRfqList, isLoading: appliedRfqListLoading } = fetchData.TQAppliedRfqList();

  const filteredList = rfqList?.data?.filter(i => {
    if (activeTab === 1) return !appliedRfqList?.data?.includes(i.id);
    if (activeTab === 2) return appliedRfqList?.data?.includes(i.id);
  });

  const isEmpty = filteredList?.length === 0;

  useEffect(() => {
    if (search && Object.values(search).some(val => val && String(val).trim() !== "")) {
      setStatus("all");
      setPriority("all");
    }
    if (Object.keys(search)?.length === 0) {
      setStatus("open");
      setPriority("all");
    }
    setCurrentPage(1);
  }, [search, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status, priority, activeTab]);

  useEffect(() => {
    if (activeTab === 2 && status !== "all") {
      setStatus("all");
    }
  }, [activeTab]);

  // console.log(rfqList?.data)
  // console.log(appliedRfqList?.data);

  /** status color */
  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-500"
      case "closed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }


  return (
    <div>
      <Helmet><title>Open Forum | MYWMS</title></Helmet>

      <MultiAttributeSearch
        setSearchObject={setSearch}
      />

      {/* main component */}
      <div className="w-full grid grid-cols-5 gap-2 overflow-hidden mt-5">

        {/* <div className="panel col-span-1">
                    <div>Add</div>
                </div> */}

        <div className="panel col-span-5">
          {/*filter */}
          <div className="flex items-center justify-between mb-2 gap-4">
            {/* wizards */}
            <div className="w-full">
              <ul className="flex items-center text-center gap-2">
                {tabList?.map(item => (
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

            <div className="w-full flex items-center justify-end gap-3">
              {/* status */}
              <div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border-gray-200 rounded-lg p-1 border text-sm"
                >
                  <option value="all">Status: all</option>
                  <option value="open">Status: Open</option>
                  <option value="closed">Status: Closed</option>
                </select>
              </div>

              {/* priority */}
              <div className="">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border-gray-200 rounded-lg p-1 border text-sm"
                >
                  <option value="all">Priority: All</option>
                  <option value="high">Priority: High</option>
                  <option value="normal">Priority: Normal</option>
                  <option value="low">Priority: Low</option>
                </select>
              </div>
            </div>
          </div>

          {isEmpty ?
            <div className="flex flex-col items-center justify-center gap-4 min-h-64">
              <BsBoxSeam fontSize={40} color='grey' />
              <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
            </div>
            : <>
              <div className=" overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-[#f5f5f5] dark:bg-[#1b2e4b]/40">
                      {tableHeader.map(item =>
                        <th key={item.key} className="px-3 py-2.5 text-left text-xs font-semibold text-white-dark uppercase tracking-wide">{item.label}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList?.map((item) =>
                      <tr
                        key={item.id}
                        className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] last:border-0 hover:bg-[#f5f5f5] dark:hover:bg-[#1b2e4b]/40 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShow(true);
                          setSelectedItem(item);
                        }}
                      >
                        {/* rfq no */}
                        <td className="px-3 py-3">
                          <p className="font-semibold tracking-wide max-w-[200px]">{item?.title || "Untitled Requisition"}</p>
                          <p className="text-xs text-white-dark whitespace-nowrap font-mono mt-0.5"># {item?.rfq_no}</p>
                        </td>

                        {/* company */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                              <FiUser size={12} />
                            </div>
                            <span className="truncate max-w-[120px]">{item?.meta?.name || "Unknown"}</span>
                          </div>
                        </td>

                        {/* location */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <FiMapPin size={13} className="text-danger shrink-0" />
                            <span className="text-xs truncate max-w-[130px]">{item?.meta?.nodeDetails?.location || "N/A"}</span>
                          </div>
                        </td>

                        {/* amount */}
                        <td className="px-3 py-3 font-semibold whitespace-nowrap">{currencyFormatter(item?.grand_total)}</td>

                        {/* priority */}
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

                        {/* status */}
                        <td className="px-3 py-3">
                          <span
                            className={`badge rounded-full capitalize text-xs ${statusColor(item?.status)}`}
                          >
                            {item?.status || "N/A"}
                          </span>
                        </td>

                        {/* deadline */}
                        <td className="px-3 py-3 whitespace-nowrap">{utcToLocal(item?.submission_deadline)}</td>

                        {/* remaining days */}
                        <td className="px-3 py-3 whitespace-nowrap text-center">{remainingDays(item?.submission_deadline)}</td>

                        {/* connection */}
                        <td className="whitespace-nowrap">
                          {isLogin ?
                            buyerTenant == item?.buyer_tenant
                              ? <> Creator </>
                              : item?.isConnected
                                ? <span className="text-sky-400">Connected</span>
                                : item?.connection_status === "pending"
                                  ? <>Pending...</>
                                  :
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedConnectItem(item);
                                      setConnectModalShow(true);
                                    }}
                                  >
                                    Connect
                                  </button>
                            : <button
                              className="cursor-pointer text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/auth/login');
                              }}
                            >
                              log in...
                            </button>
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
      </div>

      <AddModal
        isShow={isShow}
        setIsShow={setIsShow}
        maxWidth="55"
        placement="start"
      >
        <RequisitionCard
          details={selectedItem}
          setIsRequisitionCardShow={setIsShow}
        />
      </AddModal>

      <ConnectRoleModal
        isShow={connectModalShow}
        setIsShow={setConnectModalShow}
        rfqItem={selectedConnectItem}
        onConfirm={async (role, item) => {
          // TODO: call your API here

          if (role === "supplier") {
            const payload = {
              parent_tenant: item?.buyer_tenant,
              connection_type: role,
            };

            const res = await mutateAsync({ path: "/connection/supplier", formData: payload });
            console.log("Supplier Connected:", res);
          };

          if (role == "trader") {
            console.log("Connect as:", role, "for RFQ:", item);
            const payload = {
              parent_tenant: item?.buyer_tenant,
              connection_type: role,
            };

            const res = await mutateAsync({ path: "/connection/trader", formData: payload });
            // setStatus(all);
            console.log(res);
          };
        }}
      />
    </div>
  );
};

export default Dashboard;


