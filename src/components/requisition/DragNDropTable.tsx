import React, { useEffect, useState } from 'react'
import { DispatchProp } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';


type DragNDropTableProps = {
    selectedRecords: any[];
    setSelectedRecords?: (record: any[]) => void;
    handler?: any[];
    setHandler?: any;
}

const DragNDropTable: React.FC<DragNDropTableProps> = ({
    selectedRecords,
    handler,
    setHandler
}) => {


    useEffect(() => {
        setHandler(selectedRecords);
    }, [selectedRecords]);


    return (
        <div className="panel">
            <div className="font-semibold text-lg mb-5">Swap Values</div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-12">
                <div>
                    <ul id="example5">
                        <div>
                            {handler?.length === 0 ? (
                                <p className="text-center text-gray-500">No Records Found</p>
                            ) : (
                                <ReactSortable
                                    list={handler}
                                    setList={setHandler}
                                    animation={200}
                                    handle=".handle"
                                    group="handler"
                                    ghostClass="gu-transit"
                                >
                                    {handler?.map((item: any) => (
                                        <li key={item.id ?? item._id ?? Math.random()}>
                                            <div className="bg-white dark:bg-[#1b2e4b] rounded-md border border-white-light dark:border-dark px-6 py-3.5 flex md:flex-row flex-col ltr:text-left rtl:text-right items-md-center">
                                                <div className="flex md:flex-row flex-col justify-between items-center flex-1 text-center md:text-left">
                                                    <div className="w-2/3 font-semibold md:my-0 my-3">
                                                        <div className="w-full flex items-center justify-between">
                                                            <p>{item.id}</p>
                                                            <p>module</p>
                                                            <p>level code</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-white-dark">
                                                        <span className="handle px-2 ltr:mr-1 rtl:ml-1 bg-[#ebedf2] dark:bg-black rounded cursor-move">
                                                            +
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ReactSortable>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DragNDropTable;
