import React, { useState } from 'react'
import SearchInput from '../../components/inputs/SearchInput'
import ItemTable from '../../components/ItemTable'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi';
import TableHeader from '../../components/table/TableHeader';
import { REQUISITION_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import { Button } from '@mantine/core';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconNotes from '../../components/Icon/IconNotes';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import BasicPagination from '../../components/BasicPagination';
import AddModal from '../../components/Add.modal';
import RequisitionDetails from '../../components/requisition/RequisitionDetails';
import CustomeButton from "../../components/inputs/Button";
import { confirmation } from '../../utils/alerts';

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


const Requisition = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isShow, setIsShow] = useState(false);

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
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li className="">
                    <span>Requisition</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-4xl font-bold my-3">Requisition</h1>
                    <p className='text-gray-600 text-base'>Manage and view all Requisitions</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/requisition/create')}
                >
                    <FiPlus size={20} className='mr-2' />
                    Create Requisition
                </button>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name or description..."
                    className="bg- border-pink-500"
                    setValue={debounceSearch}
                />
            </div>

            {/* table */}
            <div className="panel border rounded overflow-hidden">
                <TableHeader columns={REQUISITION_COLUMN} />
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
                <BasicPagination
                    totalPage={5}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setLimit={setLimit}
                />
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