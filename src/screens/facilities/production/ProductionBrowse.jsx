import React, { useState } from 'react'
import ComponentHeader from '../../../components/ComponentHeader'
import RMstock from '../rmStore/components/RMStock';
import AddModal from '../../../components/Add.modal';
import ItemIssueForm from '../../../components/store/production/ItemIssue.form';
import TransferOrderList from '../transferOrderList';


const headerLink = [{ title: "production" }];

const tabList = [
    { id: 1, title: "Rm Stock" },
    { id: 2, title: "Rm Issue" },
    { id: 3, title: "Inward" },
    { id: 4, title: "Outward" },
]

const ProductionBrowse = () => {
    const [isIssueItemShow, setIsIssueItemShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [activeTab, setActiveTab] = useState(1);


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

                addButton3={true}
                btn3Title="Generate Work Order"
                btn3OnClick={() => setIsBulkShow(true)}
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

            <AddModal
                isShow={isIssueItemShow}
                setIsShow={setIsIssueItemShow}
                title="Raw Material Issue Form"
            >
                <ItemIssueForm
                    setIsShow={setIsIssueItemShow}
                />
            </AddModal>

        </div>
    )
}

export default ProductionBrowse