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
import masterData from '../../Backend/master.backend';
import { RHFToFormData } from '../../utils/RHFtoFD';
import { Button } from '@mantine/core';
import ProfileCard from '../../components/user/userProfile/ProfileCard';

const USER_TYPE = [
    { label: "Node Admin", value: "NODE_ADMIN" },
    { label: "Node User", value: "NODE_USER" },
]

const CreateUser = () => {
    const { handleSubmit, register, control, reset, watch, formState: { errors } } = useForm();

    const password = watch("password");
    const state = watch("state");
    const node = watch("node") || null;

    const { data: registeredNodeList, isLoading: registeredNodeListLoading } = fetchData.TQTenantRegisteredNodeList();
    const stateData = useSelector(state => state.location);
    const { data: districtData, isLoading: districtIsLoading } = fetchData.TQDistrictList(state?.id);

    const { mutateAsync: createData, isPending: createPending } = masterData.TQCreateMaster();



    async function submitForm(data) {
        const formData = RHFToFormData(data);

        try {
            const res = await createData({ path: `/business/register-user`, formData });
            if (res.success) reset();

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/user" className="text-primary hover:underline">
                        user
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>register & Assign User</span>
                </li>
            </ul>

            <form onSubmit={handleSubmit(submitForm)} className='mt-5'>

                <div className="grid grid-cols-1 min-[820px]:grid-cols-2 space-x-10">
                    <div className="panel space-y-6">

                        {/* select parent node */}
                        <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>

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

                                            label="Assign Place"
                                            labelPosition={"inline"}
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
                                            labelPosition={"inline"}
                                            options={USER_TYPE}
                                            disabled={node === null ? true : false}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* 1st row */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            {/* Full Name */}
                            <div>
                                <Input
                                    label={"Full Name"}
                                    labelPosition={"inline"}
                                    placeholder={"Enter Full Name..."}
                                    {...register("full_name", {
                                        required: "This field is required!!!"
                                    })}
                                    error={errors.full_name?.message}
                                    required={true}
                                />
                            </div>
                            {/* Phone Number */}
                            <div className='grid grid-cols-1 sm:grid-cols-1 gap-4'>
                                <div>
                                    <Input
                                        label={"Phone Number"}
                                        labelPosition={"inline"}
                                        type="number"
                                        placeholder={"Enter Phone Number..."}
                                        {...register("phone_no", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.phone_no?.message}
                                        required={true}
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
                                                labelPosition={"inline"}
                                                onChange={onChange} // gets File object
                                                name="image"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>


                        {/* 2rd row */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <div>
                                <Input
                                    label={"Email"}
                                    labelPosition={"inline"}
                                    placeholder={"Enter Email..."}
                                    {...register("email", {
                                        required: "This field is required!!!"
                                    })}
                                    error={errors.email?.message}
                                    required={true}
                                />
                            </div>


                            <div>
                                <Input
                                    label={"Password"}
                                    labelPosition={"inline"}
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
                        </div>

                        {/* button */}
                        <div className="flex items-center justify-end gap-11">
                            <button
                                type='button'
                                className='btn btn-outline-dark'
                            >
                                Cancel
                            </button>

                            <Button
                                type='submit'
                                className='btn btn-info'
                                loading={createPending}
                            >
                                Submit
                            </Button>
                        </div>

                    </div>

                    <ProfileCard />
                </div>
            </form>


        </div>
    )
}

export default CreateUser