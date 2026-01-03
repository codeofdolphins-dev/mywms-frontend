import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { useNavigate } from 'react-router-dom';
import BasicPagination from '../../components/BasicPagination';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPencil from '../../components/Icon/IconPencil';
import TableRow from '../../components/table/TableRow';
import TableHeader from '../../components/table/TableHeader';
import CustomeButton from '../../components/inputs/Button'
import { QUOTATION_COLUMN } from '../../utils/helper';


const sampleData = [
    {
        id: "1",
        qno: "QT-FUEL-778",
        supplier: {
            id: 1,
            name: "Prepare invoice",
        },
        status: "pending",
        notes: "Invoice needs to be prepared before end of day",
        total: 1250
    },
    {
        id: "2",
        qno: "QT-FUEL-778",
        supplier: {
            id: 1,
            name: "Prepare invoice",
        },
        status: "in-progress",
        notes: "Oil change and tire rotation scheduled",
        total: 450
    },
    {
        id: "3",
        qno: "QT-FUEL-778",
        supplier: {
            id: 1,
            name: "Prepare invoice",
        },
        status: "done",
        notes: "All documents collected and verified",
        total: 12310
    },
    {
        id: "4",
        qno: "QT-FUEL-778",
        supplier: {
            id: 1,
            name: "Prepare invoice",
        },
        status: "complete",
        notes: "Submit report to management",
        total: 3000
    },
    {
        id: "5",
        qno: "QT-FUEL-778",
        supplier: {
            id: 1,
            name: "Prepare invoice",
        },
        status: "pending",
        notes: "New stock arrival from supplier",
        total: 7800
    }
];


const Quotation = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isShow, setIsShow] = useState(false);

    function handelEdit(id) {
        console.log(id)
    }
    async function handleDelete(id) {
        console.log(id)
    }
    function handelShow(id) {
        console.log(id)
    }

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li className="">
                    <span>quotation</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-4xl font-bold my-3">Quotation</h1>
                    <p className='text-gray-600 text-base'>Manage and view all Quotation</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/quotation/create')}
                >
                    <FiPlus size={20} className='mr-2' />
                    Create Quotation
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
                <TableHeader columns={QUOTATION_COLUMN} />
                {
                    sampleData?.map((item, idx) => (
                        <TableRow
                            key={item.id}
                            columns={QUOTATION_COLUMN}
                            row={{
                                id: item?.id,
                                qno: item?.qno,
                                name: item?.supplier.name,
                                status: item?.status,
                                notes: (
                                    <p className='text-xs text-justify'>{item?.notes}</p>
                                ),
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

        </div>
    )
}

export default Quotation