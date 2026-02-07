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


const headerLink = [
    { title: "requisition", link: "/requisition" },
    { title: "receive-quotation" },
]

const ReceiveQuotation = () => {
    const [searchParams] = useSearchParams();
    const reqNo = searchParams.get("s") ?? "";
    const [debounceSearch, setDebounceSearch] = useState(reqNo);
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

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["receiveQuotationList"]);

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-secondary";
            case "quoted": return "bg-success";
            case "rejected": return "bg-danger";
            default: return "bg-warning";
        }
    }


    async function approveQ(item) {
        try {
            await createData({ path: "/purchase-order/create", formData: { quotationId: item } });
        } catch (error) {
            console.log(error)
        }
    };
    function rejectQ(item) { };

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
                                        <thead>
                                            <tr className={`py-1 w-full flex items-center justify-between ${(active === `${item.id}`) ? '!text-primary' : ''}`}>
                                                <th>{item?.nodeDetails?.name}</th>
                                                <th>{item?.nodeDetails?.location}</th>
                                                <th>
                                                    <div className={`badge ${statusColor(item?.status)}`}>
                                                        {item?.status?.toUpperCase()}
                                                    </div>
                                                </th>
                                                <th> {requisition.grandTotal} || {item?.quotation?.grandTotal ?? "XXXXX"}</th>
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
                                                                        >
                                                                            Approve & Send PO
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => rejectQ(item?.quotation?.id)}
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
                                        </thead>
                                    </table>
                                </div>

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
                                                return (
                                                    <TableRow
                                                        key={j}
                                                        columns={QUOTATION_RECEIVE_COLUMN}
                                                        row={{
                                                            barcode: product?.sourceRequisitionItem?.product?.barcode,
                                                            product: product?.sourceRequisitionItem?.product?.name,
                                                            brand: product?.sourceRequisitionItem?.brand?.name,
                                                            category: product?.sourceRequisitionItem?.category?.name,
                                                            subCategory: product?.sourceRequisitionItem?.subCategory?.name,
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