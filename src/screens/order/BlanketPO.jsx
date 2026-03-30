import React, { useState } from 'react';
import BasicPagination from '../../components/BasicPagination';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import ComponentHeader from '../../components/ComponentHeader';
import bpo from '../../Backend/bpo.fetch';
import { BPO_COLUMN } from '../../utils/helper';
import { Link } from 'react-router-dom';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import { MdOutlineDownload } from 'react-icons/md';
import CustomeButton from '../../components/inputs/Button';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import secureLocalStorage from 'react-secure-storage';
import { utcToLocal } from '../../utils/UTCtoLocal';



const headerLink = [
    { title: "Blanket PO" },
];

const BlanketPO = () => {
    const TENANT = secureLocalStorage.getItem("tenant");

    const [search, setSearch] = useState(null);
    const [status, setStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = {
        ...(search && { search: search }),
        status: status,
        page: currentPage,
        limit: limit,
    };
    const { data: bpoList, isLoading: bpoListLoading } = bpo.TQBlanketOrderList(params);
    const isEmpty = bpoList?.data?.length > 0 ? false : true;

    // console.log(bpoList)


    async function handelDownload(params) {

    }
    function handelShow(items) {
    }
    async function handleDelete(id) {
    };




    /** set status color */
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
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-5">
                <ComponentHeader
                    headerLink={headerLink}
                    addButton={false}
                    className="w-full"
                    setDebounceSearch={setSearch}
                    searchPlaceholder='Search BPO # or Vendor...'
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border-gray-200 rounded-lg p-2 border"
                >
                    <option value="all">Status: All</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="panel mt-5 z-0 min-h-64">
                <TableBody
                    columns={BPO_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={bpoList?.meta?.totalPages || 1}
                    isEmpty={isEmpty}
                    isLoading={bpoListLoading}
                >
                    {
                        bpoList?.data?.map((item, idx) => {
                            const isBuyer = item?.buyer_tenant === TENANT ? true : false;

                            return (<TableRow
                                key={item.id}
                                columns={BPO_COLUMN}
                                row={{
                                    id: (
                                        <Link to={`/order/bpo/details/${item?.bpo_no}`} className='hover:underline text-primary' >
                                            {item?.bpo_no}
                                        </Link>
                                    ),
                                    partner: isBuyer ? item?.vendor?.tenantDetails?.companyName : item?.buyer?.tenantDetails?.companyName,
                                    items: item?.blanketOrderItems?.length,
                                    status: (
                                        <>
                                            <span className={`badge uppercase rounded-full ${item?.status === "active" ? "badge-outline-success" : "badge-outline-primary"}`}>
                                                {item?.status}
                                            </span>
                                        </>
                                    ),
                                    valid_until: utcToLocal(item?.valid_until),
                                    createdAt: utcToLocal(item?.createdAt),
                                    action: (
                                        <div className='flex items-center justify-center space-x-2'>
                                            <CustomeButton
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                            </CustomeButton>

                                            <CustomeButton onClick={() => handelShow(item.items)} >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>

                                            <CustomeButton onClick={() => handelDownload(item?.requisition_no)} >
                                                {false && (downloadReqNo === item?.requisition_no)
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
                                    )
                                }}
                            />)
                        })
                    }
                </TableBody>
            </div>
        </div>
    )
}

export default BlanketPO