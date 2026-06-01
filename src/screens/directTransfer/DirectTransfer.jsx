import React, { useState } from 'react'
import TableBody from '../../components/table/TableBody'
import TableRow from '../../components/table/TableRow'
import AddModal from '../../components/Add.modal';
import { utcToLocal } from '../../utils/UTCtoLocal';
import ComponentHeader from '../../components/ComponentHeader';
import DirectTransferForm from '../../components/directTransfer/DirectTransfer.form';
import DirectTransferPreview from '../../components/directTransfer/DirectTransferPreview';
import fetchData from '../../Backend/fetchData.backend';
import masterData from '../../Backend/master.backend';
import { confirmation, successAlert } from '../../utils/alerts';
import { DIRECT_TRANSFER_COLUMN_ACTION } from './helper';
import Tippy from '@tippyjs/react';
import { IoTrashOutline } from 'react-icons/io5';
import { FaPencil } from 'react-icons/fa6';
import { TbClipboardList } from 'react-icons/tb';




const headerLink = [{ title: "direct-transfer" }];

const DirectTransfer = () => {

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const [search, setSearch] = useState("");

  const [previewData, setPreviewData] = useState(null);
  const [isPreviewShow, setIsPreviewShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEditShow, setIsEditShow] = useState(false);

  const { data: directTransferList, isLoading } = fetchData.TQDirectTransferList()
  const { mutateAsync: deleteData } = masterData.TQDeleteMaster(['directTransferList']);
  const isEmpty = directTransferList?.data?.length === 0

  const editHandler = (item) => {
    setEditData(item);
    setIsEditShow(true);
  };

  const deleteHandler = async (id) => {
    try {
      const isConfirm = await confirmation();
      if (isConfirm) {
        const res = await deleteData({ path: `/direct-transfer/delete/${id}` });
        if (res?.success) {
          successAlert(res.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  /** production status color */
  const statusColor = (status) => {
    switch (status) {
      case "send": return "bg-info";
      case "accepted": return "bg-success";
      case "return": return "bg-danger";
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
        btnOnClick={() => {
          setEditData(null);
          setIsShow(true);
        }}
      />

      <div className="panel mt-5 z-0 min-h-64">

        <div className="">
          <TableBody
            columns={DIRECT_TRANSFER_COLUMN_ACTION}
            isEmpty={isEmpty}
            isLoading={isLoading}
            limit={limit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={directTransferList?.pagination?.totalPages || 1}
          >
            {directTransferList?.data?.map((item) => (
              <TableRow
                key={item.id}
                columns={DIRECT_TRANSFER_COLUMN_ACTION}
                row={{
                  no: <span className='text-xs font-semibold'>{item?.dir_trans_no}</span>,
                  to: <span className="text-xs font-semibold text-gray-800">{item?.toLocation?.nodeDetails?.name}</span>,
                  date: <span className="font-semibold text-gray-800">{utcToLocal(item?.transfer_date)}</span>,
                  items: <span className="font-semibold text-gray-800">{item?.transferItems?.length}</span>,
                  status: <span className={`badge whitespace-nowrap uppercase ${statusColor(item?.status)}`}>{item?.status?.replace("_", " ")}</span>,
                  creator: <span className="font-semibold text-gray-800">{item?.transferCreator?.name?.full_name}</span>,
                  action: (
                    <div className='flex items-center justify-center gap-2'>
                      <Tippy content="Preview" >
                        <button
                          onClick={() => {
                            setPreviewData(item);
                            setIsPreviewShow(true);
                          }}
                          disabled={item.is_default}
                          className={`
                              ${item.is_default ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:text-gray-700 "}
                            `}
                        >
                          <TbClipboardList
                            className=''
                            size={22}
                          />
                        </button>
                      </Tippy>
                      <Tippy content="Edit" >
                        <button
                          onClick={() => editHandler(item)}
                          disabled={item.is_default}
                          className={`
                              ${item.is_default ? "cursor-not-allowed text-gray-400" : "cursor-pointer hover:text-gray-700 "}
                            `}
                        >
                          <FaPencil
                            className=''
                            size={18}
                          />
                        </button>
                      </Tippy>
                      <Tippy content="Delete" >
                        <button
                          onClick={() => deleteHandler(item.id)}
                          disabled={item.is_default}
                          className={`
                            ${item.is_default ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-red-500 "}
                          `}
                        >
                          <IoTrashOutline
                            size={20}
                          />
                        </button>
                      </Tippy>
                    </div>
                  ),
                }}
              />
            ))}
          </TableBody>
        </div>
      </div>

      {/* Direct Transfer Add popup modal */}
      <AddModal
        isShow={isShow}
        setIsShow={setIsShow}
        title="Direct Transfer Items"
        maxWidth="75"
      >
        <DirectTransferForm setIsShow={setIsShow} />
      </AddModal>

      {/* Direct Transfer Edit popup modal */}
      <AddModal
        isShow={isEditShow}
        setIsShow={setIsEditShow}
        title="Edit Direct Transfer"
        maxWidth="75"
      >
        <DirectTransferForm setIsShow={setIsEditShow} editData={editData} />
      </AddModal>

      {/* Direct Transfer Preview popup modal */}
      <AddModal
        isShow={isPreviewShow}
        setIsShow={setIsPreviewShow}
        title="Direct Transfer Preview"
        maxWidth="75"
      >
        <DirectTransferPreview data={previewData} onClose={() => setIsPreviewShow(false)} />
      </AddModal>
    </div>
  )
}

export default DirectTransfer;