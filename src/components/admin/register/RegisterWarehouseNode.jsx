import React from 'react';
import Input from '../../inputs/Input';
import { Controller } from 'react-hook-form';
import RHSelect from "../../inputs/RHF/Select.RHF";
import TextArea from '../../inputs/TextArea';
import RHRadioGroup from '../../inputs/RHF/RHRadioGroup';
import FileUpload from '../../inputs/File';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import fetchData from '../../../Backend/fetchData.backend';

const RegisterWarehouseNode = ({
    control,
    register,
    errors,
    watch,
    header
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
                    <h1 className="text-xl font-bold my-3">Listing: {header?.name}</h1>
                </div>
            </div>

            {/* 2rd row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label={"Warehouse Name"}
                        placeholder={"Enter warehouse Name"}
                        {...register("full_name", {
                            required: "This field is required!!!"
                        })}
                        error={errors.full_name?.message}
                        required={true}
                    />
                    <Input
                        label={"Warehouse Location"}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
                <div className='grid grid-cols-2 gap-4'>
                    <Input
                        type={"number"}
                        label={"Latitude"}
                        placeholder={"Enter Latitude"}
                        {...register("lat", {
                            required: "This field is required!!!"
                        })}
                        error={errors.lat?.message}
                        required={true}
                    />

                    <Input
                        type={"number"}
                        label={"Longitude"}
                        placeholder={"Enter Longitude"}
                        {...register("long", {
                            required: "This field is required!!!"
                        })}
                        error={errors.long?.message}
                        required={true}
                    />
                </div>
            </div>

            {/* 4th row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pincode */}
                    <div>
                        <Input
                            label={"Pincode"}
                            type={"number"}
                            placeholder={"Enter Pincode"}
                            {...register("pincode", { required: "This field is required!!!" })}
                            error={errors.pincode?.message}
                            required={true}
                        />
                    </div>
                    <div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    label="Warehouse Image"
                                    onChange={onChange}
                                    name="image"
                                />
                            )}
                        />
                    </div>
                </div>
            </div>


            {/* 6th row */}
            <div className='grid grid-cols-1 gap-4'>
                <TextArea
                    label="Description"
                    placeholder="Enter Address..."
                    className="text-sm"
                    {...register("desc")}
                />
            </div>

            <div className="flex items-center justify-end gap-5">
                <button type='button' className='btn btn-outline-dark' onClick={() => navigate(-1)}>Cancel</button>
                <Button type='submit' className='btn btn-primary text-lg'>Submit</Button>
            </div>
        </div>
    )
}

export default RegisterWarehouseNode