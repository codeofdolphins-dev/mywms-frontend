import React, { useState } from 'react'
import Basic from '../../components/requisition/Basic';
import DragNDropTable from '../../components/requisition/DragNDropTable';
import MasterRecord from '../../components/requisition/MasterRecord';

const rowData = [
    { id: 1, module: "dealer", levelCode: "L-100" },
    { id: 2, module: "dealer", levelCode: "L-100" },
    { id: 3, module: "dealer", levelCode: "L-109" },
    { id: 4, module: "dealer", levelCode: "L-100" },
    { id: 5, module: "dealer", levelCode: "L-100" },
    { id: 6, module: "warehouse", levelCode: "L-100" },
    { id: 7, module: "dealer", levelCode: "L-105" },
    { id: 8, module: "dealer", levelCode: "L-100" },
    { id: 9, module: "dealer", levelCode: "L-100" },
    { id: 10, module: "dealer", levelCode: "L-103" }
];


const Rules = () => {
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [handler, setHandler] = useState(selectedRecords ?? []);

    return (
        <div>
            <div className="w-full h-2/5 flex gap-3">
                {/* master record */}
                <div className="w-1/3">
                    <MasterRecord
                        rowData={rowData}
                        selectedRecords={selectedRecords}
                        setSelectedRecords={setSelectedRecords}
                    />
                </div>
                {/* initial record */}
                <div className="w-1/3">
                    <Basic
                        selectedRecords={selectedRecords}
                        setSelectedRecords={setSelectedRecords}
                    />
                </div>
                {/* swap record */}
                <div className="w-1/3">
                    <DragNDropTable
                        selectedRecords={selectedRecords}
                        setSelectedRecords={setSelectedRecords}
                        handler={handler}
                        setHandler={setHandler}
                    />
                </div>
            </div>
        </div>
    )
}

export default Rules;