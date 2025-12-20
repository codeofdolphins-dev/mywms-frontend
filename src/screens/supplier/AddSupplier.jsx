import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import TextArea from '../../components/inputs/TextArea';
import Input from '../../components/inputs/Input';
import FileUpload from '../../components/inputs/File';
import { Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import RHRadioGroup from '../../components/inputs/RHF/RHRadioGroup';
import fetchData from '../../Backend/fetchData';
import masterData from '../../Backend/master.backend';


const gstType = [
    { value: "include", label: "Shoes" },
    { value: "exclude", label: "Hats" },
]

const options = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

const AddSupplier = () => {

    const [stateId, setStateId] = useState(null);

    const navigate = useNavigate();
    const { data: stateData } = fetchData.TQStateList();
    const { data: districtData } = fetchData.TQDistrictList(stateId);

    const { mutateAsync: ceateSupplier, isPending } = masterData.TQCreateMaster()

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({ mode: "onChange" });
    const password = watch("password");
    const accNo = watch("account_number");

    const handelCancel = () => {
        reset();
        navigate(-1);
    };

    async function submit(formData) {
        formData.user_type = "supplier";

        try {
            const res = await ceateSupplier({ path: "/supplier/create", formData })
            console.log(res);
            
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div>
            {/* breadcrumb */}
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/master" className="text-primary hover:underline">
                        Master
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <Link to="/master/Suppliers" className="text-primary hover:underline">
                        Suppliers
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>Add Supplier</span>
                </li>
            </ul>

            <div>
                {/* Grid */}
                <div className="panel mt-5" id="forms_grid">
                    <form onSubmit={handleSubmit(submit)} className="space-y-5">
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
                                            required: "This field is required!!!"
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
                                            required: "This field is required!!!",
                                            validate: (value) => (
                                                value === password || "Passwords do not match!!!"
                                            )
                                        })}
                                        error={errors.confirmPassword?.message}
                                        required={true}
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
                            <div>
                                <Input
                                    label={"Company Name"}
                                    placeholder={"Enter Company Name..."}
                                    {...register("company_name", {
                                        required: "This field is required!!!"
                                    })}
                                    error={errors.company_name?.message}
                                    required={true}
                                />
                            </div>

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
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 5th row */}
                        <div className='grid grid-cols-1 gap-4'>
                            <TextArea
                                label="Description"
                                placeholder="Enter Address..."
                                className="text-sm"
                                {...register("desc")}
                            />
                        </div>

                        <div className="panel space-y-5 !mt-0" id='forms_grid'>
                            <h1 className='text-lg mb-3'>Bank Info</h1>

                            {/* 6th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* name */}
                                <div>
                                    <Input
                                        label={"Account Holder Name"}
                                        placeholder={"Enter Email..."}
                                        {...register("account_holder_name", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.account_holder_name?.message}
                                        required={true}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Bank Name */}
                                    <div>
                                        <Input
                                            label={"Bank Name"}
                                            placeholder={"Enter Bank Name"}
                                            {...register("bank_name", {
                                                required: "This field is required!!!"
                                            })}
                                            error={errors.bank_name?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* ifsc */}
                                    <div>
                                        <Input
                                            label={"IFSC Code"}
                                            placeholder={"Enter Bank Name"}
                                            {...register("ifsc_code", {
                                                required: "This field is required!!!"
                                            })}
                                            error={errors.ifsc_code?.message}
                                            required={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 7th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    {/* branch */}
                                    <div>
                                        <Input
                                            label={"Branch"}
                                            placeholder={"Enter branch..."}
                                            {...register("bank_branch", {
                                                required: "This field is required!!!"
                                            })}
                                            error={errors.bank_branch?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* account type */}
                                    <div>
                                        <Controller
                                            name="account_type"
                                            control={control}
                                            rules={{
                                                required: "Please select a account type!",
                                            }}
                                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                                                <RHRadioGroup
                                                    ref={(el) => {
                                                        ref({
                                                            focus: () => el?.focus(),
                                                        });
                                                    }}
                                                    value={value}
                                                    onChange={onChange}
                                                    label="Account Type"
                                                    required={true}
                                                    options={[
                                                        { label: "Savings", value: "savings" },
                                                        { label: "Current", value: "current" },
                                                    ]}
                                                    error={error?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Account Number */}
                                    <div>
                                        <Input
                                            label="Account Number"
                                            type="number"
                                            placeholder={"Enter Account Number..."}
                                            {...register("account_number", {
                                                required: "This field is required!!!"
                                            })}
                                            error={errors.account_number?.message}
                                            required={true}
                                        />
                                    </div>

                                    {/* Confirm Account Number */}
                                    <div>
                                        <Input
                                            label="Confirm Account Number"
                                            type="number"
                                            placeholder={"Confirm Account Number..."}
                                            {...register("confirmAccountNumber", {
                                                required: "This field is required!!!",
                                                validate: (value) => (
                                                    value === accNo || "Account number not matching!!!"
                                                )
                                            })}
                                            error={errors.confirmAccountNumber?.message}
                                            required={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <Button variant="outline" color="gray" size="md" radius="md" onClick={handelCancel} >Cancel</Button>
                            <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={isPending} className='ml-auto'>Add Product</Button>
                        </div>
                    </form>
                </div>
            </div>

        </div >
    )
}

export default AddSupplier
