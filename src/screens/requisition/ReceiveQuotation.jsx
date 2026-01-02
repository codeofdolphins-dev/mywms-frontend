import React from 'react'
import { FiPlus } from 'react-icons/fi'
import SearchInput from '../../components/inputs/SearchInput'
import { Link } from 'react-router-dom'

const ReceiveQuotation = () => {
    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li className="">
                    <Link to="/requisition" className="text-primary hover:underline">
                        quotation
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2 ">
                    <span>Receive quotation</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center mt-5">
                <div>
                    <h1 className="text-4xl font-bold my-3">Quotation</h1>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/quotation/create')}
                >
                    <FiPlus size={20} className='mr-2' />
                    Create Quotation
                </button>
            </div>


            {/* Search and Add Button */}
            {/* <div className="flex flex-col sm:flex-row gap-4 my-6">
                <SearchInput
                    type="text"
                    placeholder="Search by name or description..."
                    className="bg- border-pink-500"
                    setValue={debounceSearch}
                />
            </div> */}
        </div>
    )
}

export default ReceiveQuotation