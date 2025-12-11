import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import RHSelect from '../../components/inputs/RHF/Select.RHF';
import TextArea from '../../components/inputs/TextArea';
import Input from '../../components/inputs/Input';
import FileUpload from '../../components/inputs/File';
import { Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import RHRadioGroup from '../../components/inputs/RHF/RHRadioGroup';


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
    const navigate = useNavigate();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const submit = (data) => {
        console.log(data);
        setTimeout(() => {
            reset();
        }, 3000);
    }

    const handelCancel = () => {
        reset();
        navigate(-1);
    }

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
                <div className="panel" id="forms_grid">
                    <div className="mb-5">
                        <form onSubmit={handleSubmit(submit)} className="space-y-5">
                            {/* 2nd row */}
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
                                {/* <div>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{
                                            required: "This field is required!!!"
                                        }}
                                        render={({ field: { value, onChange, ref, onBlur }, fieldState: { error } }) => (
                                            <RHSelect
                                                ref={(el) => {
                                                    ref({
                                                        focus: () => el?.focus(),
                                                    });
                                                }}
                                                value={value}
                                                onChange={onChange}

                                                label="Category"
                                                options={options}
                                                error={error?.message}
                                                isMulti={true}
                                                required={true}
                                            />
                                        )}
                                    />
                                </div> */}
                            </div>

                            {/* 3rd row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Confirm Password */}
                                <div>
                                    <Input
                                        label={"Confirm Password"}
                                        type="password"
                                        placeholder={"Confirm Password..."}
                                        {...register("confirmPassword", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.confirmPassword?.message}
                                        required={true}
                                    />
                                </div>

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

                            </div>

                            {/* 4th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label={"company Name"}
                                        placeholder={"Enter Company Name..."}
                                        {...register("company_name", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.company_name?.message}
                                        required={true}
                                    />
                                </div>


                                {/* Phone Number */}
                                <div>
                                    <Input
                                        label={"Phone Number"}
                                        placeholder={"Enter Phone Number..."}
                                        {...register("phone", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.phone?.message}
                                        required={true}
                                    />
                                </div>

                            </div>


                            {/* 5th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    {/* State */}
                                    <Controller
                                        name="state_id"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <RHSelect
                                                label="Select State"
                                                options={gstType}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    {/* district */}
                                    <Controller
                                        name="district_id"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <RHSelect
                                                label="Select district"
                                                options={gstType}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* 6th row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    {/* Pincode */}
                                    <div>
                                        <Input
                                            label={"Pincode"}
                                            placeholder={"Enter Pincode"}
                                            {...register("pincode", { required: "This field is required!!!" })}
                                            error={errors.pincode?.message}
                                            required={true}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <TextArea
                                        label="Address"
                                        placeholder="Enter Address..."
                                        className="text-sm"
                                        {...register("address")}
                                    />
                                </div>

                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <TextArea
                                        label="Description"
                                        placeholder="Enter Address..."
                                        className="text-sm"
                                        {...register("desc")}
                                    />
                                </div>

                                <div>
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


                            <div className="flex">
                                <Button variant="outline" color="gray" size="md" radius="md" onClick={handelCancel} >Cancel</Button>

                                <Button variant="filled" color="indigo" size="md" radius="md" type="submit" loading={false} className='ml-auto'>Add Product</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default AddSupplier
