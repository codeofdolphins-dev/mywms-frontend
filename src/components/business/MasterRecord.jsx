import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import TableHeader from '../table/TableHeader';
import { NODE_COLUMN } from '../../utils/helper';
import TableRow from '../table/TableRow';
import Switch from '../inputs/Switch';
import CheckBox from '../inputs/CheckBox';


const MasterRecord = ({
    rowData,
    selectedRecords,
    setSelectedRecords
}) => {

    const checkAll = rowData.length > 0 && selectedRecords.length === rowData.length;

    function handelSelect(item) {
        setSelectedRecords(prev => {
            const exists = prev.some(i => i.id === item.id);

            if (exists) {
                return prev.filter(i => i.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    }

    function checkFn() {
        if (checkAll) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords([...rowData]);
        }
    }

    return (
        <div>
            <div className="panel w-full">
                <div className="flex items-center justify-between md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg">Business Models</h5>
                    <div className="">
                        <CheckBox
                            label="Check / Uncheck all"
                            labelPosition="start"
                            checked={checkAll}
                            onChange={checkFn}
                        />
                    </div>
                </div>
                <div className="">
                    <TableHeader columns={NODE_COLUMN} />

                    <div className="max-h-[40vh] min-h-[40vh] overflow-y-auto">
                        {
                            rowData?.map((item, idx) => (
                                <TableRow
                                    key={idx}
                                    columns={NODE_COLUMN}
                                    onClick={() => handelSelect(item)}
                                    row={{
                                        action: (
                                            <CheckBox
                                                checked={selectedRecords?.some(i => i.id === item.id)}
                                            />
                                        ),
                                        name: item.name,
                                        code: item.code
                                    }}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterRecord;
