import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link, useParams } from 'react-router-dom'
import Accordian from '../../components/Accordian'
import TableHeader from '../../components/table/TableHeader'
import { QUOTATION_RECEIVE_COLUMN } from '../../utils/helper'
import TableRow from '../../components/table/TableRow'
import ComponentHeader from '../../components/ComponentHeader'
import fetchData from '../../Backend/fetchData.backend'
import AnimateHeight from 'react-animate-height'
import IconCaretDown from '../../components/Icon/IconCaretDown'

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

const headerLink = [
    { title: "requisition", link: "/requisition" },
    { title: "receive-quotation" },
]

const ReceiveQuotation = () => {
    const { reqNo } = useParams();
    const [debounceSearch, setDebounceSearch] = useState('');

    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const { data, isLoading } = fetchData.TQReceiveQuotationList({ reqNo });

    const suppliers = data?.data?.suppliers;

    console.log(suppliers);

    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by name or description...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                className='mb-5 justify-between'
            />

            <div className="panel space-y-4">
                {
                    suppliers?.map((item, idx) => (
                        <div className="border border-[#d3d3d3] rounded" key={idx}>
                            <div
                                className="flex items-center justify-between pr-5"
                                onClick={() => togglePara(`${item.id}`)}
                            >
                                <div className={`p-4 w-full flex items-center justify-between text-white-dark ${(active === `${item.id}`) ? '!text-primary' : ''}`}>
                                    <p>{item?.nodeDetails?.name}</p>
                                    <p>{item?.nodeDetails?.location}</p>
                                    <p>{item?.RequisitionSupplier?.status}</p>
                                    <p>{item?.quotation?.grandTotal}</p>
                                </div>

                                <div className={`ml-auto ${active === `${item.id}` ? 'rotate-180' : ''}`}>
                                    <IconCaretDown />
                                </div>
                            </div>

                            <AnimateHeight duration={300} height={active === `${item.id}` ? 'auto' : 0}>
                                <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3]">

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
                                </div>
                            </AnimateHeight>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ReceiveQuotation