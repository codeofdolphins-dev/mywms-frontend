import React, { useState } from 'react'
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
import { QUOTATION_COLUMN, QUOTATION_RECEIVE_COLUMN } from '../../utils/helper';
import ComponentHeader from '../../components/ComponentHeader';
import fetchData from '../../Backend/fetchData.backend';
import TableBody from '../../components/table/TableBody';
import { utcToLocal } from '../../utils/UTCtoLocal';
import AddModal from '../../components/Add.modal';


const headerLink = [
    { title: "quotation" },
];


const Quotation = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [itemDetails, setItemDetails] = useState([]);
    const [isShowPreview, setIsShowPreview] = useState(false);

    const { data: quotationList, loading } = fetchData.TQQuotationList();
    const isEmpty = quotationList?.data?.length < 1;


    function handelEdit(id) {
        console.log(id)
    }
    async function handleDelete(id) {
        console.log(id)
    }
    function handelShow(items) {
        setIsShowPreview(true)
        setItemDetails(items)
    }

    return (
        <div>
            {/*header section */}
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                searchPlaceholder=''
                setDebounceSearch={setDebounceSearch}
            />

            {/* table */}
            <div className={`panel mt-5 z-0 ${isEmpty ? "min-h-64" : ""} relative`}>
                <TableBody
                    columns={QUOTATION_COLUMN}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={quotationList?.meta?.totalPages || 1}
                    isEmpty={isEmpty}
                >
                    {
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
                    }
                </TableBody>
            </div>

            {/* preview panel */}
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

        </div >
    )
}

export default Quotation