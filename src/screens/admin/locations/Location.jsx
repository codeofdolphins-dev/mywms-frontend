import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComponentHeader from '../../../components/ComponentHeader';
import TableBody from '../../../components/table/TableBody';
import TableRow from '../../../components/table/TableRow';
import CustomeButton from '../../../components/inputs/Button';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { LOCATION_LIST_COLUMN } from '../../../utils/helper';
import business from '../../../Backend/business.fetch';
import masterData from '../../../Backend/master.backend';
import { headLink_register } from './helper';
import { confirmation } from '../../../utils/alerts';



const Location = () => {
  const navigate = useNavigate();
  const { mutateAsync: deleteData, isPending: deleteIsPending } = masterData.TQDeleteMaster(["tenantRegisteredNodeList"]);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetching the location data
  const params = {
    ...(search && { search }),
    page: currentPage,
    limit: limit,
  };
  const { data: locations, isLoading } = business.TQTenantRegisteredNodeList(params);
  const data = locations?.data;
  const isEmpty = data?.length === 0;

  // console.log(data);

  function editLocation(id) {
    navigate(`update/${id}`);
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
    <div className='space-y-4'>
      {/* Header Section */}
      <ComponentHeader
        headerLink={headLink_register}
        primaryText='All Locations'
        searchPlaceholder='Search Location...'
        setDebounceSearch={setSearch}
        btnTitle='Register Location'
        btnOnClick={() => navigate("register")}
      />

      <div className={`panel mt-5 relative z-0 min-h-64`}>
        <div className="overflow-x-auto">
          <TableBody
            columns={LOCATION_LIST_COLUMN}
            isEmpty={isEmpty}
            isLoading={isLoading}
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={locations?.pagination?.totalPages}
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
                          // TODO: Handle Edit action
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