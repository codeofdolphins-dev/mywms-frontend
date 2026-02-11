import React, { useCallback, useEffect, useState } from 'react'
import MasterRecord from '../../components/business/MasterRecord';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import businessNode from '../../Backend/businessNode.backend';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Basic from '../../components/business/Basic';
import DragNDropTable from '../../components/business/DragNDropTable';
import ComponentHeader from '../../components/ComponentHeader';
import Loader from '../../components/loader/Loader';


const headerLink = [
    { title: "received-requisition" },
];

const Rules = () => {
    const [value, setValue] = useState("");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [handler, setHandler] = useState(selectedRecords ?? []);

    const { data, isLoading } = businessNode.TQBusinessNode();

    const { data: businessFlow, isLoading: businessFlowLoading } = businessNode.TQTenantBusinessFlow({ email: value }, Boolean(value));

    useEffect(() => {
        if (value === "") {
            setSelectedRecords([]);
            return;
        };

        if (
            !businessFlow?.success ||
            !businessFlow?.data?.businessFlows?.length ||
            !data?.data?.length
        ) {
            setSelectedRecords([]);
            return;
        };

        const businessFlows = businessFlow.data.businessFlows;
        const allNodes = data.data;

        const flowCodes = new Set(
            businessFlows.map(item => item.node_type_code)
        );

        setSelectedRecords(
            allNodes.filter(i => flowCodes.has(i.code))
        );

    }, [value, businessFlow, data]);


    const { handleSubmit, register, control } = useForm();

    console.log(handler);

    function submit() {

    };

    if (isLoading) return <FullScreenLoader />;

    return (
        <div>
            <div className="panel mb-4 flex justify-center items-center">
                <ComponentHeader
                    searchPlaceholder='Enter Company Email'
                    className='w-full'
                    addButton={false}
                    // headerLink={headerLink}
                    setDebounceSearch={setValue}
                />
            </div>
            <div className="">
                {businessFlowLoading
                    ? <Loader />
                    : <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
                            {/* master record */}
                            <div >
                                <MasterRecord
                                    rowData={data?.data}
                                    selectedRecords={selectedRecords}
                                    setSelectedRecords={setSelectedRecords}
                                />
                            </div>
                            {/* initial record */}
                            <div >
                                <Basic
                                    selectedRecords={selectedRecords}
                                    setSelectedRecords={setSelectedRecords}
                                />
                            </div>
                            {/* swap record */}
                            <div >
                                <DragNDropTable
                                    selectedRecords={selectedRecords}
                                    setSelectedRecords={setSelectedRecords}
                                    handler={handler}
                                    setHandler={setHandler}
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-end">
                            <Button
                                onClick={submit}
                            >
                                Submit
                            </Button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default Rules;