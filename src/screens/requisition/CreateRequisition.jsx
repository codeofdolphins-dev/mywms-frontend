import React, { useEffect, useRef, useState } from 'react'
import SearchableSelect from '../../components/inputs/SearchableSelect';
import { useForm } from 'react-hook-form';
import ItemTable from '../../components/ItemTable';


const tableData = [
    {
        id: 1,
        gstin: "27AAEPM1234Q1Z5",
        brand: "Brand A",
        product: "Product A",
        packSize: "500ml",
        reqQty: 120,
    },
    {
        id: 2,
        gstin: "29BBBPX2345R2Z7",
        brand: "Brand B",
        product: "Product B",
        packSize: "1L",
        reqQty: 400,
    },
    {
        id: 3,
        gstin: "07AACCM3456H1Z2",
        brand: "Brand C",
        product: "Product C",
        packSize: "250ml",
        reqQty: 310,
    },
    {
        id: 4,
        gstin: "19AAECS5678T1Z4",
        brand: "Brand D",
        product: "Product D",
        packSize: "750ml",
        reqQty: 100,
    },
];


const CreateRequisition = () => {

    const [itemCount, setItemCount] = useState(0);

    const [supplier, setSupplier] = useState('');
    const [warehouse, setWarehouse] = useState('');
    const [items, setItems] = useState(tableData || []);
    const colName = ["Id", "GSTIN No.", "Brand", "Product", "Pack Size", "Req Qty.", "Actions"];


    const addItem = () => {
        setItemCount(prev => prev + 1);
    };

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="panel" id="forms_grid">
            <div className="flex items-center justify-between mb-8">
                <h5 className="font-bold text-2xl">Create Requisition</h5>
            </div>
            <div className="mb-5">
                <form className="space-y-5">

                    {/* first row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className='flex items-center gap-5'>
                            <label htmlFor="supplier" className='text-lg flex'>Supplier <span className='text-danger'>*</span></label>
                            <SearchableSelect
                                setValue={setSupplier}
                            />
                        </div>
                        <div className='flex items-center gap-5'>
                            <label htmlFor="gridPassword" className='text-lg flex'>Warehouse <span className='text-danger'>*</span></label>
                            <SearchableSelect
                                setValue={setWarehouse}
                            />
                        </div>
                    </div>

                    {/* second row */}
                    {supplier &&
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <label htmlFor="gstno">GSTIN no.</label>
                                <input id="gstno" type="number" placeholder="Enter GSTIN no." className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="brand">Brand</label>
                                <SearchableSelect />
                            </div>
                            <div>
                                <label htmlFor="product">Product</label>
                                <SearchableSelect />
                            </div>
                            <div>
                                <label htmlFor="packSize">Pack Size</label>
                                <input id="packSize" type="text" placeholder="Enter Pack Size" className="form-input" />
                            </div>
                            <div>
                                <label htmlFor="reqQty">Req Qty.</label>
                                <input id="reqQty" type="text" placeholder="Enter Req Qty." className="form-input" />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary !mt-6"
                                onClick={addItem}
                            >
                                Add Item
                            </button>
                        </div>
                    }

                    {itemCount > 0 && <>
                        <ItemTable
                            items={items}
                            setItems={setItems}
                            colName={colName}
                        />
                        <button type="button" className="btn btn-primary ml-auto">Submit Requisition</button>
                    </>}
                </form>
            </div>
        </div>
    )
}

export default CreateRequisition;