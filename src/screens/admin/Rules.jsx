import React, { useCallback, useEffect, useState } from 'react'
import MasterRecord from '../../components/business/MasterRecord';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Basic from '../../components/business/Basic';
import DragNDropTable from '../../components/business/DragNDropTable';
import ComponentHeader from '../../components/ComponentHeader';
import Loader from '../../components/loader/Loader';
import masterData from '../../Backend/master.backend';
import superAdmin from '../../Backend/superAdmin.backend';



const Rules = () => {
    const [value, setValue] = useState("");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [handler, setHandler] = useState(selectedRecords ?? []);

    /** mutate API */
    const { mutateAsync: updateData, isPending: updatePending } = masterData.TQUpdateMaster(["tenantBusinessNodeList", "tenantBusinessFlow"]);


    // fetch all offerd business node
    const { data, isLoading } = superAdmin.TQBusinessNode();

    // fetch all business nodes based on email
    const { data: businessFlow, isLoading: businessFlowLoading } = superAdmin.TQTenantBusinessFlow({ email: value }, Boolean(value));

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

        // Create lookup map for fast access
        const nodeMap = new Map(
            allNodes.map(node => [node.code, node])
        );

        // Preserve sequence order
        const orderedNodes = businessFlows
            .map(flow => nodeMap.get(flow.node_type_code))
            .filter(Boolean); // remove undefined if any mismatch

        setSelectedRecords(orderedNodes);


    }, [value, businessFlow, data]);


    // const { handleSubmit, register, control } = useForm();


    async function submit() {
        const payload = {};
        payload.email = value;
        payload.nodeSequence = handler;

        try {
            const res = await updateData({ path: "/super-admin/update-tenant-business-flow", formData: payload });
            console.log(res);
            // if(res.success)

        } catch (error) {
            console.log(error)
        }

    };

    if (isLoading) return <FullScreenLoader />;

    return (
        <div>
            <div className="panel mb-4 flex justify-center items-center">
                <ComponentHeader
                    searchPlaceholder='Enter Company Email'
                    className='w-full'
                    addButton={false}
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
                                loading={updatePending}
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