import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../inputs/RHF/Select.RHF";
import RHRadioGroup from '../inputs/RHF/RHRadioGroup';
import business from '../../Backend/business.fetch';

const SampleFileForm = () => {

    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = business.TQManufacturingNodeList();

    const { control, formState: { errors }, watch } = useForm();


    const locationId = watch("locationId")
    console.log(locationId)


    return (
        <>
            <form className="panel">
                <div className="grid grid-cols-1 gap-4">

                    {/* location */}
                    <div>
                        <Controller
                            name="locationId"
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

                                    label="Select Location"
                                    labelPosition="inline"
                                    options={registeredNodeList?.data}
                                    error={error?.message}

                                    objectReturn={true}

                                    // isMulti={true}
                                    required={true}
                                />
                            )}
                        />
                    </div>

                    {/* store */}
                    <div>
                        <Controller
                            name="storeId"
                            control={control}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <RHSelect
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}

                                    label="Select Store"
                                    labelPosition="inline"
                                    // options={brandData?.data}
                                    error={error?.message}
                                    // isMulti={true}
                                    required={true}
                                />
                            )}
                        />
                    </div>

                    <div className=''>
                        <Controller
                            name="is_exempt"
                            control={control}
                            defaultValue={"finished"}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                <RHRadioGroup
                                    ref={(el) => {
                                        ref({
                                            focus: () => el?.focus(),
                                        });
                                    }}
                                    value={value}
                                    onChange={onChange}
                                    label="Product Type"
                                    labelPosition="inline"
                                    options={[
                                        { label: "Raw", value: "raw" },
                                        { label: "Finished", value: "finished" },
                                    ]}
                                />
                            )}
                        />
                    </div>
                </div>
            </form>
        </>
    )
}

export default SampleFileForm