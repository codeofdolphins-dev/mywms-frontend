import React, { useState } from 'react'
import ComponentHeader from '../../components/ComponentHeader'
import TableBody from '../../components/table/TableBody';
import { VENDOR_LIST_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import CustomeButton from "../../components/inputs/Button"
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import AddModal from '../../components/Add.modal';
import VendorForm from '../../components/vendor/Vendor.form';
import { confirmation } from '../../utils/alerts';
import masterData from '../../Backend/master.backend';
import vendor from '../../Backend/vendor.backend';


const headerLink = [
    { title: "production", },
    { title: "vendor" },
]

const Vendor = () => {

    const [isShow, setIsShow] = useState(false);


    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data: vendorList, isLoading: listLoading } = vendor.TQVendorList();

    const { mutateAsync: deleteData } = masterData.TQDeleteMaster(["vendorList"])

    async function handleDelete(id) {
        try {
            alert("working");
            // const isConfirm = await confirmation();
            // if (isConfirm) await deleteData({ path: `/requisition/delete/${id}` });
        } catch (error) {
            console.log(error);
        }
    }

    function handleEdit(id){
        alert("working");
    };



    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                btnOnClick={() => setIsShow(true)}
                searchPlaceholder='Search by name or description...'
                btnTitle='Vendor'
                setDebounceSearch={setSearch}
            />

            <div className="panel mt-5 min-h-64 relative z-0">
                <TableBody
                    columns={VENDOR_LIST_COLUMN}
                    isEmpty={false}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={vendorList?.meta?.totalPages}
                >
                    {vendorList?.data?.map((item, idx) =>
                        <TableRow
                            key={idx}
                            columns={VENDOR_LIST_COLUMN}
                            row={{
                                name: item?.name?.full_name,
                                email: item?.email,
                                cName: item?.company_name,
                                phone: item?.phone_no,
                                gst: item?.meta?.gst_no,
                                status: item?.is_active ? "Active" : "Inactive",
                                action: (
                                    <div className='flex space-x-3'>
                                        <CustomeButton
                                            onClick={() => handleEdit(item.id)}
                                        >
                                            <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                        </CustomeButton>

                                        <CustomeButton
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                        </CustomeButton>
                                    </div>
                                )
                            }}
                        />
                    )}
                </TableBody>
            </div>


            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Add New Vendor"
            >
                <VendorForm
                    setIsShow={setIsShow}
                />
            </AddModal>

        </div>
    )
}

export default Vendor