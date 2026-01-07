import React from 'react';
import { Button } from '@mantine/core';
import TextArea from '../../inputs/TextArea';
import Input from '../../inputs/Input';
import { Controller } from 'react-hook-form';
import FileUpload from '../../inputs/File';
import RHSelect from "../../inputs/RHF/Select.RHF";
import fetchData from '../../../Backend/fetchData';
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
    const state_id = watch("state_id");

    const { data: districtData, isLoading: districtIsLoading } = fetchData.TQDistrictList(state_id);

    return (
        <div className="panel space-y-5">

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold my-3">Register <em>{header?.name}</em></h1>
                </div>
            </div>

            {/* 2rd row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                    <Input
                        label={"Name"}
                        placeholder={"Enter Name"}
                        {...register("name", {
                            required: "This field is required!!!"
                        })}
                        error={errors.name?.message}
                        required={true}
                    />
                </div>
                {/* Phone Number */}
                <div>
                    <Input
                        label={"Phone Number"}
                        type="number"
                        placeholder={"Enter Phone Number..."}
                        {...register("ph_number", {
                            required: "This field is required!!!"
                        })}
                        error={errors.ph_number?.message}
                        required={true}
                    />
                </div>
            </div>

            {/* 1st row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Email */}
                <div>
                    <Input
                        label={"Email"}
                        placeholder={"Enter Email..."}
                        {...register("email", {
                            required: "This field is required!!!"
                        })}
                        error={errors.email?.message}
                        required={true}
                    // disabled={id}
                    />
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
                {/* Password */}
                <div>
                    <Input
                        label={"Password"}
                        type="password"
                        placeholder={"Enter Password..."}
                        {...register("password", {
                            required: {
                                message: "This field is required!!!",
                                value: true
                            }
                        })}
                        error={errors.password?.message}
                        required={true}
                    />
                </div>
                {/* Confirm Password */}
                <div>
                    <Input
                        label={"Confirm Password"}
                        type="password"
                        placeholder={"Confirm Password..."}
                        {...register("confirmPassword", {
                            required: {
                                message: "This field is required!!!",
                                // value: !id
                            },
                            validate: (value) => (
                                value === password || "Passwords do not match!!!"
                            )
                        })}
                        error={errors.confirmPassword?.message}
                    // required={!id}
                    />
                </div>
                {/* </div> */}
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

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
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
                        name="state_id"
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
                            />
                        )}
                    />
                </div>
                {/* </div> */}
            </div>

            {/* 4th row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
                <div>
                    {/* district */}
                    <Controller
                        name="district_id"
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
                {/* </div> */}

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