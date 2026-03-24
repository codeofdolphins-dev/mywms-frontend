import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { PURCHASE_ORDER_BROWSE } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Input from '../../components/inputs/Input';
import { utcToLocal } from '../../utils/UTCtoLocal';
import { MdCurrencyRupee } from 'react-icons/md';
import { Button } from '@mantine/core';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { Link, useNavigate } from 'react-router-dom';
import PO from './browse/PO';
import SO from './browse/SO';


const headerLink = [
    { title: "order" },
];

const OrderBrowse = () => {
    const [debounceSearch, setDebounceSearch] = useState('');
    const [activeTab, setActiveTab] = useState(1);

    // console.log(data)



    // if (isLoading) return <FullScreenLoader />

    return (
        <div>
            {/*header section */}
            <ComponentHeader
                headerLink={headerLink}
                addButton={false}
                searchPlaceholder='Search by PO No...'
                setDebounceSearch={setDebounceSearch}
            />

            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    <li>
                        <div
                            className={`
                                ${activeTab === 1 ? '!bg-primary text-white' : ''}
                                block rounded-t-full bg-[#f3f2ee] px-6 py-1.5 cursor-pointer
                            `}
                            onClick={() => setActiveTab(1)}
                        >
                            <p className='-mb-1'>Purchase Order(PO)</p>
                        </div>
                    </li>

                    <li>
                        <div className={`${activeTab === 2 ? '!bg-primary text-white' : ''} block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-36 cursor-pointer`}
                            onClick={() => setActiveTab(2)}
                        >
                            <p className='-mb-1'>Sales Order(SO)</p>
                        </div>
                    </li>
                </ul>
            </div>

            {
                activeTab === 1 && <PO debounceSearch={debounceSearch} />
            }

            {
                activeTab === 2 && <SO debounceSearch={debounceSearch} />
            }
        </div >
    )
}

export default OrderBrowse