import React from 'react'
import TableHeader from '../table/TableHeader'
import { REQUISITION_CREATE_COLUMN } from '../../utils/helper'
import TableRow from '../table/TableRow'

const RequisitionDetails = ({
  setIsShow = false,
  selectedItems = []
}) => {
  return (
    <div className="panel h-52">
      <div className="overflow-auto">
        <TableHeader columns={REQUISITION_CREATE_COLUMN} />
        {
          selectedItems?.map((item, idx) =>
            <TableRow
              key={idx}
              columns={REQUISITION_CREATE_COLUMN}
              row={{
                barcode: item?.product?.barcode,
                product: item?.product?.name,
                brand: item?.brand?.name,
                category: item?.category?.name,
                subCategory: item?.subCategory?.name,
                packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                reqQty: item?.qty,
                priceLimit: item?.priceLimit,
              }}
            />
          )
        }
      </div>
    </div>
  )
}

export default RequisitionDetails