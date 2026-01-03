import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { PURCHASE_ORDER } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';

const sampleDataSet = [
    {
        id: 1,
        pr_id: 166595531,
        status: "draft",
        priority: "draft",
        delivery_date: "15/05/2026",
        note: "lorem lorem lorem lorem",
        created_by: "user1",
        total_amount: 365000,
        items: [
            {
                id: 1,
                name: "Soap",
                barcode: 52165165,
                quantity_ordered: 550,
                unit_price: 400,
                line_total: 220000
            },
            {
                id: 2,
                name: "Shampoo",
                barcode: 52165166,
                quantity_ordered: 200,
                unit_price: 450,
                line_total: 90000
            },
            {
                id: 3,
                name: "Toothpaste",
                barcode: 52165167,
                quantity_ordered: 150,
                unit_price: 300,
                line_total: 45000
            },
            {
                id: 4,
                name: "Conditioner",
                barcode: 52165168,
                quantity_ordered: 100,
                unit_price: 500,
                line_total: 50000
            },
            {
                id: 5,
                name: "Face Wash",
                barcode: 52165169,
                quantity_ordered: 80,
                unit_price: 450,
                line_total: 36000
            }
        ]
    },
    {
        id: 2,
        pr_id: 166595532,
        status: "pending",
        priority: "high",
        delivery_date: "20/05/2026",
        note: "urgent grocery items",
        created_by: "user2",
        total_amount: 285000,
        items: [
            {
                id: 1,
                name: "Rice",
                barcode: 62165165,
                quantity_ordered: 500,
                unit_price: 350,
                line_total: 175000
            },
            {
                id: 2,
                name: "Wheat Flour",
                barcode: 62165166,
                quantity_ordered: 300,
                unit_price: 220,
                line_total: 66000
            },
            {
                id: 3,
                name: "Sugar",
                barcode: 62165167,
                quantity_ordered: 200,
                unit_price: 180,
                line_total: 36000
            },
            {
                id: 4,
                name: "Salt",
                barcode: 62165168,
                quantity_ordered: 100,
                unit_price: 80,
                line_total: 8000
            }
        ]
    },
    {
        id: 3,
        pr_id: 166595533,
        status: "approved",
        priority: "medium",
        delivery_date: "25/05/2026",
        note: "fresh produce order",
        created_by: "user3",
        total_amount: 198000,
        items: [
            {
                id: 1,
                name: "Apples",
                barcode: 72165165,
                quantity_ordered: 200,
                unit_price: 300,
                line_total: 60000
            },
            {
                id: 2,
                name: "Bananas",
                barcode: 72165166,
                quantity_ordered: 300,
                unit_price: 120,
                line_total: 36000
            },
            {
                id: 3,
                name: "Oranges",
                barcode: 72165167,
                quantity_ordered: 250,
                unit_price: 160,
                line_total: 40000
            },
            {
                id: 4,
                name: "Grapes",
                barcode: 72165168,
                quantity_ordered: 150,
                unit_price: 220,
                line_total: 33000
            },
            {
                id: 5,
                name: "Mangoes",
                barcode: 72165169,
                quantity_ordered: 100,
                unit_price: 290,
                line_total: 29000
            }
        ]
    },
    {
        id: 4,
        pr_id: 166595534,
        status: "completed",
        priority: "low",
        delivery_date: "30/05/2026",
        note: "electronics restock",
        created_by: "user4",
        total_amount: 410000,
        items: [
            {
                id: 1,
                name: "USB Cable",
                barcode: 82165165,
                quantity_ordered: 300,
                unit_price: 150,
                line_total: 45000
            },
            {
                id: 2,
                name: "Mouse",
                barcode: 82165166,
                quantity_ordered: 150,
                unit_price: 900,
                line_total: 135000
            },
            {
                id: 3,
                name: "Keyboard",
                barcode: 82165167,
                quantity_ordered: 100,
                unit_price: 1800,
                line_total: 180000
            },
            {
                id: 4,
                name: "Headphones",
                barcode: 82165168,
                quantity_ordered: 50,
                unit_price: 1000,
                line_total: 50000
            }
        ]
    }
];


const PurchaseOrder = () => {
    const navigate = useNavigate();
    const [debounceSearch, setDebounceSearch] = useState('');
    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 space-x-reverse">
                <li className="">
                    <span>purchase-order</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-4xl font-bold my-3">Purchase Order</h1>
                    <p className='text-gray-600 text-base'>Manage and view all purchase order</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/quotation/create')}
                >
                    <FiPlus size={20} className='mr-2' />
                    Create PO
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

            <div className="panel">
                <TableHeader columns={PURCHASE_ORDER} />
                {
                    sampleDataSet?.map((item, idx) => {
                        <TableRow
                            key={idx}
                            columns={PURCHASE_ORDER}
                            row={{
                                id: item?.id,
                                pr_id: item?.id,
                                status: item?.id,
                                priority: item?.priority,
                                expected_delivery_date: item?.priority,
                            }}
                        />
                    })
                }
            </div>
        </div>
    )
}

export default PurchaseOrder