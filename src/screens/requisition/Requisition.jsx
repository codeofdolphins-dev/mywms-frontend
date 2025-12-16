import React, { useState } from 'react'
import SearchInput from '../../components/inputs/SearchInput'
import ItemTable from '../../components/ItemTable'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi';

const colName = ["Id", "Supplier", "Name", "Phone No.", "Address", "Account Holder Name", "Account Number", "IFSC Code", "Branch", "Bank Name", "Actions"];

const tableData = [
    {
        "Id": 1,
        "Email": "arjun.patel@example.com",
        "Name": "Arjun Patel",
        "Phone No.": "9876543210",
        "Address": "12 Ashok Nagar, Ahmedabad, Gujarat",
        "Account Holder Name": "Arjun Patel",
        "Account Number": "123456789012",
        "IFSC Code": "HDFC0001234",
        "Branch": "Ashram Road",
        "Bank Name": "HDFC Bank"
    },
    {
        "Id": 2,
        "Email": "neha.sharma@example.com",
        "Name": "Neha Sharma",
        "Phone No.": "9123456789",
        "Address": "45 Civil Lines, Jaipur, Rajasthan",
        "Account Holder Name": "Neha Sharma",
        "Account Number": "234567890123",
        "IFSC Code": "SBIN0005678",
        "Branch": "Civil Lines",
        "Bank Name": "State Bank of India"
    },
    {
        "Id": 3,
        "Email": "rohit.verma@example.com",
        "Name": "Rohit Verma",
        "Phone No.": "9988776655",
        "Address": "78 MG Road, Indore, Madhya Pradesh",
        "Account Holder Name": "Rohit Verma",
        "Account Number": "345678901234",
        "IFSC Code": "ICIC0004321",
        "Branch": "MG Road",
        "Bank Name": "ICICI Bank"
    },
    {
        "Id": 4,
        "Email": "kavita.iyer@example.com",
        "Name": "Kavita Iyer",
        "Phone No.": "9012345678",
        "Address": "9 T Nagar, Chennai, Tamil Nadu",
        "Account Holder Name": "Kavita Iyer",
        "Account Number": "456789012345",
        "IFSC Code": "AXIS0008765",
        "Branch": "T Nagar",
        "Bank Name": "Axis Bank"
    }
];

const Requisition = () => {

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li className="">
                    <span>Requisition</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-5xl font-bold my-3">Requisition</h1>
                    <p className='text-gray-600 text-base'>Manage and view all Requisitions</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/requisition/create')}
                >
                    <FiPlus size={20} className='mr-2'/>
                    Create New Requisition
                </button>
            </div>


            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name or description..."
                    className="bg- border-pink-500"
                    value={search}
                    setValue={setSearch}
                />
            </div>

            <ItemTable
                colName={colName}
                items={tableData}
                edit={true}
            />

        </div >
    )
}

export default Requisition