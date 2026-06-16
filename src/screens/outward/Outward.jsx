import React, { useState } from 'react'
import ComponentHeader from '../../components/ComponentHeader'
import { Link, useNavigate } from 'react-router-dom'
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import { PRODUCT_COLUMN } from '../../utils/helper';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import { MdOutlineDownload } from 'react-icons/md';
import CustomeButton from "../../components/inputs/Button"
import fetchData from '../../Backend/fetchData.backend';
import { currencyFormatter } from '../../utils/currencyFormatter';
import AddModal from '../../components/Add.modal';
import { OUTWARD_COLUMN } from './helper';
import { IoMdDownload } from 'react-icons/io';
import pdf from '../../Backend/downloads/pdf/pdf.download';
import { LuLoaderCircle } from 'react-icons/lu';

const headerLink = [
    { title: "outward" },
];

const Outward = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedItem, setSelectedItem] = useState(null);
    const [downloadingInvoice, setDownloadingInvoice] = useState(null);


    const { mutateAsync, isPending } = pdf.TQOutwardInvoicePDFDownload();

    const params = {
        ...(debounceSearch && { outward_no: debounceSearch }),
        page: currentPage,
        limit: limit,
    };
    const { data: outwardList, isLoading: outwardListLoading } = fetchData.TQOutwardList(params);

    const isEmpty = outwardList?.data?.length < 1;

    function handelShow(items) {
        setSelectedItem(items);
        setIsShow(true);
    }

    async function handelDownloadInvoice(out_no) {
        setDownloadingInvoice(out_no);
        await mutateAsync({ out_no });
    }

    /** set status color */
    function statusColor(status) {
        // follow jointable status order
        switch (status) {
            case "pending":
                return "bg-secondary";
            case "picking":
                return "bg-primary";
            case "picked":
                return "bg-info";
            case "dispatched":
                return "bg-success";
            case "cancelled":
                return "bg-danger";
            default:
                return "bg-warning";
        }
    }

    /** set priority color */
    function priorityColor(priority) {
        switch (priority) {
            case "urgent":
                return "bg-danger";
            case "high":
                return "bg-warning";
            case "medium":
                return "bg-primary";
            default:
                return "bg-secondary";
        }
    }

    return (
        <>
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                btnTitle='Add Outward'
                btnOnClick={() => navigate('/outward/create')}
            />

            {/* Outward list table section */}
            <div className="panel mt-5 z-0 min-h-64">
                <TableBody
                    columns={OUTWARD_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={outwardList?.pagination?.totalPages || 1}
                    isEmpty={isEmpty}
                    isLoading={outwardListLoading}
                >
                    {outwardList?.data?.map((item, idx) => (
                        <TableRow
                            key={item.id}
                            columns={OUTWARD_COLUMN}
                            row={{
                                id: (
                                    <Link
                                        to={`/outward/${item.outward_no}`}
                                        className='hover:underline text-primary'
                                    >
                                        {item?.outward_no}
                                    </Link>
                                ),
                                status: (
                                    <>
                                        <span className={`badge uppercase rounded-full ${statusColor(item?.status)}`}>
                                            {item?.status === "po_created" ? "po. created" : item?.status}
                                        </span>
                                    </>
                                ),
                                priority: (
                                    <>
                                        <span className={`badge uppercase rounded-full ${priorityColor(item?.priority)}`}>
                                            {item?.priority}
                                        </span>
                                    </>
                                ),
                                note: item?.note,
                                itemsCount: item?.outwardItemList?.length,
                                action: (
                                    <div className='flex items-center justify-center space-x-2'>
                                        <CustomeButton
                                            title="Preview"
                                            onClick={() => handelShow(item.outwardItemList)}
                                        >
                                            <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                        </CustomeButton>
                                        <CustomeButton
                                            title="Download invice"
                                            onClick={() => handelDownloadInvoice(item.outward_no)}
                                            disabled={isPending}
                                        >
                                            {isPending && downloadingInvoice === item.outward_no
                                                ? <LuLoaderCircle size={20} className='animate-spin' />
                                                : <IoMdDownload size={20} className="hover:scale-110 cursor-pointer" />
                                            }
                                        </CustomeButton>
                                    </div>
                                )
                            }}
                        />
                    ))}
                </TableBody>
            </div>


            {/* Item details modal */}
            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Item Details"
                maxWidth='75'
            >
                <div className="panel mt-5 z-0 min-h-64">
                    <TableBody
                        columns={PRODUCT_COLUMN}
                        showPagination={false}
                        isEmpty={isEmpty}
                        isLoading={outwardListLoading}
                    >
                        {
                            selectedItem?.map((item, idx) => {
                                const product = item?.outwardProduct;

                                return <TableRow
                                    key={item.id}
                                    columns={PRODUCT_COLUMN}
                                    row={{
                                        barcode: product?.barcode,
                                        product: product?.name,
                                        sku: product?.sku,
                                        packSize: `${product?.measure} ${product?.unit_type} ${product?.package_type}`,
                                        reqQty: item?.requested_qty,
                                        price: item?.unit_price
                                    }}
                                />
                            })
                        }
                    </TableBody>
                </div>
            </AddModal>
        </>
    )
}

export default Outward