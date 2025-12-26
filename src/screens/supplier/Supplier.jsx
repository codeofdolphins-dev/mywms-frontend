import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput'
import IconSettings from '../../components/Icon/IconSettings';
import IconPencil from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import Input from '../../components/inputs/Input';
import ItemTable from '../../components/ItemTable';
import AddModal from '../../components/Add.modal';
import fetchData from '../../Backend/fetchData';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import masterData from '../../Backend/master.backend';
import { confirmation, successAlert } from '../../utils/alerts';


const colName = [
    { key: "id", label: "ID" },
    { key: "email", label: "Email" },
    { key: "full_name", label: "Name" },
    { key: "company_name", label: "Company" },
    { key: "phone_no", label: "Phone" },
    { key: "is_active", label: "Status", render: v => v ? "Active" : "Inactive" },
    { key: "address.address", label: "Address" },
    { key: "supplierBankDetails.account_holder_name", label: "Account Holder Name" },
    { key: "supplierBankDetails.account_number", label: "Account Number" },
    { key: "supplierBankDetails.account_type", label: "Account Type" },
    { key: "supplierBankDetails.ifsc_code", label: "IFSC Code" },
    { key: "supplierBankDetails.bank_branch", label: "Branch" },
    { key: "supplierBankDetails.bank_name", label: "Bank Name" },
];

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
            if(!isSuccess) return;

            const res = await deleteSupplier({ path: `/supplier/delete/${id}` });
            if(res.success) successAlert(res.message);

        } catch (error) {
            console.log(error);            
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch])


    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Suppliers</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Suppliers</h1>
                    <p className='text-gray-600 text-base'>Manage and view all Suppliers</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('add-supplier')}
                >Create Supplier</button>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name or description..."
                    className="bg- border-pink-500"
                    setValue={setDebounceSearch}
                />
            </div>

            <ItemTable
                columns={colName}
                items={data?.data}
                edit={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
                totalPage={data?.meta?.totalPages}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isLoading={isLoading}
            />

        </div >
    )
}

export default Supplier;