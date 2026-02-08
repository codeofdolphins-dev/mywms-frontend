import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '@/components/inputs/SearchInput'
import IconSettings from '@/components/Icon/IconSettings';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import IconCode from '@/components/Icon/IconCode';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Input from '@/components/inputs/Input';
import ItemTable from '@/components/ItemTable';
import AddModal from '@/components/Add.modal';
import FullScreenLoader from '@/components/loader/FullScreenLoader';
import masterData from '@/Backend/master.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import CustomeButton from "@/components/inputs/Button";
import ComponentHeader from '@/components/ComponentHeader';
import TableBody from '../../../components/table/TableBody';
import SupplierForm from '../../../components/supplier/SupplierForm';
import fetchData from '../../../Backend/fetchData.backend';
import { SUPPLIER_COLUMN } from '../../../utils/helper';
import BasicPagination from '../../../components/BasicPagination';
import TableHeader from '../../../components/table/TableHeader';
import TableRow from '../../../components/table/TableRow';


const headerLink = [
    { title: "master", link: "/master" },
    { title: "suppliers" },
]

const Supplier = () => {
    const navigate = useNavigate();

    const { mutateAsync: deleteSupplier } = masterData.TQDeleteMaster(["supplierList"]);

    const [debounceSearch, setDebounceSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [editId, setEditId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = {
        text: debounceSearch || null,
        page: currentPage || null,
        limit: limit || null
    };
    const { data, isLoading } = fetchData.TQAllSupplierList(params);
    const isEmpty = data?.data?.length === 0;


    const handleEdit = (id) => {
        setEditId(id);
        setIsShow(true);
    };

    const handleDelete = async (id) => {
        try {
            const isSuccess = await confirmation();
            if (!isSuccess) return;

            const res = await deleteSupplier({ path: `/supplier/delete/${id}` });
            if (res.success) successAlert(res.message);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch])


    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                primaryText='Suppliers'
                secondaryText='Manage and view all Suppliers'
                // btnOnClick={() => navigate('add-supplier')}
                btnOnClick={() => setIsShow(true)}
                searchPlaceholder='Search by name or description...'
                btnTitle='Add Supplier'
                setDebounceSearch={setDebounceSearch}
            />

            <div className={`panel mt-5 min-h-64 relative`}>
                <TableBody
                    columns={SUPPLIER_COLUMN}
                    isEmpty={isEmpty}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    setLimit={setLimit}
                    totalPage={data?.meta?.totalPages}
                >
                    {data?.data?.map((item, idx) => (
                        <TableRow
                            key={idx}
                            columns={SUPPLIER_COLUMN}
                            row={{
                                id: item?.id,
                                email: item?.contact_email,
                                full_name: item?.name?.full_name,
                                phone_no: item?.contact_phone,
                                is_active: item?.status ? "Active" : "Inactive",
                                address: item?.address?.address,

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
                    ))}
                </TableBody>
            </div>

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Add New Supplier"}
                maxWidth='60'
            >
                <SupplierForm
                    setIsShow={setIsShow}
                    editId={editId}
                />
            </AddModal>

        </div >
    )
}

export default Supplier;