import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { REQUISITION_CREATE_COLUMN, REQUISITION_RECEIVE_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import CustomeButton from "../../components/inputs/Button";
import AddModal from '../../components/Add.modal';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import fetchData from '../../Backend/fetchData.backend';


const headerLink = [
    { title: "quotation", link: "/quotation" },
    { title: "receive-requisition" },
];

const ReceiveRequision = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const [itemDetails, setItemDetails] = useState([]);
    const [isShow, setIsShow] = useState(false);

    const { data: receiveRequisitionList, isLoading: receiveRequisitionListLoading } = fetchData.TQRequisitionReceiveList();

    const isEmpty = !receiveRequisitionList?.data || receiveRequisitionList?.data?.length < 1;

    function handelShow(data) {
        setItemDetails(data)
        setIsShow(true);
    }

    useEffect(() => {
        if (!isShow) {
            setItemDetails([]);
        }
    }, [isShow]);

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
                        {
                            receiveRequisitionList?.data?.map((item, idx) => (
                                <TableRow
                                    key={idx}
                                    columns={REQUISITION_RECEIVE_COLUMN}
                                    onClick={() => navigate(`/requisition/receive/${item.requisition_no}`)}
                                    row={{
                                        id: item?.id,
                                        title: item?.title,
                                        sender: item?.buyer?.nodeDetails?.name,
                                        priority: item?.priority,
                                        itemsCount: item?.items?.length,
                                        action: (
                                            <div className='flex space-x-3'>
                                                <CustomeButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handelShow(item?.items);
                                                    }}
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
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Item Details"}
            >
                <div className="panel">
                    <div className="overflow-x-auto">
                        <TableHeader columns={REQUISITION_CREATE_COLUMN} />
                        {
                            itemDetails?.map((item, idx) => (
                                <TableRow
                                    key={item?.id}
                                    columns={REQUISITION_CREATE_COLUMN}
                                    row={{
                                        barcode: item?.product?.barcode,
                                        product: item?.product?.name,
                                        brand: item?.brand?.name,
                                        category: item?.category?.name,
                                        subCategory: item?.subCategory?.name,
                                        packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                                        reqQty: item?.qty,
                                    }}
                                />
                            ))
                        }
                    </div>
                </div>
            </AddModal>
        </div >
    )
}

export default ReceiveRequision