import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link, useSearchParams } from 'react-router-dom'
import Accordian from '../../components/Accordian'
import TableHeader from '../../components/table/TableHeader'
import { QUOTATION_RECEIVE_COLUMN } from '../../utils/helper'
import TableRow from '../../components/table/TableRow'
import ComponentHeader from '../../components/ComponentHeader'
import fetchData from '../../Backend/fetchData.backend'
import AnimateHeight from 'react-animate-height'
import IconCaretDown from '../../components/Icon/IconCaretDown'
import TableBody from '../../components/table/TableBody'
import Dropdown from '../../components/Dropdown'
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots'
import masterData from '../../Backend/master.backend'

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
    const [searchParams] = useSearchParams();
    const reqNo = searchParams.get("s") ?? "";
    const [debounceSearch, setDebounceSearch] = useState(reqNo);

    /** set reset search value */
    useEffect(() => {
        if (debounceSearch.length > 0) return;
        setDebounceSearch(reqNo);
    }, [reqNo, debounceSearch])

    const [active, setActive] = useState('0');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const { data, isLoading } = fetchData.TQReceiveQuotationList({ reqNo: debounceSearch });

    const suppliers = data?.data?.suppliers;
    const requisition = data?.data?.requisition;

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster(["receiveQuotationList"]);

    /** status color change helper */
    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-secondary";
            case "quoted": return "bg-success";
            case "rejected": return "bg-danger";
            default: return "bg-warning";
        }
    }


    async function approveQ(item) {
        try {
            await createData({ path: "/purchase-order/create", formData: { quotationId: item } });
        } catch (error) {
            console.log(error)
        }
    };
    function rejectQ(item) { };

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
                    suppliers?.map((item, idx) => {
                        const isEmpty = item?.quotation === null ? true : false;
                        console.log(item);

                        return (
                            <div
                                className={`border border-[#d3d3d3] rounded ${isEmpty ? '' : 'cursor-pointer'}`}
                                key={idx}
                            >
                                <div
                                    className={`flex items-center justify-between`}
                                    onClick={() => !isEmpty ? togglePara(`${item.id}`) : null}
                                >
                                    <table>
                                        <thead>
                                            <tr className={`py-1 w-full flex items-center justify-between ${(active === `${item.id}`) ? '!text-primary' : ''}`}>
                                                <th>{item?.nodeDetails?.name}</th>
                                                <th>{item?.nodeDetails?.location}</th>
                                                <th>
                                                    <div className={`badge ${statusColor(item?.status)}`}>
                                                        {item?.status?.toUpperCase()}
                                                    </div>
                                                </th>
                                                <th> {requisition.grandTotal} || {item?.quotation?.grandTotal ?? "XXXXX"}</th>
                                                <th>
                                                    <div
                                                        className="flex items-center justify-center w-1/4"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="dropdown">
                                                            <Dropdown
                                                                placement="bottom-end"
                                                                btnClassName="btn p-0 rounded-none border-0 shadow-none dropdown-toggle text-black hover:text-primary"
                                                                button={
                                                                    <IconHorizontalDots className="w-6 h-6 rotate-90 opacity-70" />
                                                                }
                                                            >
                                                                <ul className="!min-w-[170px]">
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => approveQ(item?.quotation?.id)}
                                                                        >
                                                                            Approve & Send PO
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => rejectQ(item?.quotation?.id)}
                                                                        >
                                                                            Reject Quotation
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th>
                                                    {isEmpty ? <></> :
                                                        <div className={`${active === `${item.id}` ? 'rotate-180' : ''}`}>
                                                            <IconCaretDown />
                                                        </div>
                                                    }
                                                </th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                <AnimateHeight duration={300} height={active === `${item.id}` ? 'auto' : 0}>
                                    <div
                                        className={`space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] ${isEmpty ? "min-h-64" : ""} `}
                                    >
                                        <TableBody
                                            isEmpty={isEmpty}
                                            columns={QUOTATION_RECEIVE_COLUMN}
                                        >
                                            {
                                                item?.quotation?.item?.map((product, j) => {
                                                    return (
                                                        <TableRow
                                                            key={j}
                                                            columns={QUOTATION_RECEIVE_COLUMN}
                                                            row={{
                                                                barcode: product?.sourceRequisitionItem?.product?.barcode,
                                                                product: product?.sourceRequisitionItem?.product?.name,
                                                                brand: product?.sourceRequisitionItem?.brand?.name,
                                                                category: product?.sourceRequisitionItem?.category?.name,
                                                                subCategory: product?.sourceRequisitionItem?.subCategory?.name,
                                                                qty: product?.sourceRequisitionItem?.qty,
                                                                priceLimit: product?.sourceRequisitionItem?.priceLimit,
                                                                offerPrice: product?.offer_price,
                                                                tax: product?.tax_percent,
                                                                total: product?.total_price,
                                                            }}
                                                        />
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </div>
                                </AnimateHeight>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ReceiveQuotation