import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import RHSelect from "../../components/inputs/RHF/Select.RHF";
import Input from '../../components/inputs/Input';
import TextArea from '../../components/inputs/TextArea';
import FileUpload from '../../components/inputs/File';
import SearchableSelect from '../../components/inputs/SearchableSelect';
import fetchData from '../../Backend/fetchData.backend';
import { useSelector } from 'react-redux';

const USER_TYPE = [
    { label: "Node Admin", value: "node-admin" },
    { label: "Node User", value: "node-user" },
]

const CreateUser = () => {
    const { handleSubmit, register, control, reset, watch, formState: { errors } } = useForm();

    const password = watch("password");
    const state_id = watch("state_id");
    const node = watch("node") || null;

    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = fetchData.TQTenantRegisteredNodeList();
    const stateData = useSelector(state => state.location);
    const { data: districtData, isLoading: districtIsLoading } = fetchData.TQDistrictList(state_id);



    function submitForm(data) { }

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/admin" className="text-primary hover:underline">
                        admin
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>user-register</span>
                </li>
            </ul>

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold my-3">Register & Assign User</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(submitForm)}>
                <div className="panel space-y-4">

                    {/* select parent node */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                        {/* assign location */}
                        <div className="">
                            <Controller
                                name="node"
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

                                        label="Assign Location"
                                        options={registeredNodeList?.data}
                                        error={error?.message}
                                        objectReturn={true}
                                        isClearable={true}
                                    />
                                )}
                            />
                        </div>

                        {/* node type */}
                        <div className="">
                            <Controller
                                name="node_type"
                                control={control}
                                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                    <SearchableSelect
                                        ref={(el) => {
                                            ref({
                                                focus: () => el?.focus(),
                                            });
                                        }}
                                        value={value}
                                        onChange={onChange}

                                        label="User Type"
                                        options={USER_TYPE}
                                        disabled={node === null ? true : false}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* 1st row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
                                        },
                                        validate: (value) => (
                                            value === password || "Passwords do not match!!!"
                                        )
                                    })}
                                    error={errors.confirmPassword?.message}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2rd row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                            <Input
                                label={"Full Name"}
                                placeholder={"Enter Full Name..."}
                                {...register("full_name", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.full_name?.message}
                                required={true}
                            />
                        </div>
                        {/* Phone Number */}
                        <div>
                            <Input
                                label={"Phone Number"}
                                type="number"
                                placeholder={"Enter Phone Number..."}
                                {...register("phone_no", {
                                    required: "This field is required!!!"
                                })}
                                error={errors.phone_no?.message}
                                required={true}
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
                                            onChange={(value) => {
                                                onChange(value);
                                                setStateId(value);
                                            }}

                                            label="Select State"
                                            options={stateData}
                                            required={true}
                                            error={error?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4th row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* district */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            disabled={state_id ? false : true}
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
                                            onChange={onChange} // gets File object
                                            name="image"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* desc */}
                        <div className='grid grid-cols-1 gap-4'>
                            <TextArea
                                label="Description"
                                placeholder="Enter Address..."
                                className="text-sm"
                                {...register("desc")}
                            />
                        </div>
                    </div>

                    {/* button */}
                    <div className="flex items-center justify-end gap-11">
                        <button
                            type='button'
                            className='btn btn-outline-dark'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='btn btn-info'
                        >
                            Submit
                        </button>
                    </div>

                </div>
            </form>


        </div>
    )
}

export default CreateUser