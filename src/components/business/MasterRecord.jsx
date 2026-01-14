import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import TableHeader from '../table/TableHeader';
import { NODE_COLUMN } from '../../utils/helper';
import TableRow from '../table/TableRow';
import Switch from '../inputs/Switch';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';


const MasterRecord = ({
    rowData,
    selectedRecords,
    setSelectedRecords
}) => {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('Checkbox Table'));
    // });

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


    return (
        <div>
            <div className="panel w-full">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg">Business Models</h5>
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
                                            <input type="checkbox" className="form-checkbox outline-primary"
                                                checked={selectedRecords?.some(i => i.id === item.id)}
                                                onChange={() => {}}
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
