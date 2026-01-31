import React from 'react'
import TableHeader from '../table/TableHeader'
import { REQUISITION_ITEMS_COLUMN } from '../../utils/helper'
import TableRow from '../table/TableRow'

const RequisitionDetails = ({
  setIsShow = false,
  selectedItems = []
}) => {
  return (
    <div className="panel">
      <div className="overflow-x-auto">
        <TableHeader columns={REQUISITION_ITEMS_COLUMN} />
        {
          selectedItems?.map((item, idx) => 
            <TableRow
              key={idx}
              columns={REQUISITION_ITEMS_COLUMN}
              row={{
                id: idx+1,
                barcode: item?.product?.barcode,
                productName: item?.product?.name,
                productType: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                qty: item?.qty,
              }}
            />
          )
        }
      </div>
    </div>
  )
}

export default RequisitionDetails