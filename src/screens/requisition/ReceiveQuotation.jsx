import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link } from 'react-router-dom'
import Accordian from '../../components/Accordian'
import TableHeader from '../../components/table/TableHeader'
import { QUOTATION_RECEIVE_COLUMN } from '../../utils/helper'
import TableRow from '../../components/table/TableRow'

const dataSet = [
    {
        supplier: {
            id: 1,
            name: "ABC",
            phone: 789654231
        },
        items: [
            { id: 1, barcode: 151616551, productName: "Soap", price: 150, qty: 50 },
            { id: 2, barcode: 151616552, productName: "Shampoo", price: 320, qty: 30 },
            { id: 3, barcode: 151616553, productName: "Toothpaste", price: 180, qty: 40 },
            { id: 4, barcode: 151616554, productName: "Conditioner", price: 280, qty: 25 },
            { id: 5, barcode: 151616555, productName: "Face Wash", price: 220, qty: 35 },
        ]
    },
    {
        supplier: {
            id: 2,
            name: "XYZ Traders",
            phone: 987456123
        },
        items: [
            { id: 1, barcode: 251616551, productName: "Rice", price: 60, qty: 500 },
            { id: 2, barcode: 251616552, productName: "Wheat Flour", price: 55, qty: 300 },
            { id: 3, barcode: 251616553, productName: "Sugar", price: 45, qty: 200 },
            { id: 4, barcode: 251616554, productName: "Salt", price: 20, qty: 150 },
            { id: 5, barcode: 251616555, productName: "Pulses", price: 90, qty: 180 },
        ]
    },
    {
        supplier: {
            id: 3,
            name: "Fresh Farm Supplies",
            phone: 912345678
        },
        items: [
            { id: 1, barcode: 351616551, productName: "Apples", price: 120, qty: 100 },
            { id: 2, barcode: 351616552, productName: "Bananas", price: 40, qty: 150 },
            { id: 3, barcode: 351616553, productName: "Oranges", price: 80, qty: 120 },
            { id: 4, barcode: 351616554, productName: "Grapes", price: 110, qty: 90 },
            { id: 5, barcode: 351616555, productName: "Mangoes", price: 150, qty: 70 },
        ]
    },
    {
        supplier: {
            id: 4,
            name: "Tech Components Ltd",
            phone: 998877665
        },
        items: [
            { id: 1, barcode: 451616551, productName: "USB Cable", price: 250, qty: 60 },
            { id: 2, barcode: 451616552, productName: "Mouse", price: 600, qty: 40 },
            { id: 3, barcode: 451616553, productName: "Keyboard", price: 1200, qty: 30 },
            { id: 4, barcode: 451616554, productName: "Headphones", price: 1800, qty: 25 },
            { id: 5, barcode: 451616555, productName: "Webcam", price: 2200, qty: 20 },
        ]
    }
];


const ReceiveQuotation = () => {

    const [debounceSearch, setDebounceSearch] = useState('');

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

            <div className="panel space-y-4">
                {
                    dataSet?.map((item, idx) => (
                        <Accordian
                            key={idx}
                            id={idx}
                            header={item?.supplier?.name}
                        >
                            <TableHeader columns={QUOTATION_RECEIVE_COLUMN} />
                            {
                                item?.items?.map((product, j) => (
                                    <TableRow
                                        key={j}
                                        columns={QUOTATION_RECEIVE_COLUMN}
                                        row={{
                                            id: product?.id,
                                            barcode: product?.barcode,
                                            productName: product?.productName,
                                            price: product?.price,
                                            qty: product?.qty,
                                        }}
                                    />
                                ))
                            }
                        </Accordian>
                    ))
                }
            </div>
        </div>
    )
}

export default ReceiveQuotation