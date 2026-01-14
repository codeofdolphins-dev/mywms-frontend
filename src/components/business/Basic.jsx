import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import IconXCircle from '../Icon/IconXCircle';
import TableRow from '../table/TableRow';
import TableHeader from '../table/TableHeader';
import { BASIC_NODE_COLUMN } from '../../utils/helper';


const Basic = ({
    selectedRecords,
    setSelectedRecords
}) => {

    const removeItem = (id) => {
        setSelectedRecords((prev) => prev.filter((item) => item.id !== id));
    }

    return (
        <div>
            <div className="panel">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Selected Models</h5>

                {
                    selectedRecords?.length < 1 ? (
                        <p className="text-center text-gray-500">No Records Found</p>
                    ) : (
                        <div className="">
                            <TableHeader columns={BASIC_NODE_COLUMN} />

                            <div className="max-h-[40vh] overflow-y-auto">
                                {
                                    selectedRecords?.map((item, idx) => (
                                        <TableRow
                                            key={idx}
                                            columns={BASIC_NODE_COLUMN}
                                            row={{
                                                id: item.id,
                                                name: item.name,
                                                code: item.code,
                                                action: (
                                                    <div className="flex items-start w-max mx-auto">
                                                        <Tippy content="Delete">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                            >
                                                                <IconXCircle />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                ),
                                            }}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Basic;
