import React, { useState } from 'react'
import ItemTable from '../../components/ItemTable'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi';
import TableHeader from '../../components/table/TableHeader';
import { REQUISITION_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import IconPencil from '../../components/Icon/IconPencil';
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

const headerLink = [
    { title: "requisition" },
]

const Requisition = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isShow, setIsShow] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const { data: requisitionList, isLoading: requisitionListLoading } = fetchData.TQRequisitionList();

    const isEmpty = requisitionList?.data?.length < 1;

    function handelShow(items) {
        setIsShow(true);
        setSelectedItems(items)
        console.log(items)
    }
    function handelEdit(id) {
        console.log(id)
    }
    async function handleDelete(id) {
        try {
            const isConfirm = await confirmation();
            if (isConfirm) {
                console.log(id)
            }
        } catch (error) {
            console.log(error);
        }
    };

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
            <div className={`panel mt-5 ${isEmpty ? "min-h-64" : ""} relative`}>
                <div className="overflow-x-auto">
                    <TableHeader columns={REQUISITION_COLUMN} />
                    <TableBody
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={requisitionList?.meta?.totalPages || 1}
                        isEmpty={isEmpty}
                    >
                        {
                            requisitionList?.data?.map((item, idx) => (
                                <TableRow
                                    key={item.id}
                                    columns={REQUISITION_COLUMN}
                                    row={{
                                        id: (
                                            <Link to={`/requisition/received-quotation/${item.requisition_no}`} className='hover:underline text-primary' >
                                                {item?.requisition_no}
                                            </Link>
                                        ),
                                        title: item?.title,
                                        status: item?.status,
                                        priority: item?.priority,
                                        notes: item?.notes,
                                        grandTotal: item?.grandTotal,
                                        action: (
                                            <div className='flex items-center justify-center space-x-3'>
                                                {/* <CustomeButton
                                                    onClick={() => handelEdit(item.id)}
                                                >
                                                    <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                </CustomeButton> */}

                                                <CustomeButton
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                                </CustomeButton>

                                                <CustomeButton
                                                    onClick={() => handelShow(item.items)}
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