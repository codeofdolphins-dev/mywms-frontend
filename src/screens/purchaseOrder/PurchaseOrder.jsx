import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { PURCHASE_ORDER } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import fetchData from '../../Backend/fetchData.backend';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Input from '../../components/inputs/Input';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { MdCurrencyRupee } from 'react-icons/md';
import { useSelector } from 'react-redux';


const headerLink = [
    { title: "purchase-order" },
];

const PurchaseOrder = () => {
    const activeNode = useSelector((state) => state.auth.userData?.activeNode);
    const [searchParams] = useSearchParams();
    const PO_No = searchParams.get("s") ?? "";
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [businessNode, setBusinessNode] = useState({});
    const [isBuyer, setIsBuyer] = useState(null);

    /** set reset search value */
    useEffect(() => {
        if (debounceSearch.length > 0) return;
        setDebounceSearch(PO_No);
    }, [PO_No, debounceSearch]);

    const params = {
        poNo: debounceSearch,
        page: currentPage,
        limit: limit,
    };
    const { data, isLoading } = fetchData.TQPurchaseOrderList(params);
    const isEmpty = !!data?.data?.[0]?.purchasOrderItems?.length > 0 ? false : true;
    const purchasOrderItems = data?.data?.[0]?.purchasOrderItems ?? [];

    /** set business node location */
    useEffect(() => {
        if (activeNode == data?.data?.[0]?.form_business_node_id) {
            setBusinessNode(data?.data?.[0]?.poFormBusinessNode);
            setIsBuyer(true);
        }
        if (activeNode == data?.data?.[0]?.to_business_node_id) {
            setBusinessNode(data?.data?.[0]?.poToBusinessNode)
            setIsBuyer(false);
        }
    }, [data, isLoading]);


    // if (isLoading) return <FullScreenLoader />

    return (
        <div>
            {/*header section */}
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                searchPlaceholder='Search by PO No...'
                setDebounceSearch={setDebounceSearch}
            />

            <div className="panel mt-5">
                <h1>Purchase Order Details</h1>

                <div className="mt-5 flex justify-between sm:flex-row flex-col gap-6">

                    {/* PO details */}
                    <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">PO Number :</div>
                            <div># {data?.data?.[0]?.po_no || "N/A"}</div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">Issue Date :</div>
                            <div>{utcToLocal(data?.data?.[0]?.createdAt)}</div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">Grand Total:</div>
                            <div className='flex items-center'>
                                <MdCurrencyRupee />
                                {data?.data?.[0]?.grand_total}
                            </div>
                        </div>
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">Note:</div>
                            <div> {data?.data?.[0]?.note || "N/A"} </div>
                        </div>
                    </div>

                    {/* Node details */}
                    <div className="xl:1/3 lg:w-2/5 sm:w-1/2">
                        <div className="flex items-center w-full justify-between mb-2">
                            <div className="text-white-dark">{ isBuyer ? "Supplier Name:" : "Buyer Name:"}</div>
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

            <div className="panel mt-5 min-h-64">
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
                                    brand: item?.poi_sourceRequisitionItem?.brand?.name,
                                    category: item?.poi_sourceRequisitionItem?.category?.name,
                                    subCategory: item?.poi_sourceRequisitionItem?.subCategory?.name,
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