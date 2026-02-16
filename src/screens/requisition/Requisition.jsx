import React, { useState } from 'react'
import ItemTable from '../../components/ItemTable'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi';
import TableHeader from '../../components/table/TableHeader';
import { REQUISITION_COLUMN } from '../../utils/helper';
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

const headerLink = [
    { title: "requisition" },
];

const Requisition = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isShow, setIsShow] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [downloadReqNo, setDownloadReqNo] = useState(null);

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["requisitionList"]);

    const { mutateAsync: requisitionPdf_download, isPending: requisitionPdf_pending } = pdf.TQRequisitionPDFDownload();
    const { data: requisitionList, isLoading: requisitionListLoading } = fetchData.TQRequisitionList();
    const isEmpty = requisitionList?.data?.length < 1;



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
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                btnTitle='Add Requisition'
                btnOnClick={() => navigate('/requisition/create')}
            />

            {/* table */}
            <div className={`panel mt-5 z-0 min-h-64`}>
                <TableBody
                    columns={REQUISITION_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={requisitionList?.meta?.totalPages || 1}
                    isEmpty={isEmpty}
                    isLoading={requisitionListLoading}
                >
                    {
                        requisitionList?.data?.map((item, idx) => (
                            <TableRow
                                key={item.id}
                                columns={REQUISITION_COLUMN}
                                row={{
                                    id: (
                                        <Link to={`/quotation/received-quotation?s=${item.requisition_no}`} className='hover:underline text-primary' >
                                            {item?.requisition_no}
                                        </Link>
                                    ),
                                    title: item?.title,
                                    status: (
                                        <>
                                            <span className={`badge uppercase rounded-full ${statusColor(item?.status)}`}>
                                                {item?.status === "po_created" ? "po. created" : item?.status}
                                            </span>
                                        </>
                                    ),
                                    priority: (
                                        <>
                                            <span className={`badge uppercase rounded-full ${item?.priority === "high" ? "badge-outline-danger" : item?.priority === "normal" ? "badge-outline-primary" : "badge-outline-secondary"}`}>
                                                {item?.priority}
                                            </span>
                                        </>
                                    ),
                                    notes: item?.notes,
                                    grandTotal: item?.grandTotal,
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
                                    )
                                }}
                            />
                        ))
                    }
                </TableBody>
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Requisition Items"}
                maxWidth='75'
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