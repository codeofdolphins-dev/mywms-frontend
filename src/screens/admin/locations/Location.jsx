import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaWarehouse, FaIndustry, FaHandshake, FaLayerGroup } from 'react-icons/fa';
import { LiaSpinnerSolid } from "react-icons/lia";
import Breadcrumb from '../../../components/Breadcrumb';
import ComponentHeader from '../../../components/ComponentHeader';
import TableBody from '../../../components/table/TableBody';
import TableRow from '../../../components/table/TableRow';
import CustomeButton from '../../../components/inputs/Button';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { LOCATION_LIST_COLUMN } from '../../../utils/helper';
import business from '../../../Backend/business.fetch';
import masterData from '../../../Backend/master.backend';
import { confirmation } from '../../../utils/alerts';


// rotating color themes for the dynamic cards
const CARD_THEMES = [
  { bgColor: "bg-blue-50", activeBorder: "border-blue-600", textColor: "text-blue-600" },
  { bgColor: "bg-amber-50", activeBorder: "border-amber-600", textColor: "text-amber-600" },
  { bgColor: "bg-emerald-50", activeBorder: "border-emerald-600", textColor: "text-emerald-600" },
  { bgColor: "bg-violet-50", activeBorder: "border-violet-600", textColor: "text-violet-600" },
  { bgColor: "bg-rose-50", activeBorder: "border-rose-600", textColor: "text-rose-600" },
  { bgColor: "bg-cyan-50", activeBorder: "border-cyan-600", textColor: "text-cyan-600" },
];

const CATEGORY_ICONS = {
  manufacturing: <FaIndustry />,
  warehouse: <FaWarehouse />,
};


const Location = () => {
  const navigate = useNavigate();
  const { mutateAsync: deleteData, isPending: deleteIsPending } = masterData.TQDeleteMaster(["tenantRegisteredNodeList", "registeredNodeCount"]);

  /**************** node type cards *******************/
  const { data: businessNodes, isLoading: nodeTypesLoading } = business.TQTenantBusinessNodeList();
  const { data: nodeCount, isLoading: nodeCountLoading } = business.TQRegisteredNodeCount();
  const countData = nodeCount?.data || [];

  const getCount = (code) => {
    const item = countData.find(d => d.node_type_code === code);
    return item ? parseInt(item.count) : 0;
  };

  // total across every node type, shown on the "All Locations" card
  const totalCount = countData.reduce((sum, d) => sum + (parseInt(d.count) || 0), 0);

  const locationCards = (businessNodes?.data || []).map((node, index) => ({
    ...node,
    icon: CATEGORY_ICONS[node.category] || <FaHandshake />,
    count: getCount(node.code),
    ...CARD_THEMES[index % CARD_THEMES.length],
  }));

  /**************** pagination variables *******************/
  const [activeCode, setActiveCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(null);


  /**************** data fetching GET *******************/
  const params = {
    ...(search && { search }),
    ...(activeCode && { node_type_code: activeCode }),
    page: currentPage,
    limit,
  };

  useEffect(() => {
    setSearch(null);
    setCurrentPage(1);
  }, [activeCode]);

  const { data: locations, isLoading } = business.TQTenantRegisteredNodeList(params);
  const data = locations?.data;
  const isEmpty = data?.length === 0;


  function editLocation(id) {
    navigate(`update/${id}`);
  }

  /** register location with the node type preselected */
  function registerLocation(node) {
    navigate("register", {
      state: { id: node.id, name: node.name, code: node.code, category: node.category }
    });
  }


  /** handel delete location */
  function deleteLocation(id) {
    confirmation("Are you sure you want to delete this location?")
      .then((res) => {
        if (res) {
          deleteData({ path: `business/delete/${id}` })
        }
      });
  }


  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Breadcrumb
        options={[{ title: "locations" }]}
        className='mb-1'
      />

      {/* 1. Top Node Type Cards with Add Icon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
        {/* default card — clears the node type filter and lists every location */}
        <div
          onClick={() => setActiveCode(null)}
          className={`group rounded-2xl border-2 p-4 hover:shadow-md transition-all relative flex gap-4 items-center cursor-pointer bg-slate-50 ${!activeCode ? "border-slate-700 shadow-md" : "border-gray-200 shadow-sm"}
          `}
        >
          <div className="shrink-0 p-3 sm:p-4 rounded-xl bg-white text-slate-700 text-xl sm:text-2xl">
            <FaLayerGroup />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-800 leading-snug truncate">All Locations</h3>
            <div className="flex items-center gap-2 mt-1 min-w-0">
              <span className="shrink-0 text-xs font-bold text-gray-400 uppercase tracking-wider">ALL</span>
              <span className="shrink-0 w-1 h-1 bg-gray-300 rounded-full"></span>
              {
                nodeCountLoading ? (
                  <LiaSpinnerSolid size={15} className='shrink-0 animate-spin text-blue-400' />
                ) : (
                  <span className="shrink-0 text-sm text-blue-600 whitespace-nowrap">{totalCount} Location(s)</span>
                )
              }
            </div>
          </div>
        </div>

        {nodeTypesLoading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="rounded-2xl border-2 border-gray-200 bg-white p-4 h-24 animate-pulse shadow-sm" />
          ))
        ) : (
          locationCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCode(prev => prev === cat.code ? null : cat.code)}
              className={`group rounded-2xl border-2 p-4 hover:shadow-md transition-all relative flex gap-4 items-center cursor-pointer ${cat.bgColor} ${activeCode === cat.code ? `${cat.activeBorder} shadow-md` : "border-gray-200 shadow-sm"}
              `}
            >

              <div className={`shrink-0 p-3 sm:p-4 rounded-xl bg-white ${cat.textColor} text-xl sm:text-2xl`}>
                {cat.icon}
              </div>

              <div className="min-w-0 flex-1 flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-800 leading-snug truncate" title={cat.name}>{cat.name}</h3>
                  <div className="flex items-center gap-2 mt-1 min-w-0">
                    <span className="shrink-0 text-xs font-bold text-gray-400 uppercase tracking-wider">{cat.code}</span>
                    <span className="shrink-0 w-1 h-1 bg-gray-300 rounded-full"></span>
                    {
                      nodeCountLoading ? (
                        <LiaSpinnerSolid size={15} className='shrink-0 animate-spin text-blue-400' />
                      ) : (
                        <span className="shrink-0 text-sm text-blue-600 whitespace-nowrap">{cat.count} Location(s)</span>
                      )
                    }
                  </div>
                </div>

                {/* The "Add" Icon for each node type */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    registerLocation(cat);
                  }}
                  className="shrink-0 bg-gray-50 text-gray-400 p-2 rounded-full hover:bg-[#0052CC] hover:text-white transition-all shadow-sm"
                >
                  <FaPlus size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>


      <div className="panel">
        <ComponentHeader
          addButton={false}
          searchPlaceholder='Search Location...'
          searchClassName='z-5'
          setDebounceSearch={setSearch}
        />

        {/* table */}
        <div className="z-0 min-h-64 mt-5">
          <TableBody
            columns={LOCATION_LIST_COLUMN}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            setLimit={setLimit}
            totalPage={locations?.pagination?.totalPages || 1}
            isEmpty={isEmpty}
            isLoading={isLoading}
          >
            {data?.map((item) => {
              const address = item?.address;

              // Handling both string and object variations from the API for State
              const stateName = typeof address?.state === 'object' ? address?.state?.name : address?.state;

              // Handling both string and object variations from the API for District
              const cityName = typeof address?.district === 'object' ? address?.district?.name : address?.district;

              const addressString = [stateName, cityName].filter(Boolean).join(' - ') || 'N/A';

              const category = item?.businessNode?.type?.category ? <span className='badge bg-info uppercase'>{item?.businessNode?.type?.category}</span> : <span className='badge bg-dark/30 text-white'>Uncategorized</span>;

              return (
                <TableRow
                  key={item.id}
                  columns={LOCATION_LIST_COLUMN}
                  row={{
                    name: <span className="font-semibold whitespace-nowrap">{item?.name}</span>,
                    location: <span className="font-semibold whitespace-nowrap">{item?.location}</span>,
                    type: <div className="truncate">{item?.businessNode?.type?.name}</div>,
                    category: category,
                    address: <div className="">{addressString}</div>,
                    gst: item?.gst_no || <span className="text-gray-400">N/A</span>,
                    license: item?.license_no || <span className="text-gray-400">N/A</span>,
                    action: (
                      <div className="flex justify-center space-x-3">
                        <CustomeButton onClick={(e) => {
                          e.stopPropagation();
                          editLocation(item.id);
                        }}>
                          <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                        </CustomeButton>

                        <CustomeButton onClick={(e) => {
                          e.stopPropagation();
                          deleteLocation(item.id);
                        }}>
                          <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                        </CustomeButton>
                      </div>
                    )
                  }}
                />
              )
            })}
          </TableBody>
        </div>
      </div>
    </div>
  )
}

export default Location;
