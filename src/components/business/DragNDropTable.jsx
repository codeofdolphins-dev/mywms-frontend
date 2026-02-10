import React, { useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs';
import TableHeader from '../table/TableHeader';
import { BASIC_NODE_COLUMN } from '../../utils/helper';
import TableRow from '../table/TableRow';


const DragNDropTable = ({
    selectedRecords,
    handler,
    setHandler
}) => {


    useEffect(() => {
        setHandler(selectedRecords);
    }, [selectedRecords]);


    return (
        <div className="panel">
            <div className="font-semibold text-lg mb-5">Swap Models</div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-12">
                <div>
                    <ul id="example5">
                        <div>
                            {handler?.length === 0 ? (
                                <p className="text-center text-gray-500">No Records Found</p>
                            ) : (
                                <>
                                    <TableHeader columns={BASIC_NODE_COLUMN} />
                                    <div className="max-h-[40vh] overflow-y-auto">
                                        <ReactSortable
                                            list={handler}
                                            setList={setHandler}
                                            animation={200}
                                            handle=".handle"
                                            group="handler"
                                            ghostClass="gu-transit"
                                        >
                                            {handler?.map((item) => (
                                                <TableRow
                                                    key={item.id}
                                                    columns={BASIC_NODE_COLUMN}
                                                    row={{
                                                        id: item.id,
                                                        name: item.name,
                                                        code: item.code,
                                                        action: (
                                                            <div className="text-white-dark" content='move'>
                                                                <span className="handle px-2 ltr:mr-1 rtl:ml-1 bg-[#ebedf2] dark:bg-black rounded cursor-move">
                                                                    +
                                                                </span>
                                                            </div>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </ReactSortable>
                                    </div>
                                </>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DragNDropTable;
