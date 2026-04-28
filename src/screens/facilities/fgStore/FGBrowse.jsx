import React, { useEffect, useState } from 'react'
import ComponentHeader from '../../../components/ComponentHeader';
import RMstock from '../rmStore/components/RMStock';
import TransferOrderList from '../TransferOrderList';
import FGReceipt from './components/FGReceipt';
import { useSearchParams } from 'react-router-dom';


const headerLink = [{ title: "FG store" }];

const tabList = [
    { id: 1, title: "Stock" },
    { id: 2, title: "Production Receipt" }
]

const FGBrowse = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabValue = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState(tabValue ? Number(tabValue) : 1);

    
    /** sync the active tab from the url search params */
    useEffect(() => {
        if (tabValue && Number(tabValue) !== activeTab) {
            setActiveTab(Number(tabValue));
        }
    }, [tabValue]);


    /** update the tab to url search params when active tab is changed */
    useEffect(() => {
        setSearchParams(prev => {
            prev.set("tab", activeTab);
            return prev;
        });
    }, [activeTab, setSearchParams]);


    return (
        <div>
            {/* compheader */}
            <ComponentHeader
                headerLink={headerLink}
                showSearch={false}
            />

            {/* wizards */}
            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    {tabList?.map(item => (
                        <li key={item.id}>
                            <div
                                className={`
                                ${activeTab === item.id ? '!bg-primary text-white' : ''}
                                block rounded-t-full bg-[#f3f2ee] px-2 py-1 w-44 cursor-pointer
                                `}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <p className='mb-1 font-semibold'>{item.title}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {activeTab === 1 && <RMstock />}
            {activeTab === 2 && <FGReceipt />}

        </div>
    )
}

export default FGBrowse