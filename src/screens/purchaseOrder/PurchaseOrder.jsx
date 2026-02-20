import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { PURCHASE_ORDER } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Input from '../../components/inputs/Input';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { MdCurrencyRupee } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Button } from '@mantine/core';
import { purchaseOrder } from '../../Backend/purchaseOrder.fetch';


const headerLink = [
    { title: "purchase-order", link: "/purchase-order" },
    { title: "details" },
];

const PurchaseOrder = () => {
    const navigate = useNavigate();
    const activeNode = useSelector((state) => state.auth.userData?.activeNode);
    const { id: poNo } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [businessNode, setBusinessNode] = useState({});
    const [isBuyer, setIsBuyer] = useState(null);

    const params = {
        poNo,
        page: currentPage,
        limit: limit,
    };
    const { data, isLoading } = purchaseOrder.TQPurchaseOrderItemDetails(params, Boolean(poNo));
    const isEmpty = data?.data?.items?.length > 0 ? false : true;
    const purchasOrderItems = data?.data?.items ?? [];

    console.log(data)

    /** set business node location */
    useEffect(() => {
        if (activeNode == data?.data?.form_business_node_id) {
            setBusinessNode(data?.data?.poFormBusinessNode);
            setIsBuyer(true);
        }
        if (activeNode == data?.data?.to_business_node_id) {
            setBusinessNode(data?.data?.poToBusinessNode)
            setIsBuyer(false);
        }
    }, [data, isLoading]);


    if (isLoading) return <FullScreenLoader />

    return (
        <div>
            {/*header section */}
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                showSearch={false}
            />

            <div className="panel mt-1 !py-3">
                <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                        <h1>Purchase Order Details</h1>
                        {!isBuyer &&
                            <div className="flex items-center gap-2">
                                <Button
                                    // loading={true}
                                    color='green'
                                    size="compact-md"
                                    className='rounded-full'
                                >
                                    Approve
                                </Button>

                                <Button
                                    // loading={true}
                                    color='red'
                                    size="compact-md"
                                    className='rounded-full'
                                >
                                    Cancelled
                                </Button>
                            </div>
                        }
                    </div>
                    {
                        isBuyer &&
                        <Button
                            size="compact-md"
                            onClick={() => navigate(`/inward/create?s=${poNo}`)}
                        >
                            Inward
                        </Button>
                    }
                </div>

                {/* details section */}
                <div className="mt-2 flex justify-between sm:flex-row flex-col gap-6">

                    {/* PO details */}
                    <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">PO Number :</div>
                            <div># {data?.data?.po_no || "N/A"}</div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">Issue Date :</div>
                            <div>{utcToLocal(data?.data?.createdAt)}</div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">Grand Total:</div>
                            <div className='flex items-center'>
                                <MdCurrencyRupee />
                                {data?.data?.grand_total}
                            </div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">Note:</div>
                            <div> {data?.data?.note || "N/A"} </div>
                        </div>
                    </div>

                    {/* Node details */}
                    <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">{isBuyer ? "Supplier Name:" : "Buyer Name:"}</div>
                            <div className="whitespace-nowrap">{businessNode?.nodeDetails?.name || "N/A"}</div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">GST No:</div>
                            <div>{businessNode?.nodeDetails?.gst_no || "N/A"}</div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">Location:</div>
                            <div>{businessNode?.nodeDetails?.location || "N/A"}</div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2 gap-5">
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Lat:</div>
                                <div>{businessNode?.nodeDetails?.address?.lat || "N/A"}</div>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <div className="text-white-dark">Long:</div>
                                <div>{businessNode?.nodeDetails?.address?.long || "N/A"}</div>
                            </div>
                        </div>

                        <div className="flex items-center w-full justify-between mb-2 gap-5">
                            <div className="flex items-center w-full justify-between mb-2">
                                <p className="text-white-dark">Address:</p>
                                <p>{businessNode?.nodeDetails?.address?.address || "N/A"}</p>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <p className="text-white-dark">Pincode:</p>
                                <p>{businessNode?.nodeDetails?.address?.pincode || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-center w-full justify-between mb-2 gap-5">
                            <div className="flex items-center w-full justify-between mb-2">
                                <p className="text-white-dark">State:</p>
                                <p>{businessNode?.nodeDetails?.address?.state || "N/A"}</p>
                            </div>
                            <div className="flex items-center w-full justify-between mb-2">
                                <p className="text-white-dark">District:</p>
                                <p>{businessNode?.nodeDetails?.address?.district || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="panel mt-5 min-h-64 relative">
                <TableBody
                    columns={PURCHASE_ORDER}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={data?.meta?.totalPages}
                >
                    {
                        purchasOrderItems?.map((item, idx) => {
                            return (<TableRow
                                key={idx}
                                columns={PURCHASE_ORDER}
                                row={{
                                    barcode: item?.poi_sourceRequisitionItem?.product?.barcode,
                                    product: item?.poi_sourceRequisitionItem?.product?.name,
                                    brand: item?.poi_sourceRequisitionItem?.brand,
                                    category: item?.poi_sourceRequisitionItem?.category,
                                    subCategory: item?.poi_sourceRequisitionItem?.sub_category,
                                    qty: item?.qty,
                                    tax: item?.tax_percent,
                                    unitPrice: item?.unit_price,
                                    total: item?.line_total,
                                }}
                            />);
                        })
                    }
                </TableBody>
            </div>
        </div >
    )
}

export default PurchaseOrder