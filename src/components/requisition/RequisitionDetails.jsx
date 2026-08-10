import React from 'react'
import TableHeader from '../table/TableHeader'
import { REQUISITION_CREATE_COLUMN } from '../../utils/helper'
import TableRow from '../table/TableRow'

const RequisitionDetails = ({
  setIsShow = false,
  selectedItems = []
}) => {
  return (
    <div className="panel !w-full">
      <div>
        <TableHeader columns={REQUISITION_CREATE_COLUMN} />
        {
          selectedItems?.map((item, idx) =>
            <TableRow
              key={idx}
              columns={REQUISITION_CREATE_COLUMN}
              className='w-full'
              row={{
                barcode: item?.product?.barcode,
                product: item?.product?.name,
                brand: item?.brand,
                category: item?.category,
                subCategory: item?.sub_category,
                packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                reqQty: item?.qty,
                total: item?.line_total_price,
              }}
            />
          )
        }
      </div>
    </div>
  )
}

export default RequisitionDetails