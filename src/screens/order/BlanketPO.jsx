import React from 'react'
import BasicPagination from '../../components/BasicPagination'
import SearchableSelect from '../../components/inputs/SearchableSelect'
import ComponentHeader from '../../components/ComponentHeader'



const headerLink = [
    { title: "Blanket PO" },
];

const BlanketPO = () => {
    return (
        <div>
            {/* <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4 border border-gray-100">
                <input type="text" placeholder="Search BPO # or Vendor..." className="flex-1 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 border" />
                
            </div> */}

            <div className="flex items-center justify-between gap-5">
                <ComponentHeader
                    headerLink={headerLink}
                    addButton={false}
                    className="w-full"
                // showSearch={false}
                />

                <select className="border-gray-200 rounded-lg p-2 border">
                    <option value="all">Status: All</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="panel mt-5 z-0 min-h-64">
                
            </div>
        </div>
    )
}

export default BlanketPO