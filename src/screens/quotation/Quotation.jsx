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
import { QUOTATION_COLUMN } from '../../utils/helper';
import ComponentHeader from '../../components/ComponentHeader';
import fetchData from '../../Backend/fetchData.backend';
import TableBody from '../../components/table/TableBody';


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

const headerLink = [
    { title: "quotation" },
];


const Quotation = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [isShow, setIsShow] = useState(false);

    const { data: quotationList, loading } = fetchData.TQQuotationList();
    const isEmpty = quotationList?.data?.length < 1;


    function handelEdit(id) {
        console.log(id)
    }
    async function handleDelete(id) {
        console.log(id)
    }
    function handelShow(items) {
        console.log(items)
    }

    return (
        <div>

            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                searchPlaceholder=''
                setDebounceSearch={debounceSearch}
            />

            {/* table */}
            <div className={`panel mt-5 z-0 ${isEmpty ? "min-h-64" : ""} relative`}>
                <div className="overflow-x-auto">
                    <TableHeader columns={QUOTATION_COLUMN} />
                    <TableBody
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
                                        action: (
                                            <div className='flex items-center justify-center space-x-3'>
                                                <CustomeButton
                                                    onClick={() => handelEdit(item.id)}
                                                >
                                                    <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                </CustomeButton>

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
            </div>

        </div>
    )
}

export default Quotation