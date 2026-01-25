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
import fetchData from '@/Backend/fetchData.backend';
import FullScreenLoader from '@/components/loader/FullScreenLoader';
import masterData from '@/Backend/master.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import TableHeader from '@/components/table/TableHeader';
import { SUPPLIER_COLUMN } from '@/utils/helper';
import TableRow from '@/components/table/TableRow';
import CustomeButton from "@/components/inputs/Button";
import ComponentHeader from '@/components/ComponentHeader';
import TableBody from '../../../components/table/TableBody';


const headerLink = [
    { title: "master", link: "/master" },
    { title: "suppliers" },
]

const Supplier = () => {
    const navigate = useNavigate();

    const { mutateAsync: deleteSupplier } = masterData.TQDeleteMaster([]);

    const [debounceSearch, setDebounceSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = {
        text: debounceSearch || null,
        page: currentPage || null,
        limit: limit || null
    };
    const { data, isLoading } = fetchData.TQAllSupplierList(params);


    const handleEdit = (id) => {
        navigate("add-supplier", {
            state: { id }
        })
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

    console.log(data)


    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                primaryText='Suppliers'
                secondaryText='Manage and view all Suppliers'
                btnOnClick={() => navigate('add-supplier')}
                searchPlaceholder='Search by name or description...'
                btnTitle='Add Supplier'
                setDebounceSearch={setDebounceSearch}
            />

            <div className="panel mt-5 min-h-64 relative">
                <div className="overflow-x-auto">
                    <TableHeader columns={SUPPLIER_COLUMN} />
                    <TableBody
                        isEmpty={(data?.data?.length === 0) || (data?.data ?? true)}
                    >
                        {data?.data?.map((item, idx) => (
                            <TableRow
                                key={idx}
                                columns={SUPPLIER_COLUMN}
                                row={{
                                    id: item?.id,
                                    email: item?.email,
                                    full_name: item?.name?.full_name,
                                    company_name: item?.company_name,
                                    phone_no: item?.phone_no,
                                    is_active: item?.is_active ? "Active" : "Inactive",
                                    address: item?.address?.address,

                                    account_holder_name: item?.supplierBankDetails?.account_holder_name,
                                    account_number: item?.supplierBankDetails?.account_number,
                                    account_type: item?.supplierBankDetails?.account_type,
                                    bank_branch: item?.supplierBankDetails?.bank_branch,
                                    bank_name: item?.supplierBankDetails?.bank_name,
                                    ifsc_code: item?.supplierBankDetails?.ifsc_code,
                                    action: (
                                        <div className='flex space-x-3'>
                                            <CustomeButton
                                                onClick={() => handelEdit(item.id)}
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
            </div>
        </div >
    )
}

export default Supplier;