import React, { useState } from 'react'
import MasterRecord from '../../components/business/MasterRecord';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import businessNode from '../../Backend/businessNode.backend';
import FullScreenLoader from '../../components/loader/FullScreenLoader';
import Basic from '../../components/business/Basic';
import DragNDropTable from '../../components/business/DragNDropTable';

const Rules = () => {
    const { data, isLoading } = businessNode.TQBusinessNode()
    
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [handler, setHandler] = useState(selectedRecords ?? []);

    const { handleSubmit, register, control } = useForm();

    function submit(){};

    if(isLoading) return <FullScreenLoader />;

    return (
        <div>
                <div className="panel mb-4 flex justify-center items-center">
                    <div className="w-full flex items-center gap-5">
                        <label htmlFor="" className='whitespace-nowrap'>Choose Company</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "This field is required!!!"
                            }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}

                                    // options={data?.data}
                                    error={error?.message}
                                    required={true}
                                />
                            )}
                        />
                    </div>
                </div>

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
        </div>
    )
}

export default Rules;