import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link, useSearchParams } from 'react-router-dom'
import Accordian from '../../components/Accordian'
import TableHeader from '../../components/table/TableHeader'
import { QUOTATION_RECEIVE_COLUMN, QUOTATION_RECEIVE_RAW_COLUMN } from '../../utils/helper'
import TableRow from '../../components/table/TableRow'
import ComponentHeader from '../../components/ComponentHeader'
import AnimateHeight from 'react-animate-height'
import IconCaretDown from '../../components/Icon/IconCaretDown'
import TableBody from '../../components/table/TableBody'
import Dropdown from '../../components/Dropdown'
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots'
import masterData from '../../Backend/master.backend'
import { currencyFormatter } from '../../utils/currencyFormatter'
import { quotation } from '../../Backend/quotation.fetch'
import { useSelector } from 'react-redux'
import { rfqQuotation } from '../../Backend/rfqQuotation.fetch'
import AddModal from '../../components/Add.modal'
import BlanketPOPreview from '../../components/blanketPO/BlanketPO.preview'
import { inputAlert } from '../../utils/alerts'


const headerLink = [
    { title: "quotation", link: "/quotation" },
    { title: "receive-quotation" },
]

const ReceiveQuotation = () => {
    const user = useSelector(state => state.auth.userData);
    const [searchParams] = useSearchParams();


    /**************** global variable *******************/
    const isManufacture = user?.activeNode?.NodeUser?.department !== null ? true : false;
    const reqNo = searchParams.get("s") ?? "";

    const [previewData, setPreviewData] = useState(null);
    const [isShowPreview, setIsShowPreviewsShow] = useState(false);


    /**************** APT mutation *******************/
    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["receiveQuotationList"]);
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["receiveQuotationList"]);


    /**************** pagination and search utilities *******************/
    const [debounceSearch, setDebounceSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    /**************** revision & vendor *******************/
    const [vendor, setVendor] = useState(null);
    const [revNo, setRevNo] = useState(null);


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
        ...(vendor && { targetVendor: vendor }),
        ...(revNo && { targetRevision: revNo }),
        page: currentPage,
        limit: limit,
    };
    const { data, isLoading } = quotation.TQReceiveQuotationList(params, !isManufacture);
    const { data: rfqQuotationData, isLoading: rfqQuotationLoading } = rfqQuotation.TQRfqQuotationReceiveList(params, isManufacture);



    /** status color change helper */
    const statusColor = (status) => {
        if (isManufacture) {
            switch (status) {
                case "sent": return "bg-secondary";
                case "negotiate": return "bg-primary";
                case "confirmed": return "bg-success";
                case "closed": return "bg-success";
                default: return "bg-warning";
            }
        } else {
            switch (status) {
                case "pending": return "bg-secondary";
                case "quoted": return "bg-success";
                case "rejected": return "bg-danger";
                default: return "bg-warning";
            }
        }
    }



    async function approveQ(data) {
        setPreviewData(data);
        setIsShowPreviewsShow(true);
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

    async function negotiate(id) {
        // console.log(id);

        await inputAlert("Enter remarks(optional)").then(async (res) => {
            if (res.isConfirmed) {
                const remarks = res.value;
                try {
                    await updateData({ path: "/rfq/quotation/negotiate", formData: { id, remarks } });

                } catch (error) {
                    console.log(error);
                };
            }
        });
    };

    function changeRevision(vendor, revNo) {
        setVendor(vendor);
        setRevNo(revNo);
    }

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
                    rfqQuotationData?.data?.map((item, idx) => {
                        // console.log(item)
                        return (
                            <div
                                className="border border-[#d3d3d3] rounded"
                                key={idx}
                            >
                                {/* supplier listing */}
                                <div
                                    className={`flex items-center justify-between 'cursor-pointer`}
                                    onClick={() => togglePara(item)}
                                >
                                    <table>
                                        <thead>
                                            <tr
                                                className={`py-1 w-full flex items-center justify-between cursor-pointer ${active === `${item.id}` ? '!text-primary' : ''
                                                    }`}
                                            >
                                                {/* 1️⃣ Name */}
                                                <th className="min-w-[15%] w-full text-start">
                                                    {/* {item?.nodeDetails?.name} */}
                                                    {item?.vendorTenant?.tenantDetails?.companyName}
                                                </th>

                                                {/* 2️⃣ Location */}
                                                {/* <th className="w-[10%] text-start break-words !px-0">
                                                    {item?.nodeDetails?.location}
                                                </th> */}

                                                {/* 3️⃣ Status */}
                                                <th className="min-w-[10%] w-full !px-0 truncate">
                                                    <div>
                                                        <span className={`badge ${statusColor(item?.activeRevision?.status)}`}>{item?.activeRevision?.status === "sent" ? "QUOTED" : item?.activeRevision?.status?.toUpperCase()}</span>
                                                    </div>
                                                </th>

                                                {/* 2️⃣ Revision */}
                                                <th className="min-w-[15%] w-full text-start break-words !px-0 flex items-center">
                                                    <label htmlFor="" className='mb-0'>Revision:</label>
                                                    <select
                                                        className="bg-white border rounded-md px-1 py-1 cursor-pointer ml-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                        value={
                                                            item?.vendor_tenant === vendor
                                                                ? revNo
                                                                : item?.current_revision_no
                                                        }
                                                        onChange={(e) =>
                                                            changeRevision(item?.vendor_tenant, Number(e.target.value))
                                                        }
                                                    >
                                                        {[...Array(item?.current_revision_no).keys()].map((idx) => (
                                                            <option key={idx} value={idx + 1}>
                                                                {idx + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </th>

                                                {/* 4️⃣ Amounts */}
                                                <th className="min-w-[30%] w-full text-start break-words text-sm !px-0 !pl-1">
                                                    {currencyFormatter(item?.requisition?.grand_total)}{" || "}
                                                    {currencyFormatter(item?.activeRevision?.grand_total) ?? "XXXXX"}
                                                </th>

                                                {/* 5️⃣ PO No */}
                                                <th className="min-w-[10%] text-start break-words !px-0">
                                                    <Link
                                                        to={`/purchase-order/${item?.quotation?.purchaseOrder_no}`}
                                                        className="hover:underline text-primary"
                                                    >
                                                        {item?.quotation?.purchaseOrder_no}
                                                    </Link>
                                                </th>

                                                {/* 6️⃣ Actions */}
                                                <th className="w-[5%] flex justify-center !px-0 mr-2">
                                                    {item?.status === null &&
                                                        <div
                                                            className="dropdown"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Dropdown
                                                                placement="bottom-end"
                                                                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black hover:text-primary"
                                                                button={<IconHorizontalDots className="w-6 h-6 rotate-90 opacity-70" />}
                                                            >
                                                                <ul className="!min-w-[180px]">
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => approveQ(item)}
                                                                            className="text-left hover:!bg-green-100 hover:!text-green-500"
                                                                        >
                                                                            Lock & Confirm
                                                                        </button>
                                                                    </li>
                                                                    {item?.current_revision_no <= 3 && <>
                                                                        <li>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => negotiate(item?.id)}
                                                                            >
                                                                                Negotiate
                                                                            </button>
                                                                        </li>
                                                                    </>}
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => rejectQ(item?.quotation?.id)}
                                                                            className="hover:!bg-red-100 hover:!text-red-500"
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </Dropdown>
                                                        </div>
                                                    }

                                                    {/* </th> */}
                                                    {/* 7️⃣ Expand icon */}
                                                    {/* <th className="w-[5%] flex justify-center"> */}
                                                    <div className={`${active === `${item.id}` ? 'rotate-180' : ''}`}>
                                                        <IconCaretDown className='w-6 h-6' />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>

                                    </table>
                                </div>

                                {/* table view */}
                                <AnimateHeight duration={300} height={active === `${item.id}` ? 'auto' : 0}>
                                    <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3]">
                                        <TableBody
                                            isEmpty={false}
                                            columns={QUOTATION_RECEIVE_RAW_COLUMN}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            limit={limit}
                                            setLimit={setLimit}
                                            totalPage={item?.pagination?.totalPages}
                                        >
                                            {item?.quotationItems?.map((product, j) => {
                                                // console.log(product);
                                                const line_total = Number(product?.qty) * Number(product?.offer_price)
                                                return (
                                                    <TableRow
                                                        key={j}
                                                        columns={QUOTATION_RECEIVE_RAW_COLUMN}
                                                        row={{
                                                            name: product?.sourceRfqItem?.product_name,
                                                            uom: product?.sourceRfqItem?.uom,
                                                            qty: product?.qty,
                                                            priceLimit: currencyFormatter(product?.sourceRfqItem?.price_limit),
                                                            offerPrice: currencyFormatter(product?.offer_price),
                                                            total: currencyFormatter(line_total),
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

            <AddModal
                isShow={isShowPreview}
                setIsShow={setIsShowPreviewsShow}
                title="Preview & Send BlanketPO"
                placement='start'
            >
                <BlanketPOPreview
                    data={previewData}
                    setIsShowPreviewsShow={setIsShowPreviewsShow}
                />
            </AddModal>


        </div >
    )
}

export default ReceiveQuotation


// const suppliers = data?.data?.suppliers;
// const requisition = data?.data?.requisition;
// const isAccepted = suppliers?.some(item => item.status === "rejected");
// {
//     suppliers?.map((item, idx) => {
//         const isEmpty = item?.quotation === null ? true : false;

//         return (
//             <div
//                 className={`border border-[#d3d3d3] rounded `}
//                 key={idx}
//             >
//                 {/* supplier listing */}
//                 <div
//                     className={`flex items-center justify-between ${isEmpty ? '' : 'cursor-pointer'}`}
//                     onClick={() => !isEmpty ? togglePara(item) : null}
//                 >
//                     <table>
//                         <thead>
//                             <tr
//                                 className={`py-1 w-full flex items-center justify-between ${active === `${item.id}` ? '!text-primary' : ''
//                                     }`}
//                             >
//                                 {/* 1️⃣ Name */}
//                                 <th className="w-[20%] text-start">
//                                     {item?.nodeDetails?.name}
//                                 </th>

//                                 {/* 2️⃣ Location */}
//                                 <th className="w-[10%] text-start break-words !px-0">
//                                     {item?.nodeDetails?.location}
//                                 </th>

//                                 {/* 3️⃣ Status */}
//                                 <th className="w-[10%] text-center !px-0 truncate">
//                                     <div>
//                                         <span className={`badge  ${statusColor(item?.status)}`}>{item?.status?.toUpperCase()}</span>
//                                     </div>
//                                 </th>

//                                 {/* 4️⃣ Amounts */}
//                                 <th className="w-[20%] text-start break-words">
//                                     {currencyFormatter(requisition.grandTotal)}{" || "}
//                                     {currencyFormatter(item?.quotation?.grandTotal) ?? "XXXXX"}
//                                 </th>

//                                 {/* 5️⃣ PO No */}
//                                 <th className="w-[15%] text-start break-words !px-0">
//                                     <Link
//                                         to={`/purchase-order/${item?.quotation?.purchaseOrder_no}`}
//                                         className="hover:underline text-primary"
//                                     >
//                                         {item?.quotation?.purchaseOrder_no}
//                                     </Link>
//                                 </th>

//                                 {/* 6️⃣ Actions */}
//                                 <th className="w-[10%] flex justify-center !px-0">
//                                     {
//                                         !isAccepted &&
//                                         <div
//                                             className="dropdown"
//                                             onClick={(e) => e.stopPropagation()}
//                                         >
//                                             <Dropdown
//                                                 placement="bottom-end"
//                                                 btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black hover:text-primary"
//                                                 button={<IconHorizontalDots className="w-6 h-6 rotate-90 opacity-70" />}
//                                             >
//                                                 <ul className="!min-w-[170px]">
//                                                     <li>
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => approveQ(item?.quotation?.id)}
//                                                             className="text-success hover:!bg-success hover:!text-white"
//                                                         >
//                                                             Approve & Send PO
//                                                         </button>
//                                                     </li>
//                                                     <li>
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => rejectQ(item?.quotation?.id)}
//                                                             className="text-danger hover:!bg-danger hover:!text-white"
//                                                         >
//                                                             Reject Quotation
//                                                         </button>
//                                                     </li>
//                                                 </ul>
//                                             </Dropdown>
//                                         </div>
//                                     }
//                                     {/* </th> */}

//                                     {/* 7️⃣ Expand icon */}
//                                     {/* <th className="w-[5%] flex justify-center"> */}
//                                     {!isEmpty && (
//                                         <div className={`${active === `${item.id}` ? 'rotate-180' : ''}`}>
//                                             <IconCaretDown className='w-6 h-6' />
//                                         </div>
//                                     )}
//                                 </th>
//                             </tr>
//                         </thead>

//                     </table>
//                 </div>

//                 {/* table view */}
//                 <AnimateHeight duration={300} height={active === `${item.id}` ? 'auto' : 0}>
//                     <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3]">
//                         <TableBody
//                             isEmpty={isEmpty}
//                             columns={QUOTATION_RECEIVE_COLUMN}
//                             currentPage={currentPage}
//                             setCurrentPage={setCurrentPage}
//                             limit={limit}
//                             setLimit={setLimit}
//                             totalPage={item?.quotation?.meta?.totalPages}
//                         >
//                             {item?.quotation?.item?.map((product, j) => {
//                                 // console.log(product);
//                                 return (
//                                     <TableRow
//                                         key={j}
//                                         columns={QUOTATION_RECEIVE_COLUMN}
//                                         row={{
//                                             barcode: product?.sourceRequisitionItem?.product?.barcode,
//                                             product: product?.sourceRequisitionItem?.product?.name,
//                                             brand: product?.sourceRequisitionItem?.brand,
//                                             category: product?.sourceRequisitionItem?.category,
//                                             subCategory: product?.sourceRequisitionItem?.sub_category,
//                                             qty: product?.sourceRequisitionItem?.qty,
//                                             priceLimit: product?.sourceRequisitionItem?.priceLimit,
//                                             offerPrice: product?.offer_price,
//                                             tax: product?.tax_percent,
//                                             total: product?.total_price,
//                                         }}
//                                     />
//                                 )
//                             })}
//                         </TableBody>
//                     </div>
//                 </AnimateHeight>
//             </div>
//         )
//     })
// }