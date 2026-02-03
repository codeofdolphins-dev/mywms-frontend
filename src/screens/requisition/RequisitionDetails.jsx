import React from 'react'
import TableHeader from '../../components/table/TableHeader'
import { REQUISITION_RECEIVE_DETAILS_COLUMN } from '../../utils/helper'
import TableBody from '../../components/table/TableBody'
import fetchData from '../../Backend/fetchData.backend'
import { useParams } from 'react-router-dom'
import TableRow from '../../components/table/TableRow'
import Input from '../../components/inputs/Input'

const RequisitionDetails = () => {
    const { id } = useParams();

    const { data, isLoading } = fetchData.TQRequisitionList({ requisition_no: id });

    return (
        <div>
            <div className="panel">
                <div className="overflow-x-auto">
                    <TableHeader columns={REQUISITION_RECEIVE_DETAILS_COLUMN} />
                    {/* <TableBody isEmpty={false} ></TableBody> */}
                    {
                        data?.data[0]?.items?.map((item, idx) => {

                            console.log(item);

                            return (
                                <TableRow
                                    key={idx}
                                    columns={REQUISITION_RECEIVE_DETAILS_COLUMN}
                                    row={{
                                        barcode: item?.product?.barcode,
                                        product: item?.product?.name,
                                        brand: item?.brand?.name,
                                        category: item?.category?.name,
                                        subCategory: item?.subCategory?.name,
                                        packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                                        reqQty: item?.qty,

                                        unit_price: <Input />,
                                        tax_percent: <Input />,
                                        total_price: <Input />,
                                        note: <Input />,
                                    }}
                                />
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default RequisitionDetails