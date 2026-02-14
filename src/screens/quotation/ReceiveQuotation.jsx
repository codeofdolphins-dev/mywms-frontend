import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link, useSearchParams } from 'react-router-dom'
import Accordian from '../../components/Accordian'
import TableHeader from '../../components/table/TableHeader'
import { QUOTATION_RECEIVE_COLUMN } from '../../utils/helper'
import TableRow from '../../components/table/TableRow'
import ComponentHeader from '../../components/ComponentHeader'
import fetchData from '../../Backend/fetchData.backend'
import AnimateHeight from 'react-animate-height'
import IconCaretDown from '../../components/Icon/IconCaretDown'
import TableBody from '../../components/table/TableBody'
import Dropdown from '../../components/Dropdown'
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots'
import masterData from '../../Backend/master.backend'
import { currencyFormatter } from '../../utils/currencyFormatter'
import { warningAlert } from '../../utils/alerts'


const headerLink = [
    { title: "requisition", link: "/requisition" },
    { title: "receive-quotation" },
]

const ReceiveQuotation = () => {
    const [searchParams] = useSearchParams();
    const reqNo = searchParams.get("s") ?? "";
    const [debounceSearch, setDebounceSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedQuotationId, setSelectedQuotationId] = useState(null);

    /** set reset search value */
    useEffect(() => {
        if (debounceSearch.length > 0) return;
        setDebounceSearch(reqNo);
    }, [reqNo, debounceSearch])

    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue == value.id ? '' : String(value.id);
        });
        setSelectedQuotationId(value?.quotation?.id)
    };

    const params = {
        reqNo: debounceSearch,
        ...(selectedQuotationId && { quotationId: selectedQuotationId }),
        page: currentPage,
        limit: limit,
    };
    const { data, isLoading } = fetchData.TQReceiveQuotationList(params);

    const suppliers = data?.data?.suppliers;
    const requisition = data?.data?.requisition;
    const isAccepted = suppliers?.some(item => item.status === "rejected");

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["receiveQuotationList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["receiveQuotationList"]);

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-secondary";
            case "quoted": return "bg-success";
            case "rejected": return "bg-danger";
            default: return "bg-warning";
        }
    }


    async function approveQ(id) {
        if (!id) {
            warningAlert();
            return;
        };

        try {
            await createData({ path: "/purchase-order/create", formData: { quotationId: id } });
        } catch (error) {
            console.log(error)
        }
    };

    async function rejectQ(id) {
        if (!id) {
            warningAlert();
            return;
        };

        try {
            await updateData({ path: `/quotation/reject/${id}` });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                className='mb-5 justify-between'
            />

            <div className="panel space-y-4">
                {
                    suppliers?.map((item, idx) => {
                        const isEmpty = item?.quotation === null ? true : false;

                        return (
                            <div
                                className={`border border-[#d3d3d3] rounded `}
                                key={idx}
                            >
                                {/* supplier listing */}
                                <div
                                    className={`flex items-center justify-between ${isEmpty ? '' : 'cursor-pointer'}`}
                                    onClick={() => !isEmpty ? togglePara(item) : null}
                                >
                                    <table>
                                        {/* <thead>
                                            <tr className={`py-1 w-full flex items-center justify-between ${(active === `${item.id}`) ? '!text-primary' : ''}`}>
                                                <th>{item?.nodeDetails?.name}</th>
                                                <th>{item?.nodeDetails?.location}</th>
                                                <th>
                                                    <div className={`badge ${statusColor(item?.status)}`}>
                                                        {item?.status?.toUpperCase()}
                                                    </div>
                                                </th>
                                                <th> {currencyFormatter(requisition.grandTotal)} || {currencyFormatter(item?.quotation?.grandTotal) ?? "XXXXX"}</th>
                                                <th>
                                                    <Link to={`/purchase-order?s=${item?.quotation?.purchaseOrder_no}`} className='hover:underline text-primary' >
                                                        {item?.quotation?.purchaseOrder_no}
                                                    </Link>
                                                </th>
                                                <th>
                                                    <div
                                                        className="flex items-center justify-center w-1/4"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="dropdown">
                                                            <Dropdown
                                                                placement="bottom-end"
                                                                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black hover:text-primary"
                                                                button={
                                                                    <IconHorizontalDots className="w-6 h-6 rotate-90 opacity-70" />
                                                                }
                                                            >
                                                                <ul className="!min-w-[170px]">
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => approveQ(item?.quotation?.id)}
                                                                            className='text-success hover:!bg-success hover:!text-white'
                                                                        >
                                                                            Approve & Send PO
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => rejectQ(item?.quotation?.id)}
                                                                            className='text-danger hover:!bg-danger hover:!text-white'
                                                                        >
                                                                            Reject Quotation
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th>
                                                    {isEmpty ? <></> :
                                                        <div className={`${active === `${item.id}` ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    }
                                                </th>
                                            </tr>
                                        </thead> */}

                                        <thead>
                                            <tr
                                                className={`py-1 w-full flex items-center justify-between ${active === `${item.id}` ? '!text-primary' : ''
                                                    }`}
                                            >
                                                {/* 1️⃣ Name */}
                                                <th className="w-[20%] text-start">
                                                    {item?.nodeDetails?.name}
                                                </th>

                                                {/* 2️⃣ Location */}
                                                <th className="w-[10%] text-start break-words !px-0">
                                                    {item?.nodeDetails?.location}
                                                </th>

                                                {/* 3️⃣ Status */}
                                                <th className="w-[10%] text-center !px-0 truncate">
                                                    <div>
                                                        <span className={`badge  ${statusColor(item?.status)}`}>{item?.status?.toUpperCase()}</span>
                                                    </div>
                                                </th>

                                                {/* 4️⃣ Amounts */}
                                                <th className="w-[25%] text-start break-words">
                                                    {currencyFormatter(requisition.grandTotal)} ||{" "}
                                                    {currencyFormatter(item?.quotation?.grandTotal) ?? "XXXXX"}
                                                </th>

                                                {/* 5️⃣ PO No */}
                                                <th className="w-[15%] text-center !px-0">
                                                    <Link
                                                        to={`/purchase-order?s=${item?.quotation?.purchaseOrder_no}`}
                                                        className="hover:underline text-primary"
                                                    >
                                                        {item?.quotation?.purchaseOrder_no}
                                                    </Link>
                                                </th>

                                                {/* 6️⃣ Actions */}
                                                <th className="w-[10%] flex justify-center !px-0">
                                                    {
                                                        !isAccepted &&
                                                        <div
                                                            className="dropdown"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Dropdown
                                                                placement="bottom-end"
                                                                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black hover:text-primary"
                                                                button={<IconHorizontalDots className="w-6 h-6 rotate-90 opacity-70" />}
                                                            >
                                                                <ul className="!min-w-[170px]">
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => approveQ(item?.quotation?.id)}
                                                                            className="text-success hover:!bg-success hover:!text-white"
                                                                        >
                                                                            Approve & Send PO
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => rejectQ(item?.quotation?.id)}
                                                                            className="text-danger hover:!bg-danger hover:!text-white"
                                                                        >
                                                                            Reject Quotation
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </Dropdown>
                                                        </div>
                                                    }
                                                    {/* </th> */}

                                                    {/* 7️⃣ Expand icon */}
                                                    {/* <th className="w-[5%] flex justify-center"> */}
                                                    {!isEmpty && (
                                                        <div className={`${active === `${item.id}` ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>

                                    </table>
                                </div>

                                {/* table view */}
                                <AnimateHeight duration={300} height={active === `${item.id}` ? 'auto' : 0}>
                                    <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3]">
                                        <TableBody
                                            isEmpty={isEmpty}
                                            columns={QUOTATION_RECEIVE_COLUMN}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            limit={limit}
                                            setLimit={setLimit}
                                            totalPage={item?.quotation?.meta?.totalPages}
                                        >
                                            {item?.quotation?.item?.map((product, j) => {
                                                // console.log(product);
                                                return (
                                                    <TableRow
                                                        key={j}
                                                        columns={QUOTATION_RECEIVE_COLUMN}
                                                        row={{
                                                            barcode: product?.sourceRequisitionItem?.product?.barcode,
                                                            product: product?.sourceRequisitionItem?.product?.name,
                                                            brand: product?.sourceRequisitionItem?.brand,
                                                            category: product?.sourceRequisitionItem?.category,
                                                            subCategory: product?.sourceRequisitionItem?.sub_category,
                                                            qty: product?.sourceRequisitionItem?.qty,
                                                            priceLimit: product?.sourceRequisitionItem?.priceLimit,
                                                            offerPrice: product?.offer_price,
                                                            tax: product?.tax_percent,
                                                            total: product?.total_price,
                                                        }}
                                                    />
                                                )
                                            })}
                                        </TableBody>
                                    </div>
                                </AnimateHeight>
                            </div>
                        )
                    })
                }
            </div >
        </div >
    )
}

export default ReceiveQuotation