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

const sampleData = [
    {
        id: "9b3d6a3c-1b8a-4f3a-9a1e-1d7a6e4c9a01",
        title: "Prepare invoice",
        status: "pending",
        priority: "high",
        notes: "Invoice needs to be prepared before end of day",
        total: 1250
    },
    {
        id: "e2a4b1f7-6c34-4b9d-9e82-4b3c1a6a2f10",
        title: "Vehicle maintenance",
        status: "in-progress",
        priority: "medium",
        notes: "Oil change and tire rotation scheduled",
        total: 450
    },
    {
        id: "4f9c7a12-8e41-4d2c-9b9e-9f7a3c8d5b22",
        title: "Employee onboarding",
        status: "done",
        priority: "low",
        notes: "All documents collected and verified",
        total: 0
    },
    {
        id: "a7d3f2b9-5c81-4e9f-8b4d-1a2c6e9f3d55",
        title: "Monthly report",
        status: "complete",
        priority: "urgent",
        notes: "Submit report to management",
        total: 3000
    },
    {
        id: "c8b1d4e6-3a91-4a57-9e62-7c1a2b4f8e77",
        title: "Inventory inward",
        status: "pending",
        priority: "high",
        notes: "New stock arrival from supplier",
        total: 7800
    }
];
const headerLink = [
    { title: "requisition" },
]

const Requisition = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isShow, setIsShow] = useState(false);

    const { data: requisitionList, isLoading: requisitionListLoading } = fetchData.TQRequisitionList();


    console.log(requisitionList)
    
    const isEmpty = false;

    function handelShow(id) {
        setIsShow(true);
        console.log(id)
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
                        totalPage={1}
                        isEmpty={isEmpty}
                    >
                        {
                            sampleData?.map((item, idx) => (
                                <TableRow
                                    key={item.id}
                                    columns={REQUISITION_COLUMN}
                                    row={{
                                        id: (
                                            <Link to={`receive-quotation/${item.id}`} className='hover:underline text-primary' >
                                                {item?.id}
                                            </Link>
                                        ),
                                        title: item?.title,
                                        status: item?.status,
                                        priority: item?.priority,
                                        notes: item?.notes,
                                        total: item?.total,
                                        action: (
                                            <div className='flex space-x-3'>
                                                <CustomeButton
                                                    onClick={() => handelEdit(item.id)}
                                                >
                                                    <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                </CustomeButton>

                                                <CustomeButton
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
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
                    </TableBody>
                </div>
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Requisition Items"}
                maxWidth='60'
            >
                <RequisitionDetails
                    setIsShow={setIsShow}
                />
            </AddModal>

        </div >
    )
}

export default Requisition