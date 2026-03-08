import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link, useNavigate } from 'react-router-dom';
import BasicPagination from '../../components/BasicPagination';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPencil from '../../components/Icon/IconPencil';
import TableRow from '../../components/table/TableRow';
import TableHeader from '../../components/table/TableHeader';
import CustomeButton from '../../components/inputs/Button'
import { EXTERNAL_QUOTATION_COLUMN, QUOTATION_COLUMN, QUOTATION_RECEIVE_COLUMN } from '../../utils/helper';
import ComponentHeader from '../../components/ComponentHeader';
import fetchData from '../../Backend/fetchData.backend';
import TableBody from '../../components/table/TableBody';
import { utcToLocal } from '../../utils/UTCtoLocal';
import AddModal from '../../components/Add.modal';
import { quotation } from '../../Backend/quotation.fetch';
import { rfqQuotation } from '../../Backend/rfqQuotation.fetch';
import RFQPreview from '../../components/dashboard/RFQPreview';
import { currencyFormatter } from '../../utils/currencyFormatter';


const headerLink = [
    { title: "quotation" },
];


const Quotation = () => {
    const navigate = useNavigate();

    const [dataWrapper, setDataWrapper] = useState({});

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const [activeTab, setActiveTab] = useState(1);

    const [itemDetails, setItemDetails] = useState([]);
    const [isShowPreview, setIsShowPreview] = useState(false);

    const [EXitemDetails, setEXItemDetails] = useState([]);
    const [isShowPreviewEX, setIsShowPreviewEX] = useState(false);

    const params = {
        page: currentPage,
        limit,
        ...(debounceSearch && { quotation_no: debounceSearch })
    }
    const { data: quotationList, loading: quotationLoading } = quotation.TQQuotationList(params, activeTab === 1 ? true : false);

    const { data: rfqQuotationList, loading: rfqQuotationLoading } = rfqQuotation.TQRfqQuotationList(params, activeTab === 2 ? true : false);

    const isEmpty = quotationList?.success
        ? quotationList?.data?.length < 1
        : rfqQuotationList?.success
            ? rfqQuotationList?.data?.length < 1
            : true;


    // console.log(rfqQuotationList);



    function handelEdit(id) {
        console.log(id)
    }
    async function handleDelete(id) {
        console.log(id)
    }
    function handelShow(items, idx = 0) {
        if (activeTab === 1) {
            setIsShowPreview(true);
            setItemDetails(items);
        } else {
            setIsShowPreviewEX(true);
            setEXItemDetails({
                ...items,
                quotationRevision: items?.quotationRevision?.[idx]
            });
        }
    }


    return (
        <div>
            {/*header section */}
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                searchPlaceholder={activeTab === 1 ? 'search by quotation no' : "search by RFQ no"}
                setDebounceSearch={setDebounceSearch}
            />

            {/* wizards */}
            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    <li>
                        <div
                            className={`
                                ${activeTab === 1 ? '!bg-primary text-white' : ''}
                                block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-36 cursor-pointer
                            `}
                            onClick={() => setActiveTab(1)}
                        >
                            <p className='-mb-1'>Internal</p>
                        </div>
                    </li>

                    <li>
                        <div className={`
                                ${activeTab === 2 ? '!bg-primary text-white' : ''} 
                                block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-36 cursor-pointer
                            `}
                            onClick={() => setActiveTab(2)}
                        >
                            <p className='-mb-1'>External</p>
                        </div>
                    </li>
                </ul>
            </div>

            {/* table */}
            <div className={`panel z-0 ${isEmpty ? "min-h-64" : ""} relative`}>
                <TableBody
                    columns={activeTab === 1 ? QUOTATION_COLUMN : EXTERNAL_QUOTATION_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={
                        activeTab === 1
                            ? quotationList?.meta?.totalPages || 1
                            : rfqQuotationList?.meta?.totalPages || 1
                    }
                    isEmpty={isEmpty}
                >
                    {activeTab === 1 ? (
                        quotationList?.data?.map((item, idx) => (
                            <TableRow
                                key={item.id}
                                columns={QUOTATION_COLUMN}
                                row={{
                                    qno: item?.quotation_no,
                                    name: item?.toBusinessNode?.nodeDetails?.name,
                                    status: item?.status,
                                    notes: item?.notes,
                                    grandTotal: item?.grandTotal,
                                    validity: utcToLocal(item?.valid_till),
                                    action: (
                                        <div className='flex items-center justify-center space-x-3'>
                                            {/* <CustomeButton
                                                onClick={() => handelEdit(item.id)}
                                            >
                                                <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                            </CustomeButton> */}

                                            {/* <CustomeButton
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                                </CustomeButton> */}

                                            <CustomeButton
                                                onClick={() => handelShow(item.quotationItem)}
                                            >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        ))
                    ) : (
                        rfqQuotationList?.data?.map((item, idx) => {

                            const current_revision_no = isNaN(Number(item?.current_revision_no)) ? 0 : item?.current_revision_no;

                            let selectedRevisionNo = 0;

                            return <TableRow
                                key={item.id}
                                columns={EXTERNAL_QUOTATION_COLUMN}
                                row={{
                                    qno: item?.linkedRfq?.rfq_no,
                                    name: item?.buyer_name,
                                    status: item?.quotationRevision?.[selectedRevisionNo]?.status,
                                    grandTotal: currencyFormatter(item?.quotationRevision?.[selectedRevisionNo]?.grand_total),
                                    validity: utcToLocal(item?.valid_till),
                                    revision: (
                                        <>
                                            <select
                                                name=""
                                                id=""
                                                className='bg-white border px-3 py-1 cursor-pointer'
                                                onChange={(e) => { selectedRevisionNo = e.target.value }}
                                            >
                                                {
                                                    [...Array(current_revision_no).keys()].map(idx =>
                                                        <option
                                                            key={idx}
                                                            value={idx}
                                                        >
                                                            {idx + 1}
                                                        </option>
                                                    )
                                                }
                                            </select>
                                        </>
                                    ),
                                    action: (
                                        <div className='flex items-center justify-center space-x-3'>
                                            <CustomeButton
                                                onClick={() => activeTab == 1 ? handelShow(item) : handelShow(item, selectedRevisionNo)}
                                            >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                            <CustomeButton
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        })
                    )}
                </TableBody>
            </div>

            {/* internal quotation preview panel */}
            <AddModal
                isShow={isShowPreview}
                setIsShow={setIsShowPreview}
                title={"Quotation Preview"}
                maxWidth='95'
            >
                <div className="panel">
                    <TableBody
                        isEmpty={isEmpty}
                        columns={QUOTATION_RECEIVE_COLUMN}
                        showPagination={false}
                    >
                        {itemDetails?.map((item, j) => {
                            const barcode = item?.sourceRequisitionItem?.product?.barcode;
                            const product = item?.sourceRequisitionItem?.product?.name;
                            const brand = item?.sourceRequisitionItem?.brand;
                            const category = item?.sourceRequisitionItem?.category;
                            const sub_category = item?.sourceRequisitionItem?.sub_category;
                            const qty = item?.sourceRequisitionItem?.qty;
                            const priceLimit = item?.sourceRequisitionItem?.priceLimit;

                            const offerPrice = item?.offer_price;
                            const tax = item?.tax_percent;
                            const total = item?.total_price;

                            return (
                                <TableRow
                                    key={j}
                                    columns={QUOTATION_RECEIVE_COLUMN}
                                    row={{
                                        barcode: barcode,
                                        product: product,
                                        brand: brand,
                                        category: category,
                                        subCategory: sub_category,
                                        qty: qty,
                                        priceLimit: priceLimit,

                                        offerPrice: offerPrice,
                                        tax: tax,
                                        total: total
                                    }}
                                />
                            )
                        })}
                    </TableBody>
                </div>
            </AddModal>

            {/* external quotation preview panel */}
            <AddModal
                title="RFQ Note Preview"
                placement='start'
                isShow={isShowPreviewEX}
                setIsShow={setIsShowPreviewEX}
            >
                <RFQPreview
                    details={EXitemDetails}
                    setIsShowPreviewEX={setIsShowPreviewEX}
                />
            </AddModal>
        </div >
    )
}

export default Quotation