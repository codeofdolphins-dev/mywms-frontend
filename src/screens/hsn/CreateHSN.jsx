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

const CreateHSN = () => {
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
                    <Link to="/master/hsncodes" className="text-primary hover:underline">
                        HSN Codes
                    </Link>
                </li>
                <li className="before:content-['/'] before:mr-2">
                    <span>Add HSN Code</span>
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
                                        label={"HSN Code"}
                                        placeholder={"Enter HSN Code..."}
                                        {...register("code", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.code?.message}
                                        required={true}
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <Input
                                        label={"HSNRate %"}
                                        placeholder={"Enter Rate..."}
                                        {...register("rate", {
                                            required: "This field is required!!!"
                                        })}
                                        error={errors.rate?.message}
                                        required={true}
                                    />
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

export default CreateHSN
