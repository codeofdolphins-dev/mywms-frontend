import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { REQUISITION_CREATE_COLUMN_ACTION, REQUISITION_RECEIVE_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import CustomeButton from "../../components/inputs/Button";
import AddModal from '../../components/Add.modal';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import fetchData from '../../Backend/fetchData.backend';
import IconPencil from '../../components/Icon/IconPencil';
import QuotationForm from '../../components/quotation/QuotationForm';


const headerLink = [
    { title: "quotation", link: "/quotation" },
    { title: "received-requisition" },
];

const ReceiveRequision = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);


    const [itemDetails, setItemDetails] = useState([]);
    const [editItem, setEditItem] = useState([]);
    const [quoteItem, setQuoteItem] = useState([]);


    const [isShowDetails, setIsShowDetails] = useState(false);
    const [isShowEditDetails, setIsShowEditDetails] = useState(false);

    const { data: receiveRequisitionList, isLoading: receiveRequisitionListLoading } = fetchData.TQRequisitionReceiveList();

    const isEmpty = !receiveRequisitionList?.data || receiveRequisitionList?.data?.length < 1;


    function handelShowDetails(data) {
        setItemDetails(data)
        setIsShowDetails(true);
    };

    function handleEdit(item) {
        setIsShowEditDetails(true);

        setEditItem(item);
    };

    function handelShow(id) {
        // console.log(id);
        setEditId(id);
        setIsShowEditDetails(true);
    };
// console.log(quoteItem);

    useEffect(() => {
        setEditId(null);
    }, [isShowEditDetails]);

    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by sender name...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
            />

            <div className={`panel mt-5 ${isEmpty ? "min-h-64" : ""} relative`}>
                <div className="overflow-x-auto">
                    <TableHeader columns={REQUISITION_RECEIVE_COLUMN} />
                    <TableBody
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={1}
                        isEmpty={isEmpty}
                    >
                        {receiveRequisitionList?.data?.map((item, idx) => (
                            <TableRow
                                key={idx}
                                columns={REQUISITION_RECEIVE_COLUMN}
                                onClick={() => navigate(`${item.requisition_no}`)}
                                row={{
                                    id: item?.requisition_no,
                                    title: item?.title,
                                    sender: item?.buyer?.nodeDetails?.name,
                                    priority: item?.priority,
                                    itemsCount: item?.items?.length,
                                    action: (
                                        <div className='flex items-center'>
                                            <CustomeButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handelShowDetails(item?.items);
                                                }}
                                                className={"self-center"}
                                            >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        ))}
                    </TableBody>
                </div>
            </div>

            <AddModal
                isShow={isShowDetails}
                setIsShow={setIsShowDetails}
                title={"Item Details"}
            >
                <div className="panel space-y-5">
                    <div className="overflow-x-auto">
                        <TableHeader columns={REQUISITION_CREATE_COLUMN_ACTION} />
                        {
                            itemDetails?.map((item, idx) => (
                                <TableRow
                                    key={item?.id}
                                    columns={REQUISITION_CREATE_COLUMN_ACTION}
                                    row={{
                                        barcode: item?.product?.barcode,
                                        product: item?.product?.name,
                                        brand: item?.brand?.name,
                                        category: item?.category?.name,
                                        subCategory: item?.subCategory?.name,
                                        packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                                        reqQty: item?.qty,
                                        priceLimit: item?.priceLimit,
                                        action: (
                                            <div className='flex items-center justify-center space-x-3'>
                                                <CustomeButton
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <IconPencil className="text-danger hover:scale-110 cursor-pointer" />
                                                </CustomeButton>

                                                <CustomeButton
                                                    onClick={() => handelShow(item.id)}
                                                >
                                                    <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                                </CustomeButton>
                                            </div>
                                        )
                                    }}
                                />
                            ))
                        }
                    </div>

                    <button className='btn btn-info ml-auto' >submit</button>
                </div>
            </AddModal>

            <AddModal
                isShow={isShowEditDetails}
                setIsShow={setIsShowEditDetails}
                title={"Edit Item"}
                maxWidth='75'
                blur={false}
            >
                <QuotationForm
                    editId={editId}
                    editItem={editItem}
                    setIsShowEditDetails={setIsShowEditDetails}
                    quoteItem={quoteItem}
                    setQuoteItem={setQuoteItem}
                />
            </AddModal>
        </div >
    )
}

export default ReceiveRequision