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
import masterData from '../../Backend/master.backend';
import { confirmation } from '../../utils/alerts';


const headerLink = [
    { title: "quotation" },
];


const Quotation = () => {
    const navigate = useNavigate();

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["rfqQuotationList"]);

    const [dataWrapper, setDataWrapper] = useState({});

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const [activeTab, setActiveTab] = useState(1);

    const [selectedRevision, setSelectedRevision] = useState({});

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
        try {
            if (activeTab === 1) { }
            else {
                const res = await confirmation();
                if (!res) return;

                await deleteData({ path: `rfq/quotation/delete/${id}` });
            }
        } catch (error) {
            console.warn(error);
        }
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


    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "sent": return "bg-primary";
            case "negotiate": return "bg-warning";
            case "confirmed": return "bg-success";
            case "closed": return "bg-success";
            default: return "bg-danger";
        }
    }

    const handleRevisionChange = (itemId, value) => {
        setSelectedRevision(prev => ({
            ...prev,
            [itemId]: Number(value)
        }));
    };



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
                        rfqQuotationList?.data?.map((item) => {

                            const revisions = item?.quotationRevision || [];
                            const revisionCount = revisions.length;

                            const selectedRevisionNo =
                                selectedRevision[item.id] ??
                                (item?.current_revision_no ? item.current_revision_no - 1 : 0);

                            const selectedData = revisions[selectedRevisionNo] || {};

                            return (
                                <TableRow
                                    key={item.id}
                                    columns={EXTERNAL_QUOTATION_COLUMN}
                                    row={{
                                        qno: item?.linkedRfq?.rfq_no,
                                        name: item?.buyer_name,

                                        status: (
                                            <span className={`badge ${statusColor(selectedData?.status)}`}>
                                                {selectedData?.status?.toUpperCase()}
                                            </span>
                                        ),

                                        grandTotal: currencyFormatter(selectedData?.grand_total),

                                        validity: utcToLocal(item?.valid_till),

                                        revision: (
                                            <select
                                                className="bg-white border px-3 py-1 cursor-pointer"
                                                value={selectedRevisionNo}
                                                onChange={(e) =>
                                                    handleRevisionChange(item.id, e.target.value)
                                                }
                                            >
                                                {[...Array(revisionCount).keys()].map((idx) => (
                                                    <option key={idx} value={idx}>
                                                        {idx + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        ),

                                        action: (
                                            <div className="flex items-center justify-center space-x-3">
                                                <CustomeButton
                                                    onClick={() =>
                                                        activeTab == 1
                                                            ? handelShow(item)
                                                            : handelShow(item, selectedRevisionNo)
                                                    }
                                                >
                                                    <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                                </CustomeButton>

                                                <CustomeButton onClick={() => handleDelete(item.id)}>
                                                    <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                                </CustomeButton>
                                            </div>
                                        )
                                    }}
                                />
                            );
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
                title="RFQ Note Preview & Update"
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