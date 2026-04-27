import React, { useState } from 'react'
import ComponentHeader from '../../../components/ComponentHeader';
import RMstock from '../rmStore/components/RMStock';
import TransferOrderList from '../TransferOrderList';


const headerLink = [{ title: "FG store" }];

const FGBrowse = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [isBulkShow, setIsBulkShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');


    return (
        <div>
            {/* compheader */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder="Search by product, SKU, barcode, category..."
                setDebounceSearch={setDebounceSearch}
                addButton={false}
                showSearch={false}
            />

            {/* wizards */}
            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    <li>
                        <div
                            className={`
                                ${activeTab === 1 ? '!bg-primary text-white' : ''}
                                block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-44 cursor-pointer
                            `}
                            onClick={() => setActiveTab(1)}
                        >
                            <p className='mb-1 font-semibold'>Stock</p>
                        </div>
                    </li>

                    <li>
                        <div className={`
                                ${activeTab === 2 ? '!bg-primary text-white' : ''} 
                                block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-44 cursor-pointer
                            `}
                            onClick={() => setActiveTab(2)}
                        >
                            <p className='mb-1 font-semibold'>Receive Request</p>
                        </div>
                    </li>
                </ul>
            </div>

            {activeTab === 1 && <RMstock />}
            {activeTab === 2 && <TransferOrderList />}

        </div>
    )
}

export default FGBrowse