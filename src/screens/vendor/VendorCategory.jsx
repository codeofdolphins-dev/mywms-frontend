import React, { useState } from 'react'
import IconTrashLines from '../../components/Icon/IconTrashLines'
import AddModal from '../../components/Add.modal'
import TableRow from '../../components/table/TableRow'
import TableBody from '../../components/table/TableBody'
import ComponentHeader from '../../components/ComponentHeader'
import CustomeButton from "../../components/inputs/Button"
import { VENDOR_CATEGORY_LIST_COLUMN } from '../../utils/helper'
import vendor from '../../Backend/vendor.backend'
import masterData from '../../Backend/master.backend'
import VendorCategoryForm from '../../components/vendor/VendorCategory.form'
import IconPencil from '../../components/Icon/IconPencil'
import { confirmation } from '../../utils/alerts'



const headerLink = [
    { title: "vendor", link: "/production/vendor" },
    { title: "category" },
]


const VendorCategory = () => {
    const { mutateAsync: deleteData, isPending } = masterData.TQDeleteMaster(["vendorCategoryList"]);

    const [isShow, setIsShow] = useState(false);
    const [editData, setEditData] = useState(null);

    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = {
        ...(search && { text: search }),
        limit,
        page: currentPage,
    };
    const { data: vendorCatList } = vendor.TQVendorCategoryList(params);
    const isEmpty = vendorCatList?.data?.length < 1 ? true : false;

    async function handleDelete(id) {
        try {
            const isConfirm = await confirmation();
            if (isConfirm) await deleteData({ path: `/vendor/category/delete/${id}` });
        } catch (error) {
            console.log(error);
        }
    }

    function handleEdit(id) {
        const obj = vendorCatList?.data?.find(i => i.id === id);
        setEditData(obj);
        setIsShow(true);
    };

    return (
        <div>
            <ComponentHeader
                headerLink={headerLink}
                btnOnClick={() => setIsShow(true)}
                searchPlaceholder='Search by name...'
                btnTitle='Vendor-Category'
                setDebounceSearch={setSearch}
            />

            <div className="panel mt-5 min-h-64 relative z-0">
                <TableBody
                    columns={VENDOR_CATEGORY_LIST_COLUMN}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={vendorCatList?.meta?.totalPages}
                >
                    {vendorCatList?.data?.map((item, idx) =>
                        <TableRow
                            key={idx}
                            columns={VENDOR_CATEGORY_LIST_COLUMN}
                            row={{
                                name: item?.name,
                                code: item?.code,
                                desc: item?.desc,
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
                maxWidth='50'
            >
                <VendorCategoryForm
                    setIsShow={setIsShow}
                    editData={editData}
                />
            </AddModal>
        </div>
    )
}

export default VendorCategory