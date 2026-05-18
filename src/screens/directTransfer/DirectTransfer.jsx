import React, { useState } from 'react'
import TableBody from '../../components/table/TableBody'
import TableRow from '../../components/table/TableRow'
import AddModal from '../../components/Add.modal';
import { utcToLocal } from '../../utils/UTCtoLocal';
import ComponentHeader from '../../components/ComponentHeader';
import DirectTransferForm from '../../components/directTransfer/DirectTransfer.form';




const headerLink = [{ title: "direct-transfer" }];

const DirectTransfer = () => {

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [search, setSearch] = useState("");


  const receiptList = []

  /** production status color */
  const statusColor = (status) => {
    switch (status) {
      case "pending": return "bg-info";
      case "accepted": return "bg-success";
      default: return "bg-danger";
    }
  }

  return (
    <div>
      <ComponentHeader
        headerLink={headerLink}
        setDebounceSearch={setSearch}
        searchPlaceholder='Search...'
        
        btnTitle='Transfer'
        btnOnClick={() => setIsShow(true)}
      />

      <div className="panel mt-5 z-0 min-h-64">

        <div className="">
          <TableBody
            columns={[]}
            isEmpty={false}
            // isLoading={productionLoading}
            limit={limit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={receiptList?.pagination?.totalPages || 1}
          >
            {receiptList?.data?.map((item) => (
              <TableRow
                key={item.id}
                columns={[]}
                onClick={() => handleGenerateInward(item)}
                row={{
                  no: <span className='text-xs font-semibold'>{item?.receipt_no}</span>,
                  pro_no: <span className="text-xs font-semibold text-gray-800">{item?.parentProductionOrder?.production_order_no}</span>,

                  batch_no: <span className="font-semibold text-gray-800">{item?.batch_no}</span>,

                  barcode: <span className="font-semibold text-gray-800">{item?.receivedProduct?.barcode}</span>,

                  product: <span className="font-semibold text-gray-800">{item?.receivedProduct?.name}</span>,

                  qty: <span className="font-semibold text-gray-800">{item?.received_qty > 0 ? item?.received_qty : item?.send_qty}</span>,

                  fg_store: <span className="font-semibold text-gray-800">{item?.fgStore?.name ?? "-"}</span>,

                  mfg_date: <span className="font-semibold text-gray-800">{utcToLocal(item?.mfg_date)}</span>,

                  status: <span className={`badge whitespace-nowrap uppercase ${statusColor(item?.status)}`}>{item?.status?.replace("_", " ")}</span>
                }}
              />
            ))}
          </TableBody>
        </div>
      </div>

      <AddModal
        isShow={isShow}
        setIsShow={setIsShow}
        title="Direct Transfer Items"
        maxWidth="75"
      >
        <DirectTransferForm setIsShow={setIsShow} />
      </AddModal>
    </div>
  )
}

export default DirectTransfer;