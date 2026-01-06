import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import fetchData from '../../Backend/fetchData';

const RegisterNode = () => {

    const { data: businessNodes, isLoading: businessNodeLoading } = fetchData.TQTenantBusinessNodeList();

    const { register, control, handleSubmit, formState: { errors } } = useForm();

    const submitForm = (data) => {
        console.log(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(submitForm)}>
                <div className="panel">
                    <Controller
                        name="node"
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

                                label="Select Model Type"
                                selectKey='name'
                                options={businessNodes?.data}
                                error={error?.message}
                                required={true}
                                objectReturn={true}
                            />
                        )}
                    />
                </div>
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}

export default RegisterNode