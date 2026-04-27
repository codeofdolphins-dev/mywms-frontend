import React, { useEffect, useState } from 'react'
import ComponentHeader from '../../../components/ComponentHeader'
import RMstock from '../rmStore/components/RMStock';
import AddModal from '../../../components/Add.modal';
import ItemIssueForm from '../../../components/store/production/ItemIssue.form';
import TransferOrderList from '../TransferOrderList';
import ProductionInward from './components/ProductionInward';
import ProductionOrder from './components/ProductionOrder';
import { useSearchParams } from 'react-router-dom';
import ProductionReceipt from './components/ProductionReceipt';


const headerLink = [{ title: "Production" }];

const tabList = [
    { id: 1, title: "RM Stock" },
    { id: 2, title: "RM Issue" },
    { id: 3, title: "Production Order" },
    { id: 4, title: "Production Receipt" }
];

const ProductionBrowse = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabValue = searchParams.get('tab');

    const [isIssueItemShow, setIsIssueItemShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');

    const [activeTab, setActiveTab] = useState(tabValue ? Number(tabValue) : 1);

    useEffect(() => {
        if (tabValue && Number(tabValue) !== activeTab) {
            setActiveTab(Number(tabValue));
        }
    }, [tabValue]);

    useEffect(() => {
        setSearchParams(prev => {
            prev.set('tab', activeTab);
            return prev;
        });
    }, [activeTab, setSearchParams]);


    return (
        <div>
            {/* compheader */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder="Search by product, SKU, barcode, category..."
                setDebounceSearch={setDebounceSearch}
                addButton={false}

                addButton2={true}
                btn2Title="Request Items"
                btn2OnClick={() => setIsIssueItemShow(true)}
            />

            {/* wizards */}
            <div className="w-full mt-5">
                <ul className="flex items-center text-center gap-2">
                    {tabList.map((item, idx) => (
                        <li key={idx}>
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
            {activeTab === 2 && <TransferOrderList />}
            {activeTab === 3 && <ProductionOrder />}
            {activeTab === 4 && <ProductionReceipt />}

            <AddModal
                isShow={isIssueItemShow}
                setIsShow={setIsIssueItemShow}
                title="Raw Material Issue Form"
            >
                <ItemIssueForm
                    setIsShow={setIsIssueItemShow}
                    setActiveTab={setActiveTab}
                />
            </AddModal>

        </div>
    )
}

export default ProductionBrowse