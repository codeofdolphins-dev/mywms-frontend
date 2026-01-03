import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { REQUISITION_ITEMS_COLUMN, REQUISITION_RECEIVE_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import CustomeButton from "../../components/inputs/Button";
import AddModal from '../../components/Add.modal';

const sampleDataSet = [
    {
        id: 1,
        title: "Product Refreshment",
        sender: {
            id: 1,
            name: "ABC Ltd.",
            number: 515136131,
        },
        priority: "High",
        itemCounts: 5,
        items: [
            { id: 1, barcode: 1561681535, name: "Soap", qty: 550, price: 5000 },
            { id: 2, barcode: 1561681536, name: "Shampoo", qty: 320, price: 8200 },
            { id: 3, barcode: 1561681537, name: "Toothpaste", qty: 450, price: 6100 },
            { id: 4, barcode: 1561681538, name: "Conditioner", qty: 200, price: 7400 },
            { id: 5, barcode: 1561681539, name: "Face Wash", qty: 300, price: 6800 },
        ],
        total: 334500
    },
    {
        id: 2,
        title: "Grocery Supplies",
        sender: {
            id: 2,
            name: "XYZ Traders",
            number: 787878787,
        },
        priority: "Medium",
        itemCounts: 5,
        items: [
            { id: 1, barcode: 2561681535, name: "Rice", qty: 1000, price: 45000 },
            { id: 2, barcode: 2561681536, name: "Wheat Flour", qty: 800, price: 32000 },
            { id: 3, barcode: 2561681537, name: "Sugar", qty: 600, price: 18000 },
            { id: 4, barcode: 2561681538, name: "Salt", qty: 400, price: 4000 },
            { id: 5, barcode: 2561681539, name: "Pulses", qty: 500, price: 25000 },
        ],
        total: 124000
    },
    {
        id: 3,
        title: "Fresh Produce Order",
        sender: {
            id: 3,
            name: "Fresh Farm Co.",
            number: 919191919,
        },
        priority: "Low",
        itemCounts: 5,
        items: [
            { id: 1, barcode: 3561681535, name: "Apples", qty: 300, price: 15000 },
            { id: 2, barcode: 3561681536, name: "Bananas", qty: 500, price: 8000 },
            { id: 3, barcode: 3561681537, name: "Oranges", qty: 400, price: 12000 },
            { id: 4, barcode: 3561681538, name: "Grapes", qty: 250, price: 14000 },
            { id: 5, barcode: 3561681539, name: "Mangoes", qty: 200, price: 18000 },
        ],
        total: 67000
    },
    {
        id: 4,
        title: "Electronics Restock",
        sender: {
            id: 4,
            name: "Tech Components Ltd.",
            number: 808080808,
        },
        priority: "High",
        itemCounts: 5,
        items: [
            { id: 1, barcode: 4561681535, name: "USB Cable", qty: 150, price: 12000 },
            { id: 2, barcode: 4561681536, name: "Mouse", qty: 80, price: 24000 },
            { id: 3, barcode: 4561681537, name: "Keyboard", qty: 60, price: 36000 },
            { id: 4, barcode: 4561681538, name: "Headphones", qty: 40, price: 48000 },
            { id: 5, barcode: 4561681539, name: "Webcam", qty: 30, price: 45000 },
        ],
        total: 165000
    }
];


const ReceiveRequision = () => {
    const [debounceSearch, setDebounceSearch] = useState('');
    const [itemDetails, setItemDetails] = useState([]);
    const [isShow, setIsShow] = useState(false);

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
            {/* breadcrumb */}
            <ul className="flex space-x-2">
                <li className="">
                    <Link to="/requisition" className="text-primary hover:underline">
                        requisition
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2 ">
                    <span>Receive quotation</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-4xl font-bold my-3">Receive Quotation</h1>
                </div>
                {/* <button
                            className="btn btn-primary"
                            onClick={() => navigate('/requisition')}
                        >
                            <FiPlus size={20} className='mr-2' />
                            Create Quotation
                        </button> */}
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by supplier name..."
                    setValue={setDebounceSearch}
                />
            </div>

            <div className="">
                <TableHeader columns={REQUISITION_RECEIVE_COLUMN} />
                {
                    sampleDataSet?.map((item, idx) => (
                        <TableRow
                            key={idx}
                            columns={REQUISITION_RECEIVE_COLUMN}
                            row={{
                                id: item?.id,
                                title: item?.title,
                                sender: item?.sender?.name,
                                priority: item?.priority,
                                total: item?.total,
                                itemsCount: item?.itemCounts,
                                action: (
                                    <div className='flex space-x-3'>
                                        <CustomeButton
                                            onClick={() => handelShow(item?.items)}
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

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Item Details"}
            >
                <div className="panel">
                    <TableHeader columns={REQUISITION_ITEMS_COLUMN} />
                    {
                        itemDetails?.map((item, idx) => (
                            <TableRow
                                key={item?.id}
                                columns={REQUISITION_ITEMS_COLUMN}
                                row={{
                                    id: item?.id,
                                    barcode: item?.barcode,
                                    productName: item?.name,
                                    qty: item?.qty,
                                    price: item?.price
                                }}
                            />
                        ))
                    }
                </div>
            </AddModal>
        </div >
    )
}

export default ReceiveRequision