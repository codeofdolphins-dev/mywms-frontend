import React from 'react';
import { Button } from '@mantine/core';
import TextArea from '../../inputs/TextArea';
import Input from '../../inputs/Input';
import { Controller } from 'react-hook-form';
import FileUpload from '../../inputs/File';
import RHSelect from "../../inputs/RHF/Select.RHF";
import fetchData from '../../../Backend/fetchData.backend';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegisterPartnerNode = ({
    control,
    register,
    errors,
    watch,
    header,
}) => {
    const stateData = useSelector(state => state.location);
    const navigate = useNavigate();
    const password = watch("password");
    const state = watch("state");

    const { data: districtData, isLoading: districtIsLoading } = fetchData.TQDistrictList(state?.id);

    return (
        <div className="panel space-y-5">

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold my-3">Register {header?.name}</h1>
                </div>
            </div>

            {/* 2rd row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label={"Name"}
                        placeholder={"Enter warehouse Name"}
                        {...register("full_name", {
                            required: "This field is required!!!"
                        })}
                        error={errors.full_name?.message}
                        required={true}
                    />
                    <Input
                        label={"Location"}
                        placeholder={"Enter warehouse Location"}
                        {...register("location", {
                            required: "This field is required!!!"
                        })}
                        error={errors.location?.message}
                        required={true}
                    />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Input
                        type={"number"}
                        label={"GST Number"}
                        placeholder={"Enter GST Number"}
                        {...register("gst_no")}
                    />

                    <Input
                        type={"number"}
                        label={"License No"}
                        placeholder={"Enter licensee No"}
                        {...register("license_no")}
                    />
                </div>
            </div>

            {/* 3rd row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Address */}
                <div>
                    <Input
                        label="Address"
                        placeholder="Enter Address..."
                        className="text-sm"
                        {...register("address", {
                            required: "This field is required!!!"
                        })}
                        required={true}
                        error={errors.address?.message}
                    />
                </div>

                {/* Pincode */}
                <div className=''>
                    <Input
                        label={"Pincode"}
                        type={"number"}
                        placeholder={"Enter Pincode"}
                        {...register("pincode", { required: "This field is required!!!" })}
                        error={errors.pincode?.message}
                        required={true}
                    />
                </div>
                
                <div className="">
                    {/* State */}
                    <Controller
                        name="state"
                        control={control}
                        rules={{
                            required: "This field is required!!!"
                        }}
                        render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                            <RHSelect
                                ref={(el) => {
                                    ref({
                                        focus: () => el?.focus(),
                                    });
                                }}
                                value={value}
                                onChange={onChange}

                                label="Select State"
                                options={stateData}
                                required={true}
                                error={error?.message}
                                objectReturn={true}
                            />
                        )}
                    />
                </div>
            </div>

            {/* 4th row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    {/* district */}
                    <Controller
                        name="district"
                        control={control}
                        rules={{
                            required: "This field is required!!!"
                        }}
                        render={({ field: { ref, value, onChange }, fieldState: { error } }) => (
                            <RHSelect
                                ref={(el) => {
                                    ref({
                                        focus: () => el?.focus(),
                                    });
                                }}
                                value={value}
                                onChange={onChange}

                                label="Select district"
                                options={districtData}
                                required={true}
                                error={error?.message}
                                disabled={state ? false : true}
                                objectReturn={true}
                            />
                        )}
                    />
                </div>

                {/* file upload */}
                <div >
                    <Controller
                        name="image"
                        control={control}
                        defaultValue={null}
                        render={({ field: { onChange } }) => (
                            <FileUpload
                                label="Profile Image"
                                onChange={onChange}
                                name="image"
                            />
                        )}
                    />
                </div>

                <div>
                    <TextArea
                        label="Description"
                        placeholder="Enter Address..."
                        className="text-sm"
                        {...register("desc")}
                    />
                </div>
            </div>


            <div className="flex items-center justify-end gap-5">
                <Button variant="outline" color="gray" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type='submit' className='text-lg'>Submit</Button>
            </div>
        </div>
    )
}

export default RegisterPartnerNode